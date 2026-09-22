// Karigar runtime.
//
// The app is still the design prototype (karigar.dc.html): a template of <sc-if>/<sc-for>
// blocks with {{ path }} bindings, driven by one component class. This file is the small
// runtime that renders it in production, with Preact doing the DOM diffing, and the
// bridge between that component and the server (profiles, handover links, the model proxy).
import { h, render, Fragment } from '/vendor/preact.mjs';

const MODE = document.body.dataset.mode; // 'console' | 'artisan'
const mount = document.getElementById('app');

// ── template compiler ───────────────────────────────────────────────────────

const BIND = /{{\s*([^}]+?)\s*}}/g;

function parseExpr(src) {
  if (src === 'true') return () => true;
  if (src === 'false') return () => false;
  if (src === 'null') return () => null;
  if (/^-?\d+(\.\d+)?$/.test(src)) { const n = Number(src); return () => n; }
  const path = src.split('.');
  return scope => {
    let v = scope;
    for (const k of path) { if (v == null) return undefined; v = v[k]; }
    return v;
  };
}

// "a {{ x }} b" → scope => string; "{{ x }}" alone → scope => raw value (functions, booleans…)
function parseValue(text) {
  const whole = text.match(/^{{\s*([^}]+?)\s*}}$/);
  if (whole) return parseExpr(whole[1]);
  if (!text.includes('{{')) return () => text;
  const parts = [];
  let last = 0;
  text.replace(BIND, (m, expr, at) => {
    parts.push(text.slice(last, at), parseExpr(expr));
    last = at + m.length;
  });
  parts.push(text.slice(last));
  return scope => parts.map(p => {
    if (typeof p === 'string') return p;
    const v = p(scope);
    return v == null ? '' : String(v);
  }).join('');
}

// The HTML parser lowercases attribute names; restore what Preact needs.
function propName(tag, name, type) {
  if (name === 'onchange' && (tag === 'textarea' || (tag === 'input' && !['checkbox', 'radio', 'file'].includes(type)))) {
    return 'onInput'; // React-style onChange fires per keystroke; the native change event does not
  }
  if (name.startsWith('on')) return 'on' + name[2].toUpperCase() + name.slice(3);
  return name;
}

function compile(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const get = parseValue(node.nodeValue);
    return scope => { const v = get(scope); return v == null ? '' : String(v); };
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const tag = node.localName;
  const sc = tag === 'template' ? node.getAttribute('data-sc') : null;
  // An HTML <template> keeps its children in .content; inside SVG it is a plain element.
  const kids = [...((sc && node.content) || node).childNodes].map(compile).filter(Boolean);
  const renderKids = scope => kids.map(k => k(scope));

  if (sc === 'if') {
    const test = parseValue(node.getAttribute('value') || '');
    return scope => (test(scope) ? h(Fragment, null, renderKids(scope)) : null);
  }
  if (sc === 'for') {
    const list = parseValue(node.getAttribute('list') || '');
    const as = node.getAttribute('as') || 'item';
    return scope => {
      const items = list(scope);
      if (!Array.isArray(items)) return null;
      return h(Fragment, null, items.map(item => h(Fragment, null, renderKids({ ...scope, [as]: item }))));
    };
  }

  const type = node.getAttribute('type');
  const attrs = [...node.attributes]
    .filter(a => !a.name.startsWith('hint-'))
    .map(a => [propName(tag, a.name, type), parseValue(a.value)]);
  return scope => {
    const props = {};
    for (const [name, get] of attrs) props[name] = get(scope);
    return h(tag, props, renderKids(scope));
  };
}

// ── DCLogic: the component base class the prototype extends ─────────────────

class DCLogic {
  constructor(props) {
    this.props = props;
    this.state = {};
    this._queued = false;
    this._mounted = false;
  }
  setState(patch, cb) {
    const next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    if (next) this.state = { ...this.state, ...next };
    if (cb) this._after = [...(this._after || []), cb];
    if (!this._queued) {
      this._queued = true;
      queueMicrotask(() => { this._queued = false; this._render(); });
    }
  }
  _render() {
    let vals;
    try { vals = this.renderVals(); } catch (e) { console.error(e); return; }
    render(h(Fragment, null, this._template(vals)), mount);
    const after = this._after || [];
    this._after = null;
    after.forEach(f => f());
    if (this._mounted && this.componentDidUpdate) this.componentDidUpdate();
  }
}

async function loadComponent() {
  const html = await (await fetch('/karigar.dc')).text();
  // The HTML parser drops unknown tags inside <select> (and would foster-parent them out of
  // tables), so <sc-for>/<sc-if> are parsed as <template>, which it allows anywhere.
  const safe = html
    .replace(/<sc-(for|if)\b/g, '<template data-sc="$1"')
    .replace(/<\/sc-(for|if)>/g, '</template>');
  const doc = new DOMParser().parseFromString(safe, 'text/html');
  const helmet = doc.querySelector('helmet');
  if (helmet) [...helmet.children].forEach(el => document.head.appendChild(document.importNode(el, true)));
  const root = doc.querySelector('x-dc');
  helmet && helmet.remove();
  const tree = [...root.childNodes].map(compile).filter(Boolean);
  const src = doc.querySelector('script[data-dc-script]').textContent;
  // eslint-disable-next-line no-new-func
  const Component = new Function('DCLogic', `${src}\nreturn Component;`)(DCLogic);
  return { Component, template: scope => tree.map(t => t(scope)) };
}

