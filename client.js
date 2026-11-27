window.__ModuleLoader__.load({id:'@omeyang/dsh-ilabrat',factory(require){const module={exports:{}};
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// web/panel.jsx
var panel_exports = {};
__export(panel_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(panel_exports);
var import_react3 = __toESM(require("react"), 1);

// web/source.jsx
var import_react = __toESM(require("react"), 1);
function SourceSettings({ run, onSaved, onClose, busy }) {
  const [draft, setDraft] = (0, import_react.useState)({ name: "", host: "", port: "22", username: "", auth: "password", password: "" });
  const [fingerprint, setFingerprint] = (0, import_react.useState)("");
  const edit = (key) => (e) => {
    setDraft({ ...draft, [key]: e.target.value });
    if (key === "host" || key === "port") setFingerprint("");
  };
  return /* @__PURE__ */ import_react.default.createElement("fieldset", { disabled: busy, className: "source-card" }, /* @__PURE__ */ import_react.default.createElement("legend", null, "\u6DFB\u52A0 SSH \u6765\u6E90"), /* @__PURE__ */ import_react.default.createElement("label", null, "\u6765\u6E90\u540D\u79F0", /* @__PURE__ */ import_react.default.createElement("input", { value: draft.name, onChange: edit("name"), placeholder: "\u4F8B\u5982\uFF1A\u8054\u8C03\u5F00\u53D1\u673A" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "pair" }, /* @__PURE__ */ import_react.default.createElement("label", null, "SSH \u4E3B\u673A", /* @__PURE__ */ import_react.default.createElement("input", { value: draft.host, onChange: edit("host"), placeholder: "dev.example.com" })), /* @__PURE__ */ import_react.default.createElement("label", null, "\u7AEF\u53E3", /* @__PURE__ */ import_react.default.createElement("input", { type: "number", min: "1", max: "65535", value: draft.port, onChange: edit("port") }))), /* @__PURE__ */ import_react.default.createElement("label", null, "\u7528\u6237\u540D", /* @__PURE__ */ import_react.default.createElement("input", { value: draft.username, onChange: edit("username"), autoComplete: "off" })), /* @__PURE__ */ import_react.default.createElement("label", null, "\u8BA4\u8BC1\u65B9\u5F0F", /* @__PURE__ */ import_react.default.createElement("select", { value: draft.auth, onChange: edit("auth") }, /* @__PURE__ */ import_react.default.createElement("option", { value: "password" }, "\u4FDD\u5B58\u5BC6\u7801"), /* @__PURE__ */ import_react.default.createElement("option", { value: "agent" }, "SSH agent \u5BC6\u94A5"))), draft.auth === "password" && /* @__PURE__ */ import_react.default.createElement("label", null, "SSH \u5BC6\u7801", /* @__PURE__ */ import_react.default.createElement("input", { type: "password", value: draft.password, onChange: edit("password"), autoComplete: "new-password" })), fingerprint && /* @__PURE__ */ import_react.default.createElement("p", { className: "fingerprint" }, "\u8BF7\u4E0E\u5F00\u53D1\u673A\u7684\u4E3B\u673A\u6307\u7EB9\u6838\u5BF9", /* @__PURE__ */ import_react.default.createElement("br", null), /* @__PURE__ */ import_react.default.createElement("code", null, fingerprint)), /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: onClose }, "\u6536\u8D77"), fingerprint ? /* @__PURE__ */ import_react.default.createElement("button", { className: "primary", onClick: () => run("\u4FDD\u5B58\u6765\u6E90", async (request) => {
    const res = await request("sources", { action: "save", ...draft, fingerprint });
    onSaved(res.profile);
  }) }, "\u4FE1\u4EFB\u5E76\u4FDD\u5B58") : /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => run("\u8BFB\u53D6\u4E3B\u673A\u6307\u7EB9", async (request) => {
    const res = await request("sources", { action: "probe", host: draft.host, port: draft.port });
    setFingerprint(res.fingerprint);
  }) }, "\u8BFB\u53D6\u4E3B\u673A\u6307\u7EB9")));
}
function Browser({ listing, visit, select, close, busy, mode }) {
  const [jump, setJump] = (0, import_react.useState)(listing.dir);
  const [filter, setFilter] = (0, import_react.useState)("");
  const entries = listing.entries.filter((e) => (e.directory || (mode === "proto" ? e.name.endsWith(".proto") : e.name === "buf.yaml")) && e.name.toLowerCase().includes(filter.toLowerCase()));
  return /* @__PURE__ */ import_react.default.createElement("section", { className: "picker", "aria-label": "\u534F\u8BAE\u6587\u4EF6\u6D4F\u89C8\u5668" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react.default.createElement("h3", null, mode === "proto" ? "\u9009\u62E9 Proto \u6587\u4EF6" : "\u9009\u62E9 Buf \u5DE5\u4F5C\u533A"), /* @__PURE__ */ import_react.default.createElement("button", { disabled: busy, onClick: close }, "\u5173\u95ED")), !!listing.roots?.length && /* @__PURE__ */ import_react.default.createElement("label", null, "\u9A71\u52A8\u5668", /* @__PURE__ */ import_react.default.createElement("select", { disabled: busy, value: listing.roots.find((r) => listing.dir.toUpperCase().startsWith(r)) || "", onChange: (e) => visit(e.target.value) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "", disabled: true }, "\u9009\u62E9\u9A71\u52A8\u5668"), listing.roots.map((r) => /* @__PURE__ */ import_react.default.createElement("option", { key: r }, r)))), /* @__PURE__ */ import_react.default.createElement("label", null, "\u5F53\u524D\u76EE\u5F55", /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("input", { className: "grow mono", value: jump, disabled: busy, onChange: (e) => setJump(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter") visit(jump);
  } }), /* @__PURE__ */ import_react.default.createElement("button", { disabled: busy, onClick: () => visit(jump) }, "\u524D\u5F80"))), /* @__PURE__ */ import_react.default.createElement("input", { type: "search", "aria-label": "\u7B5B\u9009\u6587\u4EF6", placeholder: "\u7B5B\u9009\u6587\u4EF6\u6216\u76EE\u5F55", value: filter, onChange: (e) => setFilter(e.target.value) }), /* @__PURE__ */ import_react.default.createElement("div", { className: "files" }, /* @__PURE__ */ import_react.default.createElement("button", { disabled: busy || listing.parent === listing.dir, onClick: () => visit(listing.parent) }, "\u2191\u3000\u4E0A\u4E00\u7EA7\u76EE\u5F55"), entries.map((e) => /* @__PURE__ */ import_react.default.createElement("button", { key: e.path, disabled: busy, onClick: () => e.directory ? visit(e.path) : select(mode === "proto" ? e.path : listing.dir) }, /* @__PURE__ */ import_react.default.createElement("span", { className: "kind" }, e.directory ? "\u76EE\u5F55" : "\u6587\u4EF6"), e.name))), mode === "buf" && /* @__PURE__ */ import_react.default.createElement("button", { className: "primary", disabled: busy || !listing.entries.some((e) => e.name === "buf.yaml" && !e.directory), onClick: () => select(listing.dir) }, "\u4F7F\u7528\u6B64\u5DE5\u4F5C\u533A"));
}

// web/fields.jsx
var import_react2 = __toESM(require("react"), 1);

