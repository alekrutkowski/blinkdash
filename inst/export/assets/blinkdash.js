(() => {
  const app = window.BLINKDASH_APP || {};
  const root = document.getElementById('blinkdash-root');
  const state = {};
  const tableState = {};
  const webRResults = {};
  const webRSignatures = {};
  const webRRunning = {};
  const palettes = {
    okabe: ['#0072B2', '#E69F00', '#009E73', '#D55E00', '#CC79A7', '#56B4E9', '#F0E442', '#000000'],
    tableau: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'],
    observable: ['#4269D0', '#EFB118', '#FF725C', '#6CC5B0', '#3CA951', '#FF8AB7', '#A463F2', '#97BBF5', '#9C6B4E', '#9498A0'],
    tol: ['#EE7733', '#0077BB', '#33BBEE', '#EE3377', '#CC3311', '#009988', '#BBBBBB'],
    paired: ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#FFFF99', '#B15928'],
    dark24: ['#2E91E5', '#E15F99', '#1CA71C', '#FB0D0D', '#DA16FF', '#222A2A', '#B68100', '#750D86', '#EB663B', '#511CFB', '#00A08B', '#FB00D1', '#FC0080', '#B2828D', '#6C7C32', '#778AAE', '#862A16', '#A777F1', '#620042', '#1616A7', '#DA60CA', '#6C4516', '#0D2A63', '#AF0038'],
    viridis: ['#440154', '#482878', '#3E4989', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725'],
    magma: ['#000004', '#1B0C41', '#4A0C6B', '#781C6D', '#A52C60', '#CF4446', '#ED6925', '#FB9A06', '#F7D13D', '#FCFDBF'],
    plasma: ['#0D0887', '#46039F', '#7201A8', '#9C179E', '#BD3786', '#D8576B', '#ED7953', '#FB9F3A', '#FDC926', '#F0F921'],
    turbo: ['#30123B', '#4662D8', '#37A2FB', '#1AE4B6', '#71FE5F', '#C6EF34', '#FABA39', '#F66C19', '#C22303', '#7A0403'],
    vivid: ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be123c', '#65a30d', '#7c2d12', '#1d4ed8'],
    solar: ['#268bd2', '#dc322f', '#859900', '#b58900', '#6c71c4', '#2aa198', '#d33682', '#cb4b16'],
    pastel: ['#7dd3fc', '#f9a8d4', '#86efac', '#c4b5fd', '#fdba74', '#93c5fd', '#fca5a5', '#bef264'],
    soft24: ['#8DD3C7', '#FFFFB3', '#BEBADA', '#FB8072', '#80B1D3', '#FDB462', '#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F', '#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#FFFF99', '#B15928'],
    mono: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#312e81']
  };
  const themes = {
    aurora: { accent: '#4f46e5', accent2: '#0ea5e9', bg: '#f8fafc', panel: '#ffffff', ink: '#0f172a', muted: '#64748b', line: '#e2e8f0', dark: false },
    paper: { accent: '#0f766e', accent2: '#ca8a04', bg: '#fbfaf7', panel: '#ffffff', ink: '#1f2937', muted: '#6b7280', line: '#e5e7eb', dark: false },
    berry: { accent: '#be185d', accent2: '#7c3aed', bg: '#fff7fb', panel: '#ffffff', ink: '#3b0a24', muted: '#7f5a6d', line: '#f5d0e2', dark: false },
    slate: { accent: '#334155', accent2: '#0284c7', bg: '#f1f5f9', panel: '#ffffff', ink: '#0f172a', muted: '#64748b', line: '#cbd5e1', dark: false },
    mint: { accent: '#059669', accent2: '#14b8a6', bg: '#f0fdfa', panel: '#ffffff', ink: '#064e3b', muted: '#4b8074', line: '#ccfbf1', dark: false },
    sand: { accent: '#b45309', accent2: '#d97706', bg: '#fffbeb', panel: '#fffbeb', ink: '#3f2f1c', muted: '#8a6d4b', line: '#fde68a', dark: false },
    ocean: { accent: '#0369a1', accent2: '#0891b2', bg: '#f0f9ff', panel: '#ffffff', ink: '#082f49', muted: '#57798c', line: '#bae6fd', dark: false },
    lavender: { accent: '#7c3aed', accent2: '#db2777', bg: '#faf5ff', panel: '#ffffff', ink: '#2e1065', muted: '#7c6a9c', line: '#e9d5ff', dark: false },
    graphite: { accent: '#60a5fa', accent2: '#22d3ee', bg: '#0b1220', panel: '#0f172a', ink: '#e5edf9', muted: '#94a3b8', line: '#263347', dark: true },
    midnight: { accent: '#a78bfa', accent2: '#34d399', bg: '#09090f', panel: '#141420', ink: '#f5f3ff', muted: '#a1a1aa', line: '#2e2e42', dark: true },
    forest: { accent: '#34d399', accent2: '#fbbf24', bg: '#07130f', panel: '#091d17', ink: '#ecfdf5', muted: '#a7f3d0', line: '#1f4b3f', dark: true },
    dusk: { accent: '#fb7185', accent2: '#a78bfa', bg: '#111827', panel: '#1f2937', ink: '#fdf2f8', muted: '#d1a3b8', line: '#4b5563', dark: true },
    ember: { accent: '#f97316', accent2: '#ef4444', bg: '#1c0f0a', panel: '#27140e', ink: '#fff7ed', muted: '#fed7aa', line: '#7c2d12', dark: true },
    lagoon: { accent: '#2dd4bf', accent2: '#38bdf8', bg: '#061a20', panel: '#08232a', ink: '#ecfeff', muted: '#99f6e4', line: '#155e75', dark: true },
    grape: { accent: '#c084fc', accent2: '#f472b6', bg: '#160b24', panel: '#1f1031', ink: '#faf5ff', muted: '#d8b4fe', line: '#581c87', dark: true }
  };
  const fonts = {
    Inter: { css: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;650;800;900&display=swap', family: 'Inter, system-ui, sans-serif' },
    'Source Sans 3': { css: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;800;900&display=swap', family: '"Source Sans 3", system-ui, sans-serif' },
    'Plus Jakarta Sans': { css: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap', family: '"Plus Jakarta Sans", system-ui, sans-serif' },
    'Space Grotesk': { css: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;800&display=swap', family: '"Space Grotesk", system-ui, sans-serif' },
    'JetBrains Mono': { css: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&display=swap', family: '"JetBrains Mono", ui-monospace, Consolas, monospace' },
    System: { css: '', family: 'system-ui, -apple-system, "Segoe UI", sans-serif' }
  };
  function baseFontPx(mult = 1) {
    const size = Number((app.theme && (app.theme.baseFontSize || app.theme.fontSize)) || 16);
    const base = Number.isFinite(size) && size > 0 ? size : 16;
    return base * mult;
  }

  function dashboardFontFamily() {
    const f = fonts[(app.theme && app.theme.font) || 'Inter'] || fonts.Inter;
    return f.family || 'Inter, system-ui, sans-serif';
  }

  function canvasFont(mult = 0.75, weight = '') {
    return `${weight ? weight + ' ' : ''}${baseFontPx(mult)}px ${dashboardFontFamily()}`;
  }

  function svgFontSize(mult = 0.75) {
    return num(baseFontPx(mult));
  }

  const inputTypes = new Set(['select', 'selectize', 'multiselect', 'slider', 'range', 'checkbox', 'radio', 'search', 'text', 'number', 'date', 'daterange', 'toggle', 'button']);
  const plotTypes = new Set(['scatter', 'line', 'bar', 'histogram', 'boxplot', 'heatmap', 'pie']);

  const esc = x => String(x == null ? '' : x)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  function toRows(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (typeof x === 'object') {
      const keys = Object.keys(x);
      if (keys.length && keys.every(k => Array.isArray(x[k]))) {
        const n = Math.max(...keys.map(k => x[k].length));
        return Array.from({ length: n }, (_, i) => Object.fromEntries(keys.map(k => [k, x[k][i]])));
      }
    }
    return [];
  }

  function dataset(name) {
    const ds = app.datasets || {};
    const key = name || Object.keys(ds)[0];
    return toRows(ds[key]);
  }

  function widgets() {
    return Array.isArray(app.widgets) ? app.widgets : [];
  }

  function graphNodes() {
    return Array.isArray(app.graph && app.graph.nodes) ? app.graph.nodes : [];
  }

  function graphEdges() {
    return Array.isArray(app.graph && app.graph.edges) ? app.graph.edges : [];
  }

  function graphNodeFor(id) {
    return graphNodes().find(n => n.id === id);
  }

  function hasExactLayout(w) {
    return Boolean(graphNodeFor(w.id) || (w.layout && w.layout.px));
  }

  function usesFlowLayout() {
    return widgets().some(hasExactLayout);
  }

  function exactLayoutBox(w) {
    const gn = graphNodeFor(w.id);
    if (gn && gn.position && gn.size) {
      return {
        x: Number(gn.position.x || 0),
        y: Number(gn.position.y || 0),
        width: Math.max(160, Number(gn.size.width || 320)),
        height: Math.max(80, Number(gn.size.height || 160))
      };
    }
    const px = w.layout && w.layout.px;
    if (px) {
      return {
        x: Number(px.left || 0),
        y: Number(px.top || 0),
        width: Math.max(160, Number(px.width || 320)),
        height: Math.max(80, Number(px.height || 160))
      };
    }
    return null;
  }

  function flowLayoutOrigin() {
    const boxes = widgets().map(exactLayoutBox).filter(Boolean);
    if (!boxes.length) return { x: 0, y: 0 };
    const minX = Math.min(...boxes.map(b => Number.isFinite(b.x) ? b.x : 0));
    return { x: Math.max(0, minX - 12), y: 0 };
  }

  function flowLayoutBox(w) {
    const box = exactLayoutBox(w);
    if (!box) return null;
    const origin = flowLayoutOrigin();
    return {
      x: Math.max(0, Math.round(box.x - origin.x)),
      y: Math.max(0, Math.round(box.y - origin.y)),
      width: box.width,
      height: box.height
    };
  }

  function flowWidth() {
    const right = widgets().reduce((mx, w) => {
      const box = flowLayoutBox(w);
      return box ? Math.max(mx, box.x + box.width) : mx;
    }, 0);
    return Math.max(960, right + 24);
  }

  function defaultCardMinHeight(w) {
    const type = w && w.type;
    const scale = Math.max(0.9, Math.min(1.45, Number((app.theme && app.theme.baseFontSize) || 16) / 16 || 1));
    let height = 150;
    if (type === 'metric') height = 210;
    else if (type === 'table') height = 640;
    else if (plotTypes.has(type) || type === 'rplot') height = 430;
    else if (type === 'webr') height = 440;
    else if (type === 'markdown' || type === 'html') height = 300;
    else if (type === 'daterange') height = 172;
    else if (type === 'checkbox' || type === 'radio') height = 220;
    else if (type === 'selectize' || type === 'multiselect') height = 210;
    else if (type === 'range') height = 190;
    else if (type === 'button') height = 116;
    else if (inputTypes.has(type)) height = 148;
    return Math.round(height * scale);
  }

  function flowHeight() {
    const bottom = widgets().reduce((mx, w) => {
      const box = flowLayoutBox(w);
      return box ? Math.max(mx, box.y + box.height) : mx;
    }, 0);
    return Math.max(640, bottom + 70);
  }

  function layoutStyle(w) {
    const saved = savedCardPosition(w);
    if (saved) return `left: ${saved.x}px; top: ${saved.y}px; width: ${saved.width}px; height: ${saved.height}px;`;
    const box = flowLayoutBox(w);
    if (box) return `left: ${box.x}px; top: ${box.y}px; width: ${box.width}px; height: ${box.height}px;`;
    const l = w.layout || {};
    const x = Math.max(1, Math.min(12, Number(l.x || 1)));
    const y = Math.max(1, Number(l.y || 1));
    const ww = Math.max(1, Math.min(12, Number(l.w || 4)));
    const h = Math.max(1, Number(l.h || (inputTypes.has(w.type) ? 2 : 5)));
    return `grid-column: ${x} / span ${ww}; grid-row: ${y} / span ${h}; min-height: ${Math.max(defaultCardMinHeight(w), h * 96)}px;`;
  }

  function layoutSignature(w) {
    const box = exactLayoutBox(w);
    if (box) return ['flow-v2', box.x, box.y, box.width, box.height].join(':');
    const l = w.layout || {};
    return [l.x || 1, l.y || 1, l.w || 4, l.h || (inputTypes.has(w.type) ? 2 : 5)].join(':');
  }

  function savedCardPosition(w) {
    try {
      const raw = localStorage.getItem('blinkdash-card-pos-' + (app.title || 'dashboard') + '-' + w.id);
      if (!raw) return null;
      const pos = JSON.parse(raw);
      return pos && pos.base === layoutSignature(w) ? pos : null;
    } catch (_) { return null; }
  }

  function saveCardPosition(id, pos) {
    try {
      const w = widgets().find(x => x.id === id);
      if (w) pos.base = layoutSignature(w);
      localStorage.setItem('blinkdash-card-pos-' + (app.title || 'dashboard') + '-' + id, JSON.stringify(pos));
    } catch (_) {}
  }

  function attachCardMoveHandlers() {
    if (!usesFlowLayout()) return;
    root.querySelectorAll('.bd-card').forEach(card => {
      const head = card.querySelector('.bd-card-head') || card.querySelector('.bd-body');
      if (!head || card.dataset.moveReady) return;
      card.dataset.moveReady = '1';
      head.addEventListener('pointerdown', ev => {
        if (ev.target.closest('input, select, textarea, button, a')) return;
        const id = card.dataset.bdId;
        const rect = card.getBoundingClientRect();
        const parent = card.parentElement.getBoundingClientRect();
        const start = { x: ev.clientX, y: ev.clientY, left: rect.left - parent.left + card.parentElement.scrollLeft, top: rect.top - parent.top + card.parentElement.scrollTop };
        card.setPointerCapture(ev.pointerId);
        function move(e) {
          const left = Math.max(0, Math.round(start.left + e.clientX - start.x));
          const top = Math.max(0, Math.round(start.top + e.clientY - start.y));
          card.style.left = left + 'px';
          card.style.top = top + 'px';
        }
        function up() {
          try { card.releasePointerCapture(ev.pointerId); } catch (_) {}
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
          saveCardPosition(id, { x: parseInt(card.style.left || 0, 10), y: parseInt(card.style.top || 0, 10), width: card.offsetWidth, height: card.offsetHeight });
        }
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
      });
    });
  }

  function init() {
    applyTheme();
    initState();
    renderShell();
    renderAllWidgets();
    attachCardMoveHandlers();
    window.addEventListener('resize', debounce(renderOutputs, 120));
  }

  function applyTheme() {
    const t0 = app.theme || {};
    const themeName = t0.dashboardName || t0.name || 'aurora';
    const t = themes[themeName] || themes.aurora;
    const r = document.documentElement.style;
    r.setProperty('--bd-accent', t.accent || t0.accent || '#4f46e5');
    r.setProperty('--bd-accent-2', t.accent2 || '#0ea5e9');
    r.setProperty('--bd-bg', t.bg || '#f8fafc');
    r.setProperty('--bd-panel', t.panel || '#ffffff');
    r.setProperty('--bd-ink', t.ink || '#0f172a');
    r.setProperty('--bd-muted', t.muted || '#64748b');
    r.setProperty('--bd-line', t.line || '#e2e8f0');
    const baseFontSize = Number(t0.baseFontSize || t0.fontSize || 16);
    if (Number.isFinite(baseFontSize) && baseFontSize > 0) r.setProperty('--bd-base-font-size', `${baseFontSize}px`);
    if (t0.radius) r.setProperty('--bd-radius', `${t0.radius}px`);
    if (t0.density === 'compact') r.setProperty('--bd-card-padding', '10px');
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
    const font = fonts[t0.font || 'Inter'] || fonts.Inter;
    r.setProperty('--bd-font-ui', font.family);
    if (font.css) {
      let link = document.getElementById('bd-font-link');
      if (!link) { link = document.createElement('link'); link.id = 'bd-font-link'; link.rel = 'stylesheet'; document.head.appendChild(link); }
      link.href = font.css;
    }
  }

  function initState() {
    widgets().filter(w => inputTypes.has(w.type)).forEach(w => {
      const opts = optionsFor(w);
      if (w.type === 'multiselect' || w.type === 'checkbox' || (w.type === 'selectize' && w.multiple !== false)) state[w.id] = w.default || opts;
      else if (w.type === 'select' || w.type === 'radio' || w.type === 'selectize') state[w.id] = w.default ?? opts[0] ?? '';
      else if (w.type === 'range') state[w.id] = Array.isArray(w.default) ? w.default : [w.min ?? minFor(w), w.max ?? maxFor(w)];
      else if (w.type === 'daterange') state[w.id] = Array.isArray(w.default) ? w.default : ['', ''];
      else if (w.type === 'slider') state[w.id] = w.default ?? w.max ?? maxFor(w);
      else if (w.type === 'number') state[w.id] = w.default ?? w.min ?? minFor(w);
      else if (w.type === 'toggle') state[w.id] = Boolean(w.default);
      else if (w.type === 'button') state[w.id] = 0;
      else state[w.id] = w.default ?? '';
    });
  }

  function renderShell() {
    const ex = app.export || {};
    const flow = usesFlowLayout();
    root.classList.toggle('bd-root-flow', flow);
    const showBadge = ex.showBadge !== false && (ex.badgeText || '');
    const showFooter = ex.showGeneratedBy !== false && (ex.generatedBy || '');
    root.innerHTML = `
      <header class="bd-hero">
        <div class="bd-title-row">
          <h1 class="bd-title">${esc(app.title || 'BlinkDash')}</h1>
          ${showBadge ? `<span class="bd-badge">${esc(ex.badgeText || 'static reactive dashboard')}</span>` : ''}
        </div>
        ${app.subtitle ? `<p class="bd-subtitle">${esc(app.subtitle)}</p>` : ''}
      </header>
      <section class="${flow ? 'bd-flow' : 'bd-grid'}" ${flow ? `style="height: ${flowHeight()}px; min-width: ${flowWidth()}px"` : ''}>
        ${widgets().map(w => `
          <article class="bd-card ${inputTypes.has(w.type) ? 'bd-input-card' : ''} ${w.type === 'webr' && w.visible === false ? 'bd-hidden-widget' : ''}" data-bd-id="${esc(w.id)}" style="${layoutStyle(w)}">
            <div class="bd-card-inner">
              ${cardHead(w)}
              <div class="bd-body"></div>
            </div>
          </article>
        `).join('')}
      </section>
      ${showFooter ? `<footer class="bd-footer">${esc(ex.generatedBy || 'Generated by BlinkDash.')}</footer>` : ''}
    `;
  }

  function cardTitle(w) {
    return w.title || w.label || w.id || w.type;
  }

  function cardHead(w) {
    const title = cardTitle(w);
    if (inputTypes.has(w.type) || w.type === 'metric') return '';
    return `<div class="bd-card-head"><div><h2 class="bd-card-title">${esc(title)}</h2>${w.subtitle ? `<p class="bd-card-subtitle">${esc(w.subtitle)}</p>` : ''}</div></div>`;
  }

  function bodyFor(w) {
    const card = Array.from(root.querySelectorAll('[data-bd-id]')).find(el => el.dataset.bdId === w.id);
    return card ? card.querySelector('.bd-body') : null;
  }

  function renderAllWidgets() {
    widgets().forEach(w => {
      const body = bodyFor(w);
      if (!body) return;
      if (inputTypes.has(w.type)) renderInput(w, body);
      else renderOutput(w, body);
    });
    attachCardMoveHandlers();
  }

  function renderOutputs() {
    widgets().filter(w => !inputTypes.has(w.type)).forEach(w => {
      const body = bodyFor(w);
      if (body) renderOutput(w, body);
    });
  }

  function renderInput(w, body) {
    const label = esc(w.label || w.title || w.id);
    if (w.type === 'selectize') {
      renderSelectize(w, body, label);
      return;
    }
    if (w.type === 'select' || w.type === 'multiselect') {
      const mult = w.type === 'multiselect';
      body.innerHTML = `<label class="bd-control"><span class="bd-label">${label}</span><select ${mult ? 'multiple' : ''}>${optionsFor(w).map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`;
      const sel = body.querySelector('select');
      Array.from(sel.options).forEach(opt => { opt.selected = mult ? (state[w.id] || []).map(String).includes(opt.value) : String(state[w.id]) === opt.value; });
      sel.addEventListener('change', () => {
        state[w.id] = mult ? Array.from(sel.selectedOptions).map(o => o.value) : sel.value;
        renderOutputs();
      });
      return;
    }
    if (w.type === 'checkbox' || w.type === 'radio') {
      const opts = optionsFor(w);
      const name = `bd-${w.id}`;
      body.innerHTML = `<div class="bd-control"><span class="bd-label">${label}</span><div class="bd-checks">${opts.map((o, i) => `<label class="bd-check"><input type="${w.type === 'radio' ? 'radio' : 'checkbox'}" name="${esc(name)}" value="${esc(o)}" ${isChecked(w, o) ? 'checked' : ''}> ${esc(o)}</label>`).join('')}</div></div>`;
      body.querySelectorAll('input').forEach(inp => inp.addEventListener('change', () => {
        state[w.id] = w.type === 'radio'
          ? (body.querySelector('input:checked') || {}).value || ''
          : Array.from(body.querySelectorAll('input:checked')).map(x => x.value);
        renderOutputs();
      }));
      return;
    }
    if (w.type === 'range') {
      const fallbackMin = minFor(w);
      const fallbackMax = maxFor(w);
      const rawMin = Number(w.min ?? fallbackMin);
      const rawMax = Number(w.max ?? fallbackMax);
      const minBase = Number.isFinite(rawMin) ? rawMin : fallbackMin;
      const maxBase = Number.isFinite(rawMax) ? rawMax : fallbackMax;
      const min = Math.min(minBase, maxBase);
      const max = Math.max(minBase, maxBase);
      const step = Number(w.step || 1);
      const stepAttr = Number.isFinite(step) && step > 0 ? step : 'any';
      const saved = Array.isArray(state[w.id]) ? state[w.id].map(Number) : [min, max];
      const a0 = clampNumber(Math.min(saved[0], saved[1]), min, max);
      const b0 = clampNumber(Math.max(saved[0], saved[1]), min, max);
      state[w.id] = [a0, b0];
      body.innerHTML = `
        <div class="bd-control bd-control-range">
          <span class="bd-label">${label}</span>
          <div class="bd-dual-range-values"><output data-low>${fmt(a0)}</output><output data-high>${fmt(b0)}</output></div>
          <div class="bd-dual-range" style="--bd-range-low:0%;--bd-range-high:100%;" aria-label="${label} range">
            <div class="bd-dual-range-track"></div>
            <div class="bd-dual-range-fill"></div>
            <input class="bd-dual-range-input bd-dual-range-min" type="range" min="${min}" max="${max}" step="${stepAttr}" value="${a0}" aria-label="${label} minimum">
            <input class="bd-dual-range-input bd-dual-range-max" type="range" min="${min}" max="${max}" step="${stepAttr}" value="${b0}" aria-label="${label} maximum">
          </div>
          <div class="bd-range-scale"><span>${fmt(min)}</span><span>${fmt(max)}</span></div>
        </div>`;
      const ruler = body.querySelector('.bd-dual-range');
      const inputs = body.querySelectorAll('.bd-dual-range-input');
      const lowOut = body.querySelector('[data-low]');
      const highOut = body.querySelector('[data-high]');
      const sync = (active, notify = true) => {
        let a = snapNumber(inputs[0].value, min, max, step);
        let b = snapNumber(inputs[1].value, min, max, step);
        if (a > b) {
          if (active === 'high') b = a;
          else a = b;
        }
        inputs[0].value = a;
        inputs[1].value = b;
        state[w.id] = [a, b];
        lowOut.textContent = fmt(a);
        highOut.textContent = fmt(b);
        const pa = rangePercent(a, min, max);
        const pb = rangePercent(b, min, max);
        ruler.style.setProperty('--bd-range-low', `${pa}%`);
        ruler.style.setProperty('--bd-range-high', `${pb}%`);
        inputs[0].style.zIndex = Math.abs(pa - pb) < 4 && active === 'low' ? '5' : '4';
        inputs[1].style.zIndex = Math.abs(pa - pb) < 4 && active !== 'low' ? '5' : '4';
        if (notify) renderOutputs();
      };
      inputs[0].addEventListener('input', () => sync('low'));
      inputs[1].addEventListener('input', () => sync('high'));
      ruler.addEventListener('pointerdown', ev => {
        if (ev.target.closest('input')) return;
        const rect = ruler.getBoundingClientRect();
        if (!rect.width) return;
        const raw = min + ((ev.clientX - rect.left) / rect.width) * (max - min);
        const value = snapNumber(raw, min, max, step);
        const cur = state[w.id] || [min, max];
        const active = Math.abs(value - cur[0]) <= Math.abs(value - cur[1]) ? 'low' : 'high';
        inputs[active === 'low' ? 0 : 1].value = value;
        sync(active);
      });
      sync('high', false);
      return;
    }
    if (w.type === 'slider') {
      const min = Number(w.min ?? minFor(w));
      const max = Number(w.max ?? maxFor(w));
      const step = Number(w.step || 1);
      const current = clampNumber(state[w.id], Math.min(min, max), Math.max(min, max));
      state[w.id] = current;
      body.innerHTML = `<div class="bd-control"><span class="bd-label">${label}</span><div class="bd-range-ruler" style="--bd-slider-pos:${rangePercent(current, min, max)}%;" aria-label="${label} slider"><div class="bd-range-ruler-track"></div><div class="bd-range-ruler-fill"></div><input class="bd-range-input" type="range" min="${min}" max="${max}" step="${step}" value="${esc(current)}" aria-label="${label}"></div><div class="bd-range-values"><span>${fmt(min)}</span><span data-value>${fmt(current)}</span><span>${fmt(max)}</span></div></div>`;
      const ruler = body.querySelector('.bd-range-ruler');
      const inp = body.querySelector('input');
      inp.addEventListener('input', () => {
        state[w.id] = Number(inp.value);
        ruler.style.setProperty('--bd-slider-pos', `${rangePercent(state[w.id], min, max)}%`);
        body.querySelector('[data-value]').textContent = fmt(state[w.id]);
        renderOutputs();
      });
      return;
    }
    if (w.type === 'search' || w.type === 'text') {
      body.innerHTML = `<label class="bd-control"><span class="bd-label">${label}</span><input type="${w.type === 'search' ? 'search' : 'text'}" value="${esc(state[w.id])}" placeholder="${esc(w.placeholder || '')}"></label>`;
      const inp = body.querySelector('input');
      inp.addEventListener('input', debounce(() => { state[w.id] = inp.value; renderOutputs(); }, 80));
      return;
    }
    if (w.type === 'daterange') {
      const val = Array.isArray(state[w.id]) ? state[w.id] : ['', ''];
      body.innerHTML = `<div class="bd-control"><span class="bd-label">${label}</span><div class="bd-date-range"><input type="date" value="${esc(val[0] || '')}"><input type="date" value="${esc(val[1] || '')}"></div></div>`;
      const inputs = body.querySelectorAll('input');
      const sync = () => { state[w.id] = [inputs[0].value, inputs[1].value]; renderOutputs(); };
      inputs.forEach(inp => inp.addEventListener('input', sync));
      return;
    }
    if (w.type === 'number') {
      const rawMin = Number(w.min ?? minFor(w));
      const rawMax = Number(w.max ?? maxFor(w));
      const lo = Math.min(Number.isFinite(rawMin) ? rawMin : minFor(w), Number.isFinite(rawMax) ? rawMax : maxFor(w));
      const hi = Math.max(Number.isFinite(rawMin) ? rawMin : minFor(w), Number.isFinite(rawMax) ? rawMax : maxFor(w));
      const step = Number(w.step || 1);
      const stepAttr = Number.isFinite(step) && step > 0 ? step : 'any';
      const current = clampNumber(state[w.id], lo, hi);
      state[w.id] = current;
      body.innerHTML = `<label class="bd-control"><span class="bd-label">${label}</span><input type="number" min="${esc(lo)}" max="${esc(hi)}" step="${esc(stepAttr)}" value="${esc(current)}"></label>`;
      const inp = body.querySelector('input');
      bindNumberWheel(inp);
      inp.addEventListener('input', () => { state[w.id] = snapNumber(inp.value, lo, hi, step); inp.value = state[w.id]; renderOutputs(); });
      return;
    }
    if (w.type === 'date') {
      body.innerHTML = `<label class="bd-control"><span class="bd-label">${label}</span><input type="date" value="${esc(state[w.id])}"></label>`;
      const inp = body.querySelector('input');
      inp.addEventListener('input', () => { state[w.id] = inp.value; renderOutputs(); });
      return;
    }
    if (w.type === 'toggle') {
      body.innerHTML = `<label class="bd-check"><input type="checkbox" ${state[w.id] ? 'checked' : ''}> ${label}</label>`;
      const inp = body.querySelector('input');
      inp.addEventListener('change', () => { state[w.id] = inp.checked; renderOutputs(); });
      return;
    }
    if (w.type === 'button') {
      body.innerHTML = `<button class="bd-button" type="button">${label}</button>`;
      body.querySelector('button').addEventListener('click', () => {
        state[w.id] = (state[w.id] || 0) + 1;
        if ((w.action || '').toLowerCase() === 'reset') {
          initState();
          renderShell();
          renderAllWidgets();
          attachCardMoveHandlers();
        } else {
          renderOutputs();
        }
      });
    }
  }

  function renderSelectize(w, body, label) {
    const opts = optionsFor(w);
    const multi = w.multiple !== false;
    const values = multi ? (Array.isArray(state[w.id]) ? state[w.id].map(String) : []) : (state[w.id] == null ? '' : String(state[w.id]));
    const selected = o => multi ? values.includes(String(o)) : values === String(o);
    const renderOptions = (query = '') => opts.filter(o => String(o).toLowerCase().includes(query.toLowerCase())).slice(0, 120)
      .map(o => `<button type="button" data-value="${esc(o)}" class="${selected(o) ? 'active' : ''}">${esc(o)}</button>`).join('');
    body.innerHTML = `<div class="bd-control"><span class="bd-label">${label}</span><div class="bd-selectize ${multi ? 'multi' : 'single'}"><div class="bd-selectize-tags">${multi ? values.map(v => `<button type="button" data-remove="${esc(v)}">${esc(v)} ×</button>`).join('') : (values ? `<button type="button" data-clear="1">${esc(values)} ×</button>` : '')}<input class="bd-selectize-search" type="text" autocomplete="off" placeholder="${multi ? 'Search or add...' : 'Search...'}"></div><div class="bd-selectize-options">${renderOptions('')}</div></div></div>`;
    const input = body.querySelector('.bd-selectize-search');
    const optsBox = body.querySelector('.bd-selectize-options');
    const bindOptionButtons = () => optsBox.querySelectorAll('[data-value]').forEach(btn => btn.addEventListener('click', () => choose(btn.dataset.value)));
    const choose = v => {
      if (multi) {
        const cur = new Set(Array.isArray(state[w.id]) ? state[w.id].map(String) : []);
        cur.has(v) ? cur.delete(v) : cur.add(v);
        state[w.id] = Array.from(cur);
      } else {
        state[w.id] = v;
      }
      renderInput(w, body); renderOutputs();
    };
    bindOptionButtons();
    input.addEventListener('input', () => { optsBox.innerHTML = renderOptions(input.value); bindOptionButtons(); });
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Backspace' && !input.value && multi && Array.isArray(state[w.id]) && state[w.id].length) { state[w.id] = state[w.id].slice(0, -1); renderInput(w, body); renderOutputs(); }
      if (ev.key === 'Delete' && !multi) { state[w.id] = ''; renderInput(w, body); renderOutputs(); }
      if (ev.key === 'Enter') { ev.preventDefault(); const first = optsBox.querySelector('[data-value]'); if (first) choose(first.dataset.value); }
    });
    body.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => { state[w.id] = (Array.isArray(state[w.id]) ? state[w.id] : []).filter(x => String(x) !== btn.dataset.remove); renderInput(w, body); renderOutputs(); }));
    const clear = body.querySelector('[data-clear]'); if (clear) clear.addEventListener('click', () => { state[w.id] = ''; renderInput(w, body); renderOutputs(); });
  }

  function renderOutput(w, body) {
    if (w.type === 'metric') return renderMetric(w, body);
    if (w.type === 'table') return renderTable(w, body);
    if (plotTypes.has(w.type)) return renderPlot(w, body);
    if (w.type === 'markdown') return renderMarkdown(w, body);
    if (w.type === 'html') return renderHtml(w, body);
    if (w.type === 'webr') return renderWebR(w, body);
    if (w.type === 'rplot') return renderRPlotViewer(w, body);
    body.innerHTML = `<div class="bd-empty">Unknown widget type: ${esc(w.type)}</div>`;
  }

  function optionsFor(w) {
    if (Array.isArray(w.options)) return w.options.map(String);
    const field = w.field;
    if (!field || field === '*') return [];
    return Array.from(new Set(dataset(w.data).map(r => r[field]).filter(v => v != null && v !== '').map(String))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  function isChecked(w, option) {
    const val = state[w.id];
    return Array.isArray(val) ? val.map(String).includes(String(option)) : String(val) === String(option);
  }

  function valuesFor(w) {
    return dataset(w.data).map(r => Number(r[w.field])).filter(Number.isFinite);
  }

  function minFor(w) {
    const v = valuesFor(w);
    return v.length ? Math.min(...v) : 0;
  }

  function maxFor(w) {
    const v = valuesFor(w);
    return v.length ? Math.max(...v) : 100;
  }

  function clampNumber(x, lo, hi) {
    const n = Number(x);
    if (!Number.isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  function snapNumber(x, min, max, step) {
    const n = clampNumber(x, min, max);
    const st = Number(step);
    if (!Number.isFinite(st) || st <= 0) return n;
    const snapped = min + Math.round((n - min) / st) * st;
    const decimals = Math.max(0, Math.min(12, String(st).split('.')[1]?.length || 0));
    return clampNumber(Number(snapped.toFixed(decimals)), min, max);
  }

  function rangePercent(x, min, max) {
    const lo = Number(min);
    const hi = Number(max);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi === lo) return 0;
    return clampNumber(((Number(x) - lo) / (hi - lo)) * 100, 0, 100);
  }

  function bindNumberWheel(inp) {
    if (!inp || inp.type !== 'number' || inp.dataset.bdWheelBound) return;
    inp.dataset.bdWheelBound = '1';
    inp.addEventListener('wheel', ev => {
      if (inp.disabled || inp.readOnly) return;
      ev.preventDefault();
      ev.stopPropagation();
      try { inp.focus({ preventScroll: true }); } catch (_) { try { inp.focus(); } catch (_) {} }
      const before = inp.value;
      const up = Number(ev.deltaY || 0) < 0;
      try { up ? inp.stepUp() : inp.stepDown(); }
      catch (_) {
        const step = Number(inp.step) > 0 ? Number(inp.step) : 1;
        const current = Number.isFinite(Number(inp.value)) ? Number(inp.value) : Number(inp.min || 0);
        const min = inp.min === '' ? -Infinity : Number(inp.min);
        const max = inp.max === '' ? Infinity : Number(inp.max);
        const next = current + (up ? step : -step);
        inp.value = String(Math.min(Number.isFinite(max) ? max : Infinity, Math.max(Number.isFinite(min) ? min : -Infinity, next)));
      }
      if (inp.value !== before) inp.dispatchEvent(new Event('input', { bubbles: true }));
    }, { passive: false });
  }

  function upstreamIds(targetId) {
    if (!usesFlowLayout()) return null;
    const incoming = graphEdges().reduce((acc, e) => {
      (acc[e.target] ||= []).push(e.source);
      return acc;
    }, {});
    const seen = new Set();
    const stack = [...(incoming[targetId] || [])];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue;
      seen.add(id);
      (incoming[id] || []).forEach(x => stack.push(x));
    }
    return seen;
  }

  function filtersForOutput(dataName, outputId) {
    const all = widgets().filter(w => inputTypes.has(w.type) && w.data === dataName);
    const ids = upstreamIds(outputId);
    if (!ids) return all;
    return all.filter(w => ids.has(w.id));
  }

  function filteredRows(dataName, outputId) {
    let out = dataset(dataName);
    filtersForOutput(dataName, outputId).forEach(w => {
      if (w.type === 'button') return;
      out = applyFilter(out, w);
    });
    return out;
  }

  function rowsForOutput(w) {
    let out = w.filter === false ? dataset(w.data) : filteredRows(w.data, w.id);
    const ts = Array.isArray(w.transform) ? w.transform : (Array.isArray(w.transforms) ? w.transforms : []);
    ts.forEach(t => { out = applyTransform(out, t); });
    return out;
  }

  function applyFilter(rows, w) {
    const val = state[w.id];
    if (w.type === 'search') {
      const q = String(val || '').trim().toLowerCase();
      if (!q) return rows;
      return rows.filter(r => {
        if (w.field && w.field !== '*') return String(r[w.field] ?? '').toLowerCase().includes(q);
        return Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q));
      });
    }
    if (['select', 'radio'].includes(w.type) || (w.type === 'selectize' && w.multiple === false)) {
      if (val == null || val === '') return rows;
      return rows.filter(r => String(r[w.field]) === String(val));
    }
    if (['multiselect', 'checkbox'].includes(w.type) || (w.type === 'selectize' && w.multiple !== false)) {
      const vals = Array.isArray(val) ? val.map(String) : [];
      if (!vals.length) return [];
      return rows.filter(r => vals.includes(String(r[w.field])));
    }
    if (w.type === 'range') {
      const a = Number(Array.isArray(val) ? val[0] : w.min);
      const b = Number(Array.isArray(val) ? val[1] : w.max);
      return rows.filter(r => Number(r[w.field]) >= Math.min(a, b) && Number(r[w.field]) <= Math.max(a, b));
    }
    if (w.type === 'slider') {
      const v = Number(val);
      const op = w.operator || '<=';
      return rows.filter(r => compare(Number(r[w.field]), op, v));
    }
    if (w.type === 'number') {
      const v = Number(val);
      if (!Number.isFinite(v)) return rows;
      return rows.filter(r => compare(Number(r[w.field]), w.operator || '==', v));
    }
    if (w.type === 'text') {
      const q = String(val || '').toLowerCase();
      if (!q) return rows;
      return rows.filter(r => String(r[w.field] ?? '').toLowerCase().includes(q));
    }
    if (w.type === 'date') {
      if (!val) return rows;
      const d = Date.parse(val);
      return rows.filter(r => compare(Date.parse(r[w.field]), w.operator || '==', d));
    }
    if (w.type === 'daterange') {
      const a = Array.isArray(val) && val[0] ? Date.parse(val[0]) : -Infinity;
      const b = Array.isArray(val) && val[1] ? Date.parse(val[1]) : Infinity;
      return rows.filter(r => { const d = Date.parse(r[w.field]); return Number.isFinite(d) && d >= Math.min(a, b) && d <= Math.max(a, b); });
    }
    if (w.type === 'toggle' && w.field) {
      return rows.filter(r => boolValue(r[w.field]) === Boolean(val));
    }
    return rows;
  }

  function boolValue(x) {
    if (typeof x === 'boolean') return x;
    const s = String(x).toLowerCase();
    if (['true', 't', 'yes', 'y', '1'].includes(s)) return true;
    if (['false', 'f', 'no', 'n', '0'].includes(s)) return false;
    return Boolean(x);
  }

  function compare(a, op, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    if (op === '<') return a < b;
    if (op === '<=') return a <= b;
    if (op === '>') return a > b;
    if (op === '>=') return a >= b;
    if (op === '!=') return a !== b;
    return a === b;
  }

  function applyTransform(rows, t) {
    if (!t || !t.type) return rows;
    try {
      if (t.type === 'filter' && t.expr) {
        const fn = new Function('row', 'state', `return (${t.expr});`);
        return rows.filter(row => Boolean(fn(row, state)));
      }
      if ((t.type === 'mutate' || t.type === 'derive') && t.field && t.expr) {
        const fn = new Function('row', 'state', `return (${t.expr});`);
        return rows.map(row => ({ ...row, [t.field]: fn(row, state) }));
      }
      if (t.type === 'group' && t.by) {
        return aggregateRows(rows, t.by, t.field, t.op || 'count', t.as || 'value');
      }
      if (t.type === 'sort' && t.field) {
        return [...rows].sort((a, b) => String(a[t.field]).localeCompare(String(b[t.field]), undefined, { numeric: true }) * (t.desc ? -1 : 1));
      }
      if (t.type === 'limit') return rows.slice(0, Number(t.n || 100));
    } catch (e) {
      console.warn('Transform failed', t, e);
    }
    return rows;
  }

  function renderMetric(w, body) {
    const data = rowsForOutput(w);
    const m = w.measure || { op: 'count' };
    const value = aggregateValue(data, m.field, m.op || 'count');
    const digits = Number.isFinite(Number(w.digits)) ? Number(w.digits) : 1;
    const shown = typeof value === 'number' ? fmt(value, digits) : value;
    const metricLabel = w.label || w.title || '';
    const label = metricLabel ? `<div class="bd-metric-label">${esc(metricLabel)}</div>` : '';
    body.innerHTML = `<div class="bd-metric"><div class="bd-metric-value">${esc(shown)}${esc(w.suffix || '')}</div>${label}</div>`;
  }

  function aggregateValue(rows, field, op) {
    if (op === 'count') return rows.length;
    const vals = rows.map(r => field ? r[field] : null).filter(v => v != null && v !== '');
    if (op === 'distinct') return new Set(vals.map(String)).size;
    const nums = vals.map(Number).filter(Number.isFinite);
    if (!nums.length) return 0;
    if (op === 'sum') return nums.reduce((a, b) => a + b, 0);
    if (op === 'mean') return nums.reduce((a, b) => a + b, 0) / nums.length;
    if (op === 'median' || op === 'q50' || op === 'decile50') return quantile(nums, 0.5);
    if (op === 'q25') return quantile(nums, 0.25);
    if (op === 'q75') return quantile(nums, 0.75);
    if (/^quintile(20|40|60|80)$/.test(op)) return quantile(nums, Number(op.replace('quintile', '')) / 100);
    if (/^decile(10|20|30|40|60|70|80|90)$/.test(op)) return quantile(nums, Number(op.replace('decile', '')) / 100);
    if (op === 'min') return Math.min(...nums);
    if (op === 'max') return Math.max(...nums);
    return nums.length;
  }

  function renderTable(w, body) {
    if (renderWebRConsumer(w, body, 'table')) return;
    const st = tableState[w.id] || (tableState[w.id] = { page: 1, sort: '', dir: 1, search: '' });
    let data = rowsForOutput(w);
    const columns = Array.isArray(w.columns) && w.columns.length ? w.columns : Array.from(new Set(data.slice(0, 20).flatMap(r => Object.keys(r))));
    if (st.search) {
      const q = st.search.toLowerCase();
      data = data.filter(r => columns.some(c => String(r[c] ?? '').toLowerCase().includes(q)));
    }
    if (st.sort) {
      data = [...data].sort((a, b) => String(a[st.sort] ?? '').localeCompare(String(b[st.sort] ?? ''), undefined, { numeric: true }) * st.dir);
    }
    const pageSize = Number(w.pageSize || 12);
    const pages = Math.max(1, Math.ceil(data.length / pageSize));
    st.page = Math.max(1, Math.min(st.page, pages));
    const view = data.slice((st.page - 1) * pageSize, st.page * pageSize);
    body.innerHTML = `
      <div class="bd-table-widget">
        <div class="bd-table-tools">
          <input type="search" placeholder="Search table" value="${esc(st.search)}">
          <span class="bd-card-subtitle">${data.length.toLocaleString()} rows · page ${st.page} of ${pages}</span>
          <span><button class="bd-button secondary" data-table-csv="1">Download CSV</button> <button class="bd-button secondary" data-page="prev">Prev</button> <button class="bd-button secondary" data-page="next">Next</button></span>
        </div>
        <div class="bd-table-wrap">
          <table class="bd-table">
            <thead><tr>${columns.map(c => `<th data-sort="${esc(c)}">${esc(c)}${st.sort === c ? (st.dir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('')}</tr></thead>
            <tbody>${view.map(r => `<tr>${columns.map(c => `<td>${esc(r[c])}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    `;
    body.querySelector('.bd-table-tools input').addEventListener('input', debounce(e => { st.search = e.target.value; st.page = 1; renderTable(w, body); }, 100));
    body.querySelector('[data-table-csv]').addEventListener('click', () => downloadRowsCsv(data, columns, safeFile(cardTitle(w)) + '.csv'));
    body.querySelectorAll('[data-sort]').forEach(th => th.addEventListener('click', () => {
      const c = th.dataset.sort;
      if (st.sort === c) st.dir *= -1;
      else { st.sort = c; st.dir = 1; }
      renderTable(w, body);
    }));
    body.querySelector('[data-page="prev"]').addEventListener('click', () => { st.page--; renderTable(w, body); });
    body.querySelector('[data-page="next"]').addEventListener('click', () => { st.page++; renderTable(w, body); });
  }

  function renderMarkdown(w, body) {
    if (renderWebRConsumer(w, body, 'markdown')) return;
    body.innerHTML = `<div class="bd-markdown">${markdown(interpolateParams(w.markdown || '', w.id))}</div>`;
    enhanceMarkdown(body);
  }

  function renderHtml(w, body) {
    if (renderWebRConsumer(w, body, 'html')) return;
    body.innerHTML = interpolateParams(w.html || '', w.id);
  }

  function renderRPlotViewer(w, body) {
    if (renderWebRConsumer(w, body, 'plot')) return;
    body.innerHTML = '<div class="bd-empty">Draw an arrow from a webR processor to this R plot viewer.</div>';
  }

  function interpolateParams(text, id) {
    const params = upstreamParamState(id);
    return String(text || '').replace(/\{\{\s*(?:param\.)?([A-Za-z0-9_.-]+)\s*\}\}/g, (_, k) => {
      const v = params[k] ?? state[k] ?? '';
      return Array.isArray(v) ? esc(v.join(', ')) : esc(v);
    });
  }

  function firstUpstreamWebR(id) {
    const ids = upstreamIds(id);
    if (!ids) return null;
    return widgets().find(w => w.type === 'webr' && ids.has(w.id)) || null;
  }

  function renderWebRConsumer(w, body, preferred) {
    const src = firstUpstreamWebR(w.id);
    if (!src) return false;
    const res = webRResults[src.id];
    if (webRRunning[src.id] || !res) { body.innerHTML = `<div class="bd-webr-box running"><div class="bd-spinner"></div><pre class="bd-webr-output">Waiting for ${esc(src.title || src.id)}...</pre></div>`; return true; }
    if (preferred === 'html') { body.innerHTML = res.html || res.text || ''; return true; }
    if (preferred === 'markdown') { body.innerHTML = `<div class="bd-markdown">${markdown(res.markdown || res.text || res.html || '')}</div>`; enhanceMarkdown(body); return true; }
    if (preferred === 'table') {
      if (Array.isArray(res.rows)) renderStaticTable(w, body, res.rows, w.title || src.title || 'webR table');
      else body.innerHTML = `<div class="bd-empty">The upstream webR result is not table-like.</div>`;
      return true;
    }
    if (preferred === 'plot') { body.innerHTML = plotResultHtml(res, w.title || src.title || 'R plot'); bindRPlotControls(body, res, w.id || 'r-plot'); return true; }
    return false;
  }

  function renderWebR(w, body) {
    const theme = w.consoleTheme === 'light' ? 'light' : 'dark';
    const sig = webRSignature(w);
    body.innerHTML = `<div class="bd-webr-box ${theme} running"><div class="bd-spinner"></div><pre class="bd-webr-output">Starting webR...</pre></div>`;
    const box = body.querySelector('.bd-webr-box');
    const out = body.querySelector('.bd-webr-output');
    const runNow = w.autoRun !== false;
    if (!runNow) {
      box.classList.remove('running');
      box.innerHTML = `<pre class="bd-webr-output">Auto-run is disabled for this webR processor. Enable auto-run in the builder to execute it when the dashboard opens or when upstream inputs change.</pre>`;
      return;
    }
    if (webRResults[w.id] && webRSignatures[w.id] === sig) {
      box.classList.remove('running');
      renderWebRResult(w, box, webRResults[w.id]);
      return;
    }
    if (webRRunning[w.id] === sig) {
      out.textContent = 'Still running webR...';
      return;
    }
    runWebRWidget(w, box, out, sig);
  }

  function webRSignature(w) {
    let rows = [];
    try { rows = rowsForOutput(w); } catch (_) {}
    return JSON.stringify({ code: w.code || '', outputType: effectiveWebROutputType(w), packages: w.packages || '', params: upstreamParamState(w.id), rows });
  }

  async function runWebRWidget(w, box, out, sig) {
    try {
      webRRunning[w.id] = sig || webRSignature(w);
      box.classList.add('running');
      out.textContent = packageList(w.packages).length ? 'Loading webR, installing packages, and running R code...' : 'Loading webR and running R code...';
      if (!window.BlinkDashWebR) throw new Error('webR bridge is not loaded.');
      const params = upstreamParamState(w.id);
      const res = await window.BlinkDashWebR.run(w.code || '', rowsForOutput(w), state, { dataName: w.data, packages: packageList(w.packages), params, outputType: effectiveWebROutputType(w) });
      webRResults[w.id] = res || {};
      webRSignatures[w.id] = webRRunning[w.id];
      delete webRRunning[w.id];
      box.classList.remove('running');
      renderWebRResult(w, box, webRResults[w.id]);
      renderConsumersOf(w.id);
    } catch (e) {
      delete webRRunning[w.id];
      box.classList.remove('running');
      out.textContent = 'webR error: ' + (e && e.message ? e.message : String(e));
    }
  }

  function renderConsumersOf(sourceId) {
    widgets().filter(w => !inputTypes.has(w.type) && w.type !== 'webr').forEach(w => {
      const ids = upstreamIds(w.id);
      if (ids && ids.has(sourceId)) {
        const body = bodyFor(w);
        if (body) renderOutput(w, body);
      }
    });
  }

  function renderWebRResult(w, box, res) {
    const kind = effectiveWebROutputType(w) !== 'auto' ? effectiveWebROutputType(w) : (res.kind || 'text');
    const summary = [];
    summary.push('webR finished.');
    summary.push('Detected result type: ' + kind + '.');
    if (res.rows) summary.push('Rows returned: ' + res.rows.length + '.');
    if (res.svg) summary.push('Plot captured as SVG.');
    else if (res.image) summary.push('Plot captured as PNG bitmap fallback.');
    const consoleText = String(res.console || res.text || '').trim();
    box.innerHTML = `<pre class="bd-webr-output">${esc([summary.join('\n'), consoleText].filter(Boolean).join('\n\n'))}</pre>`;
  }

  function plotResultHtml(res, title) {
    const inner = res && res.svg ? `<div class="bd-rplot-svg">${res.svg}</div>` : (res && res.image ? `<img class="bd-webr-plot" src="${esc(res.image)}" alt="${esc(title || 'R plot')}">` : '<div class="bd-empty">No plot is available yet.</div>');
    return `<div class="bd-rplot-box"><div class="bd-chart-tools"><button class="bd-button secondary" data-rplot-full="1">Full screen</button><button class="bd-button secondary" data-rplot-svg="1">SVG</button><button class="bd-button secondary" data-rplot-png="1">PNG</button></div>${inner}</div>`;
  }

  function bindRPlotControls(container, res, name) {
    const svgBtn = container.querySelector('[data-rplot-svg]');
    const pngBtn = container.querySelector('[data-rplot-png]');
    const fullBtn = container.querySelector('[data-rplot-full]');
    if (svgBtn) svgBtn.addEventListener('click', () => downloadText((res && res.svg) || svgFromImage((res && res.image) || '', name), safeFile(name) + '.svg', 'image/svg+xml'));
    if (pngBtn) pngBtn.addEventListener('click', () => downloadPlotPng(container, safeFile(name) + '.png'));
    if (fullBtn) fullBtn.addEventListener('click', () => openHtmlFullScreen(container.querySelector('.bd-rplot-svg, img.bd-webr-plot')?.outerHTML || '<p>No plot</p>', name));
  }

  function packageList(x) { return String(x || '').split(',').map(s => s.trim()).filter(Boolean); }
  function upstreamParamState(id) {
    const ids = upstreamIds(id);
    const out = {};
    if (!ids) return out;
    ids.forEach(k => { if (Object.prototype.hasOwnProperty.call(state, k)) out[k] = state[k]; });
    return out;
  }

  function downstreamTypes(id) {
    const edges = (app.graph && Array.isArray(app.graph.edges)) ? app.graph.edges : [];
    const targets = edges.filter(e => e && e.source === id).map(e => e.target);
    return targets.map(t => (widgets().find(w => w.id === t) || {}).type).filter(Boolean);
  }

  function effectiveWebROutputType(w) {
    const explicit = w && w.outputType && w.outputType !== 'auto' ? w.outputType : '';
    if (explicit) return explicit;
    const types = downstreamTypes(w.id);
    if (types.includes('rplot')) return 'plot';
    if (types.includes('table')) return 'table';
    if (types.includes('html')) return 'html';
    if (types.includes('markdown')) return 'markdown';
    return 'auto';
  }

  function renderStaticTable(w, body, rows, title) {
    rows = Array.isArray(rows) ? rows : [];
    const cols = Array.from(new Set(rows.slice(0, 30).flatMap(r => Object.keys(r || {}))));
    body.innerHTML = `<div class="bd-table-widget"><div class="bd-table-tools"><span class="bd-card-subtitle">${rows.length.toLocaleString()} rows</span><button class="bd-button secondary" data-table-csv="1">Download CSV</button></div><div class="bd-table-wrap"><table class="bd-table"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0, 50).map(r => `<tr>${cols.map(c => `<td>${esc(r[c])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
    const btn = body.querySelector('[data-table-csv]');
    if (btn) btn.addEventListener('click', () => downloadRowsCsv(rows, cols, safeFile(title || cardTitle(w) || 'table') + '.csv'));
  }

  function rowsToCsv(rows, columns) {
    rows = Array.isArray(rows) ? rows : [];
    columns = Array.isArray(columns) && columns.length ? columns : Array.from(new Set(rows.flatMap(r => Object.keys(r || {}))));
    const cell = value => {
      const text = String(value == null ? '' : value);
      return /[",\n\r]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
    };
    return [columns.map(cell).join(','), ...rows.map(row => columns.map(c => cell(row && row[c])).join(','))].join('\r\n');
  }

  function downloadRowsCsv(rows, columns, filename) {
    downloadText('﻿' + rowsToCsv(rows, columns), filename || 'table.csv', 'text/csv;charset=utf-8');
  }

  function renderPlot(w, body) {
    body.innerHTML = `<div class="bd-chart-tools"><button class="bd-button secondary" data-chart-full="1">Full screen</button><button class="bd-button secondary" data-chart-svg="1">SVG</button><button class="bd-button secondary" data-chart-png="1">PNG</button></div><div class="bd-chart-wrap"><canvas class="bd-chart"></canvas></div>`;
    const canvas = body.querySelector('canvas');
    requestAnimationFrame(() => drawPlot(w, canvas, rowsForOutput(w)));
    attachChartHover(canvas, w);
    body.querySelector('[data-chart-full]').addEventListener('click', () => openNativePlotFullScreen(w));
    body.querySelector('[data-chart-png]').addEventListener('click', () => downloadCanvasPng(canvas, safeFile(w.title || w.id || 'plot') + '.png'));
    body.querySelector('[data-chart-svg]').addEventListener('click', () => downloadText(nativePlotSvg(w, rowsForOutput(w), w.title || w.id || 'plot'), safeFile(w.title || w.id || 'plot') + '.svg', 'image/svg+xml'));
  }

  function canvasContext(canvas, w) {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const width = Math.max(260, rect.width);
    const height = Math.max(220, rect.height || parent.offsetHeight || 260);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.font = canvasFont(0.75);
    const needsLegend = (w && (w.type === 'scatter' || w.type === 'line') && w.color);
    return { ctx, width, height, m: { l: 54, r: needsLegend ? 152 : 22, t: 20, b: 52 } };
  }

  function drawPlot(w, canvas, rows) {
    const c = canvasContext(canvas, w);
    canvas._bdHitRegions = [];
    if (!rows.length) return emptyChart(c, 'No rows match the current filters');
    if (w.type === 'scatter') return drawScatter(c, w, rows);
    if (w.type === 'line') return drawLine(c, w, rows);
    if (w.type === 'bar') return drawBar(c, w, rows);
    if (w.type === 'histogram') return drawHistogram(c, w, rows);
    if (w.type === 'boxplot') return drawBoxplot(c, w, rows);
    if (w.type === 'heatmap') return drawHeatmap(c, w, rows);
    if (w.type === 'pie') return drawPie(c, w, rows);
  }

  function emptyChart({ ctx, width, height }, text) {
    ctx.font = canvasFont(0.82, '700');
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height / 2);
  }

  function drawFrame(c, xLabel, yLabel) {
    const { ctx, width, height, m } = c;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(m.l, m.t);
    ctx.lineTo(m.l, height - m.b);
    ctx.lineTo(width - m.r, height - m.b);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = canvasFont(0.78, '700');
    ctx.textAlign = 'center';
    if (xLabel) ctx.fillText(xLabel, (m.l + width - m.r) / 2, height - 8);
    if (yLabel) {
      ctx.save();
      ctx.translate(13, (m.t + height - m.b) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(yLabel, 0, 0);
      ctx.restore();
    }
  }

  function drawYAxis(c, domain) {
    const { ctx, width, height, m } = c;
    const scale = lin(domain, [height - m.b, m.t]);
    ctx.strokeStyle = '#f1f5f9';
    ctx.fillStyle = '#64748b';
    ctx.font = canvasFont(0.75);
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const v = domain[0] + (domain[1] - domain[0]) * i / 4;
      const y = scale(v);
      ctx.beginPath();
      ctx.moveTo(m.l, y);
      ctx.lineTo(width - m.r, y);
      ctx.stroke();
      ctx.fillText(fmt(v), m.l - 7, y + 4);
    }
    return scale;
  }

  function drawXAxis(c, domain, scale, labeler) {
    const { ctx, height, m } = c;
    ctx.strokeStyle = '#f1f5f9';
    ctx.font = canvasFont(0.75);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bd-muted').trim() || '#64748b';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const v = domain[0] + (domain[1] - domain[0]) * i / 4;
      const x = scale(v);
      ctx.beginPath();
      ctx.moveTo(x, height - m.b);
      ctx.lineTo(x, height - m.b + 5);
      ctx.stroke();
      ctx.fillText(labeler ? labeler(v) : fmt(v), x, height - m.b + 20);
    }
  }

  function drawScatter(c, w, rows) {
    const xs = rows.map(r => Number(r[w.x])).filter(Number.isFinite);
    const ys = rows.map(r => Number(r[w.y])).filter(Number.isFinite);
    if (!xs.length || !ys.length) return emptyChart(c, 'Scatter needs numeric x and y fields');
    const { ctx, width, height, m } = c;
    drawFrame(c, w.x, w.y);
    const xDomain = padDomain([Math.min(...xs), Math.max(...xs)]);
    const x = lin(xDomain, [m.l, width - m.r]);
    drawXAxis(c, xDomain, x);
    const y = drawYAxis(c, padDomain([Math.min(...ys), Math.max(...ys)]));
    rows.forEach(r => {
      const xv = Number(r[w.x]), yv = Number(r[w.y]);
      if (!Number.isFinite(xv) || !Number.isFinite(yv)) return;
      ctx.fillStyle = colorFor(w, r[w.color]);
      ctx.globalAlpha = 0.82;
      ctx.beginPath();
      ctx.arc(x(xv), y(yv), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    if (w.color) drawLegend(c, Array.from(new Set(rows.map(r => String(r[w.color] ?? '')))), w);
  }

  function drawLine(c, w, rows) {
    const pairs = rows.map(r => ({ x: r[w.x], y: Number(r[w.y]), group: r[w.color] ?? '' })).filter(d => Number.isFinite(d.y));
    if (!pairs.length) return emptyChart(c, 'Line plot needs a numeric y field');
    const { ctx, width, height, m } = c;
    drawFrame(c, w.x, w.y);
    const xNumeric = pairs.every(d => Number.isFinite(Number(d.x)));
    const cats = Array.from(new Set(pairs.map(d => String(d.x))));
    const xDomain = xNumeric ? padDomain([Math.min(...pairs.map(d => Number(d.x))), Math.max(...pairs.map(d => Number(d.x)))]) : null;
    const xBand = xNumeric ? null : band(cats, [m.l, width - m.r], 0.2);
    const x = xNumeric ? lin(xDomain, [m.l, width - m.r]) : xBand.pos;
    if (xNumeric) drawXAxis(c, xDomain, x); else drawCatLabels(c, cats, xBand.pos, xBand.bandwidth);
    const y = drawYAxis(c, padDomain([Math.min(...pairs.map(d => d.y)), Math.max(...pairs.map(d => d.y))]));
    const groups = groupBy(pairs, d => String(d.group));
    Object.entries(groups).forEach(([g, arr]) => {
      arr.sort((a, b) => xNumeric ? Number(a.x) - Number(b.x) : cats.indexOf(String(a.x)) - cats.indexOf(String(b.x)));
      ctx.strokeStyle = colorFor(w, g);
      ctx.lineWidth = 2;
      ctx.beginPath();
      arr.forEach((d, i) => {
        const xx = xNumeric ? x(Number(d.x)) : x(String(d.x));
        const yy = y(d.y);
        if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      });
      ctx.stroke();
    });
    if (w.color) drawLegend(c, Object.keys(groups), w);
  }

  function drawBar(c, w, rows) {
    const arr = sortBarRows(aggregateRows(rows, w.x, w.y, w.aggregate || (w.y ? 'mean' : 'count'), 'value'), w);
    if (!arr.length) return emptyChart(c, 'No groups to display');
    const { ctx, width, height, m } = c;
    drawFrame(c, w.x, w.y || 'count');
    const cats = arr.map(d => String(d[w.x]));
    const x = band(cats, [m.l, width - m.r], 0.16);
    const max = Math.max(1, ...arr.map(d => Number(d.value) || 0));
    const y = drawYAxis(c, [0, max * 1.08]);
    const hits = [];
    arr.forEach(d => {
      const raw = Number(d.value) || 0;
      const xx = x.pos(String(d[w.x]));
      const yy = y(raw);
      const hh = Math.max(1, height - m.b - yy);
      ctx.fillStyle = barColorFor(w, d[w.x]);
      roundRect(ctx, xx, yy, x.bandwidth, hh, 7);
      ctx.fill();
      if (w.showHoverValues !== false) hits.push({ x: xx, y: yy, width: x.bandwidth, height: hh, label: String(d[w.x]), value: raw, text: `${d[w.x]}: ${fmt(raw)}` });
    });
    if (w.showHoverValues !== false && ctx.canvas) ctx.canvas._bdHitRegions = hits;
    drawCatLabels(c, cats, x.pos, x.bandwidth);
  }

  function drawHistogram(c, w, rows) {
    const vals = rows.map(r => Number(r[w.x || w.field])).filter(Number.isFinite);
    if (!vals.length) return emptyChart(c, 'Histogram needs a numeric field');
    const { ctx, width, height, m } = c;
    const min = Math.min(...vals), max = Math.max(...vals);
    const bins = Math.max(2, Math.min(120, Number(w.bins || 20)));
    const step = (max - min || 1) / bins;
    const counts = Array.from({ length: bins }, (_, i) => ({ x: min + i * step, n: 0 }));
    vals.forEach(v => counts[Math.min(bins - 1, Math.floor((v - min) / step))].n++);
    drawFrame(c, w.x || w.field, 'count');
    const xDomain = [min, max || min + 1];
    const x = lin(xDomain, [m.l, width - m.r]);
    drawXAxis(c, xDomain, x);
    const y = drawYAxis(c, [0, Math.max(1, ...counts.map(d => d.n)) * 1.08]);
    ctx.fillStyle = getAccent();
    counts.forEach(bn => {
      const xx = x(bn.x);
      const bw = Math.max(1, x(bn.x + step) - xx);
      const yy = y(bn.n);
      ctx.globalAlpha = 0.86;
      ctx.fillRect(xx, yy, bw, height - m.b - yy);
      ctx.globalAlpha = 1;
    });
  }

  function drawBoxplot(c, w, rows) {
    const groups = groupBy(rows, r => String(r[w.x] ?? ''));
    const arr = Object.entries(groups).map(([g, rs]) => ({ g, vals: rs.map(r => Number(r[w.y])).filter(Number.isFinite) })).filter(d => d.vals.length);
    if (!arr.length) return emptyChart(c, 'Box plot needs a group and numeric y');
    const { ctx, width, height, m } = c;
    const all = arr.flatMap(d => d.vals);
    drawFrame(c, w.x, w.y);
    const y = drawYAxis(c, padDomain([Math.min(...all), Math.max(...all)]));
    const x = band(arr.map(d => d.g), [m.l, width - m.r], 0.35);
    arr.forEach(d => {
      const qs = [0, .25, .5, .75, 1].map(p => quantile(d.vals, p));
      const cx = x.pos(d.g) + x.bandwidth / 2;
      const bw = x.bandwidth * 0.72;
      ctx.strokeStyle = colorFor(w, d.g);
      ctx.fillStyle = colorFor(w, d.g);
      ctx.globalAlpha = 0.18;
      ctx.fillRect(cx - bw / 2, y(qs[3]), bw, y(qs[1]) - y(qs[3]));
      ctx.globalAlpha = 1;
      ctx.strokeRect(cx - bw / 2, y(qs[3]), bw, y(qs[1]) - y(qs[3]));
      ctx.beginPath();
      ctx.moveTo(cx - bw / 2, y(qs[2])); ctx.lineTo(cx + bw / 2, y(qs[2]));
      ctx.moveTo(cx, y(qs[0])); ctx.lineTo(cx, y(qs[1]));
      ctx.moveTo(cx, y(qs[3])); ctx.lineTo(cx, y(qs[4]));
      ctx.stroke();
    });
    drawCatLabels(c, arr.map(d => d.g), x.pos, x.bandwidth);
  }

  function drawHeatmap(c, w, rows) {
    const xs = Array.from(new Set(rows.map(r => String(r[w.x] ?? ''))));
    const ys = Array.from(new Set(rows.map(r => String(r[w.y] ?? ''))));
    if (!xs.length || !ys.length) return emptyChart(c, 'Heatmap needs x and y groups');
    const vals = new Map();
    rows.forEach(r => {
      const key = `${r[w.x]}\u0000${r[w.y]}`;
      vals.set(key, (vals.get(key) || 0) + 1);
    });
    const max = Math.max(1, ...vals.values());
    const { ctx, width, height, m } = c;
    drawFrame(c, w.x, w.y);
    const xb = band(xs, [m.l, width - m.r], 0.04);
    const yb = band(ys, [m.t, height - m.b], 0.04);
    xs.forEach(xv => ys.forEach(yv => {
      const v = vals.get(`${xv}\u0000${yv}`) || 0;
      ctx.fillStyle = colorWithAlpha(getAccent(), 0.08 + 0.84 * v / max);
      ctx.fillRect(xb.pos(xv), yb.pos(yv), xb.bandwidth, yb.bandwidth);
    }));
    drawCatLabels(c, xs, xb.pos, xb.bandwidth);
    ctx.fillStyle = '#64748b';
    ctx.font = canvasFont(0.75);
    ctx.textAlign = 'right';
    ys.forEach(yv => ctx.fillText(short(yv), m.l - 7, yb.pos(yv) + yb.bandwidth / 2 + 4));
  }

  function drawPie(c, w, rows) {
    const arr = aggregateRows(rows, w.x, w.y, w.aggregate || (w.y ? 'sum' : 'count'), 'value').filter(d => Number(d.value) > 0);
    if (!arr.length) return emptyChart(c, 'No slices to display');
    const { ctx, width, height } = c;
    const total = arr.reduce((a, b) => a + Number(b.value), 0);
    const r = Math.min(width, height) * 0.32;
    const cx = width * 0.42, cy = height * 0.48;
    let a = -Math.PI / 2;
    arr.forEach(d => {
      const angle = Number(d.value) / total * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.fillStyle = colorFor(w, d[w.x]);
      ctx.arc(cx, cy, r, a, a + angle);
      ctx.closePath();
      ctx.fill();
      a += angle;
    });
    ctx.fillStyle = '#64748b';
    ctx.font = canvasFont(0.75);
    ctx.textAlign = 'left';
    arr.slice(0, 8).forEach((d, i) => {
      const y = 24 + i * 19;
      ctx.fillStyle = colorFor(w, d[w.x]);
      ctx.fillRect(width * 0.72, y - 9, 10, 10);
      ctx.fillStyle = '#334155';
      ctx.fillText(`${short(d[w.x])}: ${fmt(d.value)}`, width * 0.72 + 16, y);
    });
  }

  function drawLegend(c, labels, w) {
    const { ctx, width, m } = c;
    if (!labels || !labels.length) return;
    let x = Math.max(m.l + 18, width - m.r + 18), y = 18;
    ctx.textAlign = 'left';
    ctx.font = canvasFont(0.72, '600');
    labels.slice(0, 10).forEach((lab, i) => {
      const yy = y + i * 17;
      ctx.fillStyle = colorFor(w, lab);
      ctx.fillRect(x, yy - 9, 10, 10);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bd-muted').trim() || '#64748b';
      ctx.fillText(short(lab, 14), x + 15, yy);
    });
  }

  function aggregateRows(rows, groupField, valueField, op, as = 'value') {
    const groups = groupBy(rows, r => String(r[groupField] ?? ''));
    return Object.entries(groups).map(([g, rs]) => ({ [groupField]: g, [as]: aggregateValue(rs, valueField, op) }));
  }

  function sortBarRows(arr, w) {
    const mode = w.barSort || w.sortBars || 'category';
    if (mode === 'value_desc') return [...arr].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
    if (mode === 'value_asc') return [...arr].sort((a, b) => (Number(a.value) || 0) - (Number(b.value) || 0));
    return arr;
  }

  function barColorFor(w, value) {
    const mode = w.colorMode || w.barColorMode || 'category';
    return mode === 'single' ? getAccent() : colorFor(w, value);
  }

  function groupBy(xs, f) {
    return xs.reduce((acc, x) => {
      const k = f(x);
      (acc[k] || (acc[k] = [])).push(x);
      return acc;
    }, {});
  }

  function lin(domain, range) {
    const d = domain[1] - domain[0] || 1;
    return x => range[0] + (Number(x) - domain[0]) / d * (range[1] - range[0]);
  }

  function band(values, range, padding = 0.1) {
    const n = Math.max(1, values.length);
    const start = range[0], end = range[1];
    const step = (end - start) / n;
    const bw = step * (1 - padding * 2);
    return { pos: v => start + values.indexOf(String(v)) * step + step * padding, bandwidth: bw };
  }

  function drawCatLabels(c, cats, pos, bw) {
    const { ctx, height, m } = c;
    ctx.fillStyle = '#64748b';
    ctx.font = canvasFont(0.75);
    ctx.textAlign = 'center';
    cats.forEach(cat => ctx.fillText(short(cat), pos(String(cat)) + bw / 2, height - m.b + 18));
  }

  function padDomain(d) {
    let [a, b] = d;
    if (a === b) { a -= 1; b += 1; }
    const p = (b - a) * 0.06;
    return [a - p, b + p];
  }

  function quantile(vals, p) {
    const x = vals.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
    if (!x.length) return NaN;
    const i = (x.length - 1) * p;
    const lo = Math.floor(i), hi = Math.ceil(i);
    return x[lo] + (x[hi] - x[lo]) * (i - lo);
  }

  function fmt(x, digits = 1) {
    const n = Number(x);
    if (!Number.isFinite(n)) return String(x ?? '');
    const max = Math.abs(n) >= 100 ? 0 : digits;
    let s = n.toLocaleString('en-US', { maximumFractionDigits: max });
    if ((app.format && app.format.decimal) === ',') s = s.replace(/,/g, ' ').replace(/\./g, ',');
    return s;
  }

  function short(x, n = 16) {
    const s = String(x ?? '');
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--bd-accent').trim() || '#4f46e5';
  }

  function paletteFor(w) {
    return palettes[(w && w.palette) || (app.theme && app.theme.plotPalette) || 'okabe'] || palettes.okabe;
  }

  function colorFor(w, value) {
    const pal = paletteFor(w);
    if (value == null || value === '') return getAccent();
    let h = 0;
    const s = String(value);
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return pal[Math.abs(h) % pal.length];
  }

  function colorWithAlpha(hex, alpha) {
    const h = hex.replace('#', '').trim();
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function chartTooltip() {
    let tip = document.querySelector('.bd-chart-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'bd-chart-tooltip';
      tip.hidden = true;
      document.body.appendChild(tip);
    }
    return tip;
  }

  function hideChartTooltip() {
    const tip = document.querySelector('.bd-chart-tooltip');
    if (tip) tip.hidden = true;
  }

  function attachChartHover(canvas, w) {
    if (!canvas || canvas.dataset.hoverReady) return;
    canvas.dataset.hoverReady = '1';
    canvas.addEventListener('mousemove', ev => {
      const regions = Array.isArray(canvas._bdHitRegions) ? canvas._bdHitRegions : [];
      if (!regions.length) { hideChartTooltip(); return; }
      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const hit = regions.find(r => x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height);
      if (!hit) { hideChartTooltip(); return; }
      const tip = chartTooltip();
      tip.innerHTML = `<strong>${esc(hit.label || cardTitle(w) || 'Value')}</strong><span>${esc(hit.text || fmt(hit.value))}</span>`;
      tip.hidden = false;
      const pad = 12;
      const tw = tip.offsetWidth || 180;
      const th = tip.offsetHeight || 54;
      tip.style.left = Math.max(8, Math.min(window.innerWidth - tw - 8, ev.clientX + pad)) + 'px';
      tip.style.top = Math.max(8, Math.min(window.innerHeight - th - 8, ev.clientY + pad)) + 'px';
    });
    canvas.addEventListener('mouseleave', hideChartTooltip);
  }

  function safeFile(x) { return String(x || 'plot').replace(/[^A-Za-z0-9_.-]+/g, '-').replace(/^-+|-+$/g, '') || 'plot'; }
  function downloadText(text, filename, type) {
    const blob = new Blob([text || ''], { type: type || 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }
  function downloadCanvasPng(canvas, filename) {
    if (!canvas) return;
    canvas.toBlob(blob => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0); });
  }

  function nativePlotSvg(w, rows, title) {
    rows = Array.isArray(rows) ? rows : [];
    const width = 1000, height = 620;
    const m = { l: 82, r: ((w && (w.type === 'scatter' || w.type === 'line') && w.color) ? 176 : 44), t: 42, b: 84 };
    const ink = cssVar('--bd-ink', '#0f172a');
    const muted = cssVar('--bd-muted', '#64748b');
    const grid = cssVar('--bd-line', '#e2e8f0');
    const bg = cssVar('--bd-card', '#ffffff');
    const pieces = [];
    const add = x => pieces.push(x);
    const innerW = width - m.l - m.r;
    const innerH = height - m.t - m.b;
    add(`<rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="${escXml(bg)}"/>`);
    add(`<text x="${m.l}" y="24" font-size="${svgFontSize(1)}" font-weight="700" fill="${escXml(ink)}">${escXml(title || w.title || w.id || 'Plot')}</text>`);
    if (!rows.length) {
      add(`<text x="${width/2}" y="${height/2}" text-anchor="middle" fill="${escXml(muted)}">No rows match the current filters</text>`);
      return svgWrap(width, height, pieces.join(''));
    }
    const line = (x1,y1,x2,y2,st=grid,sw=1) => add(`<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}" stroke="${escXml(st)}" stroke-width="${sw}"/>`);
    const text = (x,y,t,extra='') => add(`<text x="${num(x)}" y="${num(y)}" ${extra}>${escXml(t)}</text>`);
    const rect = (x,y,wid,hei,fill,extra='') => add(`<rect x="${num(x)}" y="${num(y)}" width="${num(wid)}" height="${num(hei)}" fill="${escXml(fill)}" ${extra}/>`);
    const circle = (x,y,r,fill,extra='') => add(`<circle cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="${escXml(fill)}" ${extra}/>`);
    const frame = (xlab, ylab) => {
      line(m.l, m.t, m.l, height - m.b, grid, 1.2);
      line(m.l, height - m.b, width - m.r, height - m.b, grid, 1.2);
      if (xlab) text((m.l + width - m.r)/2, height - 18, xlab, `text-anchor="middle" font-size="${svgFontSize(0.8125)}" fill="${escXml(muted)}"`);
      if (ylab) add(`<text transform="translate(22 ${(m.t + height - m.b)/2}) rotate(-90)" text-anchor="middle" font-size="${svgFontSize(0.8125)}" fill="${escXml(muted)}">${escXml(ylab)}</text>`);
    };
    const yAxis = (domain) => {
      const scale = lin(domain, [height - m.b, m.t]);
      for (let i = 0; i <= 4; i++) {
        const v = domain[0] + (domain[1] - domain[0]) * i / 4;
        const y = scale(v);
        line(m.l, y, width - m.r, y, grid, 0.65);
        text(m.l - 10, y + 4, fmt(v), `text-anchor="end" font-size="${svgFontSize(0.75)}" fill="${escXml(muted)}"`);
      }
      return scale;
    };
    const xAxis = (domain, scale) => {
      for (let i = 0; i <= 4; i++) {
        const v = domain[0] + (domain[1] - domain[0]) * i / 4;
        const x = scale(v);
        line(x, height - m.b, x, height - m.b + 6, grid, 1);
        text(x, height - m.b + 24, fmt(v), `text-anchor="middle" font-size="${svgFontSize(0.75)}" fill="${escXml(muted)}"`);
      }
    };
    const catAxis = (cats, pos, bw) => {
      const rotate = cats.length > 9;
      cats.forEach(cat => {
        const x = pos(String(cat)) + bw / 2;
        const label = short(cat, rotate ? 11 : 15);
        if (rotate) add(`<text x="${num(x)}" y="${height - m.b + 18}" transform="rotate(35 ${num(x)} ${height - m.b + 18})" text-anchor="start" font-size="${svgFontSize(0.75)}" fill="${escXml(muted)}">${escXml(label)}</text>`);
        else text(x, height - m.b + 24, label, `text-anchor="middle" font-size="${svgFontSize(0.75)}" fill="${escXml(muted)}"`);
      });
    };
    const legend = (labels) => {
      if (!labels || !labels.length) return;
      let x = ((w.type === 'scatter' || w.type === 'line') && w.color) ? width - m.r + 18 : width - 192, y = m.t + 6;
      labels.slice(0, 12).forEach((lab, i) => {
        rect(x, y + i*18 - 8, 11, 11, colorFor(w, lab), 'rx="2"');
        text(x + 16, y + i*18 + 1, short(lab, 18), `font-size="${svgFontSize(0.75)}" fill="${escXml(muted)}"`);
      });
    };
    try {
      if (w.type === 'scatter') {
        const pts = rows.map(r => ({x:Number(r[w.x]), y:Number(r[w.y]), g:r[w.color]})).filter(d => Number.isFinite(d.x) && Number.isFinite(d.y));
        if (!pts.length) throw new Error('Scatter needs numeric x and y fields');
        frame(w.x, w.y);
        const xd = padDomain([Math.min(...pts.map(d=>d.x)), Math.max(...pts.map(d=>d.x))]);
        const yd = padDomain([Math.min(...pts.map(d=>d.y)), Math.max(...pts.map(d=>d.y))]);
        const x = lin(xd, [m.l, width-m.r]); const y = yAxis(yd); xAxis(xd, x);
        pts.forEach(d => circle(x(d.x), y(d.y), 4.2, colorFor(w, d.g), 'opacity="0.84"'));
        if (w.color) legend(Array.from(new Set(pts.map(d => String(d.g ?? '')))));
      } else if (w.type === 'line') {
        const pts = rows.map(r => ({x:r[w.x], y:Number(r[w.y]), g:r[w.color] ?? ''})).filter(d => Number.isFinite(d.y));
        if (!pts.length) throw new Error('Line plot needs a numeric y field');
        frame(w.x, w.y);
        const xNumeric = pts.every(d => Number.isFinite(Number(d.x)));
        const cats = Array.from(new Set(pts.map(d => String(d.x))));
        let x, xd, xb;
        if (xNumeric) { xd = padDomain([Math.min(...pts.map(d=>Number(d.x))), Math.max(...pts.map(d=>Number(d.x)))]); x = lin(xd, [m.l, width-m.r]); xAxis(xd, x); }
        else { xb = bandSvg(cats, [m.l, width-m.r], 0.2); x = v => xb.pos(String(v)) + xb.bandwidth/2; catAxis(cats, xb.pos, xb.bandwidth); }
        const y = yAxis(padDomain([Math.min(...pts.map(d=>d.y)), Math.max(...pts.map(d=>d.y))]));
        const groups = groupBy(pts, d => String(d.g));
        Object.entries(groups).forEach(([g, arr]) => {
          arr.sort((a,b) => xNumeric ? Number(a.x)-Number(b.x) : cats.indexOf(String(a.x))-cats.indexOf(String(b.x)));
          const d = arr.map((p,i) => `${i?'L':'M'} ${num(x(p.x))} ${num(y(p.y))}`).join(' ');
          add(`<path d="${d}" fill="none" stroke="${escXml(colorFor(w,g))}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`);
        });
        if (w.color) legend(Object.keys(groups));
      } else if (w.type === 'bar') {
        const arr = sortBarRows(aggregateRows(rows, w.x, w.y, w.aggregate || (w.y ? 'mean' : 'count'), 'value'), w);
        if (!arr.length) throw new Error('No groups to display');
        frame(w.x, w.y || 'count');
        const cats = arr.map(d => String(d[w.x]));
        const x = bandSvg(cats, [m.l, width-m.r], 0.16);
        const y = yAxis([0, Math.max(1, ...arr.map(d => Number(d.value) || 0)) * 1.08]);
        arr.forEach(d => {
          const xx=x.pos(String(d[w.x])); const yy=y(Number(d.value)||0); const hh=height-m.b-yy;
          add(`<rect x="${num(xx)}" y="${num(yy)}" width="${num(x.bandwidth)}" height="${num(hh)}" fill="${escXml(barColorFor(w, d[w.x]))}" rx="5"><title>${escXml(String(d[w.x]) + ': ' + fmt(d.value))}</title></rect>`);
        });
        catAxis(cats, x.pos, x.bandwidth);
      } else if (w.type === 'histogram') {
        const vals = rows.map(r => Number(r[w.x || w.field])).filter(Number.isFinite);
        if (!vals.length) throw new Error('Histogram needs a numeric field');
        const min = Math.min(...vals), max = Math.max(...vals);
        const bins = Math.max(2, Math.min(120, Number(w.bins || 20)));
        const step = (max - min || 1) / bins;
        const counts = Array.from({length: bins}, (_, i) => ({x:min+i*step, n:0}));
        vals.forEach(v => counts[Math.min(bins-1, Math.floor((v-min)/step))].n++);
        frame(w.x || w.field, 'count');
        const xd = [min, max || min+1]; const x = lin(xd, [m.l, width-m.r]); xAxis(xd, x);
        const y = yAxis([0, Math.max(1, ...counts.map(d=>d.n))*1.08]);
        counts.forEach(bn => { const xx=x(bn.x); const bw=Math.max(1, x(bn.x+step)-xx); const yy=y(bn.n); rect(xx, yy, bw, height-m.b-yy, getAccent(), 'opacity="0.86"'); });
      } else if (w.type === 'boxplot') {
        const groups = groupBy(rows, r => String(r[w.x] ?? ''));
        const arr = Object.entries(groups).map(([g,rs]) => ({g, vals:rs.map(r=>Number(r[w.y])).filter(Number.isFinite)})).filter(d=>d.vals.length);
        if (!arr.length) throw new Error('Box plot needs a group and numeric y');
        const all = arr.flatMap(d=>d.vals);
        frame(w.x, w.y);
        const y = yAxis(padDomain([Math.min(...all), Math.max(...all)]));
        const x = bandSvg(arr.map(d=>d.g), [m.l, width-m.r], 0.35);
        arr.forEach(d => {
          const qs=[0,.25,.5,.75,1].map(p=>quantile(d.vals,p));
          const cx=x.pos(d.g)+x.bandwidth/2, bw=x.bandwidth*.72;
          line(cx, y(qs[0]), cx, y(qs[4]), colorFor(w,d.g), 1.4);
          rect(cx-bw/2, y(qs[3]), bw, Math.max(2, y(qs[1])-y(qs[3])), colorWithAlpha(colorFor(w,d.g), .18), `stroke="${escXml(colorFor(w,d.g))}" stroke-width="1.4"`);
          line(cx-bw/2, y(qs[2]), cx+bw/2, y(qs[2]), colorFor(w,d.g), 2);
          line(cx-bw/4, y(qs[0]), cx+bw/4, y(qs[0]), colorFor(w,d.g), 1.4);
          line(cx-bw/4, y(qs[4]), cx+bw/4, y(qs[4]), colorFor(w,d.g), 1.4);
        });
        catAxis(arr.map(d=>d.g), x.pos, x.bandwidth);
      } else if (w.type === 'heatmap') {
        const vals = new Map();
        rows.forEach(r => { const k = `${r[w.x]}\u0000${r[w.y]}`; vals.set(k, (vals.get(k)||0)+1); });
        const maxv = Math.max(1, ...vals.values());
        const xs = Array.from(new Set(rows.map(r=>String(r[w.x])))); const ys = Array.from(new Set(rows.map(r=>String(r[w.y]))));
        frame(w.x, w.y);
        const xb = bandSvg(xs, [m.l, width-m.r], 0.04), yb = bandSvg(ys, [m.t, height-m.b], 0.04);
        xs.forEach(xv => ys.forEach(yv => { const v=vals.get(`${xv}\u0000${yv}`)||0; rect(xb.pos(xv), yb.pos(yv), xb.bandwidth, yb.bandwidth, colorWithAlpha(getAccent(), 0.08+0.84*v/maxv)); }));
        catAxis(xs, xb.pos, xb.bandwidth); ys.forEach(yv => text(m.l-10, yb.pos(yv)+yb.bandwidth/2+4, short(yv), `text-anchor="end" font-size="${svgFontSize(0.75)}" fill="${escXml(muted)}"`));
      } else if (w.type === 'pie') {
        const arr = aggregateRows(rows, w.x, w.y, w.aggregate || (w.y ? 'sum' : 'count'), 'value').filter(d => Number(d.value) > 0);
        if (!arr.length) throw new Error('No slices to display');
        const total = arr.reduce((a,b) => a + Number(b.value), 0);
        const cx = width*0.42, cy = height*0.52, r = Math.min(innerW, innerH)*0.36;
        let a = -Math.PI/2;
        arr.forEach(d => { const da = Number(d.value)/total*Math.PI*2; add(`<path d="${piePath(cx, cy, r, a, a+da)}" fill="${escXml(colorFor(w,d[w.x]))}"/>`); a += da; });
        legend(arr.map(d => String(d[w.x])));
      }
    } catch (e) {
      add(`<text x="${width/2}" y="${height/2}" text-anchor="middle" fill="${escXml(muted)}">${escXml(e.message || String(e))}</text>`);
    }
    return svgWrap(width, height, pieces.join(''));
  }

  function svgWrap(width, height, body) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><style>text{font-family:${escXml(dashboardFontFamily())}}</style>${body}</svg>`;
  }
  function bandSvg(values, range, padding) {
    const n = Math.max(1, values.length);
    const step = (range[1] - range[0]) / n;
    const bw = step * (1 - padding * 2);
    return { pos: v => range[0] + values.indexOf(String(v)) * step + step * padding, bandwidth: bw };
  }
  function piePath(cx, cy, r, a0, a1) {
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    return `M ${num(cx)} ${num(cy)} L ${num(x0)} ${num(y0)} A ${num(r)} ${num(r)} 0 ${large} 1 ${num(x1)} ${num(y1)} Z`;
  }
  function cssVar(name, fallback) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback; }
  function num(x) { const n = Number(x); return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0; }

  function svgFromCanvas(canvas, title) {
    const w = canvas ? canvas.width / (window.devicePixelRatio || 1) : 800;
    const h = canvas ? canvas.height / (window.devicePixelRatio || 1) : 500;
    const img = canvas ? canvas.toDataURL('image/png') : '';
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>${escXml(title || 'BlinkDash plot')}</title><image href="${img}" width="${w}" height="${h}"/></svg>`;
  }
  function svgFromImage(src, title) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700"><title>${escXml(title || 'BlinkDash plot')}</title><image href="${src}" width="1000" height="700" preserveAspectRatio="xMidYMid meet"/></svg>`;
  }
  function escXml(x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function openNativePlotFullScreen(w) {
    const modal = document.createElement('div');
    modal.className = 'bd-plot-modal';
    modal.innerHTML = `<div class="bd-plot-modal-card"><button class="bd-plot-close">×</button><h2>${esc(w.title || w.id || 'Plot')}</h2><div class="bd-chart-wrap"><canvas class="bd-chart"></canvas></div></div>`;
    document.body.appendChild(modal);
    const canvas = modal.querySelector('canvas');
    requestAnimationFrame(() => drawPlot(w, canvas, rowsForOutput(w)));
    attachChartHover(canvas, w);
    modal.querySelector('.bd-plot-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', ev => { if (ev.target === modal) modal.remove(); });
  }
  function openHtmlFullScreen(html, title) {
    const modal = document.createElement('div');
    modal.className = 'bd-plot-modal';
    modal.innerHTML = `<div class="bd-plot-modal-card"><button class="bd-plot-close">×</button><h2>${esc(title || 'Plot')}</h2><div class="bd-full-html">${html}</div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.bd-plot-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', ev => { if (ev.target === modal) modal.remove(); });
  }
  function downloadPlotPng(container, filename) {
    const svg = container.querySelector('svg');
    const img = container.querySelector('img');
    if (img && img.src && !svg) { const a = document.createElement('a'); a.href = img.src; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); return; }
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    const blob = new Blob([text], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    image.onload = () => { const c = document.createElement('canvas'); c.width = image.naturalWidth || 1200; c.height = image.naturalHeight || 800; c.getContext('2d').drawImage(image, 0, 0); downloadCanvasPng(c, filename); URL.revokeObjectURL(url); };
    image.src = url;
  }

  function markdown(md) {
    let src = String(md || '').replace(/\r\n/g, '\n');
    const blocks = [];
    const hold = html => {
      const token = `§§BD_BLOCK_${blocks.length}§§`;
      blocks.push(html);
      return token;
    };

    src = src.replace(/```([A-Za-z0-9_-]*)[ \t]*\n([\s\S]*?)```/g, (_, rawLang, code) => {
      const lang = String(rawLang || '').toLowerCase();
      if (lang === 'math') return hold(`<div class="bd-math-block">\\[${esc(code.trim())}\\]</div>`);
      if (lang === 'mermaid') return hold(`<div class="bd-diagram bd-mermaid">${esc(code.trim())}</div>`);
      if (lang === 'geojson') return hold(renderGeoJsonBlock(code, 'GeoJSON map'));
      if (lang === 'topojson') return hold(renderTopoJsonBlock(code));
      if (lang === 'stl') return hold(renderStlBlock(code));
      return hold(`<pre class="bd-code-block"><code class="language-${esc(lang || 'text')}">${highlightCode(code, lang)}</code></pre>`);
    });

    src = src.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => hold(`<div class="bd-math-block">\\[${esc(tex.trim())}\\]</div>`));

    let s = esc(src);
    s = s.replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\$`([^`]+?)`\$/g, '<span class="bd-math-inline">\\($1\\)</span>')
      .replace(/(^|[^\\])\$([^\s$][^$\n]*?[^\s$])\$/g, '$1<span class="bd-math-inline">\\($2\\)</span>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

    let html = s.split(/\n{2,}/).map(block => /^<h\d|^§§BD_BLOCK_/.test(block) ? block : `<p>${block.replace(/\n/g, '<br>')}</p>`).join('');
    blocks.forEach((block, i) => { html = html.replace(`§§BD_BLOCK_${i}§§`, block); });
    return html;
  }

  function highlightCode(code, lang) {
    const l = String(lang || '').toLowerCase();
    if (['r', 's', 'rscript'].includes(l)) return highlightR(code);
    if (['json', 'geojson', 'topojson'].includes(l)) return highlightJson(code);
    if (['html', 'xml', 'svg'].includes(l)) return highlightHtml(code);
    if (['js', 'javascript', 'ts', 'typescript'].includes(l)) return highlightJs(code);
    if (['css', 'scss'].includes(l)) return highlightCss(code);
    if (['yml', 'yaml'].includes(l)) return highlightYaml(code);
    return esc(code || '');
  }

  function highlightR(code) {
    let e = esc(code || '');
    e = e.replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>');
    e = e.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-str">$1</span>');
    e = e.replace(/\b(function|if|else|for|while|repeat|return|in|TRUE|FALSE|NULL|NA|NaN|Inf|data\.frame|list|mean|sum|min|max|median|library|require|print|summary|head|tail)\b/g, '<span class="tok-keyword">$1</span>');
    e = e.replace(/\b(bd_data|bd_state|bd_params|bd_meta|bd_manifest)\b/g, '<span class="tok-special">$1</span>');
    return e;
  }

  function highlightJson(code) {
    let e = esc(code || '');
    e = e.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="tok-key">$1</span>$2');
    e = e.replace(/(:\s*)(&quot;[^&]*?&quot;)/g, '$1<span class="tok-str">$2</span>');
    e = e.replace(/\b(true|false|null)\b/g, '<span class="tok-bool">$1</span>');
    e = e.replace(/(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi, '<span class="tok-num">$1</span>');
    return e;
  }

  function highlightHtml(code) {
    let e = esc(code || '');
    e = e.replace(/(&lt;\/?)([A-Za-z0-9-]+)/g, '$1<span class="tok-keyword">$2</span>');
    e = e.replace(/([A-Za-z_:.-]+)=(&quot;.*?&quot;)/g, '<span class="tok-key">$1</span>=<span class="tok-str">$2</span>');
    return e;
  }

  function highlightJs(code) {
    let e = esc(code || '');
    e = e.replace(/(\/\/.*)$/gm, '<span class="tok-comment">$1</span>');
    e = e.replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, '<span class="tok-str">$1</span>');
    e = e.replace(/\b(const|let|var|function|return|if|else|for|while|class|new|await|async|import|export|from|true|false|null|undefined)\b/g, '<span class="tok-keyword">$1</span>');
    return e;
  }

  function highlightCss(code) {
    let e = esc(code || '');
    e = e.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
    e = e.replace(/([A-Za-z-]+)(\s*:)/g, '<span class="tok-key">$1</span>$2');
    e = e.replace(/(#(?:[0-9a-f]{3}){1,2}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%)?\b)/gi, '<span class="tok-num">$1</span>');
    return e;
  }

  function highlightYaml(code) {
    let e = esc(code || '');
    e = e.replace(/^([ \t-]*)([A-Za-z0-9_.-]+):(.*)$/gm, (_, a, k, rest) => `${a}<span class="tok-key">${k}</span>:<span class="tok-val">${rest}</span>`);
    e = e.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-str">$1</span>');
    e = e.replace(/\b(TRUE|FALSE|true|false|null|NA)\b/g, '<span class="tok-bool">$1</span>');
    return e;
  }

  function enhanceMarkdown(scope) {
    if (!scope) return;
    if (scope.querySelector('.bd-math-inline, .bd-math-block')) ensureMathJax(() => {
      if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([scope]).catch(() => {});
    });
    const mermaidNodes = Array.from(scope.querySelectorAll('.bd-mermaid:not([data-processed])'));
    if (mermaidNodes.length) ensureMermaid(() => {
      try {
        window.mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default' });
        window.mermaid.run({ nodes: mermaidNodes }).catch(() => mermaidNodes.forEach(n => n.classList.add('bd-diagram-error')));
      } catch (_) { mermaidNodes.forEach(n => n.classList.add('bd-diagram-error')); }
    });
  }

  function ensureMathJax(done) {
    if (window.MathJax && window.MathJax.typesetPromise) { done(); return; }
    window.MathJax = window.MathJax || { tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] }, svg: { fontCache: 'global' } };
    ensureScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js', 'bd-mathjax-script', done);
  }

  function ensureMermaid(done) {
    if (window.mermaid) { done(); return; }
    ensureScript('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js', 'bd-mermaid-script', done);
  }

  function ensureScript(src, id, done) {
    const existing = document.getElementById(id);
    if (existing) { existing.addEventListener('load', done, { once: true }); if (existing.dataset.loaded === '1') done(); return; }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => { script.dataset.loaded = '1'; done(); });
    script.addEventListener('error', () => {});
    document.head.appendChild(script);
  }

  function renderGeoJsonBlock(code, title = 'GeoJSON map') {
    try {
      const parsed = JSON.parse(code);
      const geoms = geoJsonGeometries(parsed);
      if (!geoms.length) throw new Error('No supported geometries');
      return renderGeoSvg(geoms, title);
    } catch (_) {
      return diagramSourceFallback('geojson', code, title);
    }
  }

  function renderTopoJsonBlock(code) {
    try {
      const parsed = JSON.parse(code);
      const geoms = topoToGeometries(parsed);
      if (!geoms.length) throw new Error('No supported geometries');
      return renderGeoSvg(geoms, 'TopoJSON map');
    } catch (_) {
      return diagramSourceFallback('topojson', code, 'TopoJSON map');
    }
  }

  function geoJsonGeometries(obj) {
    const out = [];
    const visit = item => {
      if (!item) return;
      if (item.type === 'FeatureCollection') (item.features || []).forEach(visit);
      else if (item.type === 'Feature') visit(item.geometry);
      else if (item.type === 'GeometryCollection') (item.geometries || []).forEach(visit);
      else if (item.type) out.push(item);
    };
    visit(obj);
    return out;
  }

  function topoToGeometries(topology) {
    if (!topology || topology.type !== 'Topology') return [];
    const transform = topology.transform || null;
    const decodeArc = idx => {
      let arc = topology.arcs && topology.arcs[idx < 0 ? ~idx : idx];
      if (!Array.isArray(arc)) return [];
      let x = 0, y = 0;
      const pts = arc.map(p => {
        x += Number(p[0] || 0); y += Number(p[1] || 0);
        return transform ? [x * transform.scale[0] + transform.translate[0], y * transform.scale[1] + transform.translate[1]] : [x, y];
      });
      return idx < 0 ? pts.reverse() : pts;
    };
    const stitch = arcs => (arcs || []).flatMap((idx, i) => {
      const pts = decodeArc(idx);
      return i ? pts.slice(1) : pts;
    });
    const convert = geom => {
      if (!geom) return null;
      if (geom.type === 'GeometryCollection') return { type: 'GeometryCollection', geometries: (geom.geometries || []).map(convert).filter(Boolean) };
      if (geom.type === 'Point') return { type: 'Point', coordinates: transform ? [geom.coordinates[0] * transform.scale[0] + transform.translate[0], geom.coordinates[1] * transform.scale[1] + transform.translate[1]] : geom.coordinates };
      if (geom.type === 'MultiPoint') return { type: 'MultiPoint', coordinates: (geom.coordinates || []).map(p => transform ? [p[0] * transform.scale[0] + transform.translate[0], p[1] * transform.scale[1] + transform.translate[1]] : p) };
      if (geom.type === 'LineString') return { type: 'LineString', coordinates: stitch(geom.arcs) };
      if (geom.type === 'MultiLineString') return { type: 'MultiLineString', coordinates: (geom.arcs || []).map(stitch) };
      if (geom.type === 'Polygon') return { type: 'Polygon', coordinates: (geom.arcs || []).map(stitch) };
      if (geom.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: (geom.arcs || []).map(poly => poly.map(stitch)) };
      return null;
    };
    return Object.values(topology.objects || {}).map(convert).filter(Boolean).flatMap(geoJsonGeometries);
  }

  function collectGeoPoints(geom, pts = []) {
    if (!geom) return pts;
    const coords = geom.coordinates;
    const rec = x => {
      if (Array.isArray(x) && typeof x[0] === 'number' && typeof x[1] === 'number') pts.push(x);
      else if (Array.isArray(x)) x.forEach(rec);
    };
    if (geom.type === 'GeometryCollection') (geom.geometries || []).forEach(g => collectGeoPoints(g, pts));
    else rec(coords);
    return pts;
  }

  function renderGeoSvg(geoms, title) {
    const pts = geoms.flatMap(g => collectGeoPoints(g, []));
    if (!pts.length) return diagramSourceFallback('json', JSON.stringify(geoms, null, 2), title);
    const xs = pts.map(p => Number(p[0])).filter(Number.isFinite);
    const ys = pts.map(p => Number(p[1])).filter(Number.isFinite);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = 640, h = 360, pad = 26;
    const sx = (w - pad * 2) / (maxX - minX || 1);
    const sy = (h - pad * 2) / (maxY - minY || 1);
    const scale = Math.min(sx, sy);
    const dx = (w - (maxX - minX) * scale) / 2;
    const dy = (h - (maxY - minY) * scale) / 2;
    const project = p => [dx + (Number(p[0]) - minX) * scale, h - (dy + (Number(p[1]) - minY) * scale)];
    const pathLine = arr => (arr || []).map((p, i) => {
      const q = project(p);
      return `${i ? 'L' : 'M'}${num(q[0])},${num(q[1])}`;
    }).join(' ');
    const drawGeom = g => {
      if (!g) return '';
      if (g.type === 'Point') { const p = project(g.coordinates); return `<circle cx="${num(p[0])}" cy="${num(p[1])}" r="4.5" class="bd-map-point"/>`; }
      if (g.type === 'MultiPoint') return (g.coordinates || []).map(p => drawGeom({ type: 'Point', coordinates: p })).join('');
      if (g.type === 'LineString') return `<path d="${pathLine(g.coordinates)}" class="bd-map-line"/>`;
      if (g.type === 'MultiLineString') return (g.coordinates || []).map(line => drawGeom({ type: 'LineString', coordinates: line })).join('');
      if (g.type === 'Polygon') return (g.coordinates || []).map((ring, i) => `<path d="${pathLine(ring)} Z" class="${i ? 'bd-map-hole' : 'bd-map-poly'}"/>`).join('');
      if (g.type === 'MultiPolygon') return (g.coordinates || []).map(poly => drawGeom({ type: 'Polygon', coordinates: poly })).join('');
      if (g.type === 'GeometryCollection') return (g.geometries || []).map(drawGeom).join('');
      return '';
    };
    return `<figure class="bd-diagram bd-map-diagram"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><rect width="${w}" height="${h}" rx="18" class="bd-map-bg"/>${geoms.map(drawGeom).join('')}</svg><figcaption>${esc(title)}</figcaption></figure>`;
  }

  function renderStlBlock(code) {
    try {
      const vertices = [];
      String(code || '').split(/\n/).forEach(line => {
        const m = line.trim().match(/^vertex\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)/i);
        if (m) vertices.push([Number(m[1]), Number(m[2]), Number(m[3])]);
      });
      if (vertices.length < 3) throw new Error('No vertices');
      const projected = vertices.map(p => [p[0] - p[1] * 0.55, p[2] + (p[0] + p[1]) * 0.25]);
      const xs = projected.map(p => p[0]), ys = projected.map(p => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const w = 640, h = 360, pad = 32;
      const scale = Math.min((w - pad * 2) / (maxX - minX || 1), (h - pad * 2) / (maxY - minY || 1));
      const proj = p => [pad + (p[0] - minX) * scale, h - pad - (p[1] - minY) * scale];
      let parts = `<rect width="${w}" height="${h}" rx="18" class="bd-stl-bg"/>`;
      for (let i = 0; i + 2 < projected.length; i += 3) {
        const tri = [proj(projected[i]), proj(projected[i + 1]), proj(projected[i + 2])];
        parts += `<polygon points="${tri.map(p => `${num(p[0])},${num(p[1])}`).join(' ')}" class="bd-stl-face"/>`;
      }
      return `<figure class="bd-diagram bd-stl-diagram"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="STL model preview">${parts}</svg><figcaption>STL model preview</figcaption></figure>`;
    } catch (_) {
      return diagramSourceFallback('stl', code, 'STL model');
    }
  }

  function diagramSourceFallback(lang, code, title) {
    return `<figure class="bd-diagram bd-diagram-source"><figcaption>${esc(title || lang)}</figcaption><pre class="bd-code-block"><code class="language-${esc(lang)}">${highlightCode(code, lang)}</code></pre></figure>`;
  }


  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  if (!root) return;
  init();
})();
