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
    graphite: { accent: '#60a5fa', accent2: '#22d3ee', bg: '#0b1220', panel: '#0f172a', ink: '#e5edf9', muted: '#94a3b8', line: '#263347', dark: true },
    midnight: { accent: '#a78bfa', accent2: '#34d399', bg: '#09090f', panel: '#141420', ink: '#f5f3ff', muted: '#a1a1aa', line: '#2e2e42', dark: true },
    forest: { accent: '#34d399', accent2: '#fbbf24', bg: '#07130f', panel: '#091d17', ink: '#ecfdf5', muted: '#a7f3d0', line: '#1f4b3f', dark: true }
  };
  const fonts = {
    Inter: { css: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;650;800;900&display=swap', family: 'Inter, system-ui, sans-serif' },
    'Source Sans 3': { css: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;800;900&display=swap', family: '"Source Sans 3", system-ui, sans-serif' },
    'Plus Jakarta Sans': { css: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap', family: '"Plus Jakarta Sans", system-ui, sans-serif' },
    'Space Grotesk': { css: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;800&display=swap', family: '"Space Grotesk", system-ui, sans-serif' },
    'JetBrains Mono': { css: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&display=swap', family: '"JetBrains Mono", ui-monospace, Consolas, monospace' },
    System: { css: '', family: 'system-ui, -apple-system, "Segoe UI", sans-serif' }
  };
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

  function usesFlowLayout() {
    return graphNodes().length && widgets().some(w => graphNodeFor(w.id));
  }

  function flowHeight() {
    const bottom = graphNodes().reduce((mx, n) => Math.max(mx, Number(n.position && n.position.y || 0) + Number(n.size && n.size.height || 140)), 0);
    return Math.max(640, bottom + 70);
  }

  function layoutStyle(w) {
    const gn = graphNodeFor(w.id);
    const saved = savedCardPosition(w.id);
    if (saved) return `left: ${saved.x}px; top: ${saved.y}px; width: ${saved.width}px; min-height: ${saved.height}px;`;
    if (gn && gn.position && gn.size) {
      const x = Number(gn.position.x || 0);
      const y = Number(gn.position.y || 0);
      const ww = Math.max(160, Number(gn.size.width || 320));
      const hh = Math.max(80, Number(gn.size.height || 160));
      return `left: ${x}px; top: ${y}px; width: ${ww}px; min-height: ${hh}px;`;
    }
    const l = w.layout || {};
    const x = Math.max(1, Math.min(12, Number(l.x || 1)));
    const ww = Math.max(1, Math.min(12, Number(l.w || 4)));
    const h = Math.max(1, Number(l.h || (inputTypes.has(w.type) ? 1 : 3)));
    return `grid-column: ${x} / span ${ww}; grid-row: span ${h}; min-height: ${Math.max(92, h * 86)}px;`;
  }

  function savedCardPosition(id) {
    try {
      const raw = localStorage.getItem('blinkdash-card-pos-' + (app.title || 'dashboard') + '-' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function saveCardPosition(id, pos) {
    try { localStorage.setItem('blinkdash-card-pos-' + (app.title || 'dashboard') + '-' + id, JSON.stringify(pos)); } catch (_) {}
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
      else if (w.type === 'toggle') state[w.id] = Boolean(w.default);
      else if (w.type === 'button') state[w.id] = 0;
      else state[w.id] = w.default ?? '';
    });
  }

  function renderShell() {
    const ex = app.export || {};
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
      <section class="${usesFlowLayout() ? 'bd-flow' : 'bd-grid'}" ${usesFlowLayout() ? `style="height: ${flowHeight()}px"` : ''}>
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

  function cardHead(w) {
    const title = w.title || w.label || w.id || w.type;
    if (inputTypes.has(w.type)) return '';
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
      const min = Number(w.min ?? minFor(w));
      const max = Number(w.max ?? maxFor(w));
      const step = Number(w.step || 1);
      const val = Array.isArray(state[w.id]) ? state[w.id].map(Number) : [min, max];
      body.innerHTML = `<div class="bd-control"><span class="bd-label">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${val[0]}"><input type="range" min="${min}" max="${max}" step="${step}" value="${val[1]}"><div class="bd-range-values"><span></span><span></span></div></div>`;
      const inputs = body.querySelectorAll('input');
      const spans = body.querySelectorAll('.bd-range-values span');
      const sync = () => {
        let a = Number(inputs[0].value), b = Number(inputs[1].value);
        if (a > b) [a, b] = [b, a];
        state[w.id] = [a, b];
        spans[0].textContent = fmt(a);
        spans[1].textContent = fmt(b);
        renderOutputs();
      };
      inputs.forEach(inp => inp.addEventListener('input', sync));
      sync();
      return;
    }
    if (w.type === 'slider') {
      const min = Number(w.min ?? minFor(w));
      const max = Number(w.max ?? maxFor(w));
      const step = Number(w.step || 1);
      body.innerHTML = `<div class="bd-control"><span class="bd-label">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${esc(state[w.id])}"><div class="bd-range-values"><span>${fmt(min)}</span><span data-value>${fmt(state[w.id])}</span><span>${fmt(max)}</span></div></div>`;
      const inp = body.querySelector('input');
      inp.addEventListener('input', () => {
        state[w.id] = Number(inp.value);
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
    if (w.type === 'number' || w.type === 'date') {
      body.innerHTML = `<label class="bd-control"><span class="bd-label">${label}</span><input type="${w.type}" value="${esc(state[w.id])}"></label>`;
      const inp = body.querySelector('input');
      inp.addEventListener('input', () => { state[w.id] = w.type === 'number' ? Number(inp.value) : inp.value; renderOutputs(); });
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
    body.innerHTML = `<div class="bd-metric"><div class="bd-metric-value">${esc(shown)}${esc(w.suffix || '')}</div><div class="bd-metric-label">${esc(w.label || w.title || '')}</div></div>`;
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
      <div class="bd-table-tools">
        <input type="search" placeholder="Search table" value="${esc(st.search)}">
        <span class="bd-card-subtitle">${data.length.toLocaleString()} rows · page ${st.page} of ${pages}</span>
        <span><button class="bd-button secondary" data-page="prev">Prev</button> <button class="bd-button secondary" data-page="next">Next</button></span>
      </div>
      <div class="bd-table-wrap">
        <table class="bd-table">
          <thead><tr>${columns.map(c => `<th data-sort="${esc(c)}">${esc(c)}${st.sort === c ? (st.dir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('')}</tr></thead>
          <tbody>${view.map(r => `<tr>${columns.map(c => `<td>${esc(r[c])}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    `;
    body.querySelector('input').addEventListener('input', debounce(e => { st.search = e.target.value; st.page = 1; renderTable(w, body); }, 100));
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
    if (preferred === 'markdown') { body.innerHTML = `<div class="bd-markdown">${markdown(res.markdown || res.text || res.html || '')}</div>`; return true; }
    if (preferred === 'table') { body.innerHTML = Array.isArray(res.rows) ? tableHtml(res.rows) : `<div class="bd-empty">The upstream webR result is not table-like.</div>`; return true; }
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

  function tableHtml(rows) {
    rows = Array.isArray(rows) ? rows : [];
    const cols = Array.from(new Set(rows.slice(0, 30).flatMap(r => Object.keys(r || {}))));
    return `<div class="bd-table-wrap"><table class="bd-table"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0, 50).map(r => `<tr>${cols.map(c => `<td>${esc(r[c])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function renderPlot(w, body) {
    body.innerHTML = `<div class="bd-chart-tools"><button class="bd-button secondary" data-chart-full="1">Full screen</button><button class="bd-button secondary" data-chart-svg="1">SVG</button><button class="bd-button secondary" data-chart-png="1">PNG</button></div><div class="bd-chart-wrap"><canvas class="bd-chart"></canvas></div>`;
    const canvas = body.querySelector('canvas');
    requestAnimationFrame(() => drawPlot(w, canvas, rowsForOutput(w)));
    body.querySelector('[data-chart-full]').addEventListener('click', () => openNativePlotFullScreen(w));
    body.querySelector('[data-chart-png]').addEventListener('click', () => downloadCanvasPng(canvas, safeFile(w.title || w.id || 'plot') + '.png'));
    body.querySelector('[data-chart-svg]').addEventListener('click', () => downloadText(nativePlotSvg(w, rowsForOutput(w), w.title || w.id || 'plot'), safeFile(w.title || w.id || 'plot') + '.svg', 'image/svg+xml'));
  }

  function canvasContext(canvas) {
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
    ctx.font = '12px Inter, system-ui, sans-serif';
    return { ctx, width, height, m: { l: 54, r: 22, t: 20, b: 52 } };
  }

  function drawPlot(w, canvas, rows) {
    const c = canvasContext(canvas);
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
    const arr = aggregateRows(rows, w.x, w.y, w.aggregate || (w.y ? 'mean' : 'count'), 'value');
    if (!arr.length) return emptyChart(c, 'No groups to display');
    const { ctx, width, height, m } = c;
    drawFrame(c, w.x, w.y || 'count');
    const cats = arr.map(d => String(d[w.x]));
    const x = band(cats, [m.l, width - m.r], 0.16);
    const max = Math.max(1, ...arr.map(d => Number(d.value) || 0));
    const y = drawYAxis(c, [0, max * 1.08]);
    arr.forEach(d => {
      const xx = x.pos(String(d[w.x]));
      const yy = y(Number(d.value) || 0);
      ctx.fillStyle = colorFor(w, d[w.x]);
      roundRect(ctx, xx, yy, x.bandwidth, height - m.b - yy, 7);
      ctx.fill();
    });
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
    const { ctx, width } = c;
    if (!labels || !labels.length) return;
    let x = width - 128, y = 18;
    ctx.textAlign = 'left';
    ctx.font = '11px Inter, system-ui, sans-serif';
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
    const m = { l: 82, r: 44, t: 42, b: 84 };
    const ink = cssVar('--bd-text', '#0f172a');
    const muted = cssVar('--bd-muted', '#64748b');
    const grid = cssVar('--bd-border', '#e2e8f0');
    const bg = cssVar('--bd-card', '#ffffff');
    const pieces = [];
    const add = x => pieces.push(x);
    const innerW = width - m.l - m.r;
    const innerH = height - m.t - m.b;
    add(`<rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="${escXml(bg)}"/>`);
    add(`<text x="${m.l}" y="24" font-size="16" font-weight="700" fill="${escXml(ink)}">${escXml(title || w.title || w.id || 'Plot')}</text>`);
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
      if (xlab) text((m.l + width - m.r)/2, height - 18, xlab, `text-anchor="middle" font-size="13" fill="${escXml(muted)}"`);
      if (ylab) add(`<text transform="translate(22 ${(m.t + height - m.b)/2}) rotate(-90)" text-anchor="middle" font-size="13" fill="${escXml(muted)}">${escXml(ylab)}</text>`);
    };
    const yAxis = (domain) => {
      const scale = lin(domain, [height - m.b, m.t]);
      for (let i = 0; i <= 4; i++) {
        const v = domain[0] + (domain[1] - domain[0]) * i / 4;
        const y = scale(v);
        line(m.l, y, width - m.r, y, grid, 0.65);
        text(m.l - 10, y + 4, fmt(v), `text-anchor="end" font-size="12" fill="${escXml(muted)}"`);
      }
      return scale;
    };
    const xAxis = (domain, scale) => {
      for (let i = 0; i <= 4; i++) {
        const v = domain[0] + (domain[1] - domain[0]) * i / 4;
        const x = scale(v);
        line(x, height - m.b, x, height - m.b + 6, grid, 1);
        text(x, height - m.b + 24, fmt(v), `text-anchor="middle" font-size="12" fill="${escXml(muted)}"`);
      }
    };
    const catAxis = (cats, pos, bw) => {
      const rotate = cats.length > 9;
      cats.forEach(cat => {
        const x = pos(String(cat)) + bw / 2;
        const label = short(cat, rotate ? 11 : 15);
        if (rotate) add(`<text x="${num(x)}" y="${height - m.b + 18}" transform="rotate(35 ${num(x)} ${height - m.b + 18})" text-anchor="start" font-size="12" fill="${escXml(muted)}">${escXml(label)}</text>`);
        else text(x, height - m.b + 24, label, `text-anchor="middle" font-size="12" fill="${escXml(muted)}"`);
      });
    };
    const legend = (labels) => {
      if (!labels || !labels.length) return;
      let x = width - m.r - 148, y = m.t + 6;
      labels.slice(0, 12).forEach((lab, i) => {
        rect(x, y + i*18 - 8, 11, 11, colorFor(w, lab), 'rx="2"');
        text(x + 16, y + i*18 + 1, short(lab, 18), `font-size="12" fill="${escXml(muted)}"`);
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
        const arr = aggregateRows(rows, w.x, w.y, w.aggregate || (w.y ? 'mean' : 'count'), 'value');
        if (!arr.length) throw new Error('No groups to display');
        frame(w.x, w.y || 'count');
        const cats = arr.map(d => String(d[w.x]));
        const x = bandSvg(cats, [m.l, width-m.r], 0.16);
        const y = yAxis([0, Math.max(1, ...arr.map(d => Number(d.value) || 0)) * 1.08]);
        arr.forEach(d => { const xx=x.pos(String(d[w.x])); const yy=y(Number(d.value)||0); rect(xx, yy, x.bandwidth, height-m.b-yy, colorFor(w, d[w.x]), 'rx="5"'); });
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
        catAxis(xs, xb.pos, xb.bandwidth); ys.forEach(yv => text(m.l-10, yb.pos(yv)+yb.bandwidth/2+4, short(yv), `text-anchor="end" font-size="12" fill="${escXml(muted)}"`));
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
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><style>text{font-family:Inter,system-ui,sans-serif}</style>${body}</svg>`;
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
    let s = esc(md || '');
    s = s.replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    return s.split(/\n{2,}/).map(block => /^<h\d/.test(block) ? block : `<p>${block.replace(/\n/g, '<br>')}</p>`).join('');
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