// ── server bridge ──────────────────────────────────────────────────────────

const safeStore = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode / quota */ } }
};

async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(path, {
    method,
    headers: body !== undefined ? { 'content-type': 'application/json', ...headers } : headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'same-origin'
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || res.statusText);
    err.status = res.status;
    throw err;
  }
  return data;
}

// The prototype calls window.claude.complete(); in production that is our own proxy,
// which holds the API key server-side.
function installModel(token) {
  window.claude = {
    async complete({ model, max_tokens, system, messages }) {
      const { text } = await api('/api/chat', {
        method: 'POST', body: { model, max_tokens, system, messages },
        headers: token ? { 'x-karigar-token': token } : {}
      });
      return text;
    }
  };
}

// Save status, shown bottom-left so a facilitator in the field knows their work is kept.
const status = (() => {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:90;background:#241F2E;color:#fff;border-radius:999px;padding:7px 13px;font:600 12.5px/1.2 "Hanken Grotesk",system-ui,sans-serif;box-shadow:0 4px 14px rgba(36,31,46,.2);opacity:0;transition:opacity .2s;pointer-events:none';
  document.body.appendChild(el);
  let timer;
  return (text, sticky) => {
    clearTimeout(timer);
    el.textContent = text;
    el.style.opacity = text ? '1' : '0';
    el.style.background = sticky ? '#A81C24' : '#241F2E';
    if (text && !sticky) timer = setTimeout(() => { el.style.opacity = '0'; }, 1400);
  };
})();

// The facilitator-editable part of a profile; a change here is what triggers a save.
const EDITABLE = ['record', 'sources', 'lang', 'analysis', 'checked', 'sessionNote', 'origin', 'approved', 'cluster'];
const signature = p => JSON.stringify(EDITABLE.map(k => p[k] === undefined ? null : p[k]));

function consoleStore(initial, onServerProfile) {
  const saved = new Map(initial.map(p => [p.id, signature(p)]));
  const timers = new Map();
  const inflight = new Set();
  let latest = new Map(initial.map(p => [p.id, p]));
  let failing = false;

  const pending = () => timers.size > 0 || inflight.size > 0;

  async function save(id, attempt = 0) {
    timers.delete(id);
    const p = latest.get(id);
    if (!p) return;
    const sig = signature(p);
    if (saved.get(id) === sig) return;
    inflight.add(id);
    status('Saving…');
    try {
      const body = {};
      EDITABLE.forEach(k => { body[k] = p[k]; });
      const { profile } = await api(`/api/profiles/${encodeURIComponent(id)}`, { method: 'PUT', body });
      saved.set(id, sig);
      failing = false;
      onServerProfile(profile);
      status('Saved');
    } catch (e) {
      if (e.status === 401) { status('Signed out — sign in again to keep saving', true); location.reload(); return; }
      failing = true;
      status('Not saved yet — retrying', true);
      const wait = Math.min(30_000, 2000 * 2 ** attempt);
      timers.set(id, setTimeout(() => save(id, attempt + 1), wait));
    } finally {
      inflight.delete(id);
      // edits made while this request was in flight
      if (latest.get(id) && saved.get(id) !== signature(latest.get(id)) && !timers.has(id)) schedule(id);
    }
  }

  function schedule(id) {
    clearTimeout(timers.get(id));
    timers.set(id, setTimeout(() => save(id), 700));
  }

  async function remove(id) {
    saved.delete(id);
    clearTimeout(timers.get(id));
    timers.delete(id);
    try {
      await api(`/api/profiles/${encodeURIComponent(id)}`, { method: 'DELETE', body: {} });
      status('Deleted');
    } catch (e) {
      if (e.status !== 404) status('Could not delete — reload and try again', true);
    }
  }

  window.addEventListener('beforeunload', e => {
    if (pending() || failing) { e.preventDefault(); e.returnValue = ''; }
  });

  return {
    mode: 'console',
    sync(profiles) {
      const next = new Map(profiles.map(p => [p.id, p]));
      for (const id of saved.keys()) if (!next.has(id)) remove(id);
      latest = next;
      for (const p of profiles) if (saved.get(p.id) !== signature(p) && !inflight.has(p.id)) schedule(p.id);
    },
    async action(id, action) {
      status('Saving…');
      try {
        const { profile } = await api(`/api/profiles/${encodeURIComponent(id)}`, { method: 'POST', body: { action } });
        onServerProfile(profile);
        status('Saved');
      } catch (e) {
        status(e.status === 404 ? 'Save this profile first' : 'That did not go through — try again', true);
      }
    },
    practice() { /* the facilitator's preview of the artisan app is not practice */ },
    signOut: async () => { await api('/api/session', { method: 'DELETE' }); location.href = '/org'; },
    local: safeStore
  };
}

