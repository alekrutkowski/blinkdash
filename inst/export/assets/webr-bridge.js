(() => {
  const Bridge = {
    webR: null,
    initPromise: null,
    async init() {
      if (this.webR) return this.webR;
      if (this.initPromise) return this.initPromise;
      const app = window.BLINKDASH_APP || {};
      const source = app.export?.webrMjs || 'https://webr.r-wasm.org/latest/webr.mjs';
      this.initPromise = import(source).then(async mod => {
        const opts = {};
        if (mod.ChannelType) opts.channelType = mod.ChannelType.PostMessage;
        if (app.export?.webrBaseUrl) opts.baseUrl = app.export.webrBaseUrl;
        this.webR = new mod.WebR(opts);
        await this.webR.init();
        return this.webR;
      });
      return this.initPromise;
    },
    async run(code, rows, state, options = {}) {
      const webR = await this.init();
      const packages = Array.isArray(options.packages) ? options.packages.map(String).map(x => x.trim()).filter(Boolean) : [];
      if (packages.length) {
        if (typeof webR.installPackages !== 'function') throw new Error('This webR build does not expose installPackages().');
        await webR.installPackages(packages);
        await webR.evalRVoid(`invisible(lapply(c(${packages.map(rString).join(', ')}), function(.p) suppressPackageStartupMessages(library(.p, character.only = TRUE))))`);
      }
      await webR.evalRVoid(toDataFrameCode('bd_data', rows || []));
      await webR.evalRVoid(toListCode('bd_state', state || {}));
      await webR.evalRVoid(toListCode('bd_params', options.params || {}));
      await webR.evalRVoid(`bd_meta <- list(data_name = ${rString(options.dataName || '')}, rows = nrow(bd_data))`);
      await webR.evalRVoid('options(device = webr::canvas)');
      const shelter = await new webR.Shelter();
      try {
        if ((options.outputType || 'auto') === 'plot') {
          const svg = await evalSvgPlot(webR, code || 'plot(bd_data)');
          if (svg) return { ok: true, kind: 'plot', svg, text: 'SVG plot', console: packageConsole(packages, 'SVG plot captured with grDevices::svg().') };
        }
        const captured = await shelter.captureR(code || 'bd_data');
        const parts = [];
        if (captured.output && captured.output.length) {
          for (const item of captured.output) {
            const prefix = item.type && !['stdout'].includes(item.type) ? `${item.type}: ` : '';
            const txt = await outputToText(item.data);
            if (txt) parts.push(prefix + txt);
          }
        }
        const image = await firstImage(captured.images || []);
        const rich = await resultToRich(captured.result, options.outputType || 'auto');
        const consoleText = packageConsole(packages, parts.join('\n'));
        if (image && (!rich.kind || rich.kind === 'text')) return { ok: true, kind: 'plot', image, text: parts.join('\n'), console: consoleText };
        if (rich.kind === 'text' && parts.length) rich.text = (parts.join('\n') + (rich.text ? '\n' + rich.text : '')).trim();
        if (!rich.kind) rich.kind = 'text';
        if (!rich.text && parts.length) rich.text = parts.join('\n');
        if (!rich.text && !rich.html && !rich.markdown && !rich.rows && !rich.image) rich.text = 'Done.';
        rich.console = consoleText || rich.text || 'Done.';
        return Object.assign({ ok: true }, rich);
      } finally {
        if (shelter && typeof shelter.purge === 'function') await shelter.purge();
      }
    }
  };

  async function evalSvgPlot(webR, code) {
    const path = '/home/web_user/blinkdash-plot-' + Date.now() + '-' + Math.random().toString(16).slice(2) + '.svg';
    const wrapper = `
.bd_plot_file <- ${rString(path)}
try(unlink(.bd_plot_file), silent = TRUE)
.bd_device_open <- FALSE
tryCatch({
  grDevices::svg(filename = .bd_plot_file, width = 9, height = 5.6, pointsize = 12, bg = "transparent")
  .bd_device_open <- TRUE
}, error = function(e) {
  stop(paste("Could not open grDevices::svg() device:", conditionMessage(e)))
})
tryCatch({
  .bd_exprs <- parse(text = ${rString(code)})
  .bd_value <- NULL
  .bd_visible <- FALSE
  for (.bd_i in seq_along(.bd_exprs)) {
    .bd_res <- withVisible(eval(.bd_exprs[[.bd_i]], envir = .GlobalEnv))
    .bd_value <- .bd_res$value
    .bd_visible <- isTRUE(.bd_res$visible)
  }
  if (isTRUE(.bd_visible)) {
    try(print(.bd_value), silent = TRUE)
  }
}, error = function(e) {
  plot.new()
  text(0.5, 0.5, paste("webR plot error:", conditionMessage(e)), cex = 0.85)
})
if (.bd_device_open) try(grDevices::dev.off(), silent = TRUE)
`;
    try {
      await webR.evalRVoid(wrapper);
      let bytes = null;
      if (webR.FS && typeof webR.FS.readFile === 'function') bytes = await webR.FS.readFile(path);
      let svg = bytes ? bytesToText(bytes) : '';
      if (!svg) svg = await readSvgFromR(webR, path);
      try { await webR.evalRVoid(`try(unlink(${rString(path)}), silent = TRUE)`); } catch (_) {}
      if (typeof svg === 'string' && /<svg[\s>]/i.test(svg)) return svg.trim();
    } catch (e) {
      console.warn('SVG plot capture through grDevices::svg() failed, falling back to captured image', e);
    }
    return '';
  }

  async function readSvgFromR(webR, path) {
    try {
      const obj = await webR.evalR(`paste(readLines(${rString(path)}, warn = FALSE), collapse = "\\n")`);
      const js = await obj.toJs();
      const val = simplifyRValue(js);
      return typeof val === 'string' ? val : '';
    } catch (_) {
      return '';
    }
  }

  function bytesToText(bytes) {
    if (!bytes) return '';
    if (typeof bytes === 'string') return bytes;
    if (bytes instanceof Uint8Array || ArrayBuffer.isView(bytes)) return new TextDecoder('utf-8').decode(bytes);
    if (bytes.buffer instanceof ArrayBuffer) return new TextDecoder('utf-8').decode(new Uint8Array(bytes.buffer));
    try { return new TextDecoder('utf-8').decode(new Uint8Array(bytes)); } catch (_) { return String(bytes || ''); }
  }

  async function outputToText(x) {
    if (x == null) return '';
    if (typeof x === 'string') return x;
    if (Array.isArray(x)) return x.join('\n');
    try { if (typeof x.toString === 'function') return await x.toString(); } catch (_) {}
    try { if (typeof x.toJs === 'function') return JSON.stringify(await x.toJs(), null, 2); } catch (_) {}
    return String(x);
  }

  async function resultToRich(result, requested) {
    if (!result) return { kind: 'text', text: '' };
    try {
      if (typeof result.toD3 === 'function') {
        const rows = await result.toD3();
        if (Array.isArray(rows)) {
          if (requested === 'text') return { kind: 'text', text: JSON.stringify(rows.slice(0, 30), null, 2) };
          return { kind: 'table', rows };
        }
      }
    } catch (_) {}
    try {
      if (typeof result.toJs === 'function') {
        const js = await result.toJs();
        const val = simplifyRValue(js);
        if (requested === 'table' && Array.isArray(val)) return { kind: 'table', rows: val };
        if (typeof val === 'string') {
          if (requested === 'html' || /^\s*</.test(val)) return { kind: 'html', html: val, text: val };
          if (requested === 'markdown' || /^\s{0,3}#{1,6}\s/m.test(val) || /\*\*[^*]+\*\*/.test(val)) return { kind: 'markdown', markdown: val, text: val };
          return { kind: 'text', text: val };
        }
        if (Array.isArray(val) && val.every(x => x && typeof x === 'object' && !Array.isArray(x))) return { kind: 'table', rows: val };
        if (val == null) return { kind: 'text', text: '' };
        return { kind: 'text', text: JSON.stringify(val, null, 2) };
      }
    } catch (_) {}
    return { kind: 'text', text: '' };
  }

  function simplifyRValue(js) {
    if (js == null) return null;
    if (js.type === 'null') return null;
    if (Object.prototype.hasOwnProperty.call(js, 'values') && Array.isArray(js.values)) {
      if (js.values.length === 1) return js.values[0];
      return js.values;
    }
    if (Object.prototype.hasOwnProperty.call(js, 'names') && Array.isArray(js.names) && Array.isArray(js.values)) {
      const out = {};
      js.names.forEach((n, i) => { out[n] = js.values[i]; });
      return out;
    }
    return js;
  }

  async function firstImage(images) {
    if (!images || !images.length) return '';
    const img = images[0];
    if (typeof img === 'string') return img;
    if (img.dataUrl) return img.dataUrl;
    if (img.src) return img.src;
    try {
      if (typeof img.toDataURL === 'function') return await img.toDataURL();
    } catch (_) {}
    try {
      if (img.blob) return URL.createObjectURL(img.blob);
    } catch (_) {}
    try {
      const w = img.width || img.displayWidth || 900;
      const h = img.height || img.displayHeight || 560;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.warn('Could not convert captured webR ImageBitmap to PNG data URL', e);
    }
    return '';
  }

  function packageConsole(packages, text) {
    const p = (packages || []).length ? 'Packages installed and attached: ' + packages.join(', ') : '';
    const t = String(text || '').trim();
    return [p, t].filter(Boolean).join('\n');
  }

  function toDataFrameCode(name, rows) {
    rows = Array.isArray(rows) ? rows : [];
    const keys = Array.from(rows.reduce((s, r) => { Object.keys(r || {}).forEach(k => s.add(k)); return s; }, new Set()));
    if (!keys.length) return `${name} <- data.frame()`;
    const cols = keys.map(k => `${rName(k)} = ${rVector(rows.map(r => r ? r[k] : null))}`);
    return `${name} <- data.frame(${cols.join(', ')}, check.names = FALSE)`;
  }

  function toListCode(name, obj) {
    const keys = Object.keys(obj || {});
    const xs = keys.map(k => `${rName(k)} = ${Array.isArray(obj[k]) ? rVector(obj[k]) : rScalar(obj[k])}`);
    return `${name} <- list(${xs.join(', ')})`;
  }

  function rVector(vals) {
    vals = vals || [];
    const notMissing = vals.filter(v => v !== null && v !== undefined && v !== '');
    if (!notMissing.length) return `rep(NA_character_, ${vals.length})`;
    if (notMissing.every(v => typeof v === 'boolean')) return `c(${vals.map(v => v == null ? 'NA' : (v ? 'TRUE' : 'FALSE')).join(', ')})`;
    if (notMissing.every(v => typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))))) return `c(${vals.map(v => v == null || v === '' ? 'NA_real_' : String(Number(v))).join(', ')})`;
    return `c(${vals.map(v => v == null ? 'NA_character_' : rString(v)).join(', ')})`;
  }

  function rScalar(v) {
    if (Array.isArray(v)) return rVector(v);
    if (v === null || v === undefined) return 'NULL';
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
    return rString(v);
  }

  function rString(x) {
    return '"' + String(x).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '"';
  }

  function rName(x) {
    return '`' + String(x).replace(/`/g, '.') + '`';
  }

  window.BlinkDashWebR = Bridge;
})();