// src/descriptor.js
var known = {
  ".google.protobuf.Timestamp": "2000-01-01T00:00:00Z",
  ".google.protobuf.Duration": "0s",
  ".google.protobuf.FieldMask": "",
  ".google.protobuf.Struct": {},
  ".google.protobuf.Value": null,
  ".google.protobuf.ListValue": [],
  ".google.protobuf.Any": {},
  ".google.protobuf.Empty": {},
  ".google.protobuf.StringValue": "",
  ".google.protobuf.BytesValue": "",
  ".google.protobuf.Int64Value": "0",
  ".google.protobuf.UInt64Value": "0",
  ".google.protobuf.BoolValue": false,
  ".google.protobuf.Int32Value": 0,
  ".google.protobuf.UInt32Value": 0,
  ".google.protobuf.FloatValue": 0,
  ".google.protobuf.DoubleValue": 0
};
function seed(type, types, ancestors = [], budget = { left: 80 }) {
  if (Object.hasOwn(known, type)) return structuredClone(known[type]);
  const entry = types[type];
  if (entry?.choices) return entry.choices[0] ?? 0;
  if (!entry) {
    if (type === "string" || type === "bytes") return "";
    if (type === "bool") return false;
    return type.endsWith("64") ? "0" : 0;
  }
  const value = /* @__PURE__ */ Object.create(null);
  if (ancestors.includes(type) || ancestors.length > 8) return value;
  const groups = /* @__PURE__ */ new Set();
  for (const field2 of entry.fields) {
    if (field2.oneof && groups.has(field2.oneof)) continue;
    if (--budget.left < 0) break;
    groups.add(field2.oneof);
    value[field2.key] = field2.repeated ? types[field2.type]?.map ? {} : [] : seed(field2.type, types, [...ancestors, type], budget);
  }
  return value;
}
var isSpecial = (type) => Object.hasOwn(known, type);

// web/fields.jsx
function Scalar({ label, value, type, choices, update, issue }) {
  const [draft, setDraft] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => () => issue(label, ""), [label]);
  const json = value === null || typeof value === "object";
  function change(text) {
    try {
      let next = text;
      if (json || typeof value === "number") next = JSON.parse(text);
      if (typeof value === "number" && (typeof next !== "number" || !Number.isFinite(next))) throw Error("\u8BF7\u8F93\u5165\u6709\u6548\u6570\u5B57");
      if (typeof value === "boolean") next = text === "true";
      setDraft(null);
      issue(label, "");
      update(next);
    } catch (err) {
      setDraft(text);
      issue(label, label + " \xB7 " + err.message);
    }
  }
  const options = choices || typeof value === "boolean" && ["true", "false"];
  const props = { "aria-label": label, onChange: (e) => change(e.target.value), onBlur: () => {
    if (draft !== null && !json && String(value) === draft) setDraft(null);
  } };
  let control;
  if (options) control = /* @__PURE__ */ import_react2.default.createElement("select", { ...props, value: String(value) }, options.map((v) => /* @__PURE__ */ import_react2.default.createElement("option", { key: v }, v)));
  else if (json) control = /* @__PURE__ */ import_react2.default.createElement("textarea", { ...props, rows: 2, value: draft ?? JSON.stringify(value, null, 2) });
  else control = /* @__PURE__ */ import_react2.default.createElement("input", { ...props, value: draft ?? value ?? "", spellCheck: false });
  return /* @__PURE__ */ import_react2.default.createElement("label", { className: "value-field" }, /* @__PURE__ */ import_react2.default.createElement("span", null, /* @__PURE__ */ import_react2.default.createElement("strong", null, label), /* @__PURE__ */ import_react2.default.createElement("small", null, type.replace(/^\./, ""))), control);
}
function Collection({ label, value, field: field2, types, draw, update }) {
  const [key, setKey] = (0, import_react2.useState)("");
  const map = types[field2.type]?.map;
  const values = Object.entries(value);
  const child = map ? types[field2.type].fields[1] : { type: field2.type };
  function remove(k) {
    if (!map) return update(value.filter((_, i) => i !== Number(k)));
    const next = { ...value };
    delete next[k];
    update(next);
  }
  return /* @__PURE__ */ import_react2.default.createElement("section", { className: "collection" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react2.default.createElement("strong", null, label), /* @__PURE__ */ import_react2.default.createElement("small", null, map ? "map" : "repeated", " \xB7 ", values.length)), values.map(([k, v]) => /* @__PURE__ */ import_react2.default.createElement("div", { className: "entry", key: k }, draw(label + "[" + k + "]", v, child, (next) => {
    if (map) update({ ...value, [k]: next });
    else update(value.map((x, i) => i === Number(k) ? next : x));
  }), /* @__PURE__ */ import_react2.default.createElement("button", { "aria-label": "\u79FB\u9664 " + label + "[" + k + "]", onClick: () => remove(k) }, "\u79FB\u9664"))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "row" }, map && /* @__PURE__ */ import_react2.default.createElement("input", { className: "grow", "aria-label": label + " \u65B0\u952E", placeholder: "\u952E \xB7 " + types[field2.type].fields[0].type, value: key, onChange: (e) => setKey(e.target.value) }), /* @__PURE__ */ import_react2.default.createElement("button", { disabled: map && Object.hasOwn(value, key), onClick: () => {
    const next = seed(child.type, types);
    update(map ? { ...value, [key]: next } : [...value, next]);
    setKey("");
  } }, map ? "\u6DFB\u52A0\u952E\u503C" : "\u6DFB\u52A0\u4E00\u9879")));
}
function Fields({ value, type, types, onChange, issue }) {
  function draw(label, current, field2, update) {
    const entry = types[field2.type];
    const map = entry?.map;
    if (field2.repeated && (map ? current && typeof current === "object" && !Array.isArray(current) : Array.isArray(current))) {
      return /* @__PURE__ */ import_react2.default.createElement(Collection, { key: label, label, value: current, types, field: field2, draw, update });
    }
    if (entry?.fields && !isSpecial(field2.type) && current && typeof current === "object" && !Array.isArray(current)) {
      const content = Object.entries(current);
      const groups = [...new Set(entry.fields.map((f) => f.oneof).filter(Boolean))];
      if (content.length || groups.length) return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, { key: label }, groups.map((group) => {
        const fields = entry.fields.filter((f) => f.oneof === group);
        const selected = fields.find((f) => Object.hasOwn(current, f.key));
        return /* @__PURE__ */ import_react2.default.createElement("label", { className: "value-field", key: group }, group, " \xB7 oneof", /* @__PURE__ */ import_react2.default.createElement("select", { "aria-label": label + " " + group, value: selected?.key || "", onChange: (e) => {
          const next = { ...current };
          for (const f2 of fields) delete next[f2.key];
          const f = fields.find((f2) => f2.key === e.target.value);
          update(f ? { ...next, [f.key]: seed(f.type, types) } : next);
        } }, /* @__PURE__ */ import_react2.default.createElement("option", { value: "" }, "\u4E0D\u8BBE\u7F6E"), fields.map((f) => /* @__PURE__ */ import_react2.default.createElement("option", { key: f.key }, f.key))));
      }), content.map(([k, v]) => draw(label ? label + "." + k : k, v, entry.fields.find((f) => f.key === k) || { type: "JSON" }, (next) => update({ ...current, [k]: next }))));
    }
    return /* @__PURE__ */ import_react2.default.createElement(Scalar, { key: label, label: label || "\u8BF7\u6C42\u503C", type: field2.type, value: current, choices: entry?.choices, update, issue });
  }
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "fields" }, draw("", value, { type: "." + type }, onChange));
}

