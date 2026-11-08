"""Convert the design canvas screens (.dc.html) into React + TypeScript components.

Usage: python3 convert.py <canvas project dir> <output src/screens dir>
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
SCREENS = {
    # file: (component name, short description)
    "HP1": ("CargoType", "Step 1 · Cargo type (props: state = empty | filled)"),
    "HP2": ("RouteDates", "Step 2 · Route and dates"),
    "HP3": ("Documents", "Step 3 · Documents"),
    "HP4": ("Review", "Step 4 · Review"),
    "HP5": ("Confirmation", "Step 5 · Confirmation"),
    "HP6": ("MyBookings", "My bookings (props: search = default | recent | typing | match | loading | noresults | noaccess | offline)"),
    "HP7": ("Tracking", "Tracking (props: scenario = normal | delay | stale, tab = details | map)"),
    "Paso1": ("CargoTypeErrors", "Step 1 · Error summary and inline errors"),
    "Paso2": ("RouteDatesErrors", "Step 2 · Route, date and postal code errors"),
    "Docs": ("DocumentsErrors", "Step 3 · File errors and offline banner"),
    "Revision": ("ReviewChanged", "Step 4 · No capacity and rate changed"),
    "Confirmacion": ("ConfirmationPending", "Step 5 · Booked with pending documents"),
    "Seguimiento": ("TrackingCustoms", "Tracking · Held at customs"),
    "EdgeLeave": ("LeaveDialog", "Step 1 + leave-with-changes dialog"),
    "EdgeSave": ("SaveErrorToast", "Step 2 + server error toast"),
    "EdgeSession": ("SessionExpired", "Step 3 + session expired dialog"),
}
NAME = {k: v[0] for k, v in SCREENS.items()}

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
ATTR = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "readonly": "readOnly",
    "maxlength": "maxLength", "colspan": "colSpan", "rowspan": "rowSpan", "autocomplete": "autoComplete",
    "viewbox": "viewBox", "preserveaspectratio": "preserveAspectRatio", "gradientunits": "gradientUnits",
    "gradienttransform": "gradientTransform", "patternunits": "patternUnits", "markerwidth": "markerWidth",
    "markerheight": "markerHeight", "refx": "refX", "refy": "refY", "textlength": "textLength",
    "startoffset": "startOffset", "pathlength": "pathLength", "srcset": "srcSet",
}
HOLE = re.compile(r"\{\{\s*([^}]+?)\s*\}\}")


class Node:
    def __init__(self, tag, attrs):
        self.tag, self.attrs, self.children = tag, attrs, []


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs)
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def camel(name):
    if name.startswith("-webkit-"):
        name = "Webkit-" + name[8:]
    return re.sub(r"-([a-z])", lambda m: m.group(1).upper(), name)


class Ctx:
    def __init__(self, loops=()):
        self.loops = set(loops)

    def ref(self, path):
        path = path.strip()
        if path in ("true", "false"):
            return path
        head = path.split(".")[0]
        return path if head in self.loops else "v." + path


def tpl(value, ctx):
    """An attribute/style value that may hold {{holes}} -> JS expression."""
    parts = HOLE.split(value)
    if len(parts) == 1:
        return json.dumps(value, ensure_ascii=False)
    if len(parts) == 3 and parts[0] == "" and parts[2] == "":
        return ctx.ref(parts[1])
    out = ""
    for i, p in enumerate(parts):
        out += ("${" + ctx.ref(p) + "}") if i % 2 else p.replace("`", "\\`").replace("${", "\\${")
    return "`" + out + "`"


def style_obj(css, ctx):
    items = []
    for decl in re.split(r";(?![^(]*\))", css):
        if ":" not in decl:
            continue
        k, val = decl.split(":", 1)
        k, val = k.strip(), val.strip()
        if not k:
            continue
        items.append(f"{camel(k) if not k.startswith('--') else json.dumps(k)}: {tpl(val, ctx)}")
    return "{{ " + ", ".join(items) + " }}"


def text_js(s, ctx):
    s = re.sub(r"\s+", " ", s)
    if not s.strip():
        return None
    parts = HOLE.split(s)
    out = []
    for i, p in enumerate(parts):
        if i % 2:
            out.append("{" + ctx.ref(p) + "}")
        elif p:
            if re.search(r"[{}<>]", p) or p != p.strip():
                out.append("{" + json.dumps(p, ensure_ascii=False) + "}")
            else:
                out.append(p)
    return "".join(out)


imports = set()


def emit(node, ctx, ind):
    pad = "  " * ind
    if isinstance(node, str):
        if not node.strip():
            return f"{pad}{{\" \"}}" if node and "\n" not in node else None
        t = text_js(node, ctx)
        return pad + t if t else None
    tag, attrs = node.tag, dict(node.attrs)
    kids = lambda c: [x for x in (emit(ch, c, ind + 1) for ch in node.children) if x is not None]
    if tag in ("helmet", "script", "style", "title"):
        return None
    if tag == "sc-for":
        lst = HOLE.search(attrs["list"]).group(1)
        var = attrs["as"]
        inner = kids(Ctx(ctx.loops | {var}))
        body = "\n".join(inner)
        return f"{pad}{{{ctx.ref(lst)}.map(({var}: any, i: number) => (\n{pad}  <Fragment key={{i}}>\n{body}\n{pad}  </Fragment>\n{pad}))}}"
    if tag == "sc-if":
        cond = ctx.ref(HOLE.search(attrs["value"]).group(1))
        body = "\n".join(kids(ctx))
        return f"{pad}{{{cond} && (\n{pad}  <>\n{body}\n{pad}  </>\n{pad})}}"
    if tag == "dc-import":
        comp = NAME[attrs["name"]]
        imports.add(comp)
        props = " ".join((f"{k}={{{tpl(v, ctx)}}}" if HOLE.search(v) else f"{k}={json.dumps(v)}")
                         for k, v in node.attrs if k not in ("name", "hint-size"))
        return f"{pad}<{comp}{(' ' + props) if props else ''} />"
    out = []
    textarea_value = None
    if tag == "textarea":
        textarea_value = "".join(c for c in node.children if isinstance(c, str))
        node.children = []
    for k, v in node.attrs:
        if k.startswith("hint-"):
            continue
        v = "" if v is None else v
        name = ATTR.get(k, k if k.startswith(("aria-", "data-")) else camel(k))
        if k == "style":
            out.append(f"style={style_obj(v, ctx)}")
        elif k in ("disabled", "checked", "selected", "hidden", "required", "multiple"):
            if HOLE.search(v):
                out.append(f"{name}={{!!{tpl(v, ctx)}}}")
            elif tag == "option" and k == "selected":
                continue
            elif k == "checked":
                out.append("defaultChecked")
            else:
                out.append(name)
        elif k == "value" and tag in ("input", "select"):
            out.append(f"defaultValue={{{tpl(v, ctx)}}}" if HOLE.search(v) else f"defaultValue={json.dumps(v, ensure_ascii=False)}")
        elif HOLE.search(v):
            out.append(f"{name}={{{tpl(v, ctx)}}}")
        else:
            out.append(f"{name}={json.dumps(v, ensure_ascii=False)}")
    if tag == "select":
        sel = next((dict(o.attrs).get("value") or "".join(c for c in o.children if isinstance(c, str)).strip()
                    for o in node.children if isinstance(o, Node) and o.tag == "option" and "selected" in dict(o.attrs)), None)
        if sel is not None and not any(a.startswith("defaultValue") for a in out):
            out.append(f"defaultValue={json.dumps(sel, ensure_ascii=False)}")
    if textarea_value and textarea_value.strip():
        out.append(f"defaultValue={tpl(textarea_value, ctx) if HOLE.search(textarea_value) else json.dumps(textarea_value, ensure_ascii=False)}")
    if tag == "input" and not any(a.startswith(("defaultValue", "readOnly")) for a in out):
        pass
    if tag in ("input", "textarea", "select") and not any(a.startswith("onChange") for a in out):
        pass
    a = (" " + " ".join(out)) if out else ""
    if tag in VOID or tag == "textarea" or not node.children:
        return f"{pad}<{tag}{a} />"
    body = "\n".join(kids(ctx))
    if not body.strip():
        return f"{pad}<{tag}{a} />"
    return f"{pad}<{tag}{a}>\n{body}\n{pad}</{tag}>"


def convert(key):
    global imports
    imports = set()
    s = (SRC / f"{key}.dc.html").read_text()
    body = re.search(r"<x-dc>(.*)</x-dc>", s, re.S).group(1)
    script = re.search(r"data-dc-script[^>]*>(.*?)</script>", s, re.S).group(1)
    props_decl = json.loads(re.search(r"data-props='([^']*)'", s).group(1))
    m = re.search(r"renderVals\(\)\s*\{(.*)\n  \}\n\}", script, re.S) or re.search(r"renderVals\(\)\s*\{(.*?)\}\s*\n\}", script, re.S)
    rv = m.group(1)
    rv = rv.replace("this.props", "props")
    p = Parser()
    p.feed(body)
    roots = [c for c in p.root.children if isinstance(c, Node) and c.tag != "helmet"]
    assert len(roots) == 1, key
    jsx = emit(roots[0], Ctx(), 2)
    comp, desc = SCREENS[key]
    prop_names = [k for k in props_decl if not k.startswith("$")]
    ptype = "{ " + "; ".join(
        f"{k}?: {' | '.join(json.dumps(o) for o in props_decl[k].get('options', [])) or 'string'}" for k in prop_names) + " }" if prop_names else "Record<string, never>"
    defaults = ", ".join(f"{k} = {json.dumps(props_decl[k].get('default'))}" for k in prop_names)
    head = "// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.\n"
    head += 'import { Fragment } from "react";\n'
    for i in sorted(imports):
        head += f'import {i} from "./{i}";\n'
    sig = f"{{ {defaults} }}: {comp}Props = {{}}" if prop_names else ""
    props_line = f"  const props = {{ {', '.join(prop_names)} }};\n" if prop_names else ""
    code = f"""{head}
export type {comp}Props = {ptype};

/** {desc} */
export default function {comp}({sig}) {{
{props_line}  const v = values({ 'props' if prop_names else '' });
  return (
{jsx}
  );
}}

function values({ 'props: ' + comp + 'Props' if prop_names else '' }) {{{rv}
}}
"""
    if not prop_names:
        code = code.replace("const v = values();", "const v = values();")
    (OUT / f"{comp}.tsx").write_text(code)
    return comp


OUT.mkdir(parents=True, exist_ok=True)
for k in SCREENS:
    print(convert(k))
