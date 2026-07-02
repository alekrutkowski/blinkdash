(function () {
  'use strict';

  var INPUT_TYPES = new Set(['select', 'selectize', 'multiselect', 'slider', 'range', 'checkbox', 'radio', 'search', 'text', 'number', 'date', 'daterange', 'toggle', 'button']);
  var PLOT_TYPES = new Set(['scatter', 'line', 'bar', 'histogram', 'boxplot', 'heatmap', 'pie']);
  var AGGREGATES = ['count', 'sum', 'mean', 'median', 'min', 'max', 'q25', 'q50', 'q75', 'quintile20', 'quintile40', 'quintile60', 'quintile80', 'decile10', 'decile20', 'decile30', 'decile40', 'decile50', 'decile60', 'decile70', 'decile80', 'decile90'];

  var THEMES = {
    aurora: { label: 'Aurora light', dark: false, accent: '#4f46e5', accent2: '#0ea5e9', bg: '#f8fafc', panel: 'rgba(255,255,255,.95)', ink: '#0f172a', muted: '#64748b', line: '#e2e8f0' },
    paper: { label: 'Paper light', dark: false, accent: '#0f766e', accent2: '#ca8a04', bg: '#fbfaf7', panel: 'rgba(255,255,255,.97)', ink: '#1f2937', muted: '#6b7280', line: '#e5e7eb' },
    berry: { label: 'Berry light', dark: false, accent: '#be185d', accent2: '#7c3aed', bg: '#fff7fb', panel: 'rgba(255,255,255,.96)', ink: '#3b0a24', muted: '#7f5a6d', line: '#f5d0e2' },
    slate: { label: 'Slate light', dark: false, accent: '#334155', accent2: '#0284c7', bg: '#f1f5f9', panel: 'rgba(255,255,255,.96)', ink: '#0f172a', muted: '#64748b', line: '#cbd5e1' },
    mint: { label: 'Mint light', dark: false, accent: '#059669', accent2: '#14b8a6', bg: '#f0fdfa', panel: 'rgba(255,255,255,.96)', ink: '#064e3b', muted: '#4b8074', line: '#ccfbf1' },
    sand: { label: 'Sand light', dark: false, accent: '#b45309', accent2: '#d97706', bg: '#fffbeb', panel: 'rgba(255,251,235,.96)', ink: '#3f2f1c', muted: '#8a6d4b', line: '#fde68a' },
    ocean: { label: 'Ocean light', dark: false, accent: '#0369a1', accent2: '#0891b2', bg: '#f0f9ff', panel: 'rgba(255,255,255,.96)', ink: '#082f49', muted: '#57798c', line: '#bae6fd' },
    lavender: { label: 'Lavender light', dark: false, accent: '#7c3aed', accent2: '#db2777', bg: '#faf5ff', panel: 'rgba(255,255,255,.96)', ink: '#2e1065', muted: '#7c6a9c', line: '#e9d5ff' },
    graphite: { label: 'Graphite dark', dark: true, accent: '#60a5fa', accent2: '#22d3ee', bg: '#0b1220', panel: 'rgba(15,23,42,.94)', ink: '#e5edf9', muted: '#94a3b8', line: '#263347' },
    midnight: { label: 'Midnight dark', dark: true, accent: '#a78bfa', accent2: '#34d399', bg: '#09090f', panel: 'rgba(20,20,32,.95)', ink: '#f5f3ff', muted: '#a1a1aa', line: '#2e2e42' },
    forest: { label: 'Forest dark', dark: true, accent: '#34d399', accent2: '#fbbf24', bg: '#07130f', panel: 'rgba(9,29,23,.94)', ink: '#ecfdf5', muted: '#a7f3d0', line: '#1f4b3f' },
    dusk: { label: 'Dusk dark', dark: true, accent: '#fb7185', accent2: '#a78bfa', bg: '#111827', panel: 'rgba(31,41,55,.94)', ink: '#fdf2f8', muted: '#d1a3b8', line: '#4b5563' },
    ember: { label: 'Ember dark', dark: true, accent: '#f97316', accent2: '#ef4444', bg: '#1c0f0a', panel: 'rgba(39,20,14,.94)', ink: '#fff7ed', muted: '#fed7aa', line: '#7c2d12' },
    lagoon: { label: 'Lagoon dark', dark: true, accent: '#2dd4bf', accent2: '#38bdf8', bg: '#061a20', panel: 'rgba(8,35,42,.94)', ink: '#ecfeff', muted: '#99f6e4', line: '#155e75' },
    grape: { label: 'Grape dark', dark: true, accent: '#c084fc', accent2: '#f472b6', bg: '#160b24', panel: 'rgba(31,16,49,.94)', ink: '#faf5ff', muted: '#d8b4fe', line: '#581c87' }
  };
  var FONTS = {
    Inter: { label: 'Inter', css: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;650;800;900&display=swap', family: 'Inter, system-ui, sans-serif' },
    'Source Sans 3': { label: 'Source Sans 3', css: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;800;900&display=swap', family: '"Source Sans 3", system-ui, sans-serif' },
    'Plus Jakarta Sans': { label: 'Plus Jakarta Sans', css: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap', family: '"Plus Jakarta Sans", system-ui, sans-serif' },
    'Space Grotesk': { label: 'Space Grotesk', css: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;800&display=swap', family: '"Space Grotesk", system-ui, sans-serif' },
    'JetBrains Mono': { label: 'JetBrains Mono', css: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&display=swap', family: '"JetBrains Mono", ui-monospace, Consolas, monospace' },
    System: { label: 'System UI', css: '', family: 'system-ui, -apple-system, "Segoe UI", sans-serif' }
  };
  var PALETTES = {
    okabe: { label: 'Okabe Ito', colors: ['#0072B2', '#E69F00', '#009E73', '#D55E00', '#CC79A7', '#56B4E9', '#F0E442', '#000000'] },
    tableau: { label: 'Tableau 10', colors: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'] },
    observable: { label: 'Observable 10', colors: ['#4269D0', '#EFB118', '#FF725C', '#6CC5B0', '#3CA951', '#FF8AB7', '#A463F2', '#97BBF5', '#9C6B4E', '#9498A0'] },
    tol: { label: 'Tol vibrant', colors: ['#EE7733', '#0077BB', '#33BBEE', '#EE3377', '#CC3311', '#009988', '#BBBBBB'] },
    paired: { label: 'Paired 12', colors: ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#FFFF99', '#B15928'] },
    dark24: { label: 'Dark 24', colors: ['#2E91E5', '#E15F99', '#1CA71C', '#FB0D0D', '#DA16FF', '#222A2A', '#B68100', '#750D86', '#EB663B', '#511CFB', '#00A08B', '#FB00D1', '#FC0080', '#B2828D', '#6C7C32', '#778AAE', '#862A16', '#A777F1', '#620042', '#1616A7', '#DA60CA', '#6C4516', '#0D2A63', '#AF0038'] },
    viridis: { label: 'Viridis', colors: ['#440154', '#482878', '#3E4989', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725'] },
    magma: { label: 'Magma', colors: ['#000004', '#1B0C41', '#4A0C6B', '#781C6D', '#A52C60', '#CF4446', '#ED6925', '#FB9A06', '#F7D13D', '#FCFDBF'] },
    plasma: { label: 'Plasma', colors: ['#0D0887', '#46039F', '#7201A8', '#9C179E', '#BD3786', '#D8576B', '#ED7953', '#FB9F3A', '#FDC926', '#F0F921'] },
    turbo: { label: 'Turbo', colors: ['#30123B', '#4662D8', '#37A2FB', '#1AE4B6', '#71FE5F', '#C6EF34', '#FABA39', '#F66C19', '#C22303', '#7A0403'] },
    vivid: { label: 'Vivid contrast', colors: ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be123c', '#65a30d', '#7c2d12', '#1d4ed8'] },
    solar: { label: 'Solar', colors: ['#268bd2', '#dc322f', '#859900', '#b58900', '#6c71c4', '#2aa198', '#d33682', '#cb4b16'] },
    pastel: { label: 'Pastel', colors: ['#7dd3fc', '#f9a8d4', '#86efac', '#c4b5fd', '#fdba74', '#93c5fd', '#fca5a5', '#bef264'] },
    soft24: { label: 'Soft 24', colors: ['#8DD3C7', '#FFFFB3', '#BEBADA', '#FB8072', '#80B1D3', '#FDB462', '#B3DE69', '#FCCDE5', '#D9D9D9', '#BC80BD', '#CCEBC5', '#FFED6F', '#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#FFFF99', '#B15928'] },
    mono: { label: 'Monochrome accent', colors: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#312e81'] }
  };

  var WIDGET_LIBRARY = [
    { shelf: 'Inputs', type: 'selectize', role: 'input', icon: '⌘', title: 'Selectize', desc: 'Polished single or multi choice' },
    { shelf: 'Inputs', type: 'select', role: 'input', icon: '▾', title: 'Select', desc: 'Simple single-choice dropdown' },
    { shelf: 'Inputs', type: 'multiselect', role: 'input', icon: '▦', title: 'Multi-select', desc: 'Native many-choice select' },
    { shelf: 'Inputs', type: 'slider', role: 'input', icon: '↔', title: 'Slider', desc: 'Numeric threshold filter' },
    { shelf: 'Inputs', type: 'range', role: 'input', icon: '⟷', title: 'Range', desc: 'Dual-thumb numeric ruler' },
    { shelf: 'Inputs', type: 'date', role: 'input', icon: '📅', title: 'Date filter', desc: 'One date comparator' },
    { shelf: 'Inputs', type: 'daterange', role: 'input', icon: '⧉', title: 'Date range', desc: 'Start and end date filter' },
    { shelf: 'Inputs', type: 'checkbox', role: 'input', icon: '☑', title: 'Checkboxes', desc: 'Many categorical values' },
    { shelf: 'Inputs', type: 'radio', role: 'input', icon: '◉', title: 'Radio', desc: 'One categorical value' },
    { shelf: 'Inputs', type: 'search', role: 'input', icon: '⌕', title: 'Search', desc: 'Fast row search' },
    { shelf: 'Inputs', type: 'text', role: 'input', icon: 'T', title: 'Text filter', desc: 'Contains text match' },
    { shelf: 'Inputs', type: 'number', role: 'input', icon: '#', title: 'Number filter', desc: 'Numeric comparator with step' },
    { shelf: 'Inputs', type: 'toggle', role: 'input', icon: '⏻', title: 'Toggle', desc: 'Boolean TRUE/FALSE filter' },
    { shelf: 'Inputs', type: 'button', role: 'input', icon: '●', title: 'Button', desc: 'Reset or trigger input' },
    { shelf: 'Indicators', type: 'metric', role: 'output', icon: '42', title: 'Metric', desc: 'KPI number card' },
    { shelf: 'Tables', type: 'table', role: 'output', icon: '▤', title: 'Table', desc: 'Sortable table with CSV' },
    { shelf: 'Plots', type: 'scatter', role: 'output', icon: '•', title: 'Scatter', desc: 'Numeric x-y plot' },
    { shelf: 'Plots', type: 'line', role: 'output', icon: '⌁', title: 'Line', desc: 'Series or trend with legend' },
    { shelf: 'Plots', type: 'bar', role: 'output', icon: '▥', title: 'Bar', desc: 'Aggregated categories' },
    { shelf: 'Plots', type: 'histogram', role: 'output', icon: '▥', title: 'Histogram', desc: 'Distribution bins' },
    { shelf: 'Plots', type: 'boxplot', role: 'output', icon: '▣', title: 'Box plot', desc: 'Grouped spread' },
    { shelf: 'Plots', type: 'heatmap', role: 'output', icon: '▦', title: 'Heatmap', desc: 'Two-way matrix' },
    { shelf: 'Plots', type: 'pie', role: 'output', icon: '◔', title: 'Pie', desc: 'Part-to-whole chart' },
    { shelf: 'Narrative', type: 'markdown', role: 'output', icon: 'M', title: 'Markdown', desc: 'Text, code, math, diagrams' },
    { shelf: 'Narrative', type: 'html', role: 'output', icon: '<>', title: 'HTML', desc: 'Trusted markup, no guaranteed JS' },
    { shelf: 'R and webR', type: 'webr', role: 'output', icon: 'R', title: 'webR processor', desc: 'Browser-side R, linkable to outputs' },
    { shelf: 'R and webR', type: 'rplot', role: 'output', icon: '▧', title: 'R plot viewer', desc: 'Displays SVG plots from webR' }
  ];

  var HELP = {
    selectize: 'Selectize is a styled categorical input. Use it for factor or character columns. Switch it to multi-select when several categories should be allowed at the same time.',
    select: 'Select is a native single-choice categorical filter. It is best for short factor or character columns.',
    multiselect: 'Multi-select is a native browser multi-choice list. It filters categorical fields. For prettier interaction, prefer Selectize.',
    slider: 'Slider filters a numeric column with a comparator such as <= or >=. Use it for R integer, numeric, double, or float-like columns.',
    range: 'Range filters a numeric column between two values using one dual-thumb ruler. Use it for continuous numeric variables.',
    date: 'Date filter compares one date to a date-like column. ISO dates such as YYYY-MM-DD work best.',
    daterange: 'Date range filters rows whose date-like column lies between a start and end date.',
    checkbox: 'Checkboxes are categorical filters that allow many values. They work best for factors and character vectors.',
    radio: 'Radio inputs are categorical filters that allow exactly one value.',
    search: 'Search scans all columns when the field is *, or only one selected column. It is useful for quick free-text narrowing.',
    text: 'Text filter keeps rows where a selected text-like column contains the typed phrase.',
    number: 'Number filter compares a numeric column to a typed number. Configure its minimum, maximum, and step in the inspector.',
    toggle: 'Toggle filters a Boolean/logical column. TRUE rows are shown when it is on, FALSE rows when it is off.',
    button: 'Button can reset filters or act as a simple trigger in advanced wiring.',
    metric: 'Metric summarizes filtered rows. Use count, sum, mean, quantiles, and similar aggregations.',
    table: 'Table displays filtered rows with sorting, paging, table-level search, and CSV download of the current table data.',
    scatter: 'Scatter shows two numeric columns. Optional categorical color groups create legends in the card and full-screen view.',
    line: 'Line shows a numeric y value over a numeric, categorical, or date-like x axis. A color field creates grouped lines and a legend.',
    bar: 'Bar groups by a categorical x field and aggregates a numeric y field. Aggregates include quartiles, quintiles, and deciles. Configure single or category colors, category or value sorting, and hover values in the inspector.',
    histogram: 'Histogram shows the distribution of one numeric field. Bars touch because adjacent bins share boundaries.',
    boxplot: 'Box plot shows spread of a numeric field by categorical groups.',
    heatmap: 'Heatmap shows counts or aggregate values across two categorical axes.',
    pie: 'Pie shows part-to-whole category summaries. Use sparingly for few categories.',
    markdown: 'Markdown is for explanatory text. It is rendered as styled HTML with fenced code blocks, math, and diagram support. It can use upstream input values with {{input_id}} or {{param.input_id}} placeholders when arrows connect those inputs to this widget.',
    html: 'HTML is for trusted custom markup. It is rendered directly, so only use content you control. It can use upstream input values with {{input_id}} or {{param.input_id}} placeholders. JavaScript script tags inserted into this block are not intentionally executed; inline event handlers may work in some browsers but are discouraged and not guaranteed. For reproducible dashboards, keep logic in widgets or webR.',
    webr: 'webR runs R in the viewer\'s browser. bd_data is an R data.frame made from the widget\'s selected dataset after the upstream filters connected to this webR node have been applied. bd_state is a named R list containing every dashboard input value. bd_params is a named R list containing only the directly connected upstream input values, named by widget id. Put extra package names in Packages, comma-separated; BlinkDash asks webR to install and attach them before running your code. A webR widget has both input and output handles: it receives input parameters and can feed Markdown, HTML, Table, or R plot viewer widgets. The editor supports optional soft wrapping.',
    rplot: 'R plot viewer displays a plot produced by an upstream webR widget. Draw an arrow from a webR processor to this viewer. BlinkDash asks webR to use grDevices::svg() first for crisp vector output, then falls back to bitmap capture only if SVG fails. For ggplot2, lattice, and grid plots, assign the plot to an object and call print(p) explicitly. Installing packages such as ggplot2 in webR can take a noticeable time the first time a viewer opens the dashboard.'
  };

  var state = {
    manifest: null,
    projectDir: '',
    projectFile: '',
    nodes: [],
    edges: [],
    selected: null,
    selectedEdge: null,
    inspectorTab: 'project',
    mode: 'visual',
    dirty: false,
    search: '',
    toast: null,
    toastBad: false,
    connecting: null,
    pointer: null,
    rCode: 'summary(bd_data)',
    rName: 'derived_data',
    rData: '',
    importPath: '',
    importName: '',
    envName: '',
    envDataNames: [],
    openPath: '',
    saveAsPath: '',
    output: '',
    yamlText: '',
    yamlDirty: false,
    history: [],
    future: [],
    historyLock: false,
    modal: null,
    helpDismissed: false
  };

  var app = document.getElementById('app');

  window.addEventListener('error', function (event) { showFatal(event.error || event.message || 'Unknown JavaScript error'); });
  window.addEventListener('unhandledrejection', function (event) { showFatal(event.reason || 'Unhandled promise rejection'); });
  document.addEventListener('keydown', function (ev) {
    var key = ev.key.toLowerCase();
    if (ev.ctrlKey && key === 'z' && !ev.shiftKey) { ev.preventDefault(); undo(); }
    if (ev.ctrlKey && (key === 'y' || (key === 'z' && ev.shiftKey))) { ev.preventDefault(); redo(); }
    if (ev.key === 'Escape' && state.modal) { state.modal = null; render(); }
  });

  function esc(x) {
    return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function clone(x) { return JSON.parse(JSON.stringify(x == null ? null : x)); }
  function byId(id) { return document.getElementById(id); }
  function opt(x, y) { return x == null ? y : x; }
  function api(path, options) {
    options = options || {};
    var hasBody = Object.prototype.hasOwnProperty.call(options, 'body');
    return fetch(path, { method: options.method || (hasBody ? 'POST' : 'GET'), headers: hasBody ? { 'Content-Type': 'application/json' } : undefined, body: hasBody ? JSON.stringify(options.body) : undefined })
      .then(function (res) { return res.text().then(function (text) { var data = {}; if (text) { try { data = JSON.parse(text); } catch (e) { data = { ok: false, error: text }; } } if (!res.ok || data.ok === false) throw new Error(data.error || res.statusText || 'Request failed'); return data; }); });
  }

  function itemFor(type) { return WIDGET_LIBRARY.find(function (x) { return x.type === type; }) || { type: type, role: INPUT_TYPES.has(type) ? 'input' : 'output', icon: '?', title: type, desc: '' }; }
  function roleFor(type) { return itemFor(type).role || (INPUT_TYPES.has(type) ? 'input' : 'output'); }
  function widget(id) { return ((state.manifest && state.manifest.widgets) || []).find(function (w) { return w.id === id; }); }
  function node(id) { return state.nodes.find(function (n) { return n.id === id; }); }
  function selectedWidget() { return widget(state.selected); }
  function selectedNode() { return node(state.selected); }
  function graphGrid() { return Number((state.manifest && state.manifest.graph && state.manifest.graph.canvas && state.manifest.graph.canvas.grid) || 20); }
  function snap(v) { var g = graphGrid(); return Math.max(0, Math.round(v / g) * g); }

  function ensureManifest() {
    var m = state.manifest || {};
    m.widgets = Array.isArray(m.widgets) ? m.widgets : [];
    m.datasets = m.datasets || {};
    m.graph = m.graph || {};
    m.graph.canvas = m.graph.canvas || { width: 1680, height: 1280, grid: 20 };
    m.graph.nodes = Array.isArray(m.graph.nodes) ? m.graph.nodes : [];
    m.graph.edges = Array.isArray(m.graph.edges) ? m.graph.edges : [];
    m.theme = m.theme || {};
    m.theme.name = m.theme.name || 'aurora';
    m.theme.dashboardName = m.theme.dashboardName || m.theme.name;
    m.theme.builderName = m.theme.builderName || m.theme.name;
    m.theme.font = m.theme.font || 'Inter';
    if (m.theme.baseFontSize == null) m.theme.baseFontSize = Number(m.theme.fontSize || 16);
    if (!Number.isFinite(Number(m.theme.baseFontSize)) || Number(m.theme.baseFontSize) <= 0) m.theme.baseFontSize = 16;
    m.theme.plotPalette = m.theme.plotPalette || 'okabe';
    m.format = m.format || {};
    m.format.decimal = m.format.decimal || '.';
    m.export = m.export || {};
    if (m.export.showBadge == null) m.export.showBadge = true;
    if (m.export.badgeText == null) m.export.badgeText = 'static reactive dashboard';
    if (m.export.generatedBy == null) m.export.generatedBy = 'Generated by BlinkDash.';
    if (m.export.showGeneratedBy == null) m.export.showGeneratedBy = true;
    m.builder = m.builder || {};
    if (m.builder.helpDismissed == null) m.builder.helpDismissed = false;
    m.widgets.forEach(function (w) {
      if (w && ['markdown', 'html', 'webr'].indexOf(w.type) >= 0 && w.softWrap == null) w.softWrap = true;
      if (w && w.type === 'number') {
        var rg = rangeFor(w.data || firstDataset(), w.field);
        if (w.min == null) w.min = rg[0];
        if (w.max == null) w.max = rg[1];
        if (w.step == null) w.step = sensibleStep(rg);
      }
      if (w && w.type === 'metric' && w.title != null) {
        w.label = w.title || w.label || '';
        delete w.title;
      }
    });
    state.manifest = m;
    state.helpDismissed = !!m.builder.helpDismissed;
  }

  function asRows(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (typeof x === 'object') {
      var keys = Object.keys(x);
      if (keys.length && keys.every(function (k) { return Array.isArray(x[k]); })) {
        var n = Math.max.apply(null, keys.map(function (k) { return x[k].length; }));
        return Array.from({ length: n }, function (_, i) { var row = {}; keys.forEach(function (k) { row[k] = x[k][i]; }); return row; });
      }
    }
    return [];
  }
  function datasets() { return Object.keys((state.manifest && state.manifest.datasets) || {}); }
  function firstDataset() { return datasets()[0] || ''; }
  function rowsFor(name) { return asRows(((state.manifest && state.manifest.datasets) || {})[name || firstDataset()]); }
  function colsFor(name) { var set = new Set(); rowsFor(name).slice(0, 100).forEach(function (row) { Object.keys(row || {}).forEach(function (k) { set.add(k); }); }); return Array.from(set); }
  function valuesFor(name, field) { return rowsFor(name).map(function (r) { return r && r[field]; }).filter(function (v) { return v != null && v !== ''; }); }
  function isNum(v) { return v !== '' && v != null && Number.isFinite(Number(v)); }
  function isBoolLike(v) { if (typeof v === 'boolean') return true; var s = String(v).toLowerCase(); return ['true', 'false', 't', 'f', '0', '1'].indexOf(s) >= 0; }
  function isDateLike(v) { if (v == null || v === '') return false; if (typeof v === 'number') return false; var s = String(v); if (!/^\d{4}-\d{1,2}-\d{1,2}/.test(s)) return false; return Number.isFinite(Date.parse(s)); }
  function profileCol(name, field) { var vals = valuesFor(name, field).slice(0, 80); if (!vals.length) return 'unknown'; if (vals.every(isBoolLike)) return 'logical'; if (vals.every(isNum)) return 'numeric'; if (vals.some(isDateLike) && vals.filter(isDateLike).length / vals.length > .8) return 'date'; return 'categorical'; }
  function colsByType(name, type) { return colsFor(name).filter(function (c) { return profileCol(name, c) === type; }); }
  function numColsFor(name) { return colsByType(name, 'numeric'); }
  function catColsFor(name) { var out = colsByType(name, 'categorical'); return out.length ? out : colsFor(name); }
  function dateColsFor(name) { return colsByType(name, 'date'); }
  function boolColsFor(name) { return colsByType(name, 'logical'); }
  function uniqueVals(name, field) { return Array.from(new Set(valuesFor(name, field).map(String))).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); }).slice(0, 120); }
  function rangeFor(name, field) { var vals = valuesFor(name, field).map(Number).filter(Number.isFinite); if (!vals.length) return [0, 100]; return [Math.min.apply(null, vals), Math.max.apply(null, vals)]; }
  function dateRangeFor(name, field) { var vals = valuesFor(name, field).filter(isDateLike).map(function (x) { return String(x).slice(0, 10); }).sort(); if (!vals.length) return ['', '']; return [vals[0], vals[vals.length - 1]]; }

  function baseFontScale() {
    var size = Number(state.manifest && state.manifest.theme && state.manifest.theme.baseFontSize || 16);
    if (!Number.isFinite(size) || size <= 0) size = 16;
    return Math.max(0.9, Math.min(1.45, size / 16));
  }

  function scaledSize(width, height) {
    var s = baseFontScale();
    return { width: Math.round(width * Math.max(1, s * 0.96)), height: Math.round(height * s) };
  }

  function defaultSize(type) {
    if (type === 'metric') return scaledSize(330, 210);
    if (type === 'table') return scaledSize(760, 640);
    if (PLOT_TYPES.has(type) || type === 'rplot') return scaledSize(560, 430);
    if (type === 'webr') return scaledSize(540, 440);
    if (type === 'markdown' || type === 'html') return scaledSize(520, 300);
    if (type === 'daterange') return scaledSize(380, 172);
    if (type === 'checkbox' || type === 'radio') return scaledSize(330, 220);
    if (type === 'selectize' || type === 'multiselect') return scaledSize(330, 210);
    if (type === 'range') return scaledSize(340, 190);
    if (type === 'slider' || type === 'number' || type === 'date' || type === 'search' || type === 'text' || type === 'select' || type === 'toggle') return scaledSize(320, 148);
    return scaledSize(320, type === 'button' ? 116 : 150);
  }

  function defaultWidget(type) {
    var ds = firstDataset();
    var cols = colsFor(ds);
    var nums = numColsFor(ds);
    var cats = catColsFor(ds);
    var dates = dateColsFor(ds);
    var bools = boolColsFor(ds);
    var cat = cats[0] || cols[0] || '';
    var num = nums[0] || cols[0] || '';
    var num2 = nums[1] || nums[0] || cols[1] || cols[0] || '';
    var date = dates[0] || cols[0] || '';
    var bool = bools[0] || cols[0] || '';
    var rg = rangeFor(ds, num);
    var dr = dateRangeFor(ds, date);
    var base = { id: '', type: type, role: roleFor(type), data: ds, help: HELP[type] || '' };
    if (type === 'selectize') return Object.assign(base, { label: 'Choose ' + (cat || 'value'), field: cat, multiple: true, default: uniqueVals(ds, cat).slice(0, 6) });
    if (type === 'select') return Object.assign(base, { label: 'Select ' + (cat || 'field'), field: cat, default: uniqueVals(ds, cat)[0] || '' });
    if (type === 'multiselect') return Object.assign(base, { label: 'Choose ' + (cat || 'values'), field: cat, default: uniqueVals(ds, cat) });
    if (type === 'checkbox') return Object.assign(base, { label: 'Check ' + (cat || 'values'), field: cat, default: uniqueVals(ds, cat) });
    if (type === 'radio') return Object.assign(base, { label: 'Pick ' + (cat || 'value'), field: cat, default: uniqueVals(ds, cat)[0] || '' });
    if (type === 'slider') return Object.assign(base, { label: 'Up to ' + (num || 'value'), field: num, min: rg[0], max: rg[1], step: sensibleStep(rg), operator: '<=', default: rg[1] });
    if (type === 'range') return Object.assign(base, { label: 'Range of ' + (num || 'value'), field: num, min: rg[0], max: rg[1], step: sensibleStep(rg), default: [rg[0], rg[1]] });
    if (type === 'search') return Object.assign(base, { label: 'Search rows', field: '*', placeholder: 'Type to filter...' });
    if (type === 'text') return Object.assign(base, { label: 'Text contains', field: cat || '*', placeholder: 'Contains...' });
    if (type === 'number') return Object.assign(base, { label: 'Number filter', field: num, min: rg[0], max: rg[1], step: sensibleStep(rg), operator: '>=', default: rg[0] });
    if (type === 'date') return Object.assign(base, { label: 'Date filter', field: date, operator: '>=', default: dr[0] });
    if (type === 'daterange') return Object.assign(base, { label: 'Date range', field: date, default: dr });
    if (type === 'toggle') return Object.assign(base, { label: 'Toggle ' + (bool || 'logical'), field: bool, default: true });
    if (type === 'button') return Object.assign(base, { label: 'Reset filters', action: 'reset' });
    if (type === 'metric') return Object.assign(base, { label: 'Rows', measure: { op: 'count' }, suffix: '', digits: 1 });
    if (type === 'table') return Object.assign(base, { title: 'Data table', columns: cols, pageSize: 12 });
    if (type === 'scatter') return Object.assign(base, { title: 'Scatter plot', x: num, y: num2, color: cat, palette: state.manifest.theme.plotPalette || 'okabe' });
    if (type === 'line') return Object.assign(base, { title: 'Line plot', x: cols[0] || num, y: num, color: cat, palette: state.manifest.theme.plotPalette || 'okabe' });
    if (type === 'bar') return Object.assign(base, { title: 'Bar chart', x: cat, y: num, aggregate: 'mean', palette: state.manifest.theme.plotPalette || 'okabe', colorMode: 'category', barSort: 'category', showHoverValues: true });
    if (type === 'histogram') return Object.assign(base, { title: 'Histogram', x: num, bins: 20, palette: state.manifest.theme.plotPalette || 'okabe' });
    if (type === 'boxplot') return Object.assign(base, { title: 'Box plot', x: cat, y: num, palette: state.manifest.theme.plotPalette || 'okabe' });
    if (type === 'heatmap') return Object.assign(base, { title: 'Heatmap', x: cat, y: cols[1] || cat, value: num, aggregate: 'mean', palette: state.manifest.theme.plotPalette || 'okabe' });
    if (type === 'pie') return Object.assign(base, { title: 'Pie chart', x: cat, y: num, aggregate: 'count', palette: state.manifest.theme.plotPalette || 'okabe' });
    if (type === 'markdown') return Object.assign(base, { title: 'Notes', markdown: '### Notes\nWrite Markdown here.', softWrap: true });
    if (type === 'html') return Object.assign(base, { title: 'HTML', html: '<div class="note">Trusted HTML goes here.</div>', softWrap: true });
    if (type === 'webr') return Object.assign(base, { title: 'R snippet', code: '# bd_data is a data.frame; bd_state and bd_params are named lists\nsummary(bd_data)', outputType: 'auto', visible: true, autoRun: true, consoleTheme: 'dark', packages: '', softWrap: true });
    if (type === 'rplot') return Object.assign(base, { title: 'R plot viewer', source: '', note: 'Link a webR processor to this viewer.' });
    return base;
  }
  function sensibleStep(rg) { var span = Math.abs((rg[1] || 0) - (rg[0] || 0)); if (span <= 5) return 0.1; if (span <= 50) return 0.5; return 1; }
  function uniqueId(type) { var base = String(type || 'widget').replace(/[^A-Za-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase() || 'widget'; var used = new Set(((state.manifest && state.manifest.widgets) || []).map(function (w) { return w.id; })); var id = base, i = 2; while (used.has(id)) id = base + '_' + i++; return id; }
  function layoutFromNode(n) { return { x: Math.max(1, Math.floor(n.x / 92) + 1), y: Math.max(1, Math.floor(n.y / 84) + 1), w: Math.max(1, Math.min(12, Math.round(n.width / 92))), h: Math.max(1, Math.round(n.height / 84)), px: { left: n.x, top: n.y, width: n.width, height: n.height } }; }

  function syncFromManifest() {
    ensureManifest();
    var manifest = state.manifest;
    var graphNodes = {};
    (manifest.graph.nodes || []).forEach(function (n) { graphNodes[n.id] = n; });
    state.nodes = manifest.widgets.map(function (w, i) {
      var g = graphNodes[w.id] || {};
      var px = (w.layout && w.layout.px) || {};
      var d = defaultSize(w.type);
      return { id: w.id, x: Number((g.position && g.position.x) != null ? g.position.x : (px.left != null ? px.left : 80 + i * 34)), y: Number((g.position && g.position.y) != null ? g.position.y : (px.top != null ? px.top : 90 + i * 34)), width: Number((g.size && g.size.width) || px.width || d.width), height: Number((g.size && g.size.height) || px.height || d.height) };
    });
    var valid = new Set(manifest.widgets.map(function (w) { return w.id; }));
    state.edges = (manifest.graph.edges || []).filter(function (e) { return valid.has(e.source) && valid.has(e.target); }).map(function (e) { return { id: e.id || ('edge_' + e.source + '_' + e.target), source: e.source, target: e.target, label: e.label || 'filter' }; });
    if (state.selected && !valid.has(state.selected)) state.selected = null;
    if (!state.selected && state.nodes.length) state.selected = state.nodes[0].id;
  }

  function manifestForSave() {
    ensureManifest();
    var m = clone(state.manifest || {});
    var nodeById = {};
    state.nodes.forEach(function (n) { nodeById[n.id] = n; });
    m.widgets = (m.widgets || []).filter(function (w) { return nodeById[w.id]; }).map(function (w) { var n = nodeById[w.id]; var x = clone(w); x.layout = layoutFromNode(n); return x; });
    m.graph = Object.assign({}, m.graph || {}, {
      direction: 'left-to-right',
      canvas: (m.graph && m.graph.canvas) || { width: 1680, height: 1280, grid: 20 },
      nodes: state.nodes.map(function (n) { var w = widget(n.id) || {}; return { id: n.id, type: 'dashboard', role: w.role || roleFor(w.type), position: { x: Math.round(n.x), y: Math.round(n.y) }, size: { width: Math.round(n.width), height: Math.round(n.height) } }; }),
      edges: state.edges.map(function (e) { return { id: e.id, source: e.source, target: e.target, label: e.label || 'filter' }; })
    });
    m.builder = m.builder || {};
    m.builder.helpDismissed = state.helpDismissed;
    return m;
  }

  function snapshot() { return JSON.stringify({ manifest: manifestForSave(), nodes: state.nodes, edges: state.edges, selected: state.selected, selectedEdge: state.selectedEdge, mode: state.mode }); }
  function pushHistory() { if (state.historyLock || !state.manifest) return; state.history.push(snapshot()); if (state.history.length > 80) state.history.shift(); state.future = []; }
  function restoreSnapshot(snap) { var x = JSON.parse(snap); state.historyLock = true; state.manifest = x.manifest; ensureManifest(); state.nodes = x.nodes || []; state.edges = x.edges || []; state.selected = x.selected || null; state.selectedEdge = x.selectedEdge || null; state.mode = x.mode || state.mode; state.dirty = true; state.historyLock = false; render(); }
  function undo() { if (!state.history.length) return; state.future.push(snapshot()); restoreSnapshot(state.history.pop()); toast('Undo'); }
  function redo() { if (!state.future.length) return; state.history.push(snapshot()); restoreSnapshot(state.future.pop()); toast('Redo'); }
  function markDirty() { state.dirty = true; }
  function toast(msg, bad) { state.toast = msg; state.toastBad = !!bad; renderToast(); setTimeout(function () { if (state.toast === msg) { state.toast = null; renderToast(); } }, 4200); }

  function applyBuilderTheme() {
    if (!state.manifest) return;
    ensureManifest();
    var themeName = state.manifest.theme.builderName || state.manifest.theme.name || 'aurora';
    var t = THEMES[themeName] || THEMES.aurora;
    var r = document.documentElement.style;
    r.setProperty('--ink', t.ink); r.setProperty('--muted', t.muted); r.setProperty('--soft', t.bg); r.setProperty('--panel', t.panel); r.setProperty('--line', t.line); r.setProperty('--accent', t.accent); r.setProperty('--accent-2', t.accent2); r.setProperty('--accent-soft', t.dark ? 'rgba(96,165,250,.14)' : 'rgba(79,70,229,.10)');
    document.documentElement.dataset.theme = t.dark ? 'dark' : 'light';
    var baseSize = Number(state.manifest.theme.baseFontSize || 16);
    if (!Number.isFinite(baseSize) || baseSize <= 0) baseSize = 16;
    r.setProperty('--preview-base-font-size', baseSize + 'px');
    var f = FONTS[state.manifest.theme.font || 'Inter'] || FONTS.Inter;
    r.setProperty('--font-ui', f.family);
    ensureFontLink(f);
  }
  function ensureFontLink(f) { if (!f || !f.css) return; var id = 'bd-font-link'; var link = byId(id); if (!link) { link = document.createElement('link'); link.id = id; link.rel = 'stylesheet'; document.head.appendChild(link); } if (link.href !== f.css) link.href = f.css; }

  function render() {
    if (!state.manifest) { app.innerHTML = '<div class="boot-card"><div class="boot-logo">B</div><div><h1>Loading BlinkDash Builder</h1><p>Reading the local project through R...</p></div></div>'; return; }
    applyBuilderTheme();
    var body = state.mode === 'yaml' ? renderYamlMode() : renderVisualMode();
    app.innerHTML = '<div class="bd-builder">' + renderTopbar() + body + '</div><div id="toast-host"></div>' + renderModal();
    attachHandlers();
    if (state.mode !== 'yaml') drawEdges();
    renderToast();
  }
  function renderTopbar() {
    return '<header class="topbar"><div class="brand"><div class="logo">B</div><div><div class="brand-title">BlinkDash Builder</div><div class="brand-subtitle">' + esc(state.projectDir || 'local project') + '</div></div></div>' +
      '<input class="title-input" id="title-input" value="' + esc(state.manifest.title || '') + '" aria-label="Dashboard title">' +
      '<div class="mode-switch"><button class="seg ' + (state.mode === 'visual' ? 'active' : '') + '" data-mode="visual">Visual</button><button class="seg ' + (state.mode === 'yaml' ? 'active' : '') + '" data-mode="yaml">YAML</button></div>' +
      '<div class="top-actions"><span class="status-pill ' + (state.dirty ? 'dirty' : '') + '"><span class="status-dot"></span>' + (state.dirty ? 'Unsaved' : 'Saved in memory') + '</span>' +
      '<button class="btn small" id="undo-btn" ' + (!state.history.length ? 'disabled' : '') + '>Undo</button><button class="btn small" id="redo-btn" ' + (!state.future.length ? 'disabled' : '') + '>Redo</button>' +
      '<button class="btn" id="manual-btn">Manual</button><button class="btn" id="open-prompt-btn">Open</button><button class="btn soft" id="save-as-prompt-btn">Save as</button><button class="btn soft" id="save-btn">Save YAML</button><button class="btn primary" id="compile-view-btn">Compile and view</button><button class="btn soft" id="export-btn">Export site</button></div></header>';
  }
  function renderVisualMode() { return '<div class="workspace" id="workspace">' + renderShelf() + renderCanvas() + '<div class="inspector-splitter" id="inspector-splitter" title="Drag to resize the Inspector"></div>' + renderInspector() + '</div>'; }
  function renderYamlMode() {
    var y = state.yamlText || '';
    return '<div class="workspace yaml-workspace"><main class="panel yaml-panel"><div class="canvas-toolbar"><div><strong>Human-readable YAML source</strong> <span>Edit, fold the outline, then apply back to the visual builder.</span></div><div><button class="btn small" id="yaml-refresh-btn">Refresh from design</button><button class="btn small" id="yaml-apply-btn">Apply YAML to design</button><button class="btn small soft" id="yaml-save-btn">Save YAML</button></div></div><div class="yaml-code-wrap"><pre class="yaml-highlight" id="yaml-highlight" aria-hidden="true">' + highlightYaml(y) + '</pre><textarea id="yaml-editor" class="yaml-editor code-overlay" spellcheck="false" wrap="off">' + esc(y) + '</textarea></div></main><aside class="panel yaml-side"><div class="panel-head"><h2 class="panel-title">YAML outline</h2><p class="panel-note">Collapse sections to navigate the design.</p></div><div class="panel-body yaml-tree-body">' + renderYamlTree(manifestForSave()) + '<div class="help-box">The YAML contains <code>title</code>, <code>subtitle</code>, <code>theme</code>, embedded <code>datasets</code>, <code>widgets</code>, and <code>graph.edges</code>. Press Apply to parse it back into the visual builder.</div><button class="btn" id="manual-btn-2">Open manual</button></div></aside></div>';
  }

  function renderShelf() {
    var q = state.search.toLowerCase();
    var groups = {};
    WIDGET_LIBRARY.filter(function (it) { return !q || (it.title + ' ' + it.desc + ' ' + it.type).toLowerCase().indexOf(q) >= 0; }).forEach(function (it) { (groups[it.shelf] = groups[it.shelf] || []).push(it); });
    var html = '<aside class="panel shelf"><div class="panel-head"><h2 class="panel-title">Component library</h2><p class="panel-note">Drag a widget into the canvas. Wire inputs to outputs with arrows.</p></div><div class="panel-body"><input class="shelf-search" id="shelf-search" placeholder="Search widgets..." value="' + esc(state.search) + '">';
    Object.keys(groups).forEach(function (g) { html += '<div class="shelf-group"><div class="shelf-group-title">' + esc(g) + '</div>'; groups[g].forEach(function (it) { html += '<div class="component-card" draggable="true" data-type="' + esc(it.type) + '"><div class="component-icon">' + esc(it.icon) + '</div><div><div class="component-title">' + esc(it.title) + '</div><div class="component-desc">' + esc(it.desc) + '</div></div></div>'; }); html += '</div>'; });
    html += '</div><div id="trash-zone" class="trash-zone">Drag a canvas card here to remove it</div></aside>';
    return html;
  }
  function renderCanvas() {
    var canvas = (state.manifest.graph && state.manifest.graph.canvas) || { width: 1680, height: 1280, grid: 20 };
    return '<main class="panel canvas-panel"><div class="canvas-toolbar"><div><strong>Dashboard graph</strong> <span>' + state.nodes.length + ' components, ' + state.edges.length + ' arrows, grid ' + esc(canvas.grid || 20) + 'px</span></div><div><button class="btn small" id="fit-btn">Back to top-left</button><button class="btn small" id="align-btn">Auto-align</button><button class="btn small danger" id="clear-btn">Clear canvas</button></div></div>' +
      '<div class="canvas-scroll" id="canvas-scroll"><div class="canvas-space" id="canvas-space" style="width:' + esc(canvas.width || 1680) + 'px;height:' + esc(canvas.height || 1280) + 'px;background-size:' + esc(canvas.grid || 20) + 'px ' + esc(canvas.grid || 20) + 'px"><svg class="edge-layer" id="edge-layer"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"></path></marker></defs></svg>' + renderCanvasHelp() + (state.nodes.length ? '' : '<div class="empty-canvas">Drop components here, or use Auto-align after adding widgets.</div>') + state.nodes.map(renderNode).join('') + '</div></div></main>';
  }
  function renderCanvasHelp() {
    if (state.helpDismissed) return '';
    return '<div class="canvas-help"><button class="help-close" id="canvas-help-close" title="Close">×</button><h3>Build by dragging and wiring</h3><p>Drop components here, then drag from an input handle to an output handle. The directed arrows define exactly which controls affect which outputs.</p></div>';
  }
  function linkedBySelectedEdge(id) { var e = state.edges.find(function (x) { return x.id === state.selectedEdge; }); return e && (e.source === id || e.target === id); }
  function renderNode(n) {
    var w = widget(n.id) || { id: n.id, type: 'unknown', role: 'output' };
    var it = itemFor(w.type);
    return '<section class="bd-node ' + (state.selected === n.id ? 'selected ' : '') + (linkedBySelectedEdge(n.id) ? 'linked ' : '') + '" data-id="' + esc(n.id) + '" style="left:' + n.x + 'px;top:' + n.y + 'px;width:' + n.width + 'px;height:' + n.height + 'px">' +
      ((w.role === 'output' || w.type === 'webr') ? '<div class="handle target" title="Drop an input or webR link here"></div>' : '') +
      '<div class="node-head"><div class="node-icon">' + esc(it.icon) + '</div><div class="node-title">' + esc(w.title || w.label || it.title) + '</div><div class="node-kind">' + esc(w.role) + '</div><button class="node-info" title="What is this?" data-info="' + esc(n.id) + '">🛈</button><button class="node-close" title="Remove" data-remove="' + esc(n.id) + '">×</button></div>' +
      '<div class="node-body">' + renderPreview(w) + '</div>' +
      ((w.role === 'input' || w.type === 'webr') ? '<div class="handle source" title="Drag to a dependent output"></div>' : '') + '<div class="resize-handle" title="Drag to resize. Hold Ctrl to snap."></div></section>';
  }
  function renderPreview(w) {
    if (w.role === 'input') {
      var txt = w.field === '*' ? 'All columns' : (w.field || 'Choose a field');
      if (w.type === 'button') txt = w.action || 'reset';
      var tag = w.type === 'toggle' ? 'Boolean/logical field' : w.type === 'daterange' || w.type === 'date' ? 'Date-like field' : ['slider', 'range', 'number'].indexOf(w.type) >= 0 ? 'Numeric field' : 'Categorical/text field';
      var control = w.type === 'range'
        ? '<div class="fake-range-ruler fake-range-dual"><span></span><span></span><span></span></div>'
        : w.type === 'slider'
          ? '<div class="fake-range-ruler fake-range-single"><span></span><span></span><span></span></div>'
          : '<div class="fake-control">' + esc(txt) + '</div>';
      return '<div class="preview-input"><div><strong>' + esc(w.label || w.title || itemFor(w.type).title) + '</strong></div>' + control + '<div>' + esc(tag) + ' · data: ' + esc(w.data || firstDataset()) + '</div></div>';
    }
    if (w.type === 'metric') return '<div class="preview-metric"><div>' + esc(w.title || w.label || 'Metric') + '</div><div class="metric-value">123</div><div>' + esc((w.measure && w.measure.op) || 'count') + (w.suffix ? ' · ' + esc(w.suffix) : '') + '</div></div>';
    if (w.type === 'table') return '<div class="preview-table"><div class="preview-row"><div class="preview-cell"><b>' + esc((w.columns || colsFor(w.data))[0] || 'col1') + '</b></div><div class="preview-cell"><b>' + esc((w.columns || colsFor(w.data))[1] || 'col2') + '</b></div><div class="preview-cell"><b>' + esc((w.columns || colsFor(w.data))[2] || 'col3') + '</b></div></div><div class="preview-row"><div class="preview-cell">...</div><div class="preview-cell">...</div><div class="preview-cell">...</div></div><div class="preview-row"><div class="preview-cell">...</div><div class="preview-cell">...</div><div class="preview-cell">...</div></div></div>';
    if (PLOT_TYPES.has(w.type)) return '<div class="plot-preview"><strong>' + esc(w.title || itemFor(w.type).title) + '</strong><div class="preview-plot abstract ' + esc(w.type) + '"><span></span><span></span><span></span><span></span><span></span><span></span></div><small>' + esc(w.type) + ' · palette ' + esc(w.palette || (state.manifest.theme && state.manifest.theme.plotPalette) || 'okabe') + '</small></div>';
    if (w.type === 'webr') return '<div><strong>' + esc(w.title || 'R snippet') + '</strong><pre class="code-preview">' + esc(w.code || 'summary(bd_data)') + '</pre><p>' + (w.visible === false ? 'Hidden in export, still auto-runs.' : 'Visible and auto-runs in export.') + '</p></div>';
    if (w.type === 'markdown') return '<div><strong>' + esc(w.title || 'Markdown') + '</strong><p>' + esc((w.markdown || '').replace(/[#*_`]/g, '').slice(0, 130)) + '</p></div>';
    if (w.type === 'html') return '<div><strong>' + esc(w.title || 'HTML') + '</strong><div class="html-preview">' + (w.html || '') + '</div></div>';
    if (w.type === 'rplot') return '<div class="plot-preview"><strong>' + esc(w.title || 'R plot viewer') + '</strong><div class="preview-plot abstract rplot"><span></span><span></span><span></span><span></span><span></span><span></span></div><small>Receives SVG or PNG plot from upstream webR</small></div>';
    return '<div>' + esc(w.type) + '</div>';
  }

  function renderInspector() {
    var tabs = '<div class="tabs"><button class="tab ' + (state.inspectorTab === 'project' ? 'active' : '') + '" data-tab="project">Project</button><button class="tab ' + (state.inspectorTab === 'component' ? 'active' : '') + '" data-tab="component">Component</button><button class="tab ' + (state.inspectorTab === 'data' ? 'active' : '') + '" data-tab="data">Data & R</button><button class="tab ' + (state.inspectorTab === 'checks' ? 'active' : '') + '" data-tab="checks">Checks</button></div>';
    var content = state.inspectorTab === 'data' ? renderDataTab() : state.inspectorTab === 'checks' ? renderChecksTab() : state.inspectorTab === 'component' ? renderComponentTab() : renderProjectTab();
    return '<aside class="panel inspector" id="inspector-pane"><div class="panel-head"><h2 class="panel-title">Inspector</h2><p class="panel-note">Edit global settings, selected components, local data, or graph checks.</p></div>' + tabs + '<div class="panel-body">' + content + '</div></aside>';
  }
  function renderProjectTab() {
    var m = state.manifest;
    var html = '<div class="form-grid"><div class="help-box"><b>Project file</b><br>' + esc(state.projectFile || '(not saved yet)') + '</div>';
    html += field('Dashboard title', 'text', 'project.title', m.title || '');
    html += textArea('Dashboard subtitle', 'project.subtitle', m.subtitle || '', 4);
    html += '<div class="section-title">Open and save as</div>' + field('Open local design path (.yml/.yaml/.json or directory)', 'text', 'state.openPath', state.openPath) + '<button class="btn" id="open-path-btn">Open design</button><div class="field"><label>Import design file from browser</label><label class="file-picker" for="design-file-input">Choose YAML or JSON file</label><input id="design-file-input" class="file-native" type="file" accept=".yml,.yaml,.json,application/json"></div>' + field('Save as local path', 'text', 'state.saveAsPath', state.saveAsPath) + '<button class="btn soft" id="save-as-path-btn">Save as</button>';
    html += '<div class="section-title">Theme and formatting</div>';
    html += selectField('Builder theme', 'project.theme.builderName', m.theme.builderName || m.theme.name || 'aurora', objectOptions(THEMES));
    html += selectField('Exported dashboard theme', 'project.theme.dashboardName', m.theme.dashboardName || m.theme.name || 'aurora', objectOptions(THEMES));
    html += selectField('Font', 'project.theme.font', m.theme.font || 'Inter', objectOptions(FONTS));
    html += field('Exported dashboard base font size, px', 'number', 'project.theme.baseFontSize', m.theme.baseFontSize || 16);
    html += selectField('Default plot palette', 'project.theme.plotPalette', m.theme.plotPalette || 'okabe', objectOptions(PALETTES));
    html += selectField('Decimal separator', 'project.format.decimal', (m.format && m.format.decimal) || '.', [['.', 'Decimal dot: 1.23'], [',', 'Decimal comma: 1,23']]);
    html += '<div class="section-title">Generated text and badge</div>';
    html += checkboxField('Show badge near title', 'project.export.showBadge', m.export.showBadge !== false) + field('Badge text', 'text', 'project.export.badgeText', m.export.badgeText || '');
    html += checkboxField('Show generated-by footer', 'project.export.showGeneratedBy', m.export.showGeneratedBy !== false) + field('Footer text', 'text', 'project.export.generatedBy', m.export.generatedBy || '');
    html += '<div class="section-title">Canvas</div>' + field('Canvas grid size, px', 'number', 'project.graph.canvas.grid', (m.graph.canvas && m.graph.canvas.grid) || 20);
    html += '<div class="field-row"><button class="btn danger" id="clear-btn-2">Clear canvas</button><button class="btn" id="align-btn-2">Auto-align</button></div>';
    html += '</div>';
    return html;
  }
  function hasUpstreamWebR(id) {
    var ids = new Set(state.edges.filter(function (e) { return e.target === id; }).map(function (e) { return e.source; }));
    return (state.manifest.widgets || []).some(function (w) { return w.type === 'webr' && ids.has(w.id); });
  }

  function renderComponentTab() {
    var w = selectedWidget();
    var n = selectedNode();
    if (!w || !n) return '<div class="help-box">Select a component on the canvas, or drag one from the shelf. Click an arrow to highlight the linked widgets.</div>' + renderEdgeDetails();
    var ds = w.data || firstDataset();
    var cols = colsFor(ds); var nums = numColsFor(ds); var cats = catColsFor(ds); var dates = dateColsFor(ds); var bools = boolColsFor(ds);
    var webROwned = ['table', 'html', 'markdown', 'rplot'].indexOf(w.type) >= 0 && hasUpstreamWebR(w.id);
    var html = '<div class="form-grid"><div class="help-box"><b>' + esc(itemFor(w.type).title) + '</b> · ' + esc(w.role) + ' · id: <code>' + esc(w.id) + '</code><br>' + esc(HELP[w.type] || '') + '</div>';
    if (webROwned) {
      html += '<div class="help-box"><b>Value supplied by webR</b><br>This component is connected to a webR processor, so its content is obtained from the upstream R result. Local data, Markdown, HTML, table-column, and plot settings are intentionally disabled here. Edit the upstream webR widget or remove the arrow to configure this component manually.</div>';
    } else {
      html += field('Label or title', 'text', 'widget.labelTitle', (w.role === 'input' || w.type === 'metric') ? (w.label || w.title || '') : (w.title || w.label || ''));
      if (w.type !== 'button') html += selectField('Dataset', 'widget.data', w.data || firstDataset(), datasets());
    }
    if (!webROwned && w.role === 'input') {
      if (w.type === 'toggle') html += selectField('Boolean/logical field', 'widget.field', w.field || '', bools.length ? bools : cols);
      else if (w.type === 'date' || w.type === 'daterange') html += selectField('Date-like field', 'widget.field', w.field || '', dates.length ? dates : cols);
      else if (['slider', 'range', 'number'].indexOf(w.type) >= 0) html += selectField('Numeric field', 'widget.field', w.field || '', nums.length ? nums : cols);
      else html += selectField('Categorical/text field', 'widget.field', w.field || '', ['*'].concat(w.type === 'search' ? cols : (cats.length ? cats : cols)));
      if (w.type === 'selectize') html += checkboxField('Allow multiple values', 'widget.multiple', w.multiple !== false);
      if (['slider', 'number', 'date'].indexOf(w.type) >= 0) html += selectField('Operator', 'widget.operator', w.operator || '<=', ['<=', '>=', '==', '!=', '<', '>']);
      if (['slider', 'range', 'number'].indexOf(w.type) >= 0) { var irg = rangeFor(w.data || firstDataset(), w.field); html += '<div class="field-row">' + field('Minimum', 'number', 'widget.min', w.min == null ? irg[0] : w.min) + field('Maximum', 'number', 'widget.max', w.max == null ? irg[1] : w.max) + '</div>' + field('Step', 'number', 'widget.step', w.step || sensibleStep(irg)); }
      if (w.placeholder != null || ['search', 'text'].indexOf(w.type) >= 0) html += field('Placeholder', 'text', 'widget.placeholder', w.placeholder || '');
    } else if (!webROwned) {
      if (w.type === 'metric') { html += selectField('Metric operation', 'widget.measure.op', (w.measure && w.measure.op) || 'count', AGGREGATES); html += selectField('Metric field', 'widget.measure.field', (w.measure && w.measure.field) || '', [''].concat(nums)); html += field('Digits', 'number', 'widget.digits', w.digits == null ? 1 : w.digits) + field('Suffix', 'text', 'widget.suffix', w.suffix || ''); }
      if (w.type === 'table') html += field('Page size', 'number', 'widget.pageSize', w.pageSize || 12) + field('Columns, comma-separated', 'text', 'widget.columnsText', (w.columns || cols).join(', '));
      if (PLOT_TYPES.has(w.type)) {
        html += selectField('Palette for this plot', 'widget.palette', w.palette || (state.manifest.theme && state.manifest.theme.plotPalette) || 'okabe', objectOptions(PALETTES));
        html += selectField('X field', 'widget.x', w.x || '', cols);
        if (w.type !== 'histogram') html += selectField('Y field', 'widget.y', w.y || '', nums.length ? nums : cols);
        if (['scatter', 'line'].indexOf(w.type) >= 0) html += selectField('Color field', 'widget.color', w.color || '', [''].concat(cols));
        if (['bar', 'heatmap', 'pie'].indexOf(w.type) >= 0) html += selectField('Aggregate', 'widget.aggregate', w.aggregate || 'count', AGGREGATES);
        if (w.type === 'bar') {
          html += selectField('Bar colors', 'widget.colorMode', w.colorMode || w.barColorMode || 'category', [['category', 'Different colors by category'], ['single', 'Same color for all bars']]);
          html += selectField('Sort bars', 'widget.barSort', w.barSort || w.sortBars || 'category', [['category', 'By X axis categories'], ['value_desc', 'By size, decreasing'], ['value_asc', 'By size, increasing']]);
          html += checkboxField('Show values when hovering over bars', 'widget.showHoverValues', w.showHoverValues !== false);
        }
        if (w.type === 'histogram') html += rangeField('Number of bins', 'widget.bins', w.bins || 20, 2, 120, 1);
      }
      if (w.type === 'markdown') html += '<div class="help-box">Use Markdown, including fenced code blocks, math expressions, and Mermaid-style diagram blocks. With incoming arrows from inputs, insert their values as <code>{{input_id}}</code> or <code>{{param.input_id}}</code>.</div>' + checkboxField('Soft wrap code editor', 'widget.softWrap', w.softWrap !== false) + codeArea('Markdown', 'widget.markdown', w.markdown || '', 10, 'markdown', w.softWrap !== false);
      if (w.type === 'html') html += '<div class="help-box">Trusted HTML is rendered directly. With incoming arrows from inputs, insert values as <code>{{input_id}}</code> or <code>{{param.input_id}}</code>. <code>&lt;script&gt;</code> tags inserted inside this block are not intentionally executed. Keep JavaScript out of HTML widgets; use widget wiring or webR for logic.</div>' + checkboxField('Soft wrap code editor', 'widget.softWrap', w.softWrap !== false) + codeArea('Trusted HTML', 'widget.html', w.html || '', 10, 'html', w.softWrap !== false);
      if (w.type === 'rplot') html += '<div class="help-box">This viewer displays an upstream webR plot. Draw an arrow from a webR processor to this widget. Use the webR widget result type <code>plot</code>, or connect a webR processor to this R plot viewer so BlinkDash forces plot mode. For ggplot2/lattice/grid, use <code>p &lt;- ...</code> followed by <code>print(p)</code>.</div>';
      if (w.type === 'webr') { html += '<div class="help-box"><b>R objects available in webR</b><br><code>bd_data</code>: R data.frame with rows filtered by inputs connected to this webR widget. <code>bd_state</code>: named R list of every dashboard input state. <code>bd_params</code>: named R list of directly connected upstream values only. Return a string, HTML string, Markdown string, data.frame/data.table-like object, or draw/return a plot. For ggplot2, lattice, and grid plots, assign the plot to an object and call print(p) explicitly so the SVG graphics device receives drawing commands. Packages listed below are installed and attached in webR before the snippet runs; large packages can take time to download and install the first time.</div>'; html += selectField('Result type', 'widget.outputType', w.outputType || 'auto', ['auto', 'text', 'markdown', 'html', 'table', 'plot']); html += checkboxField('Visible in exported dashboard', 'widget.visible', w.visible !== false); html += checkboxField('Auto-run after opening and after upstream input changes', 'widget.autoRun', w.autoRun !== false); html += selectField('Console output mode', 'widget.consoleTheme', w.consoleTheme || 'dark', ['dark', 'light']); html += field('Packages to install and attach, comma-separated', 'text', 'widget.packages', w.packages || ''); html += checkboxField('Soft wrap code editor', 'widget.softWrap', w.softWrap !== false); html += codeArea('R code', 'widget.code', w.code || '', 12, 'r', w.softWrap !== false); }
    }
    html += '<div class="section-title">Size and position</div><div class="field-row">' + field('Left', 'number', 'node.x', n.x) + field('Top', 'number', 'node.y', n.y) + '</div><div class="field-row">' + field('Width', 'number', 'node.width', n.width) + field('Height', 'number', 'node.height', n.height) + '</div>';
    html += '<button class="btn danger" id="remove-selected">Remove selected widget</button>' + renderEdgeDetails() + '</div>';
    return html;
  }
  function renderEdgeDetails() {
    var rows = state.edges.filter(function (e) { return e.source === state.selected || e.target === state.selected || e.id === state.selectedEdge; });
    var html = '<div class="section-title">Links</div>';
    if (state.selectedEdge) { var e = state.edges.find(function (x) { return x.id === state.selectedEdge; }); if (e) html += '<div class="help-box"><b>Selected arrow</b><br><code>' + esc(e.source) + '</code> → <code>' + esc(e.target) + '</code></div>'; }
    if (!rows.length) return html + '<div class="help-box">No arrows are attached to the selected item.</div>';
    return html + rows.map(function (e) { return '<div class="connection-row ' + (e.id === state.selectedEdge ? 'active' : '') + '"><span><code>' + esc(e.source) + '</code> → <code>' + esc(e.target) + '</code></span><button class="btn small danger" data-delete-edge="' + esc(e.id) + '">Delete</button></div>'; }).join('');
  }

  function renderDatasetManager() {
    var names = datasets();
    var rows = names.map(function (name) {
      var dataRows = rowsFor(name);
      var cols = colsFor(name);
      var usedBy = (state.manifest.widgets || []).filter(function (w) { return w.data === name; }).map(function (w) { return w.id; });
      var used = usedBy.length ? '<span class="dataset-used">used by ' + esc(usedBy.length) + ' widget' + (usedBy.length === 1 ? '' : 's') + '</span>' : '<span class="dataset-free">unused</span>';
      return '<div class="dataset-row"><div><strong>' + esc(name) + '</strong><br><span>' + esc(dataRows.length) + ' rows · ' + esc(cols.length) + ' columns · ' + used + '</span></div><button class="btn small danger" data-delete-dataset="' + esc(name) + '">Delete</button></div>';
    }).join('');
    if (!rows) rows = '<div class="help-box">No datasets are embedded yet. Import from disk, import from the R session, or save an R pre-calculation result as a dataset.</div>';
    return '<div class="section-title">Embedded datasets</div><div class="help-box">Every embedded dataset is written into the design file and exported static dashboard. Delete unused or obsolete datasets here to keep the project small. Deleting a dataset is undoable until the design is saved.</div>' + rows;
  }

  function renderDataTab() {
    var envNames = asOptionArray(state.envDataNames);
    var envOptions = envNames.length ? envNames : [''];
    return '<div class="form-grid"><div class="help-box">R runs locally in this builder only. <code>bd_data</code> is the selected dataset as an R data frame. A BlinkDash design can embed <b>multiple datasets</b>; each widget chooses one dataset unless it receives a webR result. Local file import supports CSV, TSV/TAB, RDS, RDA/RData, JSON, and, when the <code>arrow</code> package is installed, Parquet and Feather.</div>' +
      renderDatasetManager() +
      '<div class="section-title">Import local data from disk</div>' + field('Local file path', 'text', 'state.importPath', state.importPath) + field('Dataset name', 'text', 'state.importName', state.importName) + '<button class="btn soft" id="import-btn">Import file</button>' +
      '<div class="section-title">Import data already in this R session</div><div class="help-box">The builder can see data.frames and matrices in the R environment from which <code>run_builder()</code> was called. Matrices are converted to data frames before embedding.</div>' + selectField('R object', 'state.envName', state.envName, envOptions) + '<div class="field-row"><button class="btn" id="refresh-env-btn">Refresh R objects</button><button class="btn soft" id="import-env-btn">Import R object</button></div>' +
      '<div class="section-title">R code editor</div>' + selectField('Input dataset', 'state.rData', state.rData || firstDataset(), datasets()) + codeArea('R code, with bd_data available', 'state.rCode', state.rCode, 12, 'r') + '<div class="field-row"><button class="btn" id="run-r-btn">Run R</button><button class="btn primary" id="precalc-btn">Save result as dataset</button></div>' + field('New dataset name', 'text', 'state.rName', state.rName) + '<div class="result-box">' + esc(state.output || 'Output will appear here.') + '</div></div>';
  }

  function validate() {
    var issues = [];
    if (!datasets().length) issues.push({ type: 'warn', text: 'No datasets are embedded.' });
    if (!state.nodes.length) issues.push({ type: 'warn', text: 'No components are on the canvas.' });
    var ids = new Set((state.manifest.widgets || []).map(function (w) { return w.id; }));
    state.edges.forEach(function (e) { if (!ids.has(e.source) || !ids.has(e.target)) issues.push({ type: 'warn', text: 'Broken edge: ' + e.source + ' → ' + e.target }); });
    (state.manifest.widgets || []).filter(function (w) { return w.role === 'output' && !['markdown', 'html'].includes(w.type); }).forEach(function (w) { if (!state.edges.some(function (e) { return e.target === w.id; })) issues.push({ type: 'warn', text: 'Output is not linked to any input: ' + w.id }); });
    (state.manifest.widgets || []).filter(function (w) { return w.type === 'toggle'; }).forEach(function (w) { if (profileCol(w.data, w.field) !== 'logical') issues.push({ type: 'warn', text: 'Toggle ' + w.id + ' is not using a clearly Boolean/logical field.' }); });
    if (!issues.length) issues.push({ type: 'good', text: 'No obvious issues. The graph can be saved and exported.' });
    return issues;
  }
  function renderChecksTab() { return '<div class="form-grid"><div class="help-box">Checks look for broken links, missing data, disconnected outputs, and column-type mismatches.</div>' + validate().map(function (x) { return '<div class="check-row ' + x.type + '"><span>' + esc(x.type === 'good' ? '✓' : '!') + ' ' + esc(x.text) + '</span></div>'; }).join('') + '<button class="btn soft" id="save-btn-2">Save project</button></div>'; }

  function field(label, type, prop, value) { return '<div class="field"><label>' + esc(label) + '</label><input data-prop="' + esc(prop) + '" type="' + esc(type) + '" value="' + esc(value == null ? '' : value) + '"></div>'; }
  function rangeField(label, prop, value, min, max, step) { return '<div class="field range-field"><label>' + esc(label) + ': <strong>' + esc(value == null ? '' : value) + '</strong></label><input data-prop="' + esc(prop) + '" type="range" min="' + esc(min) + '" max="' + esc(max) + '" step="' + esc(step || 1) + '" value="' + esc(value == null ? '' : value) + '"></div>'; }
  function checkboxField(label, prop, value) { return '<label class="checkline"><input data-prop="' + esc(prop) + '" type="checkbox" ' + (value ? 'checked' : '') + '> <span>' + esc(label) + '</span></label>'; }
  function selectField(label, prop, value, options) {
    options = asOptionArray(options);
    return '<div class="field"><label>' + esc(label) + '</label><select data-prop="' + esc(prop) + '">' + options.map(function (o) {
      var val = Array.isArray(o) ? o[0] : o;
      var lab = Array.isArray(o) ? o[1] : o;
      return '<option value="' + esc(val) + '" ' + (String(val) === String(value) ? 'selected' : '') + '>' + esc(lab || '(none)') + '</option>';
    }).join('') + '</select></div>';
  }
  function textArea(label, prop, value, rows, klass) { return '<div class="field"><label>' + esc(label) + '</label><textarea data-prop="' + esc(prop) + '" rows="' + esc(rows || 6) + '" class="' + esc(klass || '') + '">' + esc(value || '') + '</textarea></div>'; }
  function codeArea(label, prop, value, rows, lang, softWrap) {
    var id = 'code_' + prop.replace(/[^A-Za-z0-9]+/g, '_');
    var val = value || '';
    var wrapOn = softWrap === true;
    var cls = 'code-editor-wrap' + (wrapOn ? ' soft-wrap' : '');
    return '<div class="field code-field"><label>' + esc(label) + '</label><div class="' + cls + '" data-lang="' + esc(lang || '') + '"><pre class="code-highlight" id="' + esc(id) + '_highlight" aria-hidden="true">' + highlightCode(val, lang) + '</pre><textarea data-prop="' + esc(prop) + '" data-code-lang="' + esc(lang || '') + '" data-highlight-target="' + esc(id) + '_highlight" rows="' + esc(rows || 8) + '" class="code code-overlay" spellcheck="false" wrap="' + (wrapOn ? 'soft' : 'off') + '">' + esc(val) + '</textarea></div></div>';
  }
  function highlightCode(text, lang) { return lang === 'r' ? highlightR(text) : lang === 'yaml' ? highlightYaml(text) : lang === 'html' ? highlightHtml(text) : esc(text); }
  function highlightYaml(text) {
    var e = esc(text || '');
    e = e.replace(/^([ \t-]*)([A-Za-z0-9_.-]+):(.*)$/gm, function(_, a, k, rest) { return a + '<span class="tok-key">' + k + '</span>:<span class="tok-val">' + rest + '</span>'; });
    e = e.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-str">$1</span>');
    e = e.replace(/\b(TRUE|FALSE|true|false|null|NA)\b/g, '<span class="tok-bool">$1</span>');
    return e;
  }
  function highlightR(text) {
    var e = esc(text || '');
    e = e.replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>');
    e = e.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-str">$1</span>');
    e = e.replace(/\b(function|if|else|for|while|repeat|return|in|TRUE|FALSE|NULL|NA|invisible|data\.frame|list|summary|library)\b/g, '<span class="tok-keyword">$1</span>');
    e = e.replace(/\b(bd_data|bd_state|bd_params|bd_manifest)\b/g, '<span class="tok-special">$1</span>');
    return e;
  }
  function highlightHtml(text) {
    var e = esc(text || '');
    e = e.replace(/(&lt;\/?)([A-Za-z0-9-]+)/g, '$1<span class="tok-keyword">$2</span>');
    e = e.replace(/([A-Za-z-]+)=(&quot;.*?&quot;)/g, '<span class="tok-key">$1</span>=<span class="tok-str">$2</span>');
    return e;
  }
  function renderYamlTree(obj, label, depth) {
    label = label || 'dashboard'; depth = depth || 0;
    if (obj == null || typeof obj !== 'object') return '<div class="yaml-leaf"><span>' + esc(label) + '</span><code>' + esc(String(obj)) + '</code></div>';
    var keys = Array.isArray(obj) ? obj.map(function(_, i){ return i; }) : Object.keys(obj);
    var summary = esc(label) + ' <span>' + keys.length + (Array.isArray(obj) ? ' items' : ' keys') + '</span>';
    var children = keys.slice(0, 200).map(function(k){ return renderYamlTree(obj[k], String(k), depth + 1); }).join('');
    return '<details class="yaml-tree" ' + (depth < 2 ? 'open' : '') + '><summary>' + summary + '</summary><div class="yaml-tree-children">' + children + '</div></details>';
  }
  function objectOptions(obj) { return Object.keys(obj || {}).map(function (k) { return [k, obj[k].label || k]; }); }
  function asOptionArray(options) {
    if (Array.isArray(options)) return options;
    if (options == null) return [];
    if (typeof options === 'string' || typeof options === 'number' || typeof options === 'boolean') return [options];
    if (typeof options === 'object') {
      var vals = Object.keys(options).map(function (k) { return options[k]; });
      if (vals.every(function (v) { return v == null || typeof v !== 'object'; })) return vals;
      return Object.keys(options).map(function (k) {
        var v = options[k] || {};
        return [k, v.label || v.name || k];
      });
    }
    return [];
  }
  function optionValue(o) { return Array.isArray(o) ? o[0] : o; }

  function attachHandlers() {
    var title = byId('title-input');
    if (title) { title.addEventListener('focus', function () { title.dataset.before = title.value; }); title.addEventListener('input', function () { state.manifest.title = title.value; markDirty(); renderTopStatus(); }); title.addEventListener('change', function () { if (title.dataset.before !== title.value) pushHistory(); }); }
    document.querySelectorAll('[data-mode]').forEach(function (el) { el.addEventListener('click', function () { var mode = el.getAttribute('data-mode'); if (mode === 'yaml') refreshYaml(true).then(function () { state.mode = 'yaml'; render(); }); else { state.mode = 'visual'; render(); } }); });
    var search = byId('shelf-search'); if (search) search.addEventListener('input', function () { state.search = search.value; render(); });
    document.querySelectorAll('.component-card').forEach(function (el) { el.addEventListener('dragstart', function (ev) { ev.dataTransfer.setData('text/plain', el.getAttribute('data-type')); ev.dataTransfer.effectAllowed = 'copy'; }); });
    var space = byId('canvas-space');
    if (space) { space.addEventListener('dragover', function (ev) { ev.preventDefault(); ev.dataTransfer.dropEffect = 'copy'; }); space.addEventListener('drop', function (ev) { ev.preventDefault(); var type = ev.dataTransfer.getData('text/plain'); if (!type) return; var rect = space.getBoundingClientRect(); addWidget(type, Math.round(ev.clientX - rect.left), Math.round(ev.clientY - rect.top)); }); }
    document.querySelectorAll('.bd-node').forEach(function (el) { el.addEventListener('click', function (ev) { var id = el.getAttribute('data-id'); if (state.selected !== id) { state.selected = id; state.selectedEdge = null; state.inspectorTab = 'component'; render(); } ev.stopPropagation(); }); });
    document.querySelectorAll('.node-head').forEach(function (el) { el.addEventListener('pointerdown', nodePointerDown); });
    document.querySelectorAll('.resize-handle').forEach(function (el) { el.addEventListener('pointerdown', resizePointerDown); });
    document.querySelectorAll('.handle.source').forEach(function (el) { el.addEventListener('pointerdown', connectStart); });
    document.querySelectorAll('[data-remove]').forEach(function (el) { el.addEventListener('click', function (ev) { ev.stopPropagation(); removeWidget(el.getAttribute('data-remove')); }); });
    document.querySelectorAll('[data-info]').forEach(function (el) { el.addEventListener('click', function (ev) { ev.stopPropagation(); showWidgetHelp(el.getAttribute('data-info')); }); });
    document.querySelectorAll('[data-tab]').forEach(function (el) { el.addEventListener('click', function () { state.inspectorTab = el.getAttribute('data-tab'); render(); }); });
    document.querySelectorAll('[data-prop]').forEach(function (el) {
      if (el.tagName === 'INPUT' && el.type === 'number') bindNumberWheel(el);
      if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && ['text', 'search', 'number'].indexOf(el.type) >= 0)) el.addEventListener('input', propLiveInput);
      el.addEventListener('change', propChange);
    });
    document.querySelectorAll('[data-delete-edge]').forEach(function (el) { el.addEventListener('click', function () { removeEdge(el.getAttribute('data-delete-edge')); }); });
    document.querySelectorAll('[data-delete-dataset]').forEach(function (el) { el.addEventListener('click', function () { deleteDataset(el.getAttribute('data-delete-dataset')); }); });
    bind('save-btn', saveProject); bind('save-btn-2', saveProject); bind('compile-view-btn', compileAndViewProject); bind('export-btn', exportProject); bind('undo-btn', undo); bind('redo-btn', redo);
    bind('manual-btn', openManual); bind('manual-btn-2', openManual); bind('open-prompt-btn', openPrompt); bind('save-as-prompt-btn', saveAsPrompt);
    bind('fit-btn', goTopLeft); bind('align-btn', autoAlign); bind('align-btn-2', autoAlign); bind('clear-btn', clearCanvas); bind('clear-btn-2', clearCanvas);
    bind('remove-selected', function () { if (state.selected) removeWidget(state.selected); }); bind('canvas-help-close', dismissCanvasHelp);
    bind('import-btn', importData); bind('run-r-btn', runR); bind('precalc-btn', precalcR); bind('open-path-btn', openPath); bind('save-as-path-btn', saveAsPath);
    var designFile = byId('design-file-input'); if (designFile) designFile.addEventListener('change', importDesignFile);
    bind('refresh-env-btn', loadEnvDataNames); bind('import-env-btn', importEnvData);
    attachInspectorResize(); attachCodeEditors();
    bind('yaml-refresh-btn', function () { refreshYaml(false); }); bind('yaml-apply-btn', applyYaml); bind('yaml-save-btn', function () { applyYaml().then(saveProject); });
    var yed = byId('yaml-editor'); if (yed) { yed.addEventListener('input', function () { state.yamlText = yed.value; state.yamlDirty = true; var h = byId('yaml-highlight'); if (h) h.innerHTML = highlightYaml(yed.value); markDirty(); renderTopStatus(); }); yed.addEventListener('scroll', function(){ var h = byId('yaml-highlight'); if (h) { h.scrollTop = yed.scrollTop; h.scrollLeft = yed.scrollLeft; } }); }
    document.querySelectorAll('[data-modal-close]').forEach(function (el) { el.addEventListener('click', function () { state.modal = null; render(); }); });
  }
  function bind(id, fn) { var el = byId(id); if (el) el.addEventListener('click', fn); }
  function attachInspectorResize() {
    var sp = byId('inspector-splitter'); if (!sp || sp.dataset.ready) return; sp.dataset.ready = '1';
    sp.addEventListener('pointerdown', function(ev) {
      ev.preventDefault(); var startX = ev.clientX; var startW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--inspector-w')) || 380;
      function move(e) { var w = Math.max(300, Math.min(720, startW - (e.clientX - startX))); document.documentElement.style.setProperty('--inspector-w', w + 'px'); try { localStorage.setItem('blinkdash-inspector-w', String(w)); } catch(_) {} }
      function up() { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); }
      document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
    });
  }
  function attachCodeEditors() {
    document.querySelectorAll('textarea[data-highlight-target]').forEach(function(t) {
      var h = byId(t.getAttribute('data-highlight-target')); if (!h) return;
      var lang = t.getAttribute('data-code-lang') || '';
      h.innerHTML = highlightCode(t.value, lang);
      t.addEventListener('input', function(){ h.innerHTML = highlightCode(t.value, lang); });
      t.addEventListener('scroll', function(){ h.scrollTop = t.scrollTop; h.scrollLeft = t.scrollLeft; });
      t.addEventListener('keydown', function(ev){ if (ev.key === 'Tab') { ev.preventDefault(); var a=t.selectionStart,b=t.selectionEnd; t.value=t.value.slice(0,a)+'  '+t.value.slice(b); t.selectionStart=t.selectionEnd=a+2; h.innerHTML=highlightCode(t.value,lang); t.dispatchEvent(new Event('change', {bubbles:true})); } });
    });
  }
  function renderTopStatus() { var pill = document.querySelector('.status-pill'); if (pill) { pill.className = 'status-pill ' + (state.dirty ? 'dirty' : ''); pill.innerHTML = '<span class="status-dot"></span>' + (state.dirty ? 'Unsaved' : 'Saved in memory'); } }

  function rawPropValue(el) {
    return el.type === 'checkbox' ? el.checked : ((el.type === 'number' || el.type === 'range') ? Number(el.value) : el.value);
  }
  function bindNumberWheel(el) {
    if (!el || el.type !== 'number' || el.dataset.bdWheelBound) return;
    el.dataset.bdWheelBound = '1';
    el.addEventListener('wheel', function (ev) {
      if (el.disabled || el.readOnly) return;
      ev.preventDefault();
      ev.stopPropagation();
      try { el.focus({ preventScroll: true }); } catch (_) { try { el.focus(); } catch (_) {} }
      var before = el.value;
      var up = Number(ev.deltaY || 0) < 0;
      try { if (up) el.stepUp(); else el.stepDown(); }
      catch (_) {
        var step = Number(el.step) > 0 ? Number(el.step) : 1;
        var current = Number.isFinite(Number(el.value)) ? Number(el.value) : Number(el.min || 0);
        var min = el.min === '' ? -Infinity : Number(el.min);
        var max = el.max === '' ? Infinity : Number(el.max);
        var next = current + (up ? step : -step);
        el.value = String(Math.min(Number.isFinite(max) ? max : Infinity, Math.max(Number.isFinite(min) ? min : -Infinity, next)));
      }
      if (el.value !== before) el.dispatchEvent(new Event('input', { bubbles: true }));
    }, { passive: false });
  }
  function setPropValue(prop, valRaw) {
    if (!prop) return;
    if (prop.indexOf('state.') === 0) { state[prop.split('.')[1]] = valRaw; return; }
    if (prop.indexOf('project.') === 0) { setDeep(state.manifest, prop.replace(/^project\./, ''), valRaw); return; }
    var w = selectedWidget(); var n = selectedNode(); if (!w || !n) return;
    if (prop.indexOf('node.') === 0) { n[prop.split('.')[1]] = Number(valRaw) || 0; return; }
    if (prop.indexOf('widget.') === 0) prop = prop.replace(/^widget\./, '');
    if (prop === 'labelTitle') {
      if (w.role === 'input' || w.type === 'metric') {
        w.label = valRaw;
        if (w.type === 'metric') delete w.title;
      } else {
        w.title = valRaw;
      }
      return;
    }
    if (prop === 'columnsText') { w.columns = String(valRaw).split(',').map(function (x) { return x.trim(); }).filter(Boolean); return; }
    setDeep(w, prop, valRaw);
    if (prop === 'data') { var cols = colsFor(valRaw); if (w.field && cols.indexOf(w.field) < 0 && w.field !== '*') w.field = cols[0] || ''; }
    if ((prop === 'field' || prop === 'data') && ['slider', 'range', 'number'].indexOf(w.type) >= 0) {
      var rg = rangeFor(w.data || firstDataset(), w.field);
      if (w.min == null || prop === 'field') w.min = rg[0];
      if (w.max == null || prop === 'field') w.max = rg[1];
      if (w.step == null || prop === 'field') w.step = sensibleStep(rg);
      if (w.type === 'range') w.default = [w.min, w.max];
      else if (w.default == null || prop === 'field') w.default = w.operator === '<=' ? w.max : w.min;
    }
  }
  function propLiveInput(ev) {
    var prop = ev.target.getAttribute('data-prop');
    if (!prop) return;
    setPropValue(prop, rawPropValue(ev.target));
    markDirty();
    renderTopStatus();
    var ht = ev.target.getAttribute('data-highlight-target');
    if (ht) { var h = byId(ht); if (h) h.innerHTML = highlightCode(ev.target.value, ev.target.getAttribute('data-code-lang') || ''); }
  }

  function propChange(ev) {
    var prop = ev.target.getAttribute('data-prop');
    if (!prop) return;
    if (prop.indexOf('state.') === 0) { setPropValue(prop, rawPropValue(ev.target)); return; }
    pushHistory();
    setPropValue(prop, rawPropValue(ev.target));
    markDirty();
    render();
  }
  function setDeep(obj, path, value) { var parts = path.split('.'); var cur = obj; for (var i = 0; i < parts.length - 1; i++) { cur[parts[i]] = cur[parts[i]] || {}; cur = cur[parts[i]]; } cur[parts[parts.length - 1]] = value; }

  function addWidget(type, x, y) { pushHistory(); var w = defaultWidget(type); w.id = uniqueId(type); var sz = defaultSize(type); w.layout = layoutFromNode({ x: x, y: y, width: sz.width, height: sz.height }); state.manifest.widgets.push(w); state.nodes.push({ id: w.id, x: x, y: y, width: sz.width, height: sz.height }); state.selected = w.id; state.selectedEdge = null; state.inspectorTab = 'component'; markDirty(); render(); toast('Added ' + itemFor(type).title); }
  function removeWidget(id) { pushHistory(); state.manifest.widgets = (state.manifest.widgets || []).filter(function (w) { return w.id !== id; }); state.nodes = state.nodes.filter(function (n) { return n.id !== id; }); state.edges = state.edges.filter(function (e) { return e.source !== id && e.target !== id; }); if (state.selected === id) state.selected = state.nodes.length ? state.nodes[0].id : null; if (state.selectedEdge && !state.edges.some(function (e) { return e.id === state.selectedEdge; })) state.selectedEdge = null; markDirty(); render(); }
  function removeEdge(id) { pushHistory(); state.edges = state.edges.filter(function (e) { return e.id !== id; }); if (state.selectedEdge === id) state.selectedEdge = null; markDirty(); render(); }
  function clearCanvas() { if (!confirm('Remove all widgets and arrows, keeping datasets and project settings?')) return; pushHistory(); state.manifest.widgets = []; state.nodes = []; state.edges = []; state.selected = null; state.selectedEdge = null; markDirty(); render(); }
  function autoAlign() { pushHistory(); var inputs = state.nodes.filter(function (n) { var w = widget(n.id); return w && w.role === 'input'; }); var outputs = state.nodes.filter(function (n) { var w = widget(n.id); return !w || w.role !== 'input'; }); var y1 = 70; inputs.forEach(function (n) { n.x = 60; n.y = y1; y1 += n.height + 34; }); var y2 = 60, col = 0; outputs.forEach(function (n, i) { if (i && y2 + n.height > 1120) { col++; y2 = 60; } n.x = 420 + col * 560; n.y = y2; y2 += n.height + 40; }); markDirty(); render(); toast('Auto-aligned widgets'); }
  function goTopLeft() { var sc = byId('canvas-scroll'); if (sc) { sc.scrollLeft = 0; sc.scrollTop = 0; if (sc.scrollTo) sc.scrollTo({ left: 0, top: 0, behavior: 'smooth' }); } }
  function dismissCanvasHelp() { pushHistory(); state.helpDismissed = true; state.manifest.builder = state.manifest.builder || {}; state.manifest.builder.helpDismissed = true; markDirty(); render(); }

  function nodePointerDown(ev) {
    if (ev.target.closest('button') || ev.target.closest('.handle')) return;
    var el = ev.currentTarget.closest('.bd-node'); var id = el && el.getAttribute('data-id'); var n = node(id); if (!n) return;
    pushHistory(); state.selected = id; state.selectedEdge = null;
    var start = { x: ev.clientX, y: ev.clientY, nx: n.x, ny: n.y };
    el.setPointerCapture(ev.pointerId);
    function move(e) { var nx = start.nx + e.clientX - start.x; var ny = start.ny + e.clientY - start.y; n.x = Math.max(0, Math.round(e.ctrlKey ? snap(nx) : nx)); n.y = Math.max(0, Math.round(e.ctrlKey ? snap(ny) : ny)); el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; drawEdges(); var trash = byId('trash-zone'); if (trash) { var r = trash.getBoundingClientRect(); trash.classList.toggle('hot', e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom); } }
    function up(e) { try { el.releasePointerCapture(ev.pointerId); } catch (_) {} document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); var trash = byId('trash-zone'); var remove = false; if (trash) { var r = trash.getBoundingClientRect(); remove = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; trash.classList.remove('hot'); } if (remove) removeWidget(id); else { markDirty(); render(); } }
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
  }
  function resizePointerDown(ev) {
    ev.stopPropagation(); ev.preventDefault();
    var el = ev.currentTarget.closest('.bd-node'); var id = el && el.getAttribute('data-id'); var n = node(id); if (!n) return;
    pushHistory(); state.selected = id; state.selectedEdge = null;
    var start = { x: ev.clientX, y: ev.clientY, w: n.width, h: n.height };
    el.setPointerCapture(ev.pointerId);
    function move(e) { var nw = Math.max(170, start.w + e.clientX - start.x); var nh = Math.max(86, start.h + e.clientY - start.y); n.width = Math.round(e.ctrlKey ? snap(nw) : nw); n.height = Math.round(e.ctrlKey ? snap(nh) : nh); el.style.width = n.width + 'px'; el.style.height = n.height + 'px'; drawEdges(); }
    function up() { try { el.releasePointerCapture(ev.pointerId); } catch (_) {} document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); markDirty(); render(); }
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
  }
  function connectStart(ev) {
    ev.stopPropagation(); ev.preventDefault();
    var srcEl = ev.target.closest('.bd-node'); var source = srcEl && srcEl.getAttribute('data-id'); if (!source) return;
    state.connecting = source; state.pointer = { x: ev.clientX, y: ev.clientY };
    function move(e) { state.pointer = { x: e.clientX, y: e.clientY }; drawEdges(); }
    function up(e) { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); var el = document.elementFromPoint(e.clientX, e.clientY); var targetNode = el && el.closest && el.closest('.bd-node'); var target = targetNode && targetNode.getAttribute('data-id'); var tw = widget(target); if (target && target !== source && tw && tw.role === 'output') addEdge(source, target); state.connecting = null; state.pointer = null; render(); }
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); drawEdges();
  }
  function addEdge(source, target) { if (state.edges.some(function (e) { return e.source === source && e.target === target; })) return; pushHistory(); var id = 'edge_' + source + '_' + target + '_' + Date.now(); state.edges.push({ id: id, source: source, target: target, label: 'filter' }); state.selectedEdge = id; markDirty(); toast('Linked ' + source + ' → ' + target); }
  function drawEdges() {
    var svg = byId('edge-layer'); var space = byId('canvas-space'); if (!svg || !space) return;
    var defs = svg.querySelector('defs') ? svg.querySelector('defs').outerHTML : '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"></path></marker></defs>';
    var html = defs;
    state.edges.forEach(function (e) { html += edgePath(e, false); });
    if (state.connecting && state.pointer) html += pendingPath(state.connecting, state.pointer);
    svg.innerHTML = html;
    svg.querySelectorAll('[data-edge-id]').forEach(function (p) { p.addEventListener('click', function (ev) { ev.stopPropagation(); var id = p.getAttribute('data-edge-id'); var edge = state.edges.find(function (e) { return e.id === id; }); state.selectedEdge = id; state.selected = edge ? edge.target : state.selected; state.inspectorTab = 'component'; render(); }); });
  }
  function center(id, side) { var n = node(id); if (!n) return null; return { x: n.x + (side === 'right' ? n.width : 0), y: n.y + n.height / 2 }; }
  function edgePath(e, pending) { var a = center(e.source, 'right'), b = center(e.target, 'left'); if (!a || !b) return ''; var dx = Math.max(70, Math.abs(b.x - a.x) / 2); var d = 'M' + a.x + ',' + a.y + ' C' + (a.x + dx) + ',' + a.y + ' ' + (b.x - dx) + ',' + b.y + ' ' + b.x + ',' + b.y; var lx = (a.x + b.x) / 2, ly = (a.y + b.y) / 2 - 7; var sel = e.id === state.selectedEdge ? ' selected' : ''; return '<path class="edge-hit" data-edge-id="' + esc(e.id) + '" d="' + d + '"></path><path class="edge-path' + sel + (pending ? ' pending' : '') + '" d="' + d + '" marker-end="url(#arrow)"></path><text class="edge-label' + sel + '" data-edge-id="' + esc(e.id) + '" x="' + lx + '" y="' + ly + '" text-anchor="middle">' + esc(e.label || '') + '</text>'; }
  function pendingPath(source, pointer) { var space = byId('canvas-space'); var rect = space.getBoundingClientRect(); var a = center(source, 'right'); if (!a) return ''; var b = { x: pointer.x - rect.left, y: pointer.y - rect.top }; var dx = Math.max(60, Math.abs(b.x - a.x) / 2); var d = 'M' + a.x + ',' + a.y + ' C' + (a.x + dx) + ',' + a.y + ' ' + (b.x - dx) + ',' + b.y + ' ' + b.x + ',' + b.y; return '<path class="edge-path pending" d="' + d + '" marker-end="url(#arrow)"></path>'; }

  function saveProject() { state.manifest = manifestForSave(); api('/api/save', { body: { manifest: state.manifest } }).then(function (res) { state.projectDir = res.projectDir || state.projectDir; state.dirty = false; state.yamlDirty = false; render(); toast('Saved dashboard.blink.yml and dashboard.blink.json'); }).catch(function (e) { toast(e.message, true); }); }
  function saveAsPath() { if (!state.saveAsPath) { toast('Provide a save-as path.', true); return; } saveAs(state.saveAsPath); }
  function saveAsPrompt() { var p = prompt('Save design as .yml/.yaml/.json path or directory:', state.saveAsPath || state.projectDir || ''); if (p) { state.saveAsPath = p; saveAs(p); } }
  function saveAs(path) { state.manifest = manifestForSave(); api('/api/save-as', { body: { path: path, manifest: state.manifest } }).then(function (res) { state.projectDir = res.projectDir || state.projectDir; state.projectFile = res.paths && (res.paths.primary || res.paths.yml) || state.projectFile; state.dirty = false; render(); toast('Saved as ' + path); }).catch(function (e) { toast(e.message, true); }); }
  function openPath() { if (!state.openPath) { toast('Provide an open path.', true); return; } openDesign(state.openPath); }
  function openPrompt() { var p = prompt('Open design path (.yml/.yaml/.json or directory):', state.openPath || state.projectDir || ''); if (p) { state.openPath = p; openDesign(p); } }
  function openDesign(path) { api('/api/open', { body: { path: path } }).then(function (res) { state.manifest = res.manifest; state.projectDir = res.projectDir || ''; state.projectFile = res.projectFile || ''; state.history = []; state.future = []; state.dirty = false; state.yamlText = ''; state.yamlDirty = false; ensureManifest(); syncFromManifest(); render(); toast('Opened design'); }).catch(function (e) { toast(e.message, true); }); }
  function importDesignFile(ev) { var file = ev.target.files && ev.target.files[0]; if (!file) return; var reader = new FileReader(); reader.onload = function () { api('/api/yaml/to-json', { body: { yaml: String(reader.result || '') } }).then(function (res) { pushHistory(); state.manifest = res.manifest; ensureManifest(); syncFromManifest(); state.projectFile = file.name; state.dirty = true; state.yamlText = ''; state.yamlDirty = false; render(); toast('Imported design file. Use Save as to choose a local project path.'); }).catch(function (e) { toast(e.message, true); }); }; reader.onerror = function () { toast('Could not read design file.', true); }; reader.readAsText(file); }
  function compileAndViewProject() {
    var tab = window.open('about:blank', '_blank');
    if (tab) showCompileStatus(tab, 'Compiling dashboard...', 'BlinkDash is exporting the current design.');

    function fail(e) {
      if (tab && !tab.closed) showCompileStatus(tab, 'Compile failed', e.message, true);
      toast(e.message, true);
    }

    function finishCompile() {
      state.manifest = manifestForSave();
      api('/api/export', { body: { manifest: state.manifest, includeWorkflow: false } }).then(function (res) {
        state.dirty = false;
        state.yamlDirty = false;
        render();
        var url = '/compiled/?t=' + Date.now();
        if (tab && !tab.closed) {
          tab.location.href = url;
          toast('Compiled dashboard to ' + (res.outDir || 'site'));
        } else if (window.open(url, '_blank')) {
          toast('Compiled dashboard to ' + (res.outDir || 'site'));
        } else {
          toast('Compiled dashboard to ' + (res.outDir || 'site') + '. Open /compiled/ to view it.', true);
        }
      }).catch(fail);
    }

    if (state.mode === 'yaml' && state.yamlDirty) {
      var yed = byId('yaml-editor');
      if (yed) state.yamlText = yed.value;
      api('/api/yaml/to-json', { body: { yaml: state.yamlText } }).then(function (res) {
        pushHistory();
        state.manifest = res.manifest;
        ensureManifest();
        syncFromManifest();
        finishCompile();
      }).catch(fail);
    } else {
      finishCompile();
    }
  }
  function showCompileStatus(tab, title, message, bad) {
    if (!tab) return;
    try {
      tab.opener = null;
      tab.document.title = title;
      tab.document.body.innerHTML = '<main style="font-family:system-ui,sans-serif;padding:24px;line-height:1.5"><h1 style="font-size:20px;margin:0 0 8px;color:' + (bad ? '#b91c1c' : '#0f172a') + '">' + esc(title) + '</h1><p style="margin:0;color:#64748b;white-space:pre-wrap">' + esc(message || '') + '</p></main>';
    } catch (_) {}
  }
  function exportProject() { state.manifest = manifestForSave(); api('/api/export', { body: { manifest: state.manifest, includeWorkflow: true } }).then(function (res) { state.dirty = false; render(); toast('Exported static site to ' + (res.outDir || 'site')); }).catch(function (e) { toast(e.message, true); }); }

  function deleteDataset(name) {
    if (!name || !state.manifest || !state.manifest.datasets || !Object.prototype.hasOwnProperty.call(state.manifest.datasets, name)) return;
    var users = (state.manifest.widgets || []).filter(function (w) { return w.data === name; });
    var msg = users.length ? ('Delete dataset "' + name + '"? It is currently selected by ' + users.length + ' widget' + (users.length === 1 ? '' : 's') + '. Those widgets will be moved to another available dataset if possible.') : ('Delete dataset "' + name + '"?');
    if (!confirm(msg)) return;
    pushHistory();
    delete state.manifest.datasets[name];
    var next = firstDataset();
    (state.manifest.widgets || []).forEach(function (w) {
      if (w.data === name) {
        w.data = next || '';
        var cols = colsFor(w.data);
        ['field', 'x', 'y', 'color'].forEach(function (k) { if (w[k] && cols.indexOf(w[k]) < 0 && w[k] !== '*') w[k] = ''; });
      }
    });
    if (state.rData === name) state.rData = next || '';
    if (state.importName === name) state.importName = '';
    markDirty();
    render();
    toast('Deleted dataset: ' + name);
  }

  function importData() { api('/api/import', { body: { path: state.importPath, name: state.importName, manifest: manifestForSave() } }).then(function (res) { pushHistory(); state.manifest = res.manifest; ensureManifest(); syncFromManifest(); markDirty(); render(); toast('Imported dataset: ' + res.name); }).catch(function (e) { state.output = e.message; render(); toast(e.message, true); }); }
  function loadEnvDataNames() {
    api('/api/env-datasets').then(function(res){
      state.envDataNames = asOptionArray(res.names);
      if (!state.envName && state.envDataNames.length) state.envName = optionValue(state.envDataNames[0]);
      render();
      toast('Found ' + state.envDataNames.length + ' R data objects');
    }).catch(function(e){ toast(e.message, true); });
  }
  function importEnvData() { if (!state.envName) { toast('Choose an R object first.', true); return; } api('/api/import-env', { body: { object: state.envName, name: state.importName || state.envName, manifest: manifestForSave() } }).then(function(res){ pushHistory(); state.manifest = res.manifest; ensureManifest(); syncFromManifest(); markDirty(); render(); toast('Imported R object: ' + res.name); }).catch(function(e){ state.output = e.message; render(); toast(e.message, true); }); }
  function runR() { api('/api/eval', { body: { code: state.rCode, data: state.rData || firstDataset(), manifest: manifestForSave() } }).then(function (res) { state.output = res.output || '(no printed output)'; render(); }).catch(function (e) { state.output = e.message; render(); toast(e.message, true); }); }
  function precalcR() { api('/api/precalculate', { body: { code: state.rCode, data: state.rData || firstDataset(), name: state.rName, manifest: manifestForSave() } }).then(function (res) { pushHistory(); state.manifest = res.manifest; ensureManifest(); syncFromManifest(); state.output = res.output || ('Saved dataset: ' + res.name); state.dirty = false; render(); toast('Saved dataset: ' + res.name); }).catch(function (e) { state.output = e.message; render(); toast(e.message, true); }); }
  function refreshYaml(quiet) { state.manifest = manifestForSave(); return api('/api/yaml/from-json', { body: { manifest: state.manifest } }).then(function (res) { state.yamlText = res.yaml || ''; state.yamlDirty = false; if (!quiet) { render(); toast('YAML refreshed from design'); } }).catch(function (e) { toast(e.message, true); }); }
  function applyYaml() { var yed = byId('yaml-editor'); if (yed) state.yamlText = yed.value; return api('/api/yaml/to-json', { body: { yaml: state.yamlText } }).then(function (res) { pushHistory(); state.manifest = res.manifest; ensureManifest(); syncFromManifest(); state.yamlDirty = false; markDirty(); render(); toast('YAML applied to design'); }).catch(function (e) { toast(e.message, true); throw e; }); }
  function openManual() { api('/api/manual').then(function (res) { var md = String(res.markdown || '').replace(/^#\s+BlinkDash Builder Manual\s*/i, ''); state.modal = { title: 'BlinkDash Builder Manual', html: markdown(md) }; render(); }).catch(function (e) { toast(e.message, true); }); }
  function showWidgetHelp(id) { var w = widget(id); if (!w) return; var it = itemFor(w.type); state.modal = { title: it.title + ' widget', html: '<p>' + esc(HELP[w.type] || 'No help available for this widget yet.') + '</p>' }; render(); }

  function renderModal() { if (!state.modal) return ''; return '<div class="modal-backdrop"><div class="modal"><div class="modal-heading"><h1>' + esc(state.modal.title || 'Help') + '</h1><button class="modal-close" data-modal-close="1" title="Close">×</button></div><div class="modal-scroll"><div class="manual-html">' + (state.modal.html || '') + '</div></div></div></div>'; }
  function markdown(md) {
    var src = String(md || '').replace(/\r\n/g, '\n');
    var blocks = [];
    function hold(html) { var token = '§§CODE' + blocks.length + '§§'; blocks.push(html); return token; }
    src = src.replace(/```([A-Za-z0-9_-]*)[ \t]*\n([\s\S]*?)```/g, function(_, lang, code) {
      return hold('<pre><code class="language-' + esc(lang || '') + '">' + highlightCode(code, String(lang || '').toLowerCase()) + '</code></pre>');
    });
    src = src.replace(/\$\$([\s\S]*?)\$\$/g, function(_, tex) {
      return hold('<div class="manual-math-block">\\[' + esc(tex.trim()) + '\\]</div>');
    });
    var s = esc(src);
    s = s.replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    var html = s.split(/\n{2,}/).map(function (block) { return /^<h\d|^§§CODE/.test(block) ? block : '<p>' + block.replace(/\n/g, '<br>') + '</p>'; }).join('');
    blocks.forEach(function(b, i){ html = html.replace('§§CODE' + i + '§§', b); });
    return html;
  }
  function renderToast() { var host = byId('toast-host'); if (!host) return; host.innerHTML = state.toast ? '<div class="toast ' + (state.toastBad ? 'bad' : '') + '">' + esc(state.toast) + '</div>' : ''; }
  function showFatal(err) { var msg = err && (err.stack || err.message) || String(err); app.innerHTML = '<div class="fatal"><h1>BlinkDash Builder could not start</h1><p>The CSS loaded, but JavaScript failed.</p><pre>' + esc(msg) + '</pre></div>'; }
  function loadProject() { render(); return api('/api/project').then(function (res) { state.manifest = res.manifest || { title: 'BlinkDash', datasets: {}, widgets: [], graph: { nodes: [], edges: [] } }; state.projectDir = res.projectDir || ''; state.projectFile = res.projectFile || ''; state.dirty = false; ensureManifest(); syncFromManifest(); state.rCode = (state.manifest.snippets && state.manifest.snippets[0] && state.manifest.snippets[0].code) || state.rCode; render(); loadEnvDataNames(); }).catch(function (e) { showFatal(e); }); }

  document.addEventListener('DOMContentLoaded', loadProject);
})();