// web/theme.css
var theme_default = '.ilb {--ink:var(--dsw-alias-label-primary,CanvasText);--line:color-mix(in srgb,currentColor 19%,transparent);--shade:color-mix(in srgb,currentColor 4%,transparent);--accent:#247466;box-sizing:border-box;height:100%;overflow:auto;color:var(--ink);background:var(--dsw-alias-bg-base,Canvas);font:14px/1.48 "Inter",system-ui,sans-serif;container-type:inline-size;color-scheme:inherit}\n.ilb *{box-sizing:border-box}.ilb header{display:flex;align-items:center;gap:14px;padding: max(22px,var(--dsh-frame-top-clearance,0px)) 28px 20px;border-bottom:1px solid var(--line)}.ilb h1,.ilb h2,.ilb h3,.ilb p{margin:0}.ilb h1{font-size:22px;letter-spacing:-.03em}.ilb h2{font-size:16px}.ilb h3{font-size:13px}.ilb .mark{color:#fff;background:#24594f;padding:6px;border-radius:9px;display:flex}.ilb .subtitle,.ilb small{opacity:.72;font-size:12px}.ilb main{display:grid;grid-template-columns:minmax(190px,24%) minmax(0,1fr);min-height:calc(100% - 88px)}.ilb aside{padding:18px;background:var(--shade);border-right:1px solid var(--line);min-width:0}.ilb .editor{padding:22px clamp(14px,3vw,36px);min-width:0}.ilb .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.ilb .spread{justify-content:space-between}.ilb .grow{flex:1;min-width:110px}.ilb label{display:grid;gap:5px;font-size:12px;font-weight:600;margin:9px 0}.ilb input,.ilb textarea,.ilb select,.ilb button{font:inherit;color:inherit}\n.ilb input:not([type=checkbox]),.ilb textarea,.ilb select{width:100%;border:1px solid var(--line);padding:8px 10px;border-radius:6px;background:var(--dsw-alias-bg-base,Canvas);color:inherit}.ilb .transport{min-width:92px}.ilb textarea,.ilb pre,.ilb .mono{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px}.ilb textarea{resize:vertical;min-height:100px;line-height:1.55;tab-size:2}.ilb button{cursor:pointer;border:1px solid var(--line);border-radius:6px;background:transparent;padding:6px 10px}.ilb button:hover:not(:disabled){background:var(--shade)}.ilb button:disabled{cursor:default;opacity:.45}.ilb button.primary{background:var(--accent);color:white;border-color:transparent;font-weight:650}.ilb button.primary:hover:not(:disabled){background:#1c6055}.ilb :focus-visible{outline:2px solid #46a996;outline-offset:2px}\n.ilb .tabs{display:flex;gap:4px;margin:12px 0;flex-wrap:wrap;border-bottom:1px solid var(--line)}.ilb .tabs button{border:0;border-bottom:2px solid transparent;border-radius:0}.ilb .tabs button[aria-pressed=true]{border-color:#42a693;font-weight:700}.ilb .items{display:grid;gap:4px;max-height:48vh;overflow:auto}.ilb .item{display:flex;text-align:left;gap:6px;align-items:center}.ilb .item button{width:100%;text-align:left;min-width:0;border-color:transparent;padding:6px}.ilb .item strong,.ilb .item small{display:block;overflow-wrap:anywhere}.ilb .item .active{background:color-mix(in srgb,#429783 13%,transparent);border-color:color-mix(in srgb,#429783 40%,transparent)}.ilb .box{margin-top:16px;padding-top:14px;border-top:1px solid var(--line)}.ilb .inline{display:flex;align-items:center;gap:6px}.ilb .output{border:1px solid var(--line);border-radius:8px;padding:14px;margin-top:20px}.ilb .output pre{overflow:auto;max-height:420px;white-space:pre-wrap;overflow-wrap:anywhere;padding:12px;background:var(--shade);border-radius:5px}.ilb .pass{color:light-dark(#196151,#78cbb8)}.ilb .fail{color:light-dark(#a33531,#ffafa0)}.ilb .status{font-size:12px;font-weight:650}.ilb ul{padding-left:20px}.ilb .alert{padding:8px 12px;border-left:3px solid #bd6b46;margin:12px 0;overflow-wrap:anywhere}\n@container (max-width:660px){.ilb main{display:flex;flex-direction:column}.ilb aside{border-right:0;border-bottom:1px solid var(--line)}.ilb .items{max-height:145px}.ilb .editor{padding:16px}.ilb header{padding-inline:16px}}\n.ilb{--accent:light-dark(#17695f,#76cfba);--surface:light-dark(#fff,#192222);--canvas:light-dark(#f5f7f6,#111919);--ink:light-dark(#182b2a,#e1ebe8);--muted:light-dark(#4c655f,#acc2bb);--line:light-dark(#d7e1dd,#334440);background:var(--surface);color:var(--ink);font:14px/1.5 "Inter","Microsoft YaHei",system-ui,sans-serif}\n.ilb header{padding: max(15px,var(--dsh-frame-top-clearance,0px)) clamp(16px,2.4vw,28px) 15px;gap:12px}.ilb header h1{font-size:23px;line-height:1.18}.ilb .mark{background:#205b52;color:#f4fffb;padding:9px;border-radius:11px}.ilb .header-tools,.ilb .preset-bar{display:flex;align-items:center;gap:8px}.ilb .header-tools{margin-left:auto}.ilb .header-tools button{white-space:nowrap}.ilb .preset-bar{justify-content:flex-end;padding:6px 24px;background:var(--canvas)}.ilb .preset-bar label{min-width:min(320px,70%)}\n.ilb main{grid-template-columns:clamp(235px,26%,320px) minmax(0,1fr)}.ilb aside{background:var(--canvas);padding:22px 18px}.ilb aside>.row:first-child{margin-bottom:10px}.ilb .editor{padding:20px clamp(16px,2.5vw,34px) 32px;max-width:1400px;width:100%}.ilb h2{font-size:16px;line-height:1.4;font-weight:680}.ilb h3{overflow-wrap:anywhere}.ilb .subtitle,.ilb small{opacity:1;color:var(--muted)}\n.ilb fieldset{padding:0;border:0;min-width:0;margin:0}.ilb input:not([type=checkbox]),.ilb select,.ilb textarea{background:var(--surface);border-color:var(--line);min-width:0}.ilb button{background:var(--surface);color:var(--ink)}.ilb button.primary{background:#186d5e;color:#fff}.ilb .row button[aria-pressed=true]{background:var(--canvas);border-color:var(--accent);color:var(--accent)}.ilb .tabs{gap:2px}.ilb .tabs button{background:transparent}.ilb .tabs button[aria-pressed=true]{color:var(--accent);border-bottom-color:var(--accent)}\n.ilb .mini{width:auto;max-width:65%}.ilb .route{display:flex;flex-wrap:wrap;gap:11px;align-items:center;padding:9px 13px;border-radius:7px;background:light-dark(#e8f3ef,#20362f);color:light-dark(#20574b,#b3ead8);margin-bottom:18px;overflow-wrap:anywhere;font-size:13px}.ilb .route span:first-child:before{content:"";display:inline-block;vertical-align:middle;width:7px;height:7px;background:var(--accent);border-radius:50%;margin-right:8px}\n.ilb .selectors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ilb .selectors select,.ilb .fields input,.ilb .fields select,.ilb .picker .files{font-family:"IBM Plex Mono",Consolas,monospace}.ilb .selectors label,.ilb .value-field small{color:var(--muted)}.ilb .fields{margin:12px 0;border:1px solid var(--line);border-radius:8px;overflow:hidden}.ilb .value-field{display:grid;grid-template-columns:minmax(95px,.8fr) minmax(120px,1.2fr);align-items:center;gap:12px;padding:9px 13px;margin:0;border-bottom:1px solid var(--line)}.ilb .value-field:last-child{border:0}.ilb .value-field:nth-child(odd){background:var(--canvas)}.ilb .value-field span{min-width:0;overflow-wrap:anywhere}.ilb .value-field strong{display:block;font-family:Consolas,monospace;font-size:13px}.ilb .value-field small{font-size:11px;font-weight:400}.ilb .value-field textarea{min-height:48px}\n.ilb .source-card,.ilb .picker{margin:14px 0;padding:12px;background:var(--surface);border:1px solid var(--line);border-radius:8px}.ilb .source-card legend{font-weight:650}.ilb .pair{display:grid;grid-template-columns:minmax(0,1fr) 65px;gap:8px}.ilb .fingerprint,.ilb .source-info{font-size:12px;overflow-wrap:anywhere}.ilb .source-info{margin-top:8px}.ilb .source-info code,.ilb .source-info small{display:block;margin:6px 0}.ilb .files{display:grid;max-height:230px;overflow-y:auto;margin:8px 0}.ilb .files button{border:0;text-align:left;overflow-wrap:anywhere}.ilb .kind{font:11px system-ui;color:var(--muted);margin-right:8px}\n.ilb .output{border-radius:9px;padding:14px 16px;background:var(--canvas)}.ilb .output pre{background:var(--surface);border:1px solid var(--line)}.ilb .box{margin-top:15px;padding-top:14px}.ilb .items{margin:6px 0}.ilb .item button{background:transparent}.ilb .items:empty{display:none}\n@container (max-width:700px){.ilb main{display:flex;flex-direction:column}.ilb aside{padding:16px;border-right:0;border-bottom:1px solid var(--line)}.ilb .header-tools{flex-wrap:wrap;justify-content:flex-end}.ilb .header-tools select{width:auto}.ilb .editor{padding:16px}.ilb .items{max-height:140px}}\n@container (max-width:440px){.ilb .selectors{grid-template-columns:1fr;gap:0}.ilb .selectors label{margin:4px 0}.ilb .value-field{grid-template-columns:1fr}.ilb .header-tools{max-width:45%}.ilb .preset-bar{flex-wrap:wrap}.ilb header{padding-inline:12px}}\n\n.ilb .collection{padding:10px 13px;border-bottom:1px solid var(--line)}.ilb .collection>.row{margin:4px 0}.ilb .collection strong{font:600 13px Consolas,monospace}.ilb .entry{padding:7px 0 7px 10px;margin:8px 0;border-left:2px solid var(--line)}.ilb .entry>.value-field{padding-inline:5px}.ilb .entry>button{font-size:12px}\n\n.ilb .route{position:sticky;top:0;z-index:2;min-height:48px;border:1px solid color-mix(in srgb,var(--accent) 18%,transparent)}.ilb .route-actions{margin-left:auto;display:flex;align-items:center;flex-wrap:wrap;gap:6px}.ilb .route-actions button{font-size:12px}.ilb .route-actions .primary{padding:7px 15px}\n';