function artisanStore(token) {
  return {
    mode: 'artisan',
    token,
    sync() { /* the artisan never edits the profile */ },
    action() {},
    practice(segment) {
      api('/api/practice', { method: 'POST', body: { token, segment } }).catch(() => { /* counts are best-effort */ });
    },
    local: safeStore
  };
}

// ── boot ───────────────────────────────────────────────────────────────────

function message(title, body) {
  mount.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'k-boot';
  box.innerHTML = '<h1></h1><p></p>';
  box.querySelector('h1').textContent = title;
  box.querySelector('p').textContent = body;
  mount.appendChild(box);
}

// Sign in, or create an account when sign-up is open. Resolves once a session exists.
async function loginForm() {
  let signup = { open: false, needsCode: false };
  try { signup = await api('/api/signup'); } catch { /* older server: sign-in only */ }
  return new Promise(resolve => {
    const show = which => {
      mount.innerHTML = '';
      mount.appendChild(document.getElementById(which).content.cloneNode(true));
      const form = mount.querySelector('form');
      const err = mount.querySelector('[data-error]');
      const link = mount.querySelector('[data-signup-link]');
      if (link && signup.open) link.hidden = false;
      const code = mount.querySelector('[data-code]');
      if (code && signup.needsCode) { code.hidden = false; code.querySelector('input').required = true; }
      mount.querySelectorAll('[data-to]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); show(a.dataset.to); }));
      form.querySelector('input').focus();
      form.addEventListener('submit', async e => {
        e.preventDefault();
        err.textContent = '';
        const body = Object.fromEntries(new FormData(form));
        form.querySelector('button').disabled = true;
        try {
          await api(which === 'signup' ? '/api/signup' : '/api/session', { method: 'POST', body });
          resolve();
        } catch (x) {
          err.textContent = x.status && x.status < 500 ? x.message : 'Could not reach the server. Check the connection and try again.';
          form.querySelector('button').disabled = false;
        }
      });
    };
    show('login');
  });
}

async function bootConsole() {
  let session;
  for (;;) {
    try { session = await api('/api/session'); break; } catch (e) {
      if (e.status !== 401) { message('Karigar is not reachable', 'Check the connection, then reload this page.'); return null; }
      await loginForm();
    }
  }
  const { profiles } = await api('/api/profiles');
  installModel(null);
  return { mode: 'console', session, profiles };
}

async function bootArtisan() {
  const m = location.pathname.match(/^\/k\/([A-Za-z0-9_-]+)/);
  let token = m && m[1];
  if (!token) {
    // Opened from a home-screen icon installed before per-artisan manifests, or typed in.
    const remembered = safeStore.get('karigar-token');
    if (remembered) { location.replace(`/k/${remembered}`); return null; }
    // No artisan link: this is a facilitator arriving at the home page.
    location.replace('/org');
    return null;
  }
  // Android installs from the manifest's start_url, so it must carry this artisan's link.
  const link = document.querySelector('link[rel="manifest"]');
  if (link) link.href = `/api/manifest?t=${encodeURIComponent(token)}`;
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

  const cacheKey = `karigar-profile:${token}`;
  let profile;
  try {
    ({ profile } = await api(`/api/profile?token=${encodeURIComponent(token)}`));
    safeStore.set(cacheKey, profile);
    safeStore.set('karigar-token', token);
  } catch (e) {
    if (e.status === 410 || e.status === 404) {
      try { localStorage.removeItem(cacheKey); } catch { /* ignore */ }
      message('This link no longer works', 'Ask your facilitator for a new one. Nothing you practised here was shared with anyone.');
      return null;
    }
    // Offline: the board summary is the offline surface. Practice needs the network.
    profile = safeStore.get(cacheKey);
    if (!profile) { message('No connection', 'Connect to the internet once to open your Karigar app. After that it opens without one.'); return null; }
  }
  installModel(token);
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  return { mode: 'artisan', token, profile, standalone };
}

async function main() {
  const [boot, comp] = await Promise.all([MODE === 'console' ? bootConsole() : bootArtisan(), loadComponent()]);
  if (!boot) return;
  let instance;
  const onServerProfile = p => instance.mergeServerProfile(p);
  const store = boot.mode === 'console' ? consoleStore(boot.profiles, onServerProfile) : artisanStore(boot.token);
  instance = new comp.Component({ appOrigin: location.origin, model: 'claude-sonnet-4-5', boot, store });
  instance._template = comp.template;
  mount.innerHTML = '';
  instance._render();
  instance._mounted = true;
  if (instance.componentDidMount) await instance.componentDidMount();
}

main().catch(e => {
  console.error(e);
  message('Something went wrong', 'Reload the page. If it keeps happening, tell the Karigar team.');
});
