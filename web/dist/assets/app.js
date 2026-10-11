/* =====================================================================
   Novyra Studio — interface illenium-appearance (sans build, JS natif)
   Compatible avec les callbacks NUI de illenium-appearance v5.7.0
   (game/nui.lua). Aucun fichier Lua n'a besoin d'être modifié.
   ===================================================================== */
(() => {
  "use strict";

  // ------------------------------------------------------------------
  // Communication avec le client Lua
  // ------------------------------------------------------------------
  const resourceName = typeof GetParentResourceName === "function" ? GetParentResourceName() : "illenium-appearance";

  async function post(name, data) {
    if (window.__NUI_MOCK__) return window.__NUI_MOCK__(name, data);
    try {
      const res = await fetch(`https://${resourceName}/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data === undefined ? {} : data),
      });
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (e) {
      console.error(`[appearance] ${name}`, e);
      return null;
    }
  }

  // Envoie au plus une requête à la fois par canal ; la dernière valeur gagne.
  // Évite d'inonder le client quand on fait glisser un curseur.
  const channels = {};
  function send(key, endpoint, payload, onResult) {
    let ch = channels[key];
    if (!ch) ch = channels[key] = { busy: false, pending: null };
    const run = async (job) => {
      ch.busy = true;
      const r = await post(job.endpoint, job.payload);
      if (job.onResult) job.onResult(r);
      ch.busy = false;
      if (ch.pending) { const next = ch.pending; ch.pending = null; run(next); }
    };
    const job = { endpoint, payload, onResult };
    if (ch.busy) ch.pending = job; else run(job);
  }

  // ------------------------------------------------------------------
  // Données fixes
  // ------------------------------------------------------------------
  const PARENTS = [
    "Benjamin", "Daniel", "Joshua", "Noah", "Andrew", "Juan", "Alex", "Isaac", "Evan", "Ethan", "Vincent",
    "Angel", "Diego", "Adrian", "Gabriel", "Michael", "Santiago", "Kevin", "Louis", "Samuel", "Anthony",
    "Hannah", "Audrey", "Jasmine", "Giselle", "Amelia", "Isabella", "Zoe", "Ava", "Camila", "Violet",
    "Sophia", "Evelyn", "Nicole", "Ashley", "Grace", "Brianna", "Natalie", "Olivia", "Elizabeth", "Charlotte",
    "Emma", "Claude", "Niko", "John", "Misty",
  ];
  const EYE_COLORS = [
    "Vert", "Émeraude", "Bleu clair", "Bleu océan", "Marron clair", "Marron foncé", "Noisette", "Gris foncé",
    "Gris clair", "Rose", "Jaune", "Violet", "Noir total", "Nuances de gris", "Tequila Sunrise", "Atomique",
    "Distorsion", "ECola", "Space Ranger", "Yin Yang", "Dans le mille", "Lézard", "Dragon", "Extraterrestre",
    "Bouc", "Smiley", "Possédé", "Démon", "Infecté", "Alien", "Mort-vivant", "Zombie",
  ];
  const FREEMODE = ["mp_m_freemode_01", "mp_f_freemode_01"];

  // Textes par défaut (français). Ceux envoyés par locales/*.lua les remplacent.
  const DEFAULT_LOCALES = {
    modal: {
      save: { title: "Enregistrer", description: "Tes modifications seront enregistrées." },
      exit: { title: "Quitter", description: "Aucun changement ne sera enregistré." },
      accept: "Oui", decline: "Non",
    },
    ped: { title: "Ped", model: "Modèle" },
    headBlend: {
      title: "Héritage",
      shape: { title: "Visage", firstOption: "Père", secondOption: "Mère", mix: "Ressemblance" },
      skin: { title: "Peau", firstOption: "Père", secondOption: "Mère", mix: "Teint" },
      race: { title: "Origine", shape: "Visage", skin: "Peau", mix: "Mélange" },
    },
    faceFeatures: {
      title: "Traits du visage",
      nose: { title: "Nez", width: "Largeur", height: "Hauteur", size: "Longueur", boneHeight: "Hauteur de l'arête", boneTwist: "Torsion", peakHeight: "Abaissement de la pointe" },
      eyebrows: { title: "Arcades", height: "Hauteur", depth: "Profondeur" },
      cheeks: { title: "Joues", boneHeight: "Hauteur des pommettes", boneWidth: "Largeur des pommettes", width: "Largeur des joues" },
      eyesAndMouth: { title: "Yeux et bouche", eyesOpening: "Ouverture des yeux", lipsThickness: "Épaisseur des lèvres" },
      jaw: { title: "Mâchoire", width: "Largeur", size: "Taille" },
      chin: { title: "Menton", lowering: "Hauteur", length: "Longueur", size: "Largeur", hole: "Fossette" },
      neck: { title: "Cou", thickness: "Épaisseur" },
    },
    headOverlays: {
      title: "Cheveux et apparence",
      hair: { title: "Cheveux", style: "Coupe", color: "Couleur", highlight: "Reflets", texture: "Variante", fade: "Dégradé" },
      opacity: "Opacité", style: "Style", color: "Couleur", secondColor: "Couleur secondaire",
      blemishes: "Imperfections", beard: "Barbe", eyebrows: "Sourcils", ageing: "Vieillissement",
      makeUp: "Maquillage", blush: "Blush", complexion: "Teint", sunDamage: "Coups de soleil",
      lipstick: "Rouge à lèvres", moleAndFreckles: "Grains de beauté", chestHair: "Poils du torse",
      bodyBlemishes: "Imperfections du corps", eyeColor: "Couleur des yeux",
    },
    components: {
      title: "Vêtements", drawable: "Modèle", texture: "Variante",
      mask: "Masque", upperBody: "Bras / gants", lowerBody: "Pantalon", bags: "Sac et parachute",
      shoes: "Chaussures", scarfAndChains: "Écharpe et chaînes", shirt: "T-shirt", bodyArmor: "Gilet pare-balles",
      decals: "Écussons", jackets: "Veste", head: "Tête",
    },
    props: {
      title: "Accessoires", drawable: "Modèle", texture: "Variante",
      hats: "Chapeaux et casques", glasses: "Lunettes", ear: "Boucles d'oreilles", watches: "Montres", bracelets: "Bracelets",
    },
    tattoos: {
      title: "Tatouages",
      items: { ZONE_TORSO: "Torse", ZONE_HEAD: "Tête", ZONE_LEFT_ARM: "Bras gauche", ZONE_RIGHT_ARM: "Bras droit", ZONE_LEFT_LEG: "Jambe gauche", ZONE_RIGHT_LEG: "Jambe droite" },
      apply: "Appliquer", delete: "Supprimer", deleteAll: "Supprimer tous les tatouages", opacity: "Opacité",
    },
  };

  function deepMerge(base, extra) {
    if (!extra || typeof extra !== "object") return base;
    const out = Array.isArray(base) ? [...base] : { ...base };
    for (const k of Object.keys(extra)) {
      const v = extra[k];
      out[k] = v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object" ? deepMerge(base[k], v) : v;
    }
    return out;
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const round1 = (n) => Math.round(n * 10) / 10;

  // ------------------------------------------------------------------
  // État
  // ------------------------------------------------------------------
  const S = {
    visible: false,
    locales: DEFAULT_LOCALES,
    localesLoaded: false,
    config: null,      // ce que le script autorise (ped, headBlend, components...)
    settings: null,    // limites (min/max, couleurs, liste des peds...)
    data: null,        // apparence en cours de modification
    stored: null,      // apparence d'origine
    category: null,
    open: new Set(),   // cartes dépliées
    camera: null,      // head | body | bottom | null
    rotate: null,      // left | right | null
    removed: { head: false, body: false, bottom: false },
    tattooZone: null,
    tattooSearch: "",
    tattooSel: null,   // tatouage en aperçu
    tattooOpacity: 1,
    pedSearch: "",
  };
  let loadToken = 0;

  const $ = (sel, root = document) => root.querySelector(sel);
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
    return el;
  }

  const isFreemode = () => S.data && FREEMODE.includes(S.data.model);
  const isMale = () => S.data && S.data.model !== "mp_f_freemode_01";

  // ------------------------------------------------------------------
  // Icônes
  // ------------------------------------------------------------------
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICONS = {
    ped: svg('<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-1.5A6.5 6.5 0 0 1 11.5 13h1a6.5 6.5 0 0 1 6.5 6.5V21"/>'),
    heritage: svg('<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="17" r="3"/><path d="M8.5 9.5 11 14.5M15.5 9.5 13 14.5"/>'),
    face: svg('<path d="M12 3c4 0 7 3 7 7.5 0 5-3.4 10.5-7 10.5s-7-5.5-7-10.5C5 6 8 3 12 3Z"/><path d="M9.5 10.5h.01M14.5 10.5h.01M10 16c1.2.8 2.8.8 4 0"/>'),
    hair: svg('<circle cx="6" cy="18" r="2.5"/><circle cx="6" cy="6" r="2.5"/><path d="M8 7.5 20 17M8 16.5 20 7"/>'),
    clothes: svg('<path d="M8 3 4 5.5 2.5 10l3.5 1.5V21h12v-9.5l3.5-1.5L20 5.5 16 3c-.5 1.7-2 3-4 3S8.5 4.7 8 3Z"/>'),
    props: svg('<circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14c1.2-1 2.8-1 4 0M3 13l1.5-6h3M21 13l-1.5-6h-3"/>'),
    tattoos: svg('<path d="m14 4 6 6M12.5 5.5l6 6-8 8H4.5v-6l8-8ZM8 12l4 4"/>'),
    chevron: svg('<path d="m6 9 6 6 6-6"/>'),
    left: svg('<path d="m15 6-6 6 6 6"/>'),
    right: svg('<path d="m9 6 6 6-6 6"/>'),
    camHead: svg('<circle cx="12" cy="9" r="4.5"/><path d="M7.5 21c.5-3 2.3-5 4.5-5s4 2 4.5 5"/>'),
    camBody: svg('<path d="M8 3 4 5.5 2.5 10l3.5 1.5V21h12v-9.5l3.5-1.5L20 5.5 16 3"/><path d="M8 3c.5 1.7 2 3 4 3s3.5-1.3 4-3"/>'),
    camLegs: svg('<path d="M6 3h12l-1 18h-4l-1-11-1 11H7L6 3Z"/>'),
    rotLeft: svg('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'),
    rotRight: svg('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>'),
    turn: svg('<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'),
    hat: svg('<path d="M3 17h18M5 17c0-5 2-10 7-10s7 5 7 10"/><path d="M9 7.5V5h6v2.5"/>'),
    shirt: svg('<path d="M8 3 4 5.5 2.5 10l3.5 1.5V21h12v-9.5l3.5-1.5L20 5.5 16 3c-.5 1.7-2 3-4 3S8.5 4.7 8 3Z"/>'),
    pants: svg('<path d="M6 3h12l-1 18h-4l-1-11-1 11H7L6 3Z"/>'),
  };

  // ------------------------------------------------------------------
  // Contrôles réutilisables
  // ------------------------------------------------------------------
  function setFill(range) {
    const min = +range.min, max = +range.max, v = +range.value;
    const pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
    range.style.setProperty("--p", pct + "%");
    if (range.classList.contains("bipolar")) {
      const zero = max > min ? ((0 - min) / (max - min)) * 100 : 50;
      range.style.setProperty("--a", Math.min(zero, pct) + "%");
      range.style.setProperty("--b", Math.max(zero, pct) + "%");
    }
  }

  /** Sélecteur d'index entier (modèle, variante, style...) qui saute les valeurs interdites. */
  function stepper({ label, min, max, value, blacklist = [], format, onChange }) {
    let cur = value, lo = min, hi = max, black = new Set(blacklist || []);
    const num = h("input", { type: "number" });
    const total = h("span");
    const range = h("input", { type: "range", step: 1 });
    const sub = format ? h("div", { class: "ctl-sub" }) : null;
    const root = h("div", { class: "ctl" },
      h("div", { class: "ctl-head" }, h("span", { class: "ctl-label" }, label), h("span", { class: "ctl-val" }, num, total)),
      h("div", { class: "ctl-row" },
        h("button", { class: "arrow", html: ICONS.left, onclick: () => step(-1) }),
        range,
        h("button", { class: "arrow", html: ICONS.right, onclick: () => step(1) })),
      sub);

    const allowed = (v) => v >= lo && v <= hi && !black.has(v);
    function nearest(v, dir) {
      if (allowed(v)) return v;
      for (let i = 1; i <= hi - lo + 1; i++) {
        const a = v + i * dir, b = v - i * dir;
        if (allowed(a)) return a;
        if (allowed(b)) return b;
      }
      return cur;
    }
    function paint() {
      root.classList.toggle("disabled", hi < lo);
      range.min = lo; range.max = Math.max(hi, lo); range.value = cur;
      num.min = lo; num.max = hi; num.value = cur;
      total.textContent = `/ ${Math.max(hi, lo)}`;
      if (sub) sub.textContent = format(cur);
      setFill(range);
    }
    function commit(v, dir = 1) {
      v = Math.max(lo, Math.min(hi, Math.round(v)));
      v = nearest(v, dir);
      if (v === cur) { paint(); return; }
      cur = v; paint(); onChange(v);
    }
    function step(dir) {
      if (hi < lo) return;
      let v = cur;
      for (let i = 0; i <= hi - lo; i++) {
        v += dir;
        if (v > hi) v = lo;
        if (v < lo) v = hi;
        if (!black.has(v)) break;
      }
      commit(v, dir);
    }
    range.addEventListener("input", () => commit(+range.value, +range.value >= cur ? 1 : -1));
    num.addEventListener("change", () => { const v = parseInt(num.value, 10); if (Number.isNaN(v)) paint(); else commit(v); });
    num.addEventListener("keydown", (e) => e.stopPropagation());
    paint();
    return {
      el: root,
      set(v) { cur = v; paint(); },
      setRange(nmin, nmax, nblack) { lo = nmin; hi = nmax; if (nblack) black = new Set(nblack); if (cur > hi) cur = hi; if (cur < lo) cur = lo; paint(); },
    };
  }

  /** Curseur décimal (mélange, traits du visage, opacité). */
  function slider({ label, min, max, step = 0.1, value, bipolar = false, format, onChange }) {
    const out = h("strong");
    const range = h("input", { type: "range", min, max, step, class: bipolar ? "bipolar" : null });
    range.value = value ?? 0;
    const show = () => { out.textContent = format ? format(+range.value) : (+range.value).toFixed(1); setFill(range); };
    range.addEventListener("input", () => { show(); onChange(round1(+range.value)); });
    const root = h("div", { class: "ctl" },
      h("div", { class: "ctl-head" }, h("span", { class: "ctl-label" }, label), h("span", { class: "ctl-val" }, out)),
      h("div", { class: "ctl-row" }, range));
    show();
    return { el: root, set(v) { range.value = v; show(); } };
  }

  /** Nuancier de couleurs (cheveux, maquillage). */
  function swatches({ label, colors, value, onChange }) {
    const grid = h("div", { class: "swatches" });
    let cur = value;
    const name = h("strong");
    const btns = (colors || []).map((c, i) => {
      const b = h("button", { class: "swatch", title: `#${i}`, style: `background: rgb(${c[0]}, ${c[1]}, ${c[2]})`, onclick: () => pick(i) });
      grid.append(b);
      return b;
    });
    function paint() { btns.forEach((b, i) => b.classList.toggle("active", i === cur)); name.textContent = cur ?? "–"; }
    function pick(i) { if (i === cur) return; cur = i; paint(); onChange(i); }
    paint();
    return { el: h("div", { class: "ctl" }, h("div", { class: "ctl-head" }, h("span", { class: "ctl-label" }, label), h("span", { class: "ctl-val" }, name)), grid) };
  }

  function card(id, title, body, { badge, defaultOpen = false } = {}) {
    if (defaultOpen && !S.open.has("seen:" + id)) { S.open.add(id); S.open.add("seen:" + id); }
    const root = h("div", { class: "card" + (S.open.has(id) ? " open" : "") });
    const head = h("button", { class: "card-head", onclick: () => { root.classList.toggle("open"); root.classList.contains("open") ? S.open.add(id) : S.open.delete(id); } },
      h("span", null, title), badge ? h("span", { class: "badge" }, badge) : null, h("span", { class: "chev", html: ICONS.chevron }));
    root.append(head, h("div", { class: "card-body" }, body));
    return root;
  }

  // ------------------------------------------------------------------
  // Catégories
  // ------------------------------------------------------------------
  function categories() {
    const c = S.config, L = S.locales, free = isFreemode();
    return [
      { id: "ped", title: L.ped.title, icon: ICONS.ped, show: c.ped, render: renderPed },
      { id: "heritage", title: L.headBlend.title, icon: ICONS.heritage, show: c.headBlend && free, render: renderHeritage },
      { id: "face", title: L.faceFeatures.title, icon: ICONS.face, show: c.faceFeatures && free, render: renderFace },
      { id: "hair", title: L.headOverlays.title, icon: ICONS.hair, show: c.headOverlays, render: renderHair },
      { id: "clothes", title: L.components.title, icon: ICONS.clothes, show: c.components, render: renderClothes },
      { id: "props", title: L.props.title, icon: ICONS.props, show: c.props, render: renderProps },
      { id: "tattoos", title: L.tattoos.title, icon: ICONS.tattoos, show: c.tattoos && free, render: renderTattoos },
    ].filter((x) => x.show);
  }

  function renderRail() {
    const rail = $("#rail");
    rail.innerHTML = "";
    const cats = categories();
    if (!cats.find((c) => c.id === S.category)) S.category = cats[0] ? cats[0].id : null;
    for (const c of cats) {
      rail.append(h("button", {
        class: "rail-btn" + (c.id === S.category ? " active" : ""),
        html: c.icon + `<span class="tip">${c.title}</span>`,
        onclick: () => selectCategory(c.id),
      }));
    }
  }

  function selectCategory(id) {
    if (S.category === "tattoos" && id !== "tattoos") clearTattooPreview();
    S.category = id;
    renderRail();
    renderPanel();
    $("#panel-body").scrollTop = 0;
  }

  function renderPanel() {
    const body = $("#panel-body");
    body.innerHTML = "";
    const cat = categories().find((c) => c.id === S.category);
    $("#panel-title").textContent = cat ? cat.title : "";
    if (!cat) { body.append(h("div", { class: "empty" }, "Rien à modifier ici.")); return; }
    cat.render(body);
  }

  // ----- Ped ---------------------------------------------------------
  function renderPed(body) {
    // Les animaux (a_c_*) sont exclus de la liste
    const items = ((S.settings.ped && S.settings.ped.model && S.settings.ped.model.items) || []).filter((m) => !/^a_c_/i.test(m));
    const search = h("input", { class: "search", placeholder: "Rechercher un modèle…", value: S.pedSearch });
    const list = h("div", { class: "list" });
    const LIMIT = 150;
    function fill() {
      list.innerHTML = "";
      const q = S.pedSearch.trim().toLowerCase();
      const found = items.filter((m) => !q || m.toLowerCase().includes(q));
      // Les modèles freemode toujours en premier
      found.sort((a, b) => (FREEMODE.includes(b) ? 1 : 0) - (FREEMODE.includes(a) ? 1 : 0));
      for (const m of found.slice(0, LIMIT)) {
        const label = m === "mp_m_freemode_01" ? "Homme (freemode)" : m === "mp_f_freemode_01" ? "Femme (freemode)" : m;
        list.append(h("button", { class: "list-item" + (m === S.data.model ? " active" : ""), onclick: () => changeModel(m) },
          h("span", null, label, label !== m ? h("small", null, "  " + m) : null),
          m === S.data.model ? h("span", { class: "tag current" }, "Actuel") : null));
      }
      if (found.length > LIMIT) list.append(h("div", { class: "list-more" }, `${found.length - LIMIT} autres modèles — affine la recherche`));
      if (!found.length) list.append(h("div", { class: "empty" }, "Aucun modèle trouvé."));
    }
    search.addEventListener("input", () => { S.pedSearch = search.value; fill(); });
    search.addEventListener("keydown", (e) => e.stopPropagation());
    body.append(h("div", { class: "sticky" }, search), list);
    fill();
  }

  async function changeModel(model) {
    if (model === S.data.model) return;
    const r = await post("appearance_change_model", model);
    if (!r || !r.appearanceData) { toast("Impossible de charger ce modèle.", "error"); return; }
    S.settings = r.appearanceSettings || S.settings;
    S.data = r.appearanceData;
    if (!S.data.tattoos) S.data.tattoos = {};
    S.tattooSel = null;
    renderRail();
    renderPanel();
  }

  // ----- Héritage ----------------------------------------------------
  function renderHeritage(body) {
    const L = S.locales.headBlend, set = S.settings.headBlend, hb = S.data.headBlend;
    const change = (key, v) => { hb[key] = v; send("headBlend", "appearance_change_head_blend", { ...hb }); };
    const parent = (key, label) => stepper({ label, min: set[key].min, max: set[key].max, value: hb[key], format: (v) => PARENTS[v] || `#${v}`, onChange: (v) => change(key, v) });
    const mix = (key, label, left, right) => slider({ label, min: set[key].min, max: set[key].max, step: set[key].factor || 0.1, value: hb[key], format: (v) => `${Math.round((1 - v) * 100)}% ${left} · ${Math.round(v * 100)}% ${right}`, onChange: (v) => change(key, v) });

    body.append(
      card("hb-shape", L.shape.title, [
        parent("shapeFirst", L.shape.firstOption).el,
        parent("shapeSecond", L.shape.secondOption).el,
        mix("shapeMix", L.shape.mix, L.shape.firstOption, L.shape.secondOption).el,
      ], { defaultOpen: true }),
      card("hb-skin", L.skin.title, [
        parent("skinFirst", L.skin.firstOption).el,
        parent("skinSecond", L.skin.secondOption).el,
        mix("skinMix", L.skin.mix, L.skin.firstOption, L.skin.secondOption).el,
      ], { defaultOpen: true }),
      card("hb-race", L.race.title, [
        parent("shapeThird", L.race.shape).el,
        parent("skinThird", L.race.skin).el,
        slider({ label: L.race.mix, min: set.thirdMix.min, max: set.thirdMix.max, step: set.thirdMix.factor || 0.1, value: hb.thirdMix, onChange: (v) => change("thirdMix", v) }).el,
      ]),
    );
  }

  // ----- Visage ------------------------------------------------------
  function renderFace(body) {
    const L = S.locales.faceFeatures, set = S.settings.faceFeatures, ff = S.data.faceFeatures;
    const f = (key, label) => slider({
      label, min: set[key].min, max: set[key].max, step: set[key].factor || 0.1, value: ff[key], bipolar: true,
      format: (v) => (v > 0 ? "+" : "") + v.toFixed(1),
      onChange: (v) => { ff[key] = v; send("face", "appearance_change_face_feature", { ...ff }); },
    }).el;
    const groups = [
      ["nose", [["noseWidth", "width"], ["nosePeakHigh", "height"], ["nosePeakSize", "size"], ["noseBoneHigh", "boneHeight"], ["nosePeakLowering", "peakHeight"], ["noseBoneTwist", "boneTwist"]]],
      ["eyebrows", [["eyeBrownHigh", "height"], ["eyeBrownForward", "depth"]]],
      ["cheeks", [["cheeksBoneHigh", "boneHeight"], ["cheeksBoneWidth", "boneWidth"], ["cheeksWidth", "width"]]],
      ["eyesAndMouth", [["eyesOpening", "eyesOpening"], ["lipsThickness", "lipsThickness"]]],
      ["jaw", [["jawBoneWidth", "width"], ["jawBoneBackSize", "size"]]],
      ["chin", [["chinBoneLowering", "lowering"], ["chinBoneLenght", "length"], ["chinBoneSize", "size"], ["chinHole", "hole"]]],
      ["neck", [["neckThickness", "thickness"]]],
    ];
    groups.forEach(([g, feats], i) => {
      body.append(card("ff-" + g, L[g].title, feats.filter(([k]) => set[k]).map(([k, lk]) => f(k, L[g][lk])), { defaultOpen: i === 0 }));
    });
  }

  // ----- Cheveux et apparence ----------------------------------------
  function renderHair(body) {
    const L = S.locales.headOverlays, set = S.settings, d = S.data, free = isFreemode();

    // Cheveux
    const hairCtl = [];
    const changeHair = (key, v) => {
      d.hair[key] = v;
      if (key === "style") { d.hair.texture = 0; texture.set(0); }
      send("hair", "appearance_change_hair", { ...d.hair }, (r) => {
        if (!r) return;
        S.settings.hair = r;
        texture.setRange(r.texture.min, r.texture.max, r.blacklist && r.blacklist.textures);
        style.setRange(r.style.min, r.style.max, r.blacklist && r.blacklist.drawables);
      });
    };
    const bl = set.hair.blacklist || { drawables: [], textures: [] };
    const style = stepper({ label: L.hair.style, min: set.hair.style.min, max: set.hair.style.max, value: d.hair.style, blacklist: bl.drawables, onChange: (v) => changeHair("style", v) });
    const texture = stepper({ label: L.hair.texture, min: set.hair.texture.min, max: set.hair.texture.max, value: d.hair.texture, blacklist: bl.textures, onChange: (v) => changeHair("texture", v) });
    hairCtl.push(style.el, texture.el);

    if (free) {
      const fades = (set.tattoos && set.tattoos.items && set.tattoos.items.ZONE_HAIR || []).filter((t) => (isMale() ? t.hashMale : t.hashFemale) !== "");
      if (!S.config.automaticFade && fades.length) {
        const curFade = d.tattoos && d.tattoos.ZONE_HAIR && d.tattoos.ZONE_HAIR[0];
        const idx = Math.max(0, curFade ? fades.findIndex((t) => t.name === curFade.name) : 0);
        hairCtl.push(stepper({
          label: L.hair.fade, min: 0, max: fades.length - 1, value: idx,
          onChange: (i) => {
            d.tattoos = d.tattoos || {};
            d.tattoos.ZONE_HAIR = [fades[i]];
            send("fade", "appearance_apply_tattoo", clone(d.tattoos));
          },
        }).el);
      }
      hairCtl.push(
        swatches({ label: L.hair.color, colors: set.hair.color.items, value: d.hair.color, onChange: (v) => changeHair("color", v) }).el,
        swatches({ label: L.hair.highlight, colors: set.hair.highlight.items, value: d.hair.highlight, onChange: (v) => changeHair("highlight", v) }).el,
      );
    }
    body.append(card("ov-hair", L.hair.title, hairCtl, { defaultOpen: true }));
    if (!free) return;

    // Couleur des yeux
    const eyeMax = Math.min(set.eyeColor ? set.eyeColor.max : 30, EYE_COLORS.length - 1);
    body.append(card("ov-eyes", L.eyeColor, [
      stepper({ label: L.eyeColor, min: set.eyeColor ? set.eyeColor.min : 0, max: eyeMax, value: d.eyeColor || 0, format: (v) => EYE_COLORS[v] || "", onChange: (v) => { d.eyeColor = v; send("eye", "appearance_change_eye_color", v); } }).el,
    ]));

    // Calques (barbe, sourcils, maquillage...)
    const overlay = (key, withSecond) => {
      const o = d.headOverlays[key], st = set.headOverlays[key];
      if (!o || !st) return null;
      const change = (field, v) => { o[field] = v; send("overlays", "appearance_change_head_overlay", clone(d.headOverlays)); };
      const ctl = [
        stepper({ label: L.style, min: st.style.min, max: st.style.max, value: o.style, onChange: (v) => change("style", v) }).el,
        slider({ label: L.opacity, min: st.opacity.min, max: st.opacity.max, step: st.opacity.factor || 0.1, value: o.opacity, format: (v) => Math.round(v * 100) + "%", onChange: (v) => change("opacity", v) }).el,
      ];
      if (st.color) {
        ctl.push(swatches({ label: L.color, colors: st.color.items, value: o.color, onChange: (v) => change("color", v) }).el);
        if (withSecond) ctl.push(swatches({ label: L.secondColor, colors: st.color.items, value: o.secondColor, onChange: (v) => change("secondColor", v) }).el);
      }
      return card("ov-" + key, L[key], ctl);
    };

    body.append(h("div", { class: "section-label" }, "Pilosité"));
    ["eyebrows", "beard", "chestHair"].forEach((k) => { const c = overlay(k); if (c) body.append(c); });
    body.append(h("div", { class: "section-label" }, "Maquillage"));
    [["makeUp", true], ["blush"], ["lipstick"]].forEach(([k, s]) => { const c = overlay(k, s); if (c) body.append(c); });
    body.append(h("div", { class: "section-label" }, "Peau"));
    ["blemishes", "ageing", "complexion", "sunDamage", "moleAndFreckles", "bodyBlemishes"].forEach((k) => { const c = overlay(k); if (c) body.append(c); });
  }

  // ----- Vêtements et accessoires ------------------------------------
  function itemCard({ kind, id, title, idKey, endpoint }) {
    const L = S.locales[kind === "component" ? "components" : "props"];
    const list = kind === "component" ? "components" : "props";
    const setOf = () => S.settings[list].find((x) => x[idKey] === id);
    const item = S.data[list].find((x) => x[idKey] === id);
    const st = setOf();
    if (!item || !st) return null;
    const black = st.blacklist || { drawables: [], textures: [] };
    const isProp = kind === "prop";
    const texMin = (s) => Math.max(0, s.texture.min);

    const onResult = (r) => {
      if (!r) return;
      const arr = S.settings[list];
      const i = arr.findIndex((x) => x[idKey] === id);
      if (i >= 0) arr[i] = r; else arr.push(r);
      drawable.setRange(r.drawable.min, r.drawable.max, r.blacklist && r.blacklist.drawables);
      texture.setRange(texMin(r), r.texture.max, r.blacklist && r.blacklist.textures);
    };
    const drawable = stepper({
      label: L.drawable, min: st.drawable.min, max: st.drawable.max, value: item.drawable, blacklist: black.drawables,
      format: isProp ? (v) => (v === -1 ? "Aucun" : "") : null,
      onChange: (v) => { item.drawable = v; item.texture = 0; texture.set(0); badge.textContent = label(); send(list + id, endpoint, { ...item }, onResult); },
    });
    const texture = stepper({
      label: L.texture, min: texMin(st), max: st.texture.max, value: Math.max(item.texture, texMin(st)), blacklist: black.textures,
      onChange: (v) => { item.texture = v; badge.textContent = label(); send(list + id, endpoint, { ...item }, onResult); },
    });
    const label = () => (isProp && item.drawable === -1 ? "Aucun" : `${item.drawable} · ${item.texture}`);
    const c = card(`${list}-${id}`, title, [drawable.el, texture.el], { badge: label() });
    const badge = c.querySelector(".badge");
    return c;
  }

  function renderClothes(body) {
    const L = S.locales.components, cfg = S.config.componentConfig || {};
    const entries = [
      [0, "head", !isFreemode()],
      [1, "mask", cfg.masks],
      [11, "jackets", cfg.jackets],
      [8, "shirt", cfg.shirts],
      [3, "upperBody", cfg.upperBody],
      [4, "lowerBody", cfg.lowerBody],
      [6, "shoes", cfg.shoes],
      [7, "scarfAndChains", cfg.scarfAndChains && !S.config.hasTracker],
      [5, "bags", cfg.bags],
      [9, "bodyArmor", cfg.bodyArmor],
      [10, "decals", cfg.decals],
    ];
    let first = true;
    for (const [id, key, show] of entries) {
      if (!show) continue;
      const c = itemCard({ kind: "component", id, title: L[key], idKey: "component_id", endpoint: "appearance_change_component" });
      if (c) { if (first && !S.open.has("seen:clothes")) { c.classList.add("open"); S.open.add(`components-${id}`); S.open.add("seen:clothes"); } first = false; body.append(c); }
    }
    if (!body.children.length) body.append(h("div", { class: "empty" }, "Aucun vêtement modifiable."));
  }

  function renderProps(body) {
    const L = S.locales.props, cfg = S.config.propConfig || {};
    const entries = [[0, "hats", cfg.hats], [1, "glasses", cfg.glasses], [2, "ear", cfg.ear], [6, "watches", cfg.watches], [7, "bracelets", cfg.bracelets]];
    for (const [id, key, show] of entries) {
      if (!show) continue;
      const c = itemCard({ kind: "prop", id, title: L[key], idKey: "prop_id", endpoint: "appearance_change_prop" });
      if (c) body.append(c);
    }
    if (!body.children.length) body.append(h("div", { class: "empty" }, "Aucun accessoire modifiable."));
  }

  // ----- Tatouages ---------------------------------------------------
  function tattooItems() {
    const all = (S.settings.tattoos && S.settings.tattoos.items) || {};
    const male = isMale(), out = {};
    for (const z of Object.keys(all)) {
      if (z === "ZONE_HAIR") continue;
      out[z] = (all[z] || []).filter((t) => (male ? t.hashMale : t.hashFemale) !== "");
    }
    return out;
  }
  const appliedIn = (zone) => (S.data.tattoos && S.data.tattoos[zone]) || [];
  const isApplied = (t) => appliedIn(t.zone).some((x) => x.name === t.name);

  function clearTattooPreview() {
    if (S.tattooSel) {
      S.tattooSel = null;
      post("appearance_delete_tattoo", clone(S.data.tattoos || {}));
    }
  }

  function renderTattoos(body) {
    const L = S.locales.tattoos, items = tattooItems(), zones = Object.keys(items);
    if (!zones.length) { body.append(h("div", { class: "empty" }, "Aucun tatouage disponible.")); return; }
    if (!zones.includes(S.tattooZone)) S.tattooZone = zones[0];
    const opSet = (S.settings.tattoos && S.settings.tattoos.opacity) || { min: 0.1, max: 1, factor: 0.1 };

    const tabs = h("div", { class: "tabs" });
    for (const z of zones) {
      const n = appliedIn(z).length;
      tabs.append(h("button", { class: "tab" + (z === S.tattooZone ? " active" : ""), onclick: () => { clearTattooPreview(); S.tattooZone = z; renderPanel(); } },
        L.items[z] || z, n ? h("span", { class: "count" }, `(${n})`) : null));
    }
    const search = h("input", { class: "search", placeholder: "Rechercher un tatouage…", value: S.tattooSearch });
    search.addEventListener("keydown", (e) => e.stopPropagation());
    const selBox = h("div");
    const list = h("div", { class: "list" });

    function preview() {
      if (!S.tattooSel) return;
      const t = { ...S.tattooSel, opacity: S.tattooOpacity };
      send("tattooPreview", "appearance_preview_tattoo", { data: clone(S.data.tattoos || {}), tattoo: t });
    }

    function paintSel() {
      selBox.innerHTML = "";
      const t = S.tattooSel;
      if (!t) return;
      const applied = isApplied(t);
      selBox.append(h("div", { class: "selected-box" },
        h("div", { class: "name" }, t.label || t.name),
        applied ? null : slider({ label: L.opacity, min: opSet.min, max: opSet.max, step: opSet.factor || 0.1, value: S.tattooOpacity, format: (v) => Math.round(v * 100) + "%", onChange: (v) => { S.tattooOpacity = v; preview(); } }).el,
        h("div", { class: "actions" },
          h("button", { class: "btn ghost sm", onclick: () => { clearTattooPreview(); paintSel(); fill(); } }, "Annuler"),
          applied
            ? h("button", { class: "btn danger sm", onclick: () => removeTattoo(t) }, L.delete)
            : h("button", { class: "btn primary sm", onclick: () => applyTattoo(t) }, L.apply))));
    }

    function fill() {
      list.innerHTML = "";
      const q = S.tattooSearch.trim().toLowerCase();
      const arr = (items[S.tattooZone] || []).filter((t) => !q || (t.label || t.name).toLowerCase().includes(q));
      // Les tatouages déjà posés d'abord
      arr.sort((a, b) => isApplied(b) - isApplied(a));
      for (const t of arr) {
        const sel = S.tattooSel && S.tattooSel.name === t.name;
        list.append(h("button", { class: "list-item" + (sel ? " active" : ""), onclick: () => select(t) },
          h("span", null, t.label || t.name), isApplied(t) ? h("span", { class: "tag" }, "Posé") : null));
      }
      if (!arr.length) list.append(h("div", { class: "empty" }, "Aucun résultat."));
    }

    function select(t) {
      if (S.tattooSel && S.tattooSel.name === t.name) return;
      S.tattooSel = t;
      if (isApplied(t)) {
        S.tattooOpacity = appliedIn(t.zone).find((x) => x.name === t.name).opacity || 1;
        post("appearance_delete_tattoo", clone(S.data.tattoos || {}));
      } else {
        S.tattooOpacity = 1;
        preview();
      }
      paintSel(); fill();
    }

    async function applyTattoo(t) {
      const tattoo = { ...t, opacity: S.tattooOpacity };
      const updated = clone(S.data.tattoos || {});
      (updated[t.zone] = updated[t.zone] || []).push(tattoo);
      const paid = await post("appearance_apply_tattoo", { tattoo, updatedTattoos: updated });
      if (paid) {
        S.data.tattoos = updated;
        S.tattooSel = null;
        toast("Tatouage appliqué", "success");
        renderPanel();
      } else {
        toast("Paiement refusé : pas assez d'argent.", "error");
        clearTattooPreview();
        paintSel(); fill();
      }
    }

    async function removeTattoo(t) {
      const updated = clone(S.data.tattoos || {});
      updated[t.zone] = (updated[t.zone] || []).filter((x) => x.name !== t.name);
      S.data.tattoos = updated;
      S.tattooSel = null;
      await post("appearance_delete_tattoo", clone(updated));
      renderPanel();
    }

    search.addEventListener("input", () => { S.tattooSearch = search.value; fill(); });
    const total = Object.keys(items).reduce((n, z) => n + appliedIn(z).length, 0);
    body.append(h("div", { class: "sticky" }, tabs, search, selBox), list,
      h("button", {
        class: "btn danger block", disabled: total === 0 ? true : null,
        onclick: () => openModal({
          title: L.deleteAll, description: `${total} tatouage(s) seront retirés.`,
          onYes: async () => {
            const updated = clone(S.data.tattoos || {});
            for (const z of Object.keys(updated)) if (z !== "ZONE_HAIR") updated[z] = [];
            S.data.tattoos = updated; S.tattooSel = null;
            await post("appearance_delete_tattoo", clone(updated));
            renderPanel();
          },
        }),
      }, L.deleteAll));
    paintSel(); fill();
  }

  // ------------------------------------------------------------------
  // Barre d'outils
  // ------------------------------------------------------------------
  function setupTools() {
    const icon = { head: ICONS.camHead, body: ICONS.camBody, bottom: ICONS.camLegs };
    const cloth = { head: ICONS.hat, body: ICONS.shirt, bottom: ICONS.pants };
    document.querySelectorAll("[data-cam]").forEach((b) => {
      const k = b.dataset.cam; b.innerHTML = icon[k];
      b.onclick = () => {
        S.rotate = null;
        if (S.camera === k) { S.camera = null; post("appearance_set_camera", "default"); }
        else { S.camera = k; post("appearance_set_camera", k); }
        paintTools();
      };
    });
    document.querySelectorAll("[data-rot]").forEach((b) => {
      const k = b.dataset.rot; b.innerHTML = k === "left" ? ICONS.rotLeft : ICONS.rotRight;
      b.onclick = () => {
        if (S.rotate === k) { S.rotate = null; post("appearance_set_camera", "current"); }
        else { S.rotate = k; post("appearance_rotate_camera", k); }
        paintTools();
      };
    });
    const turn = $("[data-turn]"); turn.innerHTML = ICONS.turn; turn.onclick = () => post("appearance_turn_around");
    document.querySelectorAll("[data-cloth]").forEach((b) => {
      const k = b.dataset.cloth; b.innerHTML = cloth[k];
      b.onclick = () => {
        if (S.removed[k]) post("appearance_wear_clothes", { data: S.data, key: k });
        else post("appearance_remove_clothes", k);
        S.removed[k] = !S.removed[k];
        paintTools();
      };
    });
  }
  function paintTools() {
    document.querySelectorAll("[data-cam]").forEach((b) => b.classList.toggle("active", S.camera === b.dataset.cam));
    document.querySelectorAll("[data-rot]").forEach((b) => b.classList.toggle("active", S.rotate === b.dataset.rot));
    document.querySelectorAll("[data-cloth]").forEach((b) => b.classList.toggle("active", S.removed[b.dataset.cloth]));
  }

  // ------------------------------------------------------------------
  // Modale et notifications
  // ------------------------------------------------------------------
  function openModal({ title, description, onYes }) {
    const L = S.locales.modal;
    $("#modal-title").textContent = title;
    $("#modal-desc").textContent = description || "";
    $("#modal-yes").textContent = L.accept;
    $("#modal-no").textContent = L.decline;
    $("#modal").classList.remove("hidden");
    $("#modal-yes").onclick = () => { closeModal(); onYes(); };
    $("#modal-no").onclick = closeModal;
  }
  function closeModal() { $("#modal").classList.add("hidden"); }
  const modalOpen = () => !$("#modal").classList.contains("hidden");

  function toast(msg, kind) {
    const t = h("div", { class: "toast " + (kind || "") }, msg);
    $("#toasts").append(t);
    setTimeout(() => t.remove(), 3000);
  }

  function askSave() {
    const L = S.locales.modal.save;
    openModal({ title: L.title, description: L.description, onYes: () => { clearTattooPreview(); post("appearance_save", S.data); } });
  }
  function askExit() {
    if (!S.config || !S.config.enableExit) return;
    const L = S.locales.modal.exit;
    openModal({ title: L.title, description: L.description, onYes: () => post("appearance_exit") });
  }

  // ------------------------------------------------------------------
  // Ouverture / fermeture
  // ------------------------------------------------------------------
  async function show(payload) {
    const token = ++loadToken;
    S.visible = true;
    S.camera = null; S.rotate = null; S.removed = { head: false, body: false, bottom: false };
    S.tattooSel = null; S.tattooSearch = ""; S.pedSearch = "";
    S.config = null; S.settings = null; S.data = null;
    $("#app").classList.remove("hidden");
    $("#panel-title").textContent = "Chargement…";
    $("#rail").innerHTML = "";
    $("#panel-body").innerHTML = '<div class="boot"><div class="boot-logo"></div><div class="loader"></div></div>';
    closeModal(); paintTools();

    const getLocales = S.localesLoaded ? Promise.resolve(null) : post("appearance_get_locales");
    const getSettings = () => post("appearance_get_settings");
    const getData = () => post("appearance_get_data");
    let settingsRes, dataRes, locales;
    if (payload && payload.asynchronous) {
      locales = await getLocales; settingsRes = await getSettings(); dataRes = await getData();
    } else {
      [locales, settingsRes, dataRes] = await Promise.all([getLocales, getSettings(), getData()]);
    }
    if (token !== loadToken || !S.visible) return;
    if (locales) { S.locales = deepMerge(DEFAULT_LOCALES, locales); S.localesLoaded = true; }
    if (!settingsRes || !dataRes) { toast("Erreur de chargement de l'apparence.", "error"); return; }

    S.settings = settingsRes.appearanceSettings;
    S.config = dataRes.config || {};
    S.data = clone(dataRes.appearanceData);
    S.stored = clone(dataRes.appearanceData);
    if (!S.data.tattoos || Array.isArray(S.data.tattoos)) S.data.tattoos = {};

    $("#btn-exit").classList.toggle("hidden", !S.config.enableExit);
    $("#btn-save").textContent = S.locales.modal.save.title;
    $("#btn-exit").textContent = S.locales.modal.exit.title;
    renderRail();
    renderPanel();
  }

  function hide() {
    S.visible = false;
    loadToken++;
    closeModal();
    $("#app").classList.add("hidden");
    S.data = null; S.stored = null; S.config = null; S.tattooSel = null;
  }

  // ------------------------------------------------------------------
  // Événements
  // ------------------------------------------------------------------
  window.addEventListener("message", (e) => {
    const msg = e.data || {};
    if (msg.type === "appearance_display") show(msg.payload || {});
    else if (msg.type === "appearance_hide") hide();
  });

  window.addEventListener("keydown", (e) => {
    if (!S.visible) return;
    const typing = e.target && e.target.tagName === "INPUT" && e.target.type !== "range";
    if (e.key === "Escape") {
      if (modalOpen()) closeModal(); else askExit();
      return;
    }
    if (typing || modalOpen()) return;
    const k = e.key.toLowerCase();
    if (k === "a" || k === "q") post("rotate_left");      // q pour les claviers AZERTY
    else if (k === "d") post("rotate_right");
  });

  $("#btn-save").addEventListener("click", askSave);
  $("#btn-exit").addEventListener("click", askExit);
  setupTools();

  // Pour les tests hors jeu
  window.__appearance = { show, hide, state: S };
})();