// web/model.js
var initial = { address: "", method: "", data: "{}", plaintext: false, name: "", pointer: "", expected: "", maxMs: "", metadata: "{}" };
function fromCase(request) {
  return {
    ...initial,
    name: request.name || "",
    address: request.address,
    method: request.method,
    data: request.data,
    plaintext: request.plaintext,
    pointer: request.check?.pointer ?? "",
    expected: Object.hasOwn(request.check ?? {}, "equals") ? JSON.stringify(request.check.equals) : "",
    maxMs: String(request.check?.maxMs ?? ""),
    metadata: JSON.stringify(Object.fromEntries((request.metadataKeys ?? []).map((k) => [k, ""])), null, 2)
  };
}
function params(form) {
  if (!form.address.trim() || !form.method.trim()) throw new Error("\u8BF7\u586B\u5199\u5730\u5740\u5E76\u9009\u62E9\u6216\u8F93\u5165\u65B9\u6CD5");
  JSON.parse(form.data);
  const metadata = JSON.parse(form.metadata || "{}");
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata) || Object.values(metadata).some((v) => typeof v !== "string" || !v.trim())) {
    throw new Error("Metadata \u9700\u8981\u975E\u7A7A\u5B57\u7B26\u4E32\u952E\u503C\uFF0C\u56DE\u653E\u65F6\u8BF7\u91CD\u65B0\u586B\u5199\u51ED\u636E");
  }
  const check = {};
  if (form.maxMs) check.maxMs = Number(form.maxMs);
  if (form.pointer && !form.expected.trim()) throw new Error("\u8BF7\u586B\u5199\u5B57\u6BB5\u7684 JSON \u671F\u671B\u503C");
  if (form.expected.trim()) {
    check.pointer = form.pointer;
    check.equals = JSON.parse(form.expected);
  }
  return { address: form.address.trim(), method: form.method.trim(), data: form.data, name: form.name.trim(), plaintext: form.plaintext, metadata, check };
}
function readPreference(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem("ilabrat." + key)) ?? fallback;
  } catch {
    return fallback;
  }
}
async function api(id, command, args = {}) {
  const response = await fetch(new URL("api/ilabrat", document.baseURI), {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, command, args })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.stderr || "DSH \u8BF7\u6C42\u5931\u8D25 " + response.status);
  return result;
}

