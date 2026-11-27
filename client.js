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
var import_react = __toESM(require("react"), 1);

// web/theme.css
var theme_default = '.ilb {--ink:var(--dsw-alias-label-primary,CanvasText);--line:color-mix(in srgb,currentColor 19%,transparent);--shade:color-mix(in srgb,currentColor 4%,transparent);--accent:#247466;box-sizing:border-box;height:100%;overflow:auto;color:var(--ink);background:var(--dsw-alias-bg-base,Canvas);font:14px/1.48 "Inter",system-ui,sans-serif;container-type:inline-size;color-scheme:inherit}\n.ilb *{box-sizing:border-box}.ilb header{display:flex;align-items:center;gap:14px;padding: max(22px,var(--dsh-frame-top-clearance,0px)) 28px 20px;border-bottom:1px solid var(--line)}.ilb h1,.ilb h2,.ilb h3,.ilb p{margin:0}.ilb h1{font-size:22px;letter-spacing:-.03em}.ilb h2{font-size:16px}.ilb h3{font-size:13px}.ilb .mark{color:#fff;background:#24594f;padding:6px;border-radius:9px;display:flex}.ilb .subtitle,.ilb small{opacity:.72;font-size:12px}.ilb main{display:grid;grid-template-columns:minmax(190px,24%) minmax(0,1fr);min-height:calc(100% - 88px)}.ilb aside{padding:18px;background:var(--shade);border-right:1px solid var(--line);min-width:0}.ilb .editor{padding:22px clamp(14px,3vw,36px);min-width:0}.ilb .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.ilb .spread{justify-content:space-between}.ilb .grow{flex:1;min-width:110px}.ilb label{display:grid;gap:5px;font-size:12px;font-weight:600;margin:9px 0}.ilb input,.ilb textarea,.ilb select,.ilb button{font:inherit;color:inherit}\n.ilb input:not([type=checkbox]),.ilb textarea,.ilb select{width:100%;border:1px solid var(--line);padding:8px 10px;border-radius:6px;background:var(--dsw-alias-bg-base,Canvas);color:inherit}.ilb .transport{min-width:92px}.ilb textarea,.ilb pre,.ilb .mono{font-family:"IBM Plex Mono",Consolas,monospace;font-size:13px}.ilb textarea{resize:vertical;min-height:100px;line-height:1.55;tab-size:2}.ilb button{cursor:pointer;border:1px solid var(--line);border-radius:6px;background:transparent;padding:6px 10px}.ilb button:hover:not(:disabled){background:var(--shade)}.ilb button:disabled{cursor:default;opacity:.45}.ilb button.primary{background:var(--accent);color:white;border-color:transparent;font-weight:650}.ilb button.primary:hover:not(:disabled){background:#1c6055}.ilb :focus-visible{outline:2px solid #46a996;outline-offset:2px}\n.ilb .tabs{display:flex;gap:4px;margin:12px 0;flex-wrap:wrap;border-bottom:1px solid var(--line)}.ilb .tabs button{border:0;border-bottom:2px solid transparent;border-radius:0}.ilb .tabs button[aria-pressed=true]{border-color:#42a693;font-weight:700}.ilb .items{display:grid;gap:4px;max-height:48vh;overflow:auto}.ilb .item{display:flex;text-align:left;gap:6px;align-items:center}.ilb .item button{width:100%;text-align:left;min-width:0;border-color:transparent;padding:6px}.ilb .item strong,.ilb .item small{display:block;overflow-wrap:anywhere}.ilb .item .active{background:color-mix(in srgb,#429783 13%,transparent);border-color:color-mix(in srgb,#429783 40%,transparent)}.ilb .box{margin-top:16px;padding-top:14px;border-top:1px solid var(--line)}.ilb .inline{display:flex;align-items:center;gap:6px}.ilb .output{border:1px solid var(--line);border-radius:8px;padding:14px;margin-top:20px}.ilb .output pre{overflow:auto;max-height:420px;white-space:pre-wrap;overflow-wrap:anywhere;padding:12px;background:var(--shade);border-radius:5px}.ilb .pass{color:light-dark(#196151,#78cbb8)}.ilb .fail{color:light-dark(#a33531,#ffafa0)}.ilb .status{font-size:12px;font-weight:650}.ilb ul{padding-left:20px}.ilb .alert{padding:8px 12px;border-left:3px solid #bd6b46;margin:12px 0;overflow-wrap:anywhere}\n@container (max-width:660px){.ilb main{display:flex;flex-direction:column}.ilb aside{border-right:0;border-bottom:1px solid var(--line)}.ilb .items{max-height:145px}.ilb .editor{padding:16px}.ilb header{padding-inline:16px}}\n';

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
var field = (label, control) => /* @__PURE__ */ import_react.default.createElement("label", null, label, import_react.default.cloneElement(control, { "aria-label": label }));
function Mark({ size = 24 }) {
  return /* @__PURE__ */ import_react.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("path", { d: "m3 8 9-5 9 5-9 5z M3 12l9 5 9-5 M3 16l9 5 9-5", strokeLinejoin: "round" }));
}
function Tabs({ names, value, change }) {
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "tabs" }, names.map((n) => /* @__PURE__ */ import_react.default.createElement("button", { key: n, "aria-pressed": value === n, onClick: () => change(n) }, n)));
}
function Workbench({ ctx, sessionId }) {
  const summaries = ctx.sessions.list.getSnapshot().byId;
  const session = summaries[sessionId] ?? Object.values(summaries).find((s) => (s.retainedBy?.mainView ?? 0) > 0);
  const defaultDir = session?.projectionValues?.workingDirectory || session?.cwd || readPreference("dir", "");
  const [dir, setDir] = (0, import_react.useState)(defaultDir), [root, setRoot] = (0, import_react.useState)("");
  const [form, setForm] = (0, import_react.useState)(initial), [schema, setSchema] = (0, import_react.useState)([]), [cases, setCases] = (0, import_react.useState)([]);
  const [nav, setNav] = (0, import_react.useState)("\u65B9\u6CD5"), [tab, setTab] = (0, import_react.useState)("\u8BF7\u6C42\u4F53"), [filter, setFilter] = (0, import_react.useState)("");
  const [result, setResult] = (0, import_react.useState)(null), [error, setError] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)("");
  const [selected, setSelected] = (0, import_react.useState)([]), [save, setSave] = (0, import_react.useState)(false);
  const [envs, setEnvs] = (0, import_react.useState)(() => readPreference("envs", [])), [envName, setEnvName] = (0, import_react.useState)("");
  const [envEdit, setEnvEdit] = (0, import_react.useState)(false);
  const task = (0, import_react.useRef)(null), mounted = (0, import_react.useRef)(true), importFile = (0, import_react.useRef)(null);
  const patch = (values) => setForm((old) => ({ ...old, ...values }));
  const change = (key) => (e) => patch({ [key]: e.target.value });
  const setWorkspace = (value) => {
    setDir(value);
    setRoot("");
    setSchema([]);
    setCases([]);
    setSelected([]);
    setResult(null);
    setError("");
  };
  async function run(label, operation) {
    if (task.current) return;
    const job = { id: uid(), cancelled: false };
    task.current = job;
    setBusy(label);
    setError("");
    const request = async (command, args) => {
      if (job.cancelled) throw new Error("\u64CD\u4F5C\u5DF2\u53D6\u6D88");
      const response = await api(job.id, command, { dir: dir.trim() || ".", ...args });
      if (job.cancelled || !mounted.current) throw new Error("\u64CD\u4F5C\u5DF2\u53D6\u6D88");
      return response;
    };
    try {
      await operation(request);
    } catch (err) {
      if (mounted.current) setError(err.message);
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
  async function history(request) {
    const response = await request("grpcurl", { action: "history" });
    if (!response.ok) throw new Error(response.stderr);
    setCases(response.cases);
  }
  function load() {
    return run("\u52A0\u8F7D schema", async (request) => {
      const value = await request("buf", { action: "schema" });
      if (!value.ok) {
        setSchema([]);
        setRoot("");
        throw new Error(value.stderr);
      }
      setRoot(value.root);
      setDir(value.root);
      setSchema(value.methods);
      localStorage.setItem("ilabrat.dir", JSON.stringify(value.root));
      await history(request);
    });
  }
  (0, import_react.useEffect)(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
      cancel();
    };
  }, []);
  const method = schema.find((item) => item.name === form.method);
  function choose(item) {
    patch({ method: item.name, ...form.data.trim() === "{}" ? { data: pretty(item.template) } : {} });
    setTab("\u8BF7\u6C42\u4F53");
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
    const next = [...envs.filter((e) => e.name !== envName.trim()), { name: envName.trim(), address: form.address.trim(), plaintext: form.plaintext }];
    try {
      localStorage.setItem("ilabrat.envs", JSON.stringify(next));
      setEnvs(next);
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
      setForm(fromCase(r));
      setResult(null);
      setTab("\u8BF7\u6C42\u4F53");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  const responseText = result?.response !== void 0 ? pretty(result.response) : result?.descriptor || result?.stdout;
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "ilb" }, /* @__PURE__ */ import_react.default.createElement("style", null, theme_default), /* @__PURE__ */ import_react.default.createElement("header", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "mark" }, /* @__PURE__ */ import_react.default.createElement(Mark, { size: 30 })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h1", null, "Ilabrat"), /* @__PURE__ */ import_react.default.createElement("p", { className: "subtitle" }, "gRPC \u63A5\u53E3\u6D4B\u8BD5\u5DE5\u4F5C\u53F0"))), /* @__PURE__ */ import_react.default.createElement("main", null, /* @__PURE__ */ import_react.default.createElement("aside", null, /* @__PURE__ */ import_react.default.createElement("h2", null, "Buf \u5DE5\u4F5C\u533A"), field("\u76EE\u5F55", /* @__PURE__ */ import_react.default.createElement("input", { value: dir, onChange: (e) => setWorkspace(e.target.value), disabled: !!busy, placeholder: "\u542B buf.yaml \u7684\u76EE\u5F55" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("button", { disabled: !!busy, onClick: load }, "\u52A0\u8F7D schema"), /* @__PURE__ */ import_react.default.createElement("button", { disabled: !!busy, onClick: () => run("\u9009\u62E9\u76EE\u5F55", async () => {
    const path = await ctx.uiWorkspace.pickDirectory();
    if (path) setWorkspace(path);
  }) }, "\u6D4F\u89C8\u2026")), /* @__PURE__ */ import_react.default.createElement(Tabs, { value: nav, names: ["\u65B9\u6CD5", "\u7528\u4F8B"], change: (n) => {
    setNav(n);
    setFilter("");
  } }), field("\u7B5B\u9009" + nav, /* @__PURE__ */ import_react.default.createElement("input", { type: "search", value: filter, onChange: (e) => setFilter(e.target.value) })), /* @__PURE__ */ import_react.default.createElement("div", { className: "items" }, nav === "\u65B9\u6CD5" ? schema.filter((m) => m.name.toLowerCase().includes(filter.toLowerCase())).map((m) => /* @__PURE__ */ import_react.default.createElement("div", { className: "item", key: m.name }, /* @__PURE__ */ import_react.default.createElement("button", { disabled: !!busy, className: form.method === m.name ? "active" : "", onClick: () => choose(m) }, /* @__PURE__ */ import_react.default.createElement("strong", null, m.name.split("/")[1]), /* @__PURE__ */ import_react.default.createElement("small", null, m.name.split("/")[0])))) : cases.filter((c) => (c.name + c.method).toLowerCase().includes(filter.toLowerCase())).map((c) => /* @__PURE__ */ import_react.default.createElement("div", { className: "item", key: c.id }, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", "aria-label": "\u9009\u4E2D " + (c.name || c.method), disabled: !!busy, checked: selected.includes(c.id), onChange: (e) => setSelected(e.target.checked ? [...selected, c.id] : selected.filter((id) => id !== c.id)) }), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => openCase(c.id), disabled: !!busy }, /* @__PURE__ */ import_react.default.createElement("strong", null, c.name || c.method), /* @__PURE__ */ import_react.default.createElement("small", null, c.ok ? "\u901A\u8FC7" : "\u5931\u8D25", " \xB7 ", new Date(c.time).toLocaleString()))))), nav === "\u65B9\u6CD5" && /* @__PURE__ */ import_react.default.createElement("small", null, root ? schema.length + " \u4E2A\u65B9\u6CD5" : "\u52A0\u8F7D\u5DE5\u4F5C\u533A\u540E\u663E\u793A\u65B9\u6CD5"), nav === "\u7528\u4F8B" && /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("button", { disabled: !!busy || !selected.length, onClick: batch }, "\u8FD0\u884C\u9009\u4E2D (", selected.length, ")"), /* @__PURE__ */ import_react.default.createElement("button", { disabled: !!busy, onClick: () => run("\u5237\u65B0\u7528\u4F8B", history) }, "\u5237\u65B0")), /* @__PURE__ */ import_react.default.createElement("div", { className: "box" }, /* @__PURE__ */ import_react.default.createElement("h3", null, "Schema \u68C0\u67E5"), /* @__PURE__ */ import_react.default.createElement("div", { className: "row", style: { marginTop: 8 } }, ["lint", "build"].map((action) => /* @__PURE__ */ import_react.default.createElement("button", { key: action, disabled: !!busy, onClick: () => run("buf " + action, async (request) => setResult(await request("buf", { action }))) }, action === "lint" ? "\u6821\u9A8C" : "\u7F16\u8BD1"))))), /* @__PURE__ */ import_react.default.createElement("section", { className: "editor" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react.default.createElement("h2", null, "\u8BF7\u6C42"), /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("input", { hidden: true, type: "file", accept: ".json,application/json", ref: importFile, onChange: (e) => {
    importRequest(e.target.files[0]);
    e.target.value = "";
  } }), /* @__PURE__ */ import_react.default.createElement("button", { disabled: !!busy, onClick: () => importFile.current.click() }, "\u5BFC\u5165\u7528\u4F8B"), /* @__PURE__ */ import_react.default.createElement("button", { disabled: !!busy || !form.method, onClick: exportRequest }, "\u5BFC\u51FA\u7528\u4F8B"), /* @__PURE__ */ import_react.default.createElement("select", { style: { width: "auto" }, "aria-label": "\u5207\u6362\u73AF\u5883", disabled: !!busy, value: envs.find((v) => v.address === form.address && v.plaintext === form.plaintext)?.name || "", onChange: (e) => {
    const env = envs.find((v) => v.name === e.target.value);
    if (env) patch({ address: env.address, plaintext: env.plaintext, metadata: "{}" });
  } }, /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, "\u9009\u62E9\u73AF\u5883"), envs.map((e) => /* @__PURE__ */ import_react.default.createElement("option", { key: e.name }, e.name))))), /* @__PURE__ */ import_react.default.createElement("fieldset", { disabled: !!busy, style: { padding: 0, border: 0, margin: 0, minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "grow" }, "\u670D\u52A1\u5730\u5740", /* @__PURE__ */ import_react.default.createElement("input", { className: "mono", placeholder: "localhost:50051", value: form.address, onChange: change("address") })), /* @__PURE__ */ import_react.default.createElement("label", { className: "transport" }, "\u4F20\u8F93", /* @__PURE__ */ import_react.default.createElement("select", { "aria-label": "\u4F20\u8F93", value: form.plaintext ? "plain" : "tls", onChange: (e) => patch({ plaintext: e.target.value === "plain" }) }, /* @__PURE__ */ import_react.default.createElement("option", { value: "tls" }, "TLS"), /* @__PURE__ */ import_react.default.createElement("option", { value: "plain" }, "\u660E\u6587 h2c"))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setEnvEdit((v) => !v) }, "\u4FDD\u5B58\u73AF\u5883")), envEdit && /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, field("\u73AF\u5883\u540D\u79F0", /* @__PURE__ */ import_react.default.createElement("input", { value: envName, onChange: (e) => setEnvName(e.target.value) })), /* @__PURE__ */ import_react.default.createElement("button", { onClick: keepEnv }, "\u4FDD\u5B58\u5730\u5740\u4E0E\u4F20\u8F93")), field("RPC \u65B9\u6CD5", /* @__PURE__ */ import_react.default.createElement("input", { className: "mono", value: form.method, onChange: change("method"), placeholder: "package.Service/Method" })), method && /* @__PURE__ */ import_react.default.createElement("small", null, method.input, " \u2192 ", method.output, method.clientStreaming || method.serverStreaming ? " \xB7 streaming" : " \xB7 unary"), /* @__PURE__ */ import_react.default.createElement(Tabs, { names: ["\u8BF7\u6C42\u4F53", "Metadata", "\u65AD\u8A00"], value: tab, change: setTab }), tab === "\u8BF7\u6C42\u4F53" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, field("\u8BF7\u6C42 JSON", /* @__PURE__ */ import_react.default.createElement("textarea", { rows: 7, spellCheck: false, value: form.data, onChange: change("data") })), /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
    try {
      patch({ data: pretty(JSON.parse(form.data)) });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  } }, "\u683C\u5F0F\u5316 JSON"), /* @__PURE__ */ import_react.default.createElement("button", { disabled: !method, onClick: () => patch({ data: pretty(method.template) }) }, "\u586B\u5165 schema \u6A21\u677F"))), tab === "Metadata" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, field("gRPC Metadata\uFF08JSON \u952E\u503C\u5BF9\uFF09", /* @__PURE__ */ import_react.default.createElement("textarea", { rows: 5, spellCheck: false, value: form.metadata, onChange: change("metadata") })), /* @__PURE__ */ import_react.default.createElement("small", null, "\u5386\u53F2\u7528\u4F8B\u4EC5\u4FDD\u5B58\u952E\u540D\uFF0C\u56DE\u653E\u524D\u53EF\u5728\u8FD9\u91CC\u8865\u586B\u51ED\u636E\u3002")), tab === "\u65AD\u8A00" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "row" }, /* @__PURE__ */ import_react.default.createElement("label", { className: "grow" }, "\u54CD\u5E94\u5B57\u6BB5\uFF08JSON Pointer\uFF09", /* @__PURE__ */ import_react.default.createElement("input", { placeholder: "/result/id", value: form.pointer, onChange: change("pointer") })), /* @__PURE__ */ import_react.default.createElement("label", { className: "grow" }, "\u671F\u671B\u503C\uFF08JSON\uFF09", /* @__PURE__ */ import_react.default.createElement("input", { placeholder: '"ok"', value: form.expected, onChange: change("expected") }))), field("RPC \u8017\u65F6\u4E0A\u9650\uFF08\u6BEB\u79D2\uFF09", /* @__PURE__ */ import_react.default.createElement("input", { type: "number", min: "1", value: form.maxMs, onChange: change("maxMs") })), /* @__PURE__ */ import_react.default.createElement("small", null, "\u7A7A\u8DEF\u5F84\u5339\u914D\u6574\u4E2A\u54CD\u5E94\u3002\u6BCF\u6B21\u53D1\u9001\u90FD\u4F1A\u68C0\u67E5 gRPC \u662F\u5426\u6210\u529F\u3002")), /* @__PURE__ */ import_react.default.createElement("div", { className: "box row" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "primary", onClick: send }, "\u53D1\u9001\u8BF7\u6C42"), /* @__PURE__ */ import_react.default.createElement("label", { className: "inline" }, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", checked: save, onChange: (e) => setSave(e.target.checked) }), "\u4FDD\u5B58\u4E3A\u7528\u4F8B"), save && /* @__PURE__ */ import_react.default.createElement("input", { style: { maxWidth: 235 }, "aria-label": "\u7528\u4F8B\u540D\u79F0", placeholder: "\u7528\u4F8B\u540D\u79F0", value: form.name, onChange: change("name") }))), busy && /* @__PURE__ */ import_react.default.createElement("div", { className: "row", role: "status" }, busy, "\u2026 ", /* @__PURE__ */ import_react.default.createElement("button", { onClick: cancel }, "\u53D6\u6D88")), error && /* @__PURE__ */ import_react.default.createElement("p", { className: "alert", role: "alert" }, error), /* @__PURE__ */ import_react.default.createElement("section", { className: "output", "aria-live": "polite" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "row spread" }, /* @__PURE__ */ import_react.default.createElement("h2", null, "\u7ED3\u679C"), result && /* @__PURE__ */ import_react.default.createElement("span", { className: "status " + (result.ok ? "pass" : "fail") }, result.ok ? "\u901A\u8FC7" : "\u5931\u8D25", " \xB7 ", result.stage)), !result && /* @__PURE__ */ import_react.default.createElement("small", null, "\u53D1\u9001\u8BF7\u6C42\u6216\u6267\u884C schema \u68C0\u67E5\u540E\uFF0C\u7ED3\u679C\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002"), result && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, result.elapsedMs != null && /* @__PURE__ */ import_react.default.createElement("p", { className: "subtitle" }, "\u603B\u8017\u65F6 ", result.elapsedMs, " ms", result.rpcMs != null && " \xB7 RPC " + result.rpcMs + " ms", result.exitCode != null && " \xB7 \u9000\u51FA\u7801 " + result.exitCode), result.checks?.map((c, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, className: c.passed ? "pass" : "fail" }, c.passed ? "\u2713" : "\xD7", " ", c.name, !c.passed && Object.hasOwn(c, "expected") && "\u3000\u671F\u671B " + JSON.stringify(c.expected) + "\uFF0C\u5B9E\u9645 " + JSON.stringify(c.actual))), result.rows?.map((r, i) => /* @__PURE__ */ import_react.default.createElement("details", { key: i }, /* @__PURE__ */ import_react.default.createElement("summary", null, r.ok ? "\u2713" : "\xD7", " ", r.name, " \xB7 ", r.elapsedMs, " ms"), /* @__PURE__ */ import_react.default.createElement("pre", null, pretty(r)))), responseText && /* @__PURE__ */ import_react.default.createElement("pre", null, responseText), result.stderr && /* @__PURE__ */ import_react.default.createElement("pre", { className: "fail" }, result.stderr), result.caseId && /* @__PURE__ */ import_react.default.createElement("small", null, "\u5DF2\u4FDD\u5B58\u7528\u4F8B \xB7 ", result.caseId), result.historyError && /* @__PURE__ */ import_react.default.createElement("p", { role: "alert" }, "\u7528\u4F8B\u4FDD\u5B58\u5931\u8D25 \xB7 ", result.historyError))))));
}
var inject = ["slots", "locale", "uiWorkspace", "sessions"];
function apply(ctx) {
  ctx.locale.register("ilabrat", { zh: { nav: "Ilabrat \xB7 gRPC \u5DE5\u4F5C\u53F0" }, en: { nav: "Ilabrat \xB7 gRPC workbench" } });
  const t = ctx.locale.bind("ilabrat");
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: "ilabrat", order: 50, label: () => t("nav"), locale: "ilabrat" }, Mark));
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: "ilabrat" }, (props) => /* @__PURE__ */ import_react.default.createElement(Workbench, { ...props, ctx })));
}
return module.exports;}});