// web/panel.jsx
var uid = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (x) => x.toString(16).padStart(2, "0")).join("");
var pretty = (value) => typeof value === "string" ? value : JSON.stringify(value, null, 2);
var field = (label, control) => /* @__PURE__ */ import_react3.default.createElement("label", null, label, import_react3.default.cloneElement(control, { "aria-label": label }));
function Mark({ size = 24 }) {
  return /* @__PURE__ */ import_react3.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", "aria-hidden": "true" }, /* @__PURE__ */ import_react3.default.createElement("path", { d: "m3 8 9-5 9 5-9 5z M3 12l9 5 9-5 M3 16l9 5 9-5", strokeLinejoin: "round" }));
}
function Tabs({ names, value, change }) {
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "tabs" }, names.map((n) => /* @__PURE__ */ import_react3.default.createElement("button", { key: n, "aria-pressed": value === n, onClick: () => change(n) }, n)));
}
function Workbench({ ctx, sessionId }) {
  const summaries = ctx.sessions.list.getSnapshot().byId;
  const session = summaries[sessionId] ?? Object.values(summaries).find((s) => (s.retainedBy?.mainView ?? 0) > 0);
  const defaultDir = session?.projectionValues?.workingDirectory || session?.cwd || readPreference("dir", "");
  const [sourceId, setSourceId] = (0, import_react3.useState)(() => readPreference("source", "local"));
  const [sources, setSources] = (0, import_react3.useState)([]), [manage, setManage] = (0, import_react3.useState)(false);
  const recent = (id) => readPreference("schema." + id, { mode: "proto", dir: "" });
  const [mode, setMode] = (0, import_react3.useState)(() => recent(sourceId).mode);
  const [dir, setDir] = (0, import_react3.useState)(() => recent(sourceId).dir), [root, setRoot] = (0, import_react3.useState)("");
  const [listing, setListing] = (0, import_react3.useState)(null), [bodyView, setBodyView] = (0, import_react3.useState)("\u5B57\u6BB5");
  const [issues, setIssues] = (0, import_react3.useState)({}), drafts = (0, import_react3.useRef)(/* @__PURE__ */ new Map());
  const [presets, setPresets] = (0, import_react3.useState)(() => readPreference("presets", []));
  const [presetName, setPresetName] = (0, import_react3.useState)(""), [presetEdit, setPresetEdit] = (0, import_react3.useState)(false);
  const [targetName, setTargetName] = (0, import_react3.useState)("");
  const preference = (key, value) => localStorage.setItem("ilabrat." + key, JSON.stringify(value));
  const location = (sourceId2, mode2, dir2) => ({ sourceId: sourceId2, dir: mode2 === "buf" ? dir2 || "." : void 0, proto: mode2 === "proto" ? dir2 : void 0 });
  const sourceName = sourceId === "local" ? "\u672C\u673A \xB7 DSH" : sources.find((s) => s.id === sourceId)?.name || "SSH \u6765\u6E90";
  const [form, setForm] = (0, import_react3.useState)(initial), [schema, setSchema] = (0, import_react3.useState)([]), [cases, setCases] = (0, import_react3.useState)([]);
  const [types, setTypes] = (0, import_react3.useState)({});
  const [nav, setNav] = (0, import_react3.useState)("\u65B9\u6CD5"), [tab, setTab] = (0, import_react3.useState)("\u8BF7\u6C42\u4F53"), [filter, setFilter] = (0, import_react3.useState)("");
  const [result, setResult] = (0, import_react3.useState)(null), [error, setError] = (0, import_react3.useState)(""), [busy, setBusy] = (0, import_react3.useState)("");
  const [selected, setSelected] = (0, import_react3.useState)([]), [save, setSave] = (0, import_react3.useState)(false);
  const [envs, setEnvs] = (0, import_react3.useState)(() => readPreference("envs", [])), [envName, setEnvName] = (0, import_react3.useState)("");
  const [envEdit, setEnvEdit] = (0, import_react3.useState)(false);
  const output = (0, import_react3.useRef)(null), task = (0, import_react3.useRef)(null), mounted = (0, import_react3.useRef)(true), importFile = (0, import_react3.useRef)(null);
  const patch = (values) => setForm((old) => ({ ...old, ...values }));
  const change = (key) => (e) => patch({ [key]: e.target.value });
  const setWorkspace = (value) => {
    drafts.current.clear();
    patch({ method: "", data: "{}" });
    setIssues({});
    setListing(null);
    setDir(value);
    setRoot("");
    setSchema([]);
    setCases([]);
    setSelected([]);
    setResult(null);
    setError("");
  };
  function switchSource(id, list = sources) {
    const next = recent(id);
    setSources(list);
    setSourceId(id);
    preference("source", id);
    setManage(false);
    setMode(next.mode);
    setWorkspace(next.dir);
  }
  async function run(label, operation) {
    if (task.current) return;
    const job = { id: uid(), cancelled: false };
    task.current = job;
    setBusy(label);
    setError("");
    const request = async (command, args) => {
      if (job.cancelled) throw new Error("\u64CD\u4F5C\u5DF2\u53D6\u6D88");
      const base = ["buf", "grpcurl"].includes(command) ? location(sourceId, mode, dir) : command === "browse" ? { sourceId } : {};
      const response = await api(job.id, command, { ...base, ...args });
      if (job.cancelled || !mounted.current) throw new Error("\u64CD\u4F5C\u5DF2\u53D6\u6D88");
      return response;
    };
    try {
      await operation(request);
    } catch (err) {
      if (mounted.current && task.current === job) setError(err.message);
    } finally {
      if (task.current === job) {
        task.current = null;
        if (mounted.current) setBusy("");
      }
    }
  }
  function cancel() {
    const job = task.current;
    if (job) {
      job.cancelled = true;
      api(job.id, "cancel").catch(() => {
      });
    }
  }
  async function history(request, at = {}) {
    const response = await request("grpcurl", { action: "history", ...at });
    if (!response.ok) throw new Error(response.stderr);
    setCases(response.cases);
  }
  async function loadSchema(request, id, kind, path, restore) {
    const at = location(id, kind, path);
    const value = await request("buf", { action: "schema", ...at });
    if (!value.ok) {
      setWorkspace(path);
      throw new Error(value.stderr);
    }
    const actual = value.file || value.root;
    setListing(null);
    setDir(actual);
    setRoot(value.root);
    setSchema(value.methods);
    setTypes(value.types);
    setResult(null);
    setCases([]);
    setSelected([]);
    preference("schema." + id, { mode: kind, dir: actual });
    const first = value.methods.find((m) => m.name === restore?.method) || value.methods[0];
    drafts.current.clear();
    setIssues({});
    setBodyView("\u5B57\u6BB5");
    if (restore && first?.name !== restore.method) {
      patch({ method: "", data: "{}" });
      throw new Error("\u914D\u7F6E\u6A21\u677F\u4E2D\u7684 RPC \u5DF2\u4E0D\u5B58\u5728\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u63A5\u53E3");
    }
    if (restore) setForm(fromCase(restore));
    else patch({ method: first?.name || "", data: first ? JSON.stringify(first.template, null, 2) : "{}" });
    await history(request, at);
  }
  const load = (path) => run("\u8BFB\u53D6\u534F\u8BAE", (request) => loadSchema(request, sourceId, mode, path));
  const visit = (path) => run("\u6D4F\u89C8\u6765\u6E90\u76EE\u5F55", async (request) => {
    const value = await request("browse", { dir: path || "." });
    if (!value.ok) throw new Error(value.stderr);
    setListing(value);
  });
  function browseStart() {
    const parent = mode === "proto" && dir ? dir.replace(/[^/\\]+$/, "") : dir;
    visit(parent || (sourceId === "local" ? defaultDir : ".") || ".");
  }
  (0, import_react3.useEffect)(() => {
    mounted.current = true;
    run("\u8BFB\u53D6\u6765\u6E90", async (request) => {
      const { profiles } = await request("sources", { action: "list" });
      setSources(profiles);
      if (sourceId !== "local" && !profiles.some((p) => p.id === sourceId)) {
        switchSource("local", profiles);
        throw new Error("\u4E0A\u6B21\u7684 SSH \u6765\u6E90\u5DF2\u5220\u9664\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u6765\u6E90");
      }
      if (dir) await loadSchema(request, sourceId, mode, dir);
    });
    return () => {
      mounted.current = false;
      cancel();
      task.current = null;
    };
  }, []);
  const method = schema.find((item) => item.name === form.method);
  function choose(item) {
    if (!item || item.name === form.method) return;
    if (method) drafts.current.set(method.name, form.data);
    patch({ method: item.name, data: drafts.current.get(item.name) ?? JSON.stringify(item.template, null, 2) });
    setTab("\u8BF7\u6C42\u4F53");
    setResult(null);
    setIssues({});
    setBodyView("\u5B57\u6BB5");
  }
  const packages = [...new Set(schema.map((m) => m.package))];
  const services = [...new Set(schema.filter((m) => m.package === method?.package).map((m) => m.service))];
  const methods = schema.filter((m) => m.package === method?.package && m.service === method?.service);
  function savePreset() {
    try {
      if (!presetName.trim()) throw new Error("\u8BF7\u586B\u5199\u914D\u7F6E\u6A21\u677F\u540D\u79F0");
      const { metadata, ...request } = params(form);
      const entry = { name: presetName.trim(), sourceId, mode, dir, targetName, request: { ...request, metadataKeys: Object.keys(metadata) } };
      const next = [...presets.filter((p) => p.name !== entry.name), entry];
      preference("presets", next);
      setPresets(next);
      setPresetEdit(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  function restorePreset(p) {
    if (!p) return;
    run("\u6253\u5F00\u914D\u7F6E\u6A21\u677F", async (request) => {
      if (p.sourceId !== "local" && !sources.some((s) => s.id === p.sourceId)) throw new Error("\u914D\u7F6E\u6A21\u677F\u5F15\u7528\u7684 SSH \u6765\u6E90\u5DF2\u5220\u9664");
      switchSource(p.sourceId);
      setMode(p.mode);
      setWorkspace(p.dir);
      setTargetName(p.targetName);
      setForm(fromCase(p.request));
      setTab("\u8BF7\u6C42\u4F53");
      await loadSchema(request, p.sourceId, p.mode, p.dir, p.request);
    });
  }
  const issue = (id, message) => setIssues((old) => {
    const next = { ...old };
    if (message) next[id] = message;
    else delete next[id];
    return next;
  });
  let payload, validJson = true;
  try {
    payload = JSON.parse(form.data);
  } catch {
    validJson = false;
  }
  function send() {
    return run("\u53D1\u9001", async (request) => {
      const value = await request("grpcurl", { ...params(form), save });
      setResult(value);
      if (value.caseId) await history(request);
    });
  }
  function openCase(id) {
    return run("\u8BFB\u53D6\u7528\u4F8B", async (request) => {
      const value = await request("grpcurl", { action: "load", caseId: id });
      if (!value.ok) throw new Error(value.stderr);
      setTargetName("");
      setIssues({});
      setBodyView("JSON");
      setForm(fromCase(value.request));
      setTab("\u8BF7\u6C42\u4F53");
      setResult(null);
    });
  }
  function batch() {
    return run("\u8FD0\u884C\u9009\u4E2D\u7528\u4F8B", async (request) => {
      const rows = [];
      for (const id of selected) {
        const value = await request("grpcurl", { caseId: id });
        rows.push({ name: cases.find((c) => c.id === id)?.name || id, ...value });
        setResult({ stage: "\u6279\u91CF\u56DE\u5F52", ok: rows.every((r) => r.ok), rows: [...rows] });
      }
    });
  }
  function keepEnv() {
    if (!envName.trim() || !form.address.trim()) {
      setError("\u8BF7\u586B\u5199\u73AF\u5883\u540D\u79F0\u548C\u670D\u52A1\u5730\u5740");
      return;
    }
    if (!/^(?:\[[^\]]+\]|[\w.-]+):\d+$/.test(form.address.trim()) || !Number(form.address.trim().split(":").at(-1)) || Number(form.address.trim().split(":").at(-1)) > 65535) {
      setError("\u670D\u52A1\u5730\u5740\u5E94\u4E3A host:port \u6216 [IPv6]:port");
      return;
    }
    const next = [...envs.filter((e) => e.name !== envName.trim()), { name: envName.trim(), address: form.address.trim(), plaintext: form.plaintext }];
    try {
      localStorage.setItem("ilabrat.envs", JSON.stringify(next));
      setEnvs(next);
      setTargetName(envName.trim());
      setEnvEdit(false);
    } catch (err) {
      setError(err.message);
    }
  }
  function exportRequest() {
    try {
      const { metadata, ...request } = params(form);
      const file = { format: "ilabrat.case.v1", request: { ...request, metadataKeys: Object.keys(metadata) } };
      const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "ilabrat-case.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  async function importRequest(file) {
    if (!file) return;
    try {
      if (file.size > 4 * 1024 * 1024) throw new Error("\u7528\u4F8B\u6587\u4EF6\u8D85\u8FC7 4 MiB");
      const value = JSON.parse(await file.text());
      if (value.format !== "ilabrat.case.v1") throw new Error("\u8BF7\u9009\u62E9 Ilabrat \u5BFC\u51FA\u7684\u7528\u4F8B\u6587\u4EF6");
      const r = value.request;
      if (!r || typeof r.address !== "string" || typeof r.method !== "string" || typeof r.data !== "string" || r.name !== void 0 && typeof r.name !== "string" || typeof r.plaintext !== "boolean" || r.check?.pointer !== void 0 && typeof r.check.pointer !== "string" || !Array.isArray(r.metadataKeys) || r.metadataKeys.some((k) => typeof k !== "string")) throw new Error("\u7528\u4F8B\u5B57\u6BB5\u65E0\u6548");
      JSON.parse(r.data);
      setTargetName("");
      setIssues({});
      setBodyView("JSON");
      setForm(fromCase(r));
      setResult(null);
      setTab("\u8BF7\u6C42\u4F53");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  const responseText = result?.response !== void 0 ? pretty(result.response) : result?.descriptor || result?.stdout;
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "ilb" }, /* @__PURE__ */ import_react3.default.createElement("style", null, theme_default), /* @__PURE__ */ import_react3.default.createElement("header", null, /* @__PURE__ */ import_react3.default.createElement("span", { className: "mark" }, /* @__PURE__ */ import_react3.default.createElement(Mark, { size: 26 })), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h1", null, "Ilabrat"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "subtitle" }, "gRPC \u5DE5\u4F5C\u53F0")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "header-tools" }, /* @__PURE__ */ import_react3.default.createElement("select", { "aria-label": "\u6253\u5F00\u914D\u7F6E\u6A21\u677F", value: "", disabled: !!busy || !presets.length, onChange: (e) => restorePreset(presets.find((p) => p.name === e.target.value)) }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "" }, "\u914D\u7F6E\u6A21\u677F"), presets.map((p) => /* @__PURE__ */ import_react3.default.createElement("option", { key: p.name }, p.name))), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy || !method || !!Object.keys(issues).length, onClick: () => setPresetEdit(!presetEdit) }, "\u4FDD\u5B58\u6A21\u677F"))), presetEdit && /* @__PURE__ */ import_react3.default.createElement("div", { className: "preset-bar" }, /* @__PURE__ */ import_react3.default.createElement("label", null, "\u914D\u7F6E\u6A21\u677F\u540D\u79F0", /* @__PURE__ */ import_react3.default.createElement("input", { placeholder: "\u4F8B\u5982\uFF1A\u5F00\u53D1\u673A \xB7 \u6D4B\u8BD5\u96C6\u7FA4 \xB7 \u67E5\u8BE2\u8D44\u4EA7", value: presetName, onChange: (e) => setPresetName(e.target.value) })), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy, onClick: savePreset }, "\u4FDD\u5B58\u5F53\u524D\u914D\u7F6E\u4E0E\u8BF7\u6C42")), /* @__PURE__ */ import_react3.default.createElement("main", null, /* @__PURE__ */ import_react3.default.createElement("aside", null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react3.default.createElement("h2", null, "\u8BF7\u6C42\u6765\u6E90"), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy, onClick: () => setManage(!manage) }, "\u6DFB\u52A0 SSH")), /* @__PURE__ */ import_react3.default.createElement("select", { "aria-label": "\u8BF7\u6C42\u6765\u6E90", value: sourceId, disabled: !!busy, onChange: (e) => switchSource(e.target.value) }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "local" }, "\u672C\u673A \xB7 DSH"), sources.map((s) => /* @__PURE__ */ import_react3.default.createElement("option", { key: s.id, value: s.id }, s.name, " \xB7 SSH"))), manage && /* @__PURE__ */ import_react3.default.createElement(SourceSettings, { busy: !!busy, run, onClose: () => setManage(false), onSaved: (p) => switchSource(p.id, [...sources, p]) }), sourceId !== "local" && /* @__PURE__ */ import_react3.default.createElement("details", { className: "source-info" }, /* @__PURE__ */ import_react3.default.createElement("summary", null, "\u8FDE\u63A5\u8BE6\u60C5"), /* @__PURE__ */ import_react3.default.createElement("code", null, sources.find((p) => p.id === sourceId)?.username, "@", sources.find((p) => p.id === sourceId)?.host, " \xB7 ", sources.find((p) => p.id === sourceId)?.port), /* @__PURE__ */ import_react3.default.createElement("small", null, "\u6765\u6E90 ID \xB7 ", sourceId), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy, onClick: () => run("\u5220\u9664\u6765\u6E90", async (req) => {
    await req("sources", { action: "delete", sourceId });
    switchSource("local", sources.filter((p) => p.id !== sourceId));
  }) }, "\u79FB\u9664\u6B64\u6765\u6E90\u548C\u51ED\u636E")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "box" }, /* @__PURE__ */ import_react3.default.createElement("h2", null, "\u534F\u8BAE\u6765\u6E90"), /* @__PURE__ */ import_react3.default.createElement("fieldset", { disabled: !!busy }, /* @__PURE__ */ import_react3.default.createElement(Tabs, { names: ["Proto \u6587\u4EF6", "Buf \u5DE5\u4F5C\u533A"], value: mode === "proto" ? "Proto \u6587\u4EF6" : "Buf \u5DE5\u4F5C\u533A", change: (n) => {
    const k = n === "Proto \u6587\u4EF6" ? "proto" : "buf";
    if (k !== mode) {
      setMode(k);
      setWorkspace("");
    }
  } }), field(mode === "proto" ? "\u6587\u4EF6\u8DEF\u5F84" : "\u5DE5\u4F5C\u533A\u8DEF\u5F84", /* @__PURE__ */ import_react3.default.createElement("input", { className: "mono", value: dir, placeholder: mode === "proto" ? "\u9009\u62E9 .proto \u6587\u4EF6" : "\u9009\u62E9\u542B buf.yaml \u7684\u76EE\u5F55", onChange: (e) => setWorkspace(e.target.value) })), /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react3.default.createElement("button", { onClick: browseStart }, "\u6D4F\u89C8", mode === "proto" ? "\u6587\u4EF6" : "\u76EE\u5F55", "\u2026"), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !dir, onClick: () => load(dir) }, "\u52A0\u8F7D\u534F\u8BAE"))), listing && /* @__PURE__ */ import_react3.default.createElement(Browser, { key: listing.dir, listing, mode, busy: !!busy, visit, close: () => setListing(null), select: load })), /* @__PURE__ */ import_react3.default.createElement(Tabs, { value: nav, names: ["\u65B9\u6CD5", "\u7528\u4F8B"], change: (n) => {
    setNav(n);
    setFilter("");
  } }), field("\u7B5B\u9009" + nav, /* @__PURE__ */ import_react3.default.createElement("input", { type: "search", value: filter, onChange: (e) => setFilter(e.target.value) })), /* @__PURE__ */ import_react3.default.createElement("div", { className: "items" }, nav === "\u65B9\u6CD5" ? schema.filter((m) => m.name.toLowerCase().includes(filter.toLowerCase())).map((m) => /* @__PURE__ */ import_react3.default.createElement("div", { className: "item", key: m.name }, /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy, className: form.method === m.name ? "active" : "", onClick: () => choose(m) }, /* @__PURE__ */ import_react3.default.createElement("strong", null, m.name.split("/")[1]), /* @__PURE__ */ import_react3.default.createElement("small", null, m.name.split("/")[0])))) : cases.filter((c) => (c.name + c.method).toLowerCase().includes(filter.toLowerCase())).map((c) => /* @__PURE__ */ import_react3.default.createElement("div", { className: "item", key: c.id }, /* @__PURE__ */ import_react3.default.createElement("input", { type: "checkbox", "aria-label": "\u9009\u4E2D " + (c.name || c.method), disabled: !!busy, checked: selected.includes(c.id), onChange: (e) => setSelected(e.target.checked ? [...selected, c.id] : selected.filter((id) => id !== c.id)) }), /* @__PURE__ */ import_react3.default.createElement("button", { onClick: () => openCase(c.id), disabled: !!busy }, /* @__PURE__ */ import_react3.default.createElement("strong", null, c.name || c.method), /* @__PURE__ */ import_react3.default.createElement("small", null, c.ok ? "\u901A\u8FC7" : "\u5931\u8D25", " \xB7 ", new Date(c.time).toLocaleString()))))), nav === "\u7528\u4F8B" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react3.default.createElement("input", { hidden: true, type: "file", accept: ".json,application/json", ref: importFile, onChange: (e) => {
    importRequest(e.target.files[0]);
    e.target.value = "";
  } }), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy, onClick: () => importFile.current.click() }, "\u5BFC\u5165\u7528\u4F8B"), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy || !form.method || !!Object.keys(issues).length, onClick: exportRequest }, "\u5BFC\u51FA\u7528\u4F8B")), nav === "\u65B9\u6CD5" && /* @__PURE__ */ import_react3.default.createElement("small", null, root ? schema.length + " \u4E2A\u65B9\u6CD5" : "\u9009\u62E9\u534F\u8BAE\u540E\u663E\u793A\u65B9\u6CD5"), nav === "\u7528\u4F8B" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy || !selected.length, onClick: batch }, "\u8FD0\u884C\u9009\u4E2D (", selected.length, ")"), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !!busy, onClick: () => run("\u5237\u65B0\u7528\u4F8B", history) }, "\u5237\u65B0")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "box" }, /* @__PURE__ */ import_react3.default.createElement("h3", null, "Schema \u68C0\u67E5"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "row", style: { marginTop: 8 } }, ["lint", "build"].map((action) => /* @__PURE__ */ import_react3.default.createElement("button", { key: action, disabled: !!busy || !root, onClick: () => run("buf " + action, async (request) => setResult(await request("buf", { action }))) }, action === "lint" ? "\u6821\u9A8C" : "\u7F16\u8BD1"))))), /* @__PURE__ */ import_react3.default.createElement("section", { className: "editor" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "route" }, /* @__PURE__ */ import_react3.default.createElement("span", null, sourceName), /* @__PURE__ */ import_react3.default.createElement("span", { "aria-hidden": "true" }, "\u2192"), /* @__PURE__ */ import_react3.default.createElement("b", null, targetName || form.address || "\u5F85\u9009\u62E9\u76EE\u6807"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "route-actions" }, result && /* @__PURE__ */ import_react3.default.createElement("button", { onClick: () => output.current?.scrollIntoView({ block: "center" }) }, result.ok ? "\u67E5\u770B\u7ED3\u679C" : "\u67E5\u770B\u5931\u8D25\u539F\u56E0", result.rpcMs != null && " \xB7 " + result.rpcMs + " ms"), busy ? /* @__PURE__ */ import_react3.default.createElement("button", { onClick: cancel }, "\u53D6\u6D88", busy) : /* @__PURE__ */ import_react3.default.createElement("button", { className: "primary", disabled: !!busy || !root || !method || !form.address.trim() || !validJson || !!Object.keys(issues).length, onClick: send }, "\u53D1\u9001\u8BF7\u6C42"))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react3.default.createElement("h2", null, "\u76EE\u6807\u73AF\u5883"), /* @__PURE__ */ import_react3.default.createElement("select", { className: "mini", "aria-label": "\u5207\u6362\u76EE\u6807\u73AF\u5883", disabled: !!busy, value: targetName, onChange: (e) => {
    setTargetName(e.target.value);
    const env = envs.find((v) => v.name === e.target.value);
    if (env) patch({ address: env.address, plaintext: env.plaintext, metadata: "{}" });
  } }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "" }, "\u81EA\u5B9A\u4E49\u76EE\u6807"), envs.map((e) => /* @__PURE__ */ import_react3.default.createElement("option", { key: e.name }, e.name)))), /* @__PURE__ */ import_react3.default.createElement("fieldset", { disabled: !!busy }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "grow" }, "\u670D\u52A1\u5730\u5740", /* @__PURE__ */ import_react3.default.createElement("input", { className: "mono", placeholder: "localhost:50051", value: form.address, onChange: (e) => {
    setTargetName("");
    patch({ address: e.target.value });
  } })), /* @__PURE__ */ import_react3.default.createElement("label", { className: "transport" }, "\u4F20\u8F93", /* @__PURE__ */ import_react3.default.createElement("select", { "aria-label": "\u4F20\u8F93", value: form.plaintext ? "plain" : "tls", onChange: (e) => {
    setTargetName("");
    patch({ plaintext: e.target.value === "plain" });
  } }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "tls" }, "TLS"), /* @__PURE__ */ import_react3.default.createElement("option", { value: "plain" }, "\u660E\u6587 h2c"))), /* @__PURE__ */ import_react3.default.createElement("button", { onClick: () => setEnvEdit((v) => !v) }, "\u4FDD\u5B58\u76EE\u6807")), envEdit && /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, field("\u76EE\u6807\u73AF\u5883\u540D\u79F0", /* @__PURE__ */ import_react3.default.createElement("input", { value: envName, onChange: (e) => setEnvName(e.target.value) })), /* @__PURE__ */ import_react3.default.createElement("button", { onClick: keepEnv }, "\u4FDD\u5B58\u5730\u5740\u4E0E\u4F20\u8F93")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "box" }, /* @__PURE__ */ import_react3.default.createElement("h2", null, "RPC \u63A5\u53E3"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "selectors" }, field("Package", /* @__PURE__ */ import_react3.default.createElement("select", { value: method?.package ?? "", disabled: !schema.length, onChange: (e) => choose(schema.find((m) => m.package === e.target.value)) }, !method && /* @__PURE__ */ import_react3.default.createElement("option", { value: "" }, "\u8BF7\u9009\u62E9\u534F\u8BAE"), packages.map((n) => /* @__PURE__ */ import_react3.default.createElement("option", { key: n, value: n }, n || "\uFF08\u65E0 package\uFF09")))), field("Service", /* @__PURE__ */ import_react3.default.createElement("select", { value: method?.service || "", disabled: !services.length, onChange: (e) => choose(schema.find((m) => m.package === method?.package && m.service === e.target.value)) }, services.map((n) => /* @__PURE__ */ import_react3.default.createElement("option", { key: n }, n)))), field("Method", /* @__PURE__ */ import_react3.default.createElement("select", { value: method?.name || "", disabled: !methods.length, onChange: (e) => choose(schema.find((m) => m.name === e.target.value)) }, methods.map((m) => /* @__PURE__ */ import_react3.default.createElement("option", { key: m.name, value: m.name }, m.rpc)))))), method && /* @__PURE__ */ import_react3.default.createElement("small", null, method.input, " \u2192 ", method.output, method.clientStreaming || method.serverStreaming ? " \xB7 streaming" : " \xB7 unary"), /* @__PURE__ */ import_react3.default.createElement(Tabs, { names: ["\u8BF7\u6C42\u4F53", "Metadata", "\u65AD\u8A00"], value: tab, change: setTab }), /* @__PURE__ */ import_react3.default.createElement("div", { hidden: tab !== "\u8BF7\u6C42\u4F53" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react3.default.createElement("h3", null, method?.input || "\u8BF7\u6C42\u53C2\u6570"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react3.default.createElement("button", { "aria-pressed": bodyView === "\u5B57\u6BB5", disabled: !validJson || !method, onClick: () => setBodyView("\u5B57\u6BB5") }, "\u5B57\u6BB5"), /* @__PURE__ */ import_react3.default.createElement("button", { "aria-pressed": bodyView === "JSON", disabled: !!Object.keys(issues).length, onClick: () => setBodyView("JSON") }, "JSON"))), bodyView === "\u5B57\u6BB5" && method && validJson ? /* @__PURE__ */ import_react3.default.createElement(Fields, { key: method.name, value: payload, types, type: method.input, onChange: (v) => patch({ data: JSON.stringify(v, null, 2) }), issue }) : field("\u8BF7\u6C42 JSON", /* @__PURE__ */ import_react3.default.createElement("textarea", { rows: 6, spellCheck: false, value: form.data, onChange: change("data") })), Object.values(issues).map((m) => /* @__PURE__ */ import_react3.default.createElement("small", { className: "fail", key: m }, m)), /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, bodyView === "JSON" && /* @__PURE__ */ import_react3.default.createElement("button", { onClick: () => {
    try {
      patch({ data: JSON.stringify(JSON.parse(form.data), null, 2) });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  } }, "\u683C\u5F0F\u5316 JSON"), /* @__PURE__ */ import_react3.default.createElement("button", { disabled: !method, onClick: () => {
    patch({ data: JSON.stringify(method.template, null, 2) });
    setIssues({});
    setBodyView("JSON");
  } }, "\u91CD\u7F6E\u4E3A\u534F\u8BAE\u6A21\u677F"))), tab === "Metadata" && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, field("gRPC Metadata\uFF08JSON \u952E\u503C\u5BF9\uFF09", /* @__PURE__ */ import_react3.default.createElement("textarea", { rows: 5, spellCheck: false, value: form.metadata, onChange: change("metadata") })), /* @__PURE__ */ import_react3.default.createElement("small", null, "\u5386\u53F2\u7528\u4F8B\u4EC5\u4FDD\u5B58\u952E\u540D\uFF0C\u56DE\u653E\u524D\u53EF\u5728\u8FD9\u91CC\u8865\u586B\u51ED\u636E\u3002")), tab === "\u65AD\u8A00" && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "grow" }, "\u54CD\u5E94\u5B57\u6BB5\uFF08JSON Pointer\uFF09", /* @__PURE__ */ import_react3.default.createElement("input", { placeholder: "/result/id", value: form.pointer, onChange: change("pointer") })), /* @__PURE__ */ import_react3.default.createElement("label", { className: "grow" }, "\u671F\u671B\u503C\uFF08JSON\uFF09", /* @__PURE__ */ import_react3.default.createElement("input", { placeholder: '"ok"', value: form.expected, onChange: change("expected") }))), field("RPC \u8017\u65F6\u4E0A\u9650\uFF08\u6BEB\u79D2\uFF09", /* @__PURE__ */ import_react3.default.createElement("input", { type: "number", min: "1", value: form.maxMs, onChange: change("maxMs") })), /* @__PURE__ */ import_react3.default.createElement("small", null, "\u7A7A\u8DEF\u5F84\u5339\u914D\u6574\u4E2A\u54CD\u5E94\u3002\u6BCF\u6B21\u53D1\u9001\u90FD\u4F1A\u68C0\u67E5 gRPC \u662F\u5426\u6210\u529F\u3002")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "box row" }, /* @__PURE__ */ import_react3.default.createElement("label", { className: "inline" }, /* @__PURE__ */ import_react3.default.createElement("input", { type: "checkbox", checked: save, onChange: (e) => setSave(e.target.checked) }), "\u4FDD\u5B58\u4E3A\u7528\u4F8B"), save && /* @__PURE__ */ import_react3.default.createElement("input", { style: { maxWidth: 235 }, "aria-label": "\u7528\u4F8B\u540D\u79F0", placeholder: "\u7528\u4F8B\u540D\u79F0", value: form.name, onChange: change("name") }))), busy && /* @__PURE__ */ import_react3.default.createElement("div", { className: "row", role: "status" }, busy, "\u2026 ", /* @__PURE__ */ import_react3.default.createElement("button", { onClick: cancel }, "\u53D6\u6D88")), error && /* @__PURE__ */ import_react3.default.createElement("p", { className: "alert", role: "alert" }, error), /* @__PURE__ */ import_react3.default.createElement("section", { ref: output, className: "output", "aria-live": "polite" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react3.default.createElement("h2", null, "\u7ED3\u679C"), result && /* @__PURE__ */ import_react3.default.createElement("span", { className: "status " + (result.ok ? "pass" : "fail") }, result.ok ? "\u901A\u8FC7" : "\u5931\u8D25", " \xB7 ", result.stage)), !result && /* @__PURE__ */ import_react3.default.createElement("small", null, "\u53D1\u9001\u8BF7\u6C42\u6216\u6267\u884C schema \u68C0\u67E5\u540E\uFF0C\u7ED3\u679C\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002"), result && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, result.elapsedMs != null && /* @__PURE__ */ import_react3.default.createElement("p", { className: "subtitle" }, "\u603B\u8017\u65F6 ", result.elapsedMs, " ms", result.rpcMs != null && " \xB7 RPC " + result.rpcMs + " ms", result.exitCode != null && " \xB7 \u9000\u51FA\u7801 " + result.exitCode), result.checks?.map((c, i) => /* @__PURE__ */ import_react3.default.createElement("div", { key: i, className: c.passed ? "pass" : "fail" }, c.passed ? "\u2713" : "\xD7", " ", c.name, !c.passed && Object.hasOwn(c, "expected") && "\u3000\u671F\u671B " + JSON.stringify(c.expected) + "\uFF0C\u5B9E\u9645 " + JSON.stringify(c.actual))), result.rows?.map((r, i) => /* @__PURE__ */ import_react3.default.createElement("details", { key: i }, /* @__PURE__ */ import_react3.default.createElement("summary", null, r.ok ? "\u2713" : "\xD7", " ", r.name, " \xB7 ", r.elapsedMs, " ms"), /* @__PURE__ */ import_react3.default.createElement("pre", null, pretty(r)))), responseText && /* @__PURE__ */ import_react3.default.createElement("pre", null, responseText), result.stderr && /* @__PURE__ */ import_react3.default.createElement("pre", { className: "fail" }, result.stderr), result.caseId && /* @__PURE__ */ import_react3.default.createElement("small", null, "\u5DF2\u4FDD\u5B58\u7528\u4F8B \xB7 ", result.caseId), result.historyError && /* @__PURE__ */ import_react3.default.createElement("p", { role: "alert" }, "\u7528\u4F8B\u4FDD\u5B58\u5931\u8D25 \xB7 ", result.historyError))))));
}
var inject = ["slots", "locale", "uiWorkspace", "sessions"];
function apply(ctx) {
  ctx.locale.register("ilabrat", { zh: { nav: "Ilabrat \xB7 gRPC \u5DE5\u4F5C\u53F0" }, en: { nav: "Ilabrat \xB7 gRPC workbench" } });
  const t = ctx.locale.bind("ilabrat");
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: "ilabrat", order: 50, label: () => t("nav"), locale: "ilabrat" }, Mark));
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: "ilabrat" }, (props) => /* @__PURE__ */ import_react3.default.createElement(Workbench, { ...props, ctx })));
}
return module.exports;}});
