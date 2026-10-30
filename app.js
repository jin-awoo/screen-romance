/* Screen Romance: interactive companion to "The gendered fragility of celebrity relationships".
   Data: window.SR_DATA from data.js (built by build_data.py). Charts: d3 v7. No model is fitted here:
   Kaplan-Meier curves are recomputed for the filtered sample, hazard ratios are read from the revised manuscript reproduction statistics. */
(() => {
  "use strict";
  const D = window.SR_DATA;
  if (!D || !window.d3) {
    document.body.prepend(Object.assign(document.createElement("p"), {
      textContent: "The data file (data.js) or the chart library did not load. Rebuild with build_data.py and reload.",
      style: "padding:16px;color:#b00",
    }));
    return;
  }

  // ───────────────────────────── i18n ─────────────────────────────
  const T = {
  "en": {
    "billing": "Computational social science · Wikidata × TMDB",
    "title": "The gendered fragility of celebrity relationships",
    "authors": "Jin Han · Petter Holme — Aalto University · Kobe University",
    "filters": "Filters",
    "reset": "Reset",
    "f_era": "Start decade",
    "f_rel": "Relationship",
    "f_cty": "Citizenship of either partner",
    "f_cty_ph": "Search countries",
    "rel_all": "All",
    "rel_spouse": "Married",
    "rel_partner": "Unmarried",
    "sample": "Selected unions",
    "st_unions": "Unions",
    "st_people": "People",
    "st_brk": "Dissolved",
    "st_dth": "Death-censored",
    "st_unc": "Death; end uncertain",
    "st_tog": "Ongoing",
    "s1_eyebrow": "Supplementary data explorer",
    "s1_title": "Relationship survival",
    "s1_lede": "Descriptive KM estimates; deaths are censored.",
    "split_by": "Compare by",
    "sp_her": "Her fame",
    "sp_his": "His fame",
    "sp_joint": "Joint exposure",
    "sp_kind": "Shared titles",
    "sp_rel": "Relationship",
    "sp_era": "Era",
    "g_high_her": "She is in the more famous half",
    "g_high_his": "He is in the more famous half",
    "g_low": "Less famous half",
    "g_none": "No acting work in the 3 years before",
    "j_high": "Higher joint exposure",
    "j_low": "Lower joint exposure",
    "j_none": "No shared title",
    "k_unscripted": "Other shared credits",
    "k_scripted": "Both credited in acting roles",
    "k_none": "No shared title",
    "rel_spouse_g": "Married",
    "rel_partner_g": "Unmarried partners",
    "era_early": "1950–1989",
    "era_late": "1990–2015",
    "cap_rel": "Female–male unions with positive follow-up; uncertain endings excluded. Supported premarital spells are merged with marriage.",
    "cap_era": "Female–male unions with positive follow-up, by start year; uncertain endings excluded.",
    "th_group": "Group",
    "th_n": "Unions",
    "th_med": "Median, years",
    "th_s10": "S(10 years)",
    "th_s20": "S(20 years)",
    "km_x": "Duration (years)",
    "km_y": "Survival S(t)",
    "not_reached": "not reached",
    "at_year": "Year {t}",
    "at_risk": "{n} still followed",
    "g_median_l": "Median KM survival in selected female–male unions",
    "years_unit": "years",
    "outcome_title": "How the {n} selected unions ended",
    "costar_l": "Shared credit before start (3 yr)",
    "cross_l": "No shared citizenship, among unions with citizenship recorded on both sides",
    "dx0": "No work",
    "dx1": "Bottom quarter",
    "dx2": "Second",
    "dx3": "Third",
    "dx4": "Top quarter",
    "her_l": "Her fame",
    "his_l": "His fame",
    "too_few": "too few unions",
    "s2_eyebrow": "What the models say",
    "fm_level": "During the union",
    "fm_pre": "Before the union",
    "forest_x": "Hazard ratio per +10 percentile points (log scale)",
    "hr_log": "Hazard ratio (log scale)",
    "row_main": "Main model",
    "row_reltype": "+ relationship type",
    "row_bootstrap": "Cluster bootstrap interval",
    "row_ipw": "Weighted for TMDB matching",
    "row_spouses": "Spouses only",
    "row_partners": "Unmarried partners only",
    "row_early": "Began 1950s–80s",
    "row_late": "Began 1990s–2015",
    "row_both_items": "Recorded on both partners' pages",
    "row_no_presenter": "No presenter-only partner",
    "row_start_ok": "Start year undisputed",
    "row_snapshot": "Single TMDB snapshot",
    "row_us": "At least one US citizen",
    "row_non_us": "No US citizen",
    "row_pct3": "Fame in the 3 years before",
    "row_pct1": "Fame in the year before",
    "row_lead": "Lead film roles only (no popularity)",
    "row_allcred": "Every credit, talk shows included",
    "as_table": "Show as a table",
    "th_spec": "Window",
    "th_her": "Female HR [95% CI]",
    "th_his": "Male HR [95% CI]",
    "no_diff": "no difference",
    "her_short": "Her",
    "his_short": "His",
    "rise_row": "{who} · {k}-year rise",
    "sp_unscr_exp": "Seen together, per unit of exposure",
    "sp_scr_exp": "Acted together, per unit of exposure",
    "sp_unscr_only": "Only seen together vs. no shared title",
    "sp_scr_any": "Acted together vs. no shared title",
    "s3_eyebrow": "Supplementary cohort description",
    "s3_title": "Partner citizenships",
    "s3_lede": "Circles count unions involving each citizenship; multiple citizenships can count more than once. Arcs link partners with no shared citizenship.",
    "play": "Play",
    "pause": "Pause",
    "all_years": "All years",
    "window_start": "Window start",
    "window": "Window",
    "years_n": "{n} years",
    "speed": "Speed",
    "slow": "Slow",
    "standard": "Standard",
    "fast": "Fast",
    "reset_map": "Reset",
    "map_sub": "{n} unions · {c} cross-border",
    "map_node": "Unions",
    "map_arc": "Cross-national pairs",
    "hist_title": "Starts and outcomes",
    "atlas_caption": "Wikidata citizenships; historical states map to successors. Cross-national shares exclude missing citizenship.",
    "top_countries": "Countries",
    "top_pairs": "Cross-border pairs",
    "tip_click_on": "Click to filter the page by this country",
    "tip_click_off": "Click to remove this filter",
    "s4_eyebrow": "Supplementary individual records",
    "s4_title": "Careers and relationships",
    "s4_lede": "Annual fame reference scores. Couples are listed by cached TMDB popularity.",
    "find_couple": "Search a name",
    "find_couple_ph": "Search a name, e.g. Newman",
    "c_count": "{n} couples",
    "show_more": "Show {n} more",
    "no_match": "No couple matches the name and filters.",
    "o_brk": "Broke up",
    "o_dth": "Death-censored",
    "o_unc": "Death; end uncertain",
    "o_tog": "Ongoing",
    "f_type": "Relationship",
    "f_start": "Began",
    "f_end": "Observation endpoint",
    "f_dur": "Length",
    "f_joint": "Shared credits: start −3 through start year",
    "yes": "Yes",
    "no": "No",
    "joint_fmt": "{s} both acting · {u} other shared credits",
    "dur_fmt": "{y} years",
    "dur_cens": "{y}+ years",
    "fame_note": "Scores appear after the measurement year ends; missing years remain blank. Shading marks the observed relationship period.",
    "age_at": "~{a} at start",
    "born": "born {y}",
    "died": "died {y}",
    "other_unions": "Recorded relationships",
    "no_curve": "No TMDB career data for either partner.",
    "began_l": "Began {y}",
    "end_brk": "Broke up {y}",
    "end_dth": "Death {y}",
    "end_unc": "Partner died",
    "same_sex": "Outside the female–male classification: retained for descriptive browsing, excluded from the gendered main analyses.",
    "fame_axis": "Annual fame score",
    "wikidata": "Wikidata",
    "tmdb": "TMDB",
    "footer_built": "TMDB cache: March 2026 · Outcomes: 18 September 2026 · Wikidata × TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.",
    "dec_label": "{d}s",
    "dec_last": "2010–15",
    "key_claim": "Shared visibility, the starting fame gap, and fame change are associated with dissolution.",
    "key_her_l": "Female three-year rise · HR {hr} [{lo}, {hi}]",
    "key_him_l": "Male three-year rise · HR {hr} [{lo}, {hi}]",
    "key_note": "Three-year rise model · n = 4,314 · 95% CI. Female–male difference not significant (p = 0.086).",
    "st_unf": "Marriage transition",
    "o_unf": "Marriage transition; no subsequent follow-up",
    "end_unf": "{y}: follow-up ends at marriage transition",
    "sp_dom": "Fame groups",
    "sp_low": "Low total fame",
    "sp_high": "High total fame",
    "sp_earlyhigh": "High fame, 1950–1989",
    "sp_latehigh": "High fame, 1990–2015",
    "sp_shared1": "Exposure, 1 yr",
    "sp_shared2": "Exposure, 2 yr",
    "sp_shared3": "Exposure, 3 yr",
    "cap_dom": "One-year fame score; ahead: ≥20 points, similar: <20. Female–male unions with positive follow-up; uncertain endings excluded.",
    "cap_low": "One-year fame groups; total fame below the main-sample median.",
    "cap_high": "One-year fame groups; total fame at or above the main-sample median.",
    "cap_earlyhigh": "High total fame, 1950–1989; one-year fame groups.",
    "cap_latehigh": "High total fame, 1990–2015; one-year fame groups.",
    "cap_shared1": "Exposure: start −1 years through start +6 months; split at the main-sample exposure median.",
    "cap_shared2": "Exposure: start −2 years through start +6 months; split at the main-sample exposure median.",
    "cap_shared3": "Exposure: start −3 years through start +6 months; split at the main-sample exposure median."
  }
};
  Object.assign(T.en, window.SR_PAPER.copy.en);

  const LANG = "en";
  function t(key, vars) {
    let s = T[LANG][key];
    if (s === undefined) s = T.en[key];
    if (s === undefined) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] === undefined ? "" : vars[k]));
    return s;
  }

  // ───────────────────────────── helpers ─────────────────────────────
  const $ = (s, r = document) => r.querySelector(s);
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k === "style") e.style.cssText = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) e.append(kid.nodeType ? kid : document.createTextNode(kid));
    return e;
  }
  const locale = () => "en-US";
  const fmtN = (x) => new Intl.NumberFormat(locale()).format(x);
  const fmtP = (x, d = 0) => (x * 100).toFixed(d) + "%";
  const r2 = (x) => (Math.round(x * 100 + 1e-7) / 100).toFixed(2);
  const fmtYrs = (x) => (x === null ? t("not_reached") : x.toFixed(1));
  const fmtPv = (p) => (p === null || p === undefined ? "" : p < 0.001 ? "< 0.001" : "= " + p.toFixed(p < 0.01 ? 3 : 2));
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let displayNames = null;
  function regionName(a2) {
    try {
      if (!displayNames) {
        displayNames = new Intl.DisplayNames(["en"], { type: "region" });
      }
      return displayNames.of(a2) || a2;
    } catch (e) {
      return a2;
    }
  }
  const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // tooltip
  const tipEl = $("#tip");
  function tipShow(e, build) {
    tipEl.replaceChildren();
    build(tipEl);
    tipEl.hidden = false;
    tipPos(e);
  }
  function tipPos(e) {
    const pad = 14, r = tipEl.getBoundingClientRect();
    let x = e.clientX + pad, y = e.clientY + pad;
    if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - pad;
    if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - pad;
    tipEl.style.left = Math.max(8, x) + "px";
    tipEl.style.top = Math.max(8, y) + "px";
  }
  const tipHide = () => { tipEl.hidden = true; };
  const tipHead = (el, text) => el.append(h("div", { class: "th", text }));
  const tipRow = (el, color, v, label) => el.append(h("div", { class: "tr" },
    h("span", { class: "k", style: `background:var(${color})` }), h("span", { class: "v", text: v }), h("span", { class: "n", text: label })));
  const tipNote = (el, text) => el.append(h("div", { class: "tn", text }));
  const centerEvent = (node) => { const r = node.getBoundingClientRect(); return { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }; };

  function svgIn(host, W, H, label) {
    host.replaceChildren();
    return d3.select(host).append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("role", "img").attr("aria-label", label || "");
  }
  const widthOf = (el, min = 280) => Math.max(min, Math.floor(el.getBoundingClientRect().width || el.clientWidth || 600));

  // ───────────────────────────── data ─────────────────────────────
  const CI = Object.fromEntries(D.cols.map((c, i) => [c, i]));
  const P = D.persons;
  for (const p of P) {
    p.us = [];
    const v = p.f ? p.f[1].filter((x) => x !== null) : [];
    p.peak = v.length ? Math.max(...v) : 0;
    p.mean = v.length ? d3.mean(v) : 0;
  }
  const U = D.unions.map((r, i) => {
    const u = { i };
    for (const c of D.cols) u[c] = r[CI[c]];
    u.fi = u.fem === 0 ? u.a : u.fem === 1 ? u.b : -1;
    u.mi = u.fem === 0 ? u.b : u.fem === 1 ? u.a : -1;
    u.dec = Math.min(2010, Math.floor(u.sy / 10) * 10);
    u.out = u.et === 0 ? "brk" : u.et === 2 ? "dth" : u.et === 3 ? "unc" : u.et === 4 ? "unf" : "tog";
    const ca = P[u.a].c, cb = P[u.b].c;
    const qa = P[u.a].cq, qb = P[u.b].cq;
    const common = qa.some(q => qb.includes(q));
    const shared = common ? ca.find(c => cb.includes(c)) : null;
    u.ca = shared || ca[0] || null;
    u.cb = shared || cb[0] || null;
    u.citKnown = qa.length > 0 && qb.length > 0;
    u.cross = u.citKnown && !common;
    u.cset = new Set([...ca, ...cb]);
    u.score = Math.sqrt((P[u.a].pop + 0.1) * (P[u.b].pop + 0.1)); // both partners known today: geometric mean of TMDB popularity
    u.search = norm([P[u.a].n, P[u.b].n].join(" | "));
    P[u.a].us.push(i);
    P[u.b].us.push(i);
    return u;
  });
  for (const p of P) p.us.sort((a, b) => U[a].start - U[b].start);
  const ORDER = U.map((u) => u.i).sort((a, b) => U[b].score - U[a].score);
  const pname = (i) => P[i].n;
  const OUT_KEYS = ["brk", "dth", "unc", "tog", "unf"];
  const OUT_COL = { brk: "--o-brk", dth: "--o-dth", unc: "--o-unc", tog: "--o-tog", unf: "--none" };
  const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010];
  const CTY_COUNT = new Map();
  for (const u of U) for (const c of u.cset) CTY_COUNT.set(c, (CTY_COUNT.get(c) || 0) + 1);

  // ───────────────────────────── state ─────────────────────────────
  const S = { dec: new Set(), rel: "all", cty: new Set(), ctyQ: "", split: "dom", forest: "level",
    win: 10, pos: null, playing: false, speed: "std", q: "", limit: 60, couple: null };
  function pass(u) {
    if (S.dec.size && !S.dec.has(u.dec)) return false;
    if (S.rel === "spouse" && u.rel !== 0) return false;
    if (S.rel === "partner" && u.rel !== 1) return false;
    if (S.cty.size) {
      let ok = false;
      for (const c of S.cty) if (u.cset.has(c)) { ok = true; break; }
      if (!ok) return false;
    }
    return true;
  }

  // ───────────────────────────── Kaplan-Meier ─────────────────────────────
  function km(rows) {
    const n0 = rows.length;
    if (!n0) return null;
    const obs = rows.map((u) => [u.dur, u.ev]).sort((a, b) => a[0] - b[0]);
    const Tm = [0], Sv = [1], LO = [1], HI = [1];
    let s = 1, v = 0, risk = n0, i = 0;
    while (i < obs.length) {
      const tt = obs[i][0];
      let d = 0, c = 0;
      while (i < obs.length && obs[i][0] === tt) { if (obs[i][1]) d++; else c++; i++; }
      if (d > 0) {
        s *= 1 - d / risk;
        if (risk > d) v += d / (risk * (risk - d));
        let lo = s, hi = s;
        if (s > 0 && s < 1) {
          const se = Math.sqrt(v) / Math.abs(Math.log(s));
          lo = Math.pow(s, Math.exp(1.96 * se));
          hi = Math.pow(s, Math.exp(-1.96 * se));
        }
        Tm.push(tt); Sv.push(s); LO.push(lo); HI.push(hi);
      }
      risk -= d + c;
    }
    let med = null;
    for (let k = 0; k < Sv.length; k++) if (Sv[k] <= 0.5) { med = Tm[k]; break; }
    return { T: Tm, S: Sv, LO, HI, n: n0, med, maxT: obs[obs.length - 1][0], durs: obs.map((o) => o[0]) };
  }
  function kmIdx(f, tt) {
    let lo = 0, hi = f.T.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (f.T[m] <= tt) lo = m; else hi = m - 1; }
    return lo;
  }
  function atRisk(f, tt) { // number with duration >= t
    let lo = 0, hi = f.durs.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (f.durs[m] < tt) lo = m + 1; else hi = m; }
    return f.durs.length - lo;
  }
  const kmAt = (f, tt) => (tt > f.maxT ? null : f.S[kmIdx(f, tt)]);

  // ───────────────────────────── rail ─────────────────────────────
  function renderFilters() {
    const dec = $("#f-dec");
    dec.replaceChildren(
      h("button", { class: "chip", type: "button", "aria-pressed": S.dec.size === 0 ? "true" : "false", text: t("rel_all"),
        onclick: () => { S.dec.clear(); update(); } }),
      ...DECADES.map((d) => h("button", { class: "chip", type: "button", "aria-pressed": S.dec.has(d) ? "true" : "false",
        text: d === 2010 ? t("dec_last") : t("dec_label", { d }),
        onclick: () => { S.dec.has(d) ? S.dec.delete(d) : S.dec.add(d); update(); } })));
    const rel = $("#f-rel");
    rel.replaceChildren(...["all", "spouse", "partner"].map((k) => h("button", { type: "button", "aria-pressed": S.rel === k ? "true" : "false",
      text: t("rel_" + k), onclick: () => { S.rel = k; update(); } })));
    renderCountryList();
  }
  function renderCountryList() {
    const box = $("#f-cty");
    const q = norm(S.ctyQ.trim());
    let list = [...CTY_COUNT.entries()].map(([a2, n]) => ({ a2, n, name: regionName(a2) }));
    list.sort((a, b) => b.n - a.n);
    if (q) list = list.filter((d) => norm(d.name).includes(q) || d.a2.toLowerCase() === q).slice(0, 40);
    else {
      const top = list.slice(0, 12);
      for (const a2 of S.cty) if (!top.some((d) => d.a2 === a2)) top.push(list.find((d) => d.a2 === a2));
      list = top.filter(Boolean);
    }
    box.replaceChildren(...list.map((d) => {
      const id = "cty-" + d.a2;
      const cb = h("input", { type: "checkbox", id });
      cb.checked = S.cty.has(d.a2);
      cb.addEventListener("change", () => { cb.checked ? S.cty.add(d.a2) : S.cty.delete(d.a2); update(); });
      return h("label", { class: "crow", for: id }, cb, h("span", { text: d.name }), h("span", { class: "n", text: fmtN(d.n) }));
    }));
  }
  function renderRailStats() {
    const rows = U.filter(pass);
    const people = new Set();
    const cnt = Object.fromEntries(OUT_KEYS.map(k => [k, 0]));
    for (const u of rows) { people.add(u.a); people.add(u.b); cnt[u.out]++; }
    const n = rows.length || 1;
    const box = $("#rail-stats");
    box.replaceChildren(
      h("div", { class: "stat-row" }, h("span"), h("span", { text: t("st_unions") }), h("span", { class: "v", text: fmtN(rows.length) })),
      h("div", { class: "stat-row" }, h("span"), h("span", { text: t("st_people") }), h("span", { class: "v", text: fmtN(people.size) })),
      ...OUT_KEYS.map((k) => h("div", { class: "stat-row" },
        h("span", { class: "sw", style: `background:var(${OUT_COL[k]})` }), h("span", { text: t("st_" + k) }),
        h("span", { class: "v" }, fmtN(cnt[k]), h("span", { class: "p", text: fmtP(cnt[k] / n) })))));
  }

  // ───────────────────────────── survival ─────────────────────────────
  const dominanceGroups = [
    {v:0,k:'dom_m',c:'--him',w:2.75},{v:1,k:'dom_f',c:'--her',w:2.75},{v:2,k:'dom_e',c:'--ref',w:2}];
  const exposureGroups = [{v:1,k:'lower_exp',c:'--ref',w:2},{v:2,k:'higher_exp',c:'--vis',w:2.75}];
  const SPLITS = {
    dom: {get:u=>u.dom1,cap:'cap_dom',groups:dominanceGroups},
    low: {get:u=>u.high1===0?u.dom1:-1,cap:'cap_low',groups:dominanceGroups},
    high: {get:u=>u.high1===1?u.dom1:-1,cap:'cap_high',groups:dominanceGroups},
    earlyhigh: {get:u=>u.high1===1&&u.sy<1990?u.dom1:-1,cap:'cap_earlyhigh',groups:dominanceGroups},
    latehigh: {get:u=>u.high1===1&&u.sy>=1990?u.dom1:-1,cap:'cap_latehigh',groups:dominanceGroups},
    shared1: {get:u=>u.joint1,cap:'cap_shared1',groups:exposureGroups,shared:true},
    shared2: {get:u=>u.joint2,cap:'cap_shared2',groups:exposureGroups,shared:true},
    shared3: {get:u=>u.joint3,cap:'cap_shared3',groups:exposureGroups,shared:true},
    rel: {get:u=>u.rel,cap:'cap_rel',groups:[{v:0,k:'rel_spouse_g',c:'--vis',w:2.5},{v:1,k:'rel_partner_g',c:'--aqua',w:2.5}]},
    era: {get:u=>u.sy<1990?0:1,cap:'cap_era',groups:[{v:0,k:'era_early',c:'--aqua',w:2.5},{v:1,k:'era_late',c:'--vis',w:2.5}]},
  };
  const survBase = () => U.filter(u => u.paper_sample === 1 && pass(u));

  function renderSplitControl() {
    $("#split").replaceChildren(...Object.keys(SPLITS).map((k) => h("button", { type: "button", "aria-pressed": S.split === k ? "true" : "false",
      text: t("sp_" + k), onclick: () => { S.split = k; renderSplitControl(); renderSurvival(); } })));
  }

  function renderSurvival() {
    const host = $("#km-chart");
    const W = widthOf(host), H = Math.round(Math.min(400, Math.max(260, W * 0.52)));
    const M = { t: 26, r: 18, b: 44, l: 46 }, iw = W - M.l - M.r, ih = H - M.t - M.b;
    const sp = SPLITS[S.split];
    const base = sp.shared ? U.filter(u => u.eu === 0 && u.dur > 0 && pass(u)) : survBase();
    const groups = sp.groups.map((g) => ({ ...g, f: km(base.filter((u) => sp.get(u) === g.v)) }));
    const x = d3.scaleLinear([0, 40], [0, iw]), y = d3.scaleLinear([0, 1], [ih, 0]);
    const svg = svgIn(host, W, H, t("s1_title"));
    const g = svg.append("g").attr("transform", `translate(${M.l},${M.t})`);
    const yt = [0, 0.25, 0.5, 0.75, 1];
    g.append("g").selectAll("line").data(yt).join("line").attr("class", (d) => (d === 0 ? "axis-line" : "grid-line"))
      .attr("x1", 0).attr("x2", iw).attr("y1", (d) => y(d)).attr("y2", (d) => y(d));
    g.append("g").selectAll("text").data(yt).join("text").attr("class", "tick").attr("x", -8).attr("y", (d) => y(d))
      .attr("dy", "0.32em").attr("text-anchor", "end").text((d) => fmtP(d));
    g.append("g").selectAll("text").data(d3.range(0, 41, 5)).join("text").attr("class", "tick").attr("x", (d) => x(d))
      .attr("y", ih + 18).attr("text-anchor", "middle").text((d) => d);
    g.append("text").attr("class", "axis-title").attr("x", iw).attr("y", ih + 37).attr("text-anchor", "end").text(t("km_x"));
    g.append("text").attr("class", "axis-title").attr("x", -M.l + 2).attr("y", -12).text(t("km_y"));
    const pts = (f) => {
      const out = [];
      for (let k = 0; k < f.T.length && f.T[k] <= 40; k++) out.push([f.T[k], f.S[k], f.LO[k], f.HI[k]]);
      const last = out[out.length - 1];
      out.push([Math.min(40, f.maxT), last[1], last[2], last[3]]);
      return out;
    };
    const area = d3.area().curve(d3.curveStepAfter).x((d) => x(d[0])).y0((d) => y(d[2])).y1((d) => y(d[3]));
    const line = d3.line().curve(d3.curveStepAfter).x((d) => x(d[0])).y((d) => y(d[1]));
    const drawn = groups.filter((gr) => gr.f && gr.f.n >= 10);
    for (const gr of drawn) g.append("path").attr("d", area(pts(gr.f))).style("fill", `var(${gr.c})`).style("opacity", 0.1);
    for (const gr of [...drawn].reverse()) g.append("path").attr("d", line(pts(gr.f))).style("fill", "none")
      .style("stroke", `var(${gr.c})`).style("stroke-width", gr.w).style("stroke-linejoin", "round").style("stroke-linecap", "round");
    for (const gr of drawn) if (gr.f.med !== null && gr.f.med <= 40) g.append("circle").attr("cx", x(gr.f.med)).attr("cy", y(0.5)).attr("r", 4.5)
      .style("fill", `var(${gr.c})`).style("stroke", "var(--surface)").style("stroke-width", 2);
    // crosshair
    const cross = g.append("line").attr("class", "cross").attr("y1", 0).attr("y2", ih).style("opacity", 0);
    const dots = g.append("g");
    g.append("rect").attr("width", iw).attr("height", ih).style("fill", "transparent").style("cursor", "crosshair")
      .on("pointermove", (e) => {
        const [mx] = d3.pointer(e);
        const tt = Math.max(0, Math.min(40, Math.round(x.invert(mx))));
        cross.attr("x1", x(tt)).attr("x2", x(tt)).style("opacity", 1);
        const vals = drawn.map((gr) => ({ gr, s: kmAt(gr.f, tt) }));
        dots.selectAll("circle").data(vals.filter((d) => d.s !== null)).join("circle").attr("cx", x(tt)).attr("cy", (d) => y(d.s)).attr("r", 4)
          .style("fill", (d) => `var(${d.gr.c})`).style("stroke", "var(--surface)").style("stroke-width", 2);
        tipShow(e, (el) => {
          tipHead(el, t("at_year", { t: tt }));
          for (const d of vals) tipRow(el, d.gr.c, d.s === null ? "–" : fmtP(d.s), t(d.gr.k));
          tipNote(el, drawn.map((gr) => t("at_risk", { n: fmtN(atRisk(gr.f, tt)) })).join(" · "));
        });
      })
      .on("pointerleave", () => { cross.style("opacity", 0); dots.selectAll("*").remove(); tipHide(); });

    // table view / legend
    const tb = $("#km-table");
    tb.replaceChildren(
      h("thead", null, h("tr", null, ...["th_group", "th_n", "th_med", "th_s10", "th_s20"].map((k) => h("th", { text: t(k) })))),
      h("tbody", null, ...groups.map((gr) => {
        const f = gr.f;
        const s10 = f ? kmAt(f, 10) : null, s20 = f ? kmAt(f, 20) : null;
        return h("tr", null,
          h("td", null, h("span", { class: "lkey", style: `background:var(${gr.c});height:${gr.w > 2 ? 4 : 3}px` }), t(gr.k)),
          h("td", { text: fmtN(f ? f.n : 0) }),
          h("td", { text: f && f.n >= 10 ? fmtYrs(f.med) : "–" }),
          h("td", { text: f && s10 !== null && f.n >= 10 ? fmtP(s10) : "–" }),
          h("td", { text: f && s20 !== null && f.n >= 10 ? fmtP(s20) : "–" }));
      })));
    $("#km-caption").textContent = t(sp.cap);
  }

  function renderGlance() {
    const base = survBase();
    const f = km(base);
    const rows = U.filter(pass);
    const cnt = Object.fromEntries(OUT_KEYS.map(k => [k, 0]));
    for (const u of rows) cnt[u.out]++;
    const n = rows.length || 1;
    const costar = base.length ? base.filter((u) => u.costar === 1).length / base.length : 0;
    const known = rows.filter(u => u.citKnown);
    const cross = known.length ? known.filter(u => u.cross).length / known.length : null;
    $("#glance").replaceChildren(
      h("div", null,
        h("div", { class: "hero-v" }, f && f.med !== null ? f.med.toFixed(1) : "–", h("small", { text: t("years_unit") })),
        h("div", { class: "hero-l", text: t("g_median_l") })),
      h("div", null,
        h("div", { class: "eyebrow", text: t("outcome_title", { n: fmtN(rows.length) }) }),
        h("div", { class: "stack", role: "img", "aria-label": OUT_KEYS.map((k) => `${t("st_" + k)} ${fmtP(cnt[k] / n)}`).join(", ") },
          ...OUT_KEYS.filter((k) => cnt[k] > 0).map((k) => h("span", { style: `flex:${cnt[k]} 1 0;background:var(${OUT_COL[k]})` }))),
        h("div", { class: "stat-rows" }, ...OUT_KEYS.map((k) => h("div", { class: "stat-row" },
          h("span", { class: "sw", style: `background:var(${OUT_COL[k]})` }), h("span", { text: t("st_" + k) }),
          h("span", { class: "v" }, fmtP(cnt[k] / n), h("span", { class: "p", text: fmtN(cnt[k]) })))))),
      h("div", { class: "mini-stats" },
        h("div", { class: "mini" }, h("div", { class: "v", text: fmtP(costar) }), h("div", { class: "l", text: t("costar_l") })),
        h("div", { class: "mini" }, h("div", { class: "v", text: cross === null ? "—" : fmtP(cross) }), h("div", { class: "l", text: t("cross_l") }))));
  }

  function renderKey() {
    const a = D.paper.dynamics.sweep['3'].terms;
    const pc = hr => `${hr>=1?'+':'−'}${Math.round(Math.abs(hr-1)*100)}%`;
    $('#key-claim').textContent = t('key_claim');
    $('#key-her').textContent = pc(a.fris3.HR); $('#key-him').textContent = pc(a.mris3.HR);
    $('#key-her-l').textContent = t('key_her_l',{hr:r2(a.fris3.HR),lo:r2(a.fris3.lo),hi:r2(a.fris3.hi)});
    $('#key-him-l').textContent = t('key_him_l',{hr:r2(a.mris3.HR),lo:r2(a.mris3.lo),hi:r2(a.mris3.hi)});
  }

  function forestAxis(g, x, ticks, y0, label) {
    g.append("g").selectAll("line").data(ticks).join("line").attr("class", (d) => (Math.abs(d - 1) < 1e-9 ? "axis-line" : "grid-line"))
      .attr("x1", (d) => x(d)).attr("x2", (d) => x(d)).attr("y1", 0).attr("y2", y0);
    g.append("g").selectAll("text").data(ticks).join("text").attr("class", "tick").attr("x", (d) => x(d)).attr("y", y0 + 16)
      .attr("text-anchor", "middle").text((d) => d.toFixed(2).replace(/0$/, ""));
    if (label) g.append("text").attr("class", "axis-title").attr("x", x.range()[1]).attr("y", y0 + 34).attr("text-anchor", "end").text(label);
  }
  function logTicks(lo, hi, maxN) {
    for (const step of [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5]) {
      const ts = d3.range(Math.ceil(lo / step - 1e-9) * step, hi + 1e-9, step).map((v) => Math.round(v * 100) / 100);
      if (ts.length <= maxN) return ts;
    }
    return [lo, 1, hi];
  }

  function hrRows(host, rows, domain, label) {
    // rows: {label, marks:[{d, c, hollow}], tip}
    const W = widthOf(host, 260), narrow = W < 420, LW = narrow ? Math.round(W * 0.45) : Math.min(210, Math.round(W * 0.42));
    const rowH = 28, H = rows.length * rowH + 44, y0 = rows.length * rowH;
    const x = d3.scaleLog(domain, [LW, W - 12]);
    const svg = svgIn(host, W, H, label);
    const g = svg.append("g");
    forestAxis(g, x, logTicks(domain[0], domain[1], narrow ? 4 : 6), y0, label);
    rows.forEach((r, i) => {
      const yc = i * rowH + rowH / 2;
      const row = g.append("g");
      row.append("text").attr("class", "row-label").attr("x", LW - 10).attr("y", yc).attr("dy", "0.32em").attr("text-anchor", "end")
        .style("font-size", narrow ? "11px" : "12px").text(r.label);
      if (r.marks.length === 2) row.append("line").attr("x1", x(r.marks[0].d.hr)).attr("x2", x(r.marks[1].d.hr)).attr("y1", yc).attr("y2", yc)
        .style("stroke", `var(${r.marks[1].c})`).style("stroke-width", 2).style("opacity", 0.35);
      for (const m of r.marks) {
        if (m.ci) row.append("line").attr("x1", x(Math.max(domain[0], m.d.lo))).attr("x2", x(Math.min(domain[1], m.d.hi))).attr("y1", yc).attr("y2", yc)
          .style("stroke", `var(${m.c})`).style("stroke-width", 2).style("stroke-linecap", "round");
        row.append("circle").attr("cx", x(m.d.hr)).attr("cy", yc).attr("r", 4.5)
          .style("fill", m.hollow ? "var(--surface)" : `var(${m.c})`).style("stroke", m.hollow ? `var(${m.c})` : "var(--surface)").style("stroke-width", 2);
      }
      row.append("rect").attr("x", 0).attr("y", yc - rowH / 2).attr("width", W).attr("height", rowH).style("fill", "transparent")
        .on("pointermove", (e) => tipShow(e, (el) => { tipHead(el, r.label); for (const m of r.marks) tipRow(el, m.c, r2(m.d.hr),
          `${m.name || ""} [${r2(m.d.lo)}, ${r2(m.d.hi)}] p ${fmtPv(m.d.p)}`); }))
        .on("pointerleave", tipHide);
    });
  }
  function renderPaper() {
    window.SR_PAPER.render({D,LANG,t,h,$,d3,svgIn,widthOf,kmAt,atRisk,tipShow,tipHead,tipRow,tipNote,tipHide,hrRows});
  }

  // ───────────────────────────── atlas ─────────────────────────────
  const world = topojson.feature(D.world, D.world.objects.countries);
  world.features = world.features.filter((f) => f.id !== "010");
  const featById = new Map(world.features.map((f) => [f.id, f]));
  const numToA2 = new Map(Object.entries(D.countries).filter(([, c]) => c.num).map(([a2, c]) => [c.num, a2]));
  function mainPolygon(f) {
    if (f.geometry.type !== "MultiPolygon") return f;
    let best = null, ba = -1;
    for (const coords of f.geometry.coordinates) {
      const gg = { type: "Polygon", coordinates: coords };
      const a = d3.geoArea(gg);
      if (a > ba) { ba = a; best = gg; }
    }
    return best;
  }
  let MAP = null;
  function buildMap() {
    const wrap = $("#map-wrap");
    const W = widthOf(wrap, 300), H = Math.round(W * 0.5);
    if (MAP && MAP.W === W) return;
    const old = wrap.querySelector("svg");
    if (old) old.remove();
    const proj = d3.geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], world);
    const path = d3.geoPath(proj);
    const svg = d3.create("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("role", "img").attr("aria-label", t("s3_title"));
    wrap.prepend(svg.node());
    const g = svg.append("g");
    const land = g.append("g").selectAll("path").data(world.features).join("path").attr("d", path)
      .style("fill", "var(--land)").style("stroke", "var(--surface)").style("stroke-width", 0.6).attr("vector-effect", "non-scaling-stroke");
    const gArcs = g.append("g"), gNodes = g.append("g"), gLabels = g.append("g");
    const pos = new Map();
    for (const [a2, c] of Object.entries(D.countries)) {
      let p = null;
      if (c.num && featById.has(c.num)) p = path.centroid(mainPolygon(featById.get(c.num)));
      else if (c.ll) p = proj(c.ll);
      if (p && isFinite(p[0]) && isFinite(p[1])) pos.set(a2, p);
    }
    const zoom = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [W, H]])
      .filter((e) => (e.type === "wheel" ? e.ctrlKey || e.metaKey : !e.button))
      .on("zoom", (e) => { g.attr("transform", e.transform); MAP.k = e.transform.k; scaleMarks(); });
    svg.call(zoom);
    MAP = { W, H, proj, path, svg, g, land, gArcs, gNodes, gLabels, pos, zoom, k: 1 };
  }
  function scaleMarks() {
    if (!MAP) return;
    const k = MAP.k;
    MAP.gNodes.selectAll("circle").attr("r", (d) => d.r / k);
    MAP.gLabels.selectAll("text").attr("x", (d) => MAP.pos.get(d.a2)[0] + (d.r + 3) / k).style("font-size", 11 / k + "px")
      .style("stroke-width", 3 / k);
  }
  function arcPath(p, q) {
    const [x1, y1] = p, [x2, y2] = q, dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1;
    let nx = -dy / d, ny = dx / d;
    if (ny > 0) { nx = -nx; ny = -ny; }
    const off = d * 0.22, mx = (x1 + x2) / 2 + nx * off, my = (y1 + y2) / 2 + ny * off;
    return `M${x1},${y1}Q${mx},${my} ${x2},${y2}`;
  }
  const winRange = () => (S.pos === null ? null : [S.pos, Math.min(2015, S.pos + S.win - 1)]);

  function renderAtlas() {
    buildMap();
    const rows = U.filter(pass), win = winRange();
    const inWin = win ? rows.filter((u) => u.sy >= win[0] && u.sy <= win[1]) : rows;
    const nodes = new Map(), pairs = new Map();
    for (const u of inWin) {
      for (const c of u.cset) {
        const nd = nodes.get(c) || { a2: c, n: 0, x: 0, known: 0 };
        nd.n++; if (u.cross) nd.x++; if (u.citKnown) nd.known++;
        nodes.set(c, nd);
      }
      if (u.cross && u.ca && u.cb && u.ca !== u.cb) { const key = [u.ca, u.cb].sort().join("|"); pairs.set(key, (pairs.get(key) || 0) + 1); }
    }
    const nodeArr = [...nodes.values()].filter((d) => MAP.pos.has(d.a2)).sort((a, b) => b.n - a.n);
    const pairArr = [...pairs.entries()].map(([k, n]) => { const [a, b] = k.split("|"); return { k, a, b, n }; })
      .filter((d) => MAP.pos.has(d.a) && MAP.pos.has(d.b)).sort((a, b) => a.n - b.n);
    const maxN = d3.max(nodeArr, (d) => d.n) || 1, maxP = d3.max(pairArr, (d) => d.n) || 1;
    const rS = d3.scaleSqrt([0, maxN], [0, Math.max(12, MAP.W / 40)]);
    const wS = d3.scaleSqrt([0, maxP], [0.8, 7]);
    for (const d of nodeArr) d.r = Math.max(2.2, rS(d.n));
    const dur = REDUCED || S.playing ? 0 : 350;
    MAP.land.style("fill", (f) => (S.cty.has(numToA2.get(f.id)) ? "var(--land-on)" : "var(--land)"));
    MAP.gArcs.selectAll("path").data(pairArr, (d) => d.k).join(
      (en) => en.append("path").style("fill", "none").style("stroke", "var(--arc)").style("stroke-linecap", "round")
        .attr("vector-effect", "non-scaling-stroke").style("opacity", 0)
        .on("pointermove", (e, d) => tipShow(e, (el) => { tipHead(el, `${regionName(d.a)} — ${regionName(d.b)}`); tipRow(el, "--arc", fmtN(d.n), t("map_arc")); }))
        .on("pointerleave", tipHide),
      (up) => up, (ex) => ex.remove())
      .attr("d", (d) => arcPath(MAP.pos.get(d.a), MAP.pos.get(d.b)))
      .transition().duration(dur).style("stroke-width", (d) => wS(d.n)).style("opacity", 0.6);
    const nodeSel = MAP.gNodes.selectAll("circle").data(nodeArr, (d) => d.a2).join(
      (en) => en.append("circle").attr("class", "country-node").attr("tabindex", 0).attr("role", "button")
        .attr("cx", (d) => MAP.pos.get(d.a2)[0]).attr("cy", (d) => MAP.pos.get(d.a2)[1]).attr("r", 0)
        .attr("vector-effect", "non-scaling-stroke"),
      (up) => up, (ex) => ex.remove());
    nodeSel.attr("aria-label", (d) => `${regionName(d.a2)}: ${fmtN(d.n)}`)
      .style("fill", "var(--node)").style("fill-opacity", 0.78)
      .style("stroke", (d) => (S.cty.has(d.a2) ? "var(--sel)" : "var(--surface)")).style("stroke-width", (d) => (S.cty.has(d.a2) ? 2.5 : 1.2))
      .on("pointermove", (e, d) => nodeTip(e, d)).on("focus", (e, d) => nodeTip(centerEvent(e.currentTarget), d))
      .on("pointerleave blur", tipHide)
      .on("click", (e, d) => toggleCountry(d.a2))
      .on("keydown", (e, d) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCountry(d.a2); } });
    nodeSel.transition().duration(dur).attr("r", (d) => d.r / MAP.k);
    const top = nodeArr.slice(0, MAP.W < 520 ? 2 : 4);
    MAP.gLabels.selectAll("text").data(top, (d) => d.a2).join("text")
      .attr("y", (d) => MAP.pos.get(d.a2)[1]).attr("dy", "0.32em").text((d) => regionName(d.a2))
      .style("fill", "var(--ink)").style("stroke", "var(--surface)").style("paint-order", "stroke").style("stroke-linejoin", "round")
      .style("pointer-events", "none").style("font-weight", 600);
    scaleMarks();
    const nCross = inWin.filter((u) => u.cross).length;
    $("#map-yr").textContent = win ? `${win[0]}–${win[1]}` : "1950–2015";
    $("#map-sub").textContent = t("map_sub", { n: fmtN(inWin.length), c: fmtN(nCross) });
    $("#map-legend").replaceChildren(
      h("div", { class: "it" }, h("span", { class: "lmark", style: "background:var(--node);opacity:.8;width:11px;height:11px" }), t("map_node")),
      h("div", { class: "it" }, h("span", { style: "width:16px;height:3px;border-radius:2px;background:var(--arc)" }), t("map_arc")));
    // side lists
    const topC = nodeArr.slice(0, 8), mC = d3.max(topC, (d) => d.n) || 1;
    $("#top-countries").replaceChildren(...topC.map((d) => h("button", { class: "bar-row", type: "button", title: S.cty.has(d.a2) ? t("tip_click_off") : t("tip_click_on"),
      onclick: () => toggleCountry(d.a2) },
      h("span", { class: "name", text: regionName(d.a2) }), h("span", { class: "v", text: fmtN(d.n) }),
      h("span", { class: "track" }, h("span", { class: "fill", style: `display:block;width:${(100 * d.n) / mC}%` })))));
    const topP = [...pairArr].sort((a, b) => b.n - a.n).slice(0, 8), mP = d3.max(topP, (d) => d.n) || 1;
    $("#top-pairs").replaceChildren(...topP.map((d) => h("div", { class: "bar-row" },
      h("span", { class: "name", text: `${regionName(d.a)} — ${regionName(d.b)}` }), h("span", { class: "v", text: fmtN(d.n) }),
      h("span", { class: "track" }, h("span", { class: "fill arc", style: `display:block;width:${(100 * d.n) / mP}%` })))));
  }
  function nodeTip(e, d) {
    tipShow(e, (el) => {
      tipHead(el, regionName(d.a2));
      tipRow(el, "--node", fmtN(d.n), t("st_unions"));
      tipRow(el, "--arc", d.known ? fmtP(d.x / d.known) : "—", t("map_arc"));
      tipNote(el, S.cty.has(d.a2) ? t("tip_click_off") : t("tip_click_on"));
    });
  }
  function toggleCountry(a2) {
    S.cty.has(a2) ? S.cty.delete(a2) : S.cty.add(a2);
    tipHide();
    update();
  }

  function renderHist() {
    const host = $("#hist");
    const rows = U.filter(pass), years = d3.range(1950, 2016), win = winRange();
    const by = new Map(years.map((y) => [y, { y, brk: 0, dth: 0, unc: 0, tog: 0, unf: 0, n: 0 }]));
    for (const u of rows) { const b = by.get(u.sy); if (b) { b[u.out]++; b.n++; } }
    const data = [...by.values()];
    $("#hist-legend").replaceChildren(...OUT_KEYS.map((k) => h("span", null, h("span", { class: "sw", style: `background:var(${OUT_COL[k]})` }), t("st_" + k))));
    const W = widthOf(host), H = 140, M = { t: 8, r: 6, b: 24, l: 34 }, iw = W - M.l - M.r, ih = H - M.t - M.b;
    const x = d3.scaleBand(years, [0, iw]).paddingInner(0.2), y = d3.scaleLinear([0, d3.max(data, (d) => d.n) || 1], [ih, 0]).nice(3);
    const svg = svgIn(host, W, H, t("hist_title"));
    const g = svg.append("g").attr("transform", `translate(${M.l},${M.t})`);
    if (win) g.append("rect").attr("x", x(win[0]) - 1).attr("width", x(win[1]) + x.bandwidth() - x(win[0]) + 2).attr("y", 0).attr("height", ih)
      .style("fill", "var(--gold-wash)");
    const yt = y.ticks(3);
    g.append("g").selectAll("line").data(yt).join("line").attr("class", (d) => (d === 0 ? "axis-line" : "grid-line"))
      .attr("x1", 0).attr("x2", iw).attr("y1", (d) => y(d)).attr("y2", (d) => y(d));
    g.append("g").selectAll("text").data(yt).join("text").attr("class", "tick").attr("x", -6).attr("y", (d) => y(d)).attr("dy", "0.32em")
      .attr("text-anchor", "end").text((d) => fmtN(d));
    g.append("g").selectAll("text").data(years.filter((yy) => yy % 10 === 0)).join("text").attr("class", "tick")
      .attr("x", (yy) => x(yy) + x.bandwidth() / 2).attr("y", ih + 16).attr("text-anchor", "middle").text((yy) => yy);
    const inW = (yy) => !win || (yy >= win[0] && yy <= win[1]);
    for (const d of data) {
      let acc = 0;
      for (const k of OUT_KEYS) {
        if (!d[k]) continue;
        const y1 = y(acc), y2 = y(acc + d[k]);
        g.append("rect").attr("x", x(d.y)).attr("width", x.bandwidth()).attr("y", y2).attr("height", Math.max(0, y1 - y2 - (acc + d[k] < d.n ? 1 : 0)))
          .style("fill", `var(${OUT_COL[k]})`).style("opacity", inW(d.y) ? 1 : 0.35);
        acc += d[k];
      }
    }
    g.append("g").selectAll("rect").data(data).join("rect").attr("x", (d) => x(d.y) - (x.step() - x.bandwidth()) / 2).attr("width", x.step())
      .attr("y", 0).attr("height", ih).style("fill", "transparent").style("cursor", "pointer")
      .on("pointermove", (e, d) => tipShow(e, (el) => {
        tipHead(el, `${d.y} · ${fmtN(d.n)} ${t("st_unions").toLowerCase()}`);
        for (const k of OUT_KEYS) tipRow(el, OUT_COL[k], fmtN(d[k]), t("st_" + k));
      }))
      .on("pointerleave", tipHide)
      .on("click", (e, d) => { stopPlay(); S.pos = Math.min(d.y, 2016 - S.win); syncPlayControls(); renderAtlas(); renderHist(); });
  }

  // playback
  let timer = null;
  const SPEEDS = { slow: 1500, std: 900, fast: 420 };
  function stopPlay() { S.playing = false; if (timer) clearInterval(timer); timer = null; syncPlayControls(); }
  function startPlay() {
    if (S.pos === null || S.pos > 2016 - S.win) S.pos = 1950;
    S.playing = true;
    syncPlayControls(); renderAtlas(); renderHist();
    timer = setInterval(() => {
      S.pos = S.pos + 1 > 2016 - S.win ? 1950 : S.pos + 1;
      syncPlayControls(); renderAtlas(); renderHist();
    }, SPEEDS[S.speed]);
  }
  function syncPlayControls() {
    const pb = $("#play");
    pb.replaceChildren();
    const icon = d3.create("svg").attr("viewBox", "0 0 12 12").attr("aria-hidden", "true");
    if (S.playing) { icon.append("rect").attr("x", 2).attr("y", 1.5).attr("width", 3).attr("height", 9).style("fill", "currentColor");
      icon.append("rect").attr("x", 7).attr("y", 1.5).attr("width", 3).attr("height", 9).style("fill", "currentColor"); }
    else icon.append("path").attr("d", "M3 1.5 L10.5 6 L3 10.5 Z").style("fill", "currentColor");
    pb.append(icon.node(), document.createTextNode(S.playing ? t("pause") : t("play")));
    $("#all-years").setAttribute("aria-pressed", S.pos === null ? "true" : "false");
    const slider = $("#win-pos");
    slider.max = String(2016 - S.win);
    slider.value = String(S.pos === null ? 1950 : S.pos);
    slider.setAttribute("aria-valuetext", S.pos === null ? t("all_years") : `${S.pos}–${Math.min(2015, S.pos + S.win - 1)}`);
    slider.style.opacity = S.pos === null ? 0.5 : 1;
  }
  function initPlayControls() {
    $("#play").addEventListener("click", () => (S.playing ? stopPlay() : startPlay()));
    $("#all-years").addEventListener("click", () => { stopPlay(); S.pos = null; syncPlayControls(); renderAtlas(); renderHist(); });
    $("#win-pos").addEventListener("input", (e) => { stopPlay(); S.pos = +e.target.value; syncPlayControls(); renderAtlas(); renderHist(); });
    $("#win-size").addEventListener("change", (e) => {
      S.win = +e.target.value;
      if (S.pos !== null) S.pos = Math.min(S.pos, 2016 - S.win);
      syncPlayControls(); renderAtlas(); renderHist();
    });
    $("#speed").addEventListener("change", (e) => { S.speed = e.target.value; if (S.playing) { stopPlay(); startPlay(); } });
    $("#zoom-in").addEventListener("click", () => MAP && MAP.svg.transition().duration(REDUCED ? 0 : 300).call(MAP.zoom.scaleBy, 1.6));
    $("#zoom-out").addEventListener("click", () => MAP && MAP.svg.transition().duration(REDUCED ? 0 : 300).call(MAP.zoom.scaleBy, 1 / 1.6));
    $("#zoom-reset").addEventListener("click", () => MAP && MAP.svg.transition().duration(REDUCED ? 0 : 300).call(MAP.zoom.transform, d3.zoomIdentity));
  }
  function renderPlaySelects() {
    const ws = $("#win-size");
    ws.replaceChildren(...[5, 10, 20].map((n) => { const o = h("option", { value: n, text: t("years_n", { n }) }); o.selected = S.win === n; return o; }));
    const sp = $("#speed");
    sp.replaceChildren(...[["slow", "slow"], ["std", "standard"], ["fast", "fast"]].map(([v, k]) => {
      const o = h("option", { value: v, text: t(k) }); o.selected = S.speed === v; return o;
    }));
  }

  // ───────────────────────────── couples ─────────────────────────────
  const coupleOf = (u) => (u.fem >= 0 ? [u.fi, u.mi] : [u.a, u.b]);
  const coupleCols = (u) => (u.fem >= 0 ? ["--her", "--him"] : ["--vis", "--aqua"]);
  const endYear = (u) => u.ey;
  const yearsText = (u) => (u.out === "tog" ? `${u.sy}–` : `${u.sy}–${endYear(u)}`);
  const relText = (u) => (u.rel === 0 ? t("rel_spouse_g") : t("rel_partner_g"));
  function renderCoupleList() {
    const q = norm(S.q.trim());
    const list = ORDER.filter((i) => pass(U[i]) && (!q || U[i].search.includes(q)));
    $("#c-count").textContent = t("c_count", { n: fmtN(list.length) });
    if (!list.includes(S.couple)) S.couple = list.length ? list[0] : null;
    renderCoupleDetail();
    const box = $("#c-list");
    const items = list.slice(0, S.limit).map((i) => {
      const u = U[i], [p, q2] = coupleOf(u), cols = coupleCols(u);
      return h("button", { class: "citem", type: "button", "aria-current": S.couple === i ? "true" : "false", "data-i": i,
        onclick: () => selectCouple(i) },
        h("span", { class: "names" }, h("span", { class: "dot", style: `background:var(${cols[0]})` }), pname(p),
          h("span", { style: "color:var(--muted)" }, " & "), h("span", { class: "dot", style: `background:var(${cols[1]})` }), pname(q2)),
        h("span", { class: "yrs", text: yearsText(u) }),
        h("span", { class: "meta", text: `${t("o_" + u.out)} · ${relText(u)}` }));
    });
    box.replaceChildren(...items);
    if (list.length > S.limit) box.append(h("button", { class: "more", type: "button", text: t("show_more", { n: fmtN(Math.min(60, list.length - S.limit)) }),
      onclick: () => { S.limit += 60; renderCoupleList(); } }));
    if (!list.length) box.append(h("div", { class: "empty", text: t("no_match") }));
  }
  function selectCouple(i) {
    const u = U[i];
    if (!u || !pass(u) || (S.q && !u.search.includes(norm(S.q.trim())))) return;
    S.couple = i;
    for (const el of document.querySelectorAll("#c-list .citem")) el.setAttribute("aria-current", +el.dataset.i === i ? "true" : "false");
    renderCoupleDetail();
  }
  function outcomePill(u) {
    return h("span", { class: "pill" }, h("span", { class: "ic", style: `background:var(${OUT_COL[u.out]})` }), t("o_" + u.out));
  }
  function renderCoupleDetail() {
    const box = $("#c-detail");
    const u = U[S.couple];
    box.replaceChildren();
    if (!u) { box.append(h("p",{class:"empty",text:t("no_match")})); return; }
    const [p, q] = coupleOf(u), cols = coupleCols(u);
    const durTxt = u.ev === 1 || u.out !== "tog" ? t("dur_fmt", { y: u.dur.toFixed(1) }) : t("dur_cens", { y: u.dur.toFixed(1) });
    box.append(
      h("div", { class: "detail-head" },
        h("h3", null, h("span", { class: "dot", style: `background:var(${cols[0]});width:10px;height:10px` }), pname(p), " & ",
          h("span", { class: "dot", style: `background:var(${cols[1]});width:10px;height:10px;margin-left:4px` }), pname(q)),
        outcomePill(u), h("span", { class: "pill", text: relText(u) })),
      h("div", { class: "facts" },
        fact(t("f_start"), String(u.sy)),
        fact(t("f_end"), u.out === "tog" ? "–" : String(endYear(u))),
        fact(t("f_dur"), durTxt),
        fact(t("f_joint"), t("joint_fmt", { s: fmtN(u.jsc || 0), u: fmtN(u.jun || 0) }))),
      h("div", { class: "chart", id: "c-chart" }),
      h("p", { class: "caption", text: t("fame_note") }));
    if (u.ds === 0) box.append(h("p", { class: "caption", text: t("same_sex") }));
    const people = h("div", { class: "people" });
    [p, q].forEach((pi, k) => {
      const pp = P[pi];
      const meta = [pp.b ? t("born", { y: pp.b }) : null, pp.d ? t("died", { y: pp.d }) : null,
        pp.b ? t("age_at", { a: u.sy - pp.b }) : null, pp.c.map(regionName).join(", ") || null].filter(Boolean).join(" · ");
      people.append(h("div", { class: "person" },
        h("div", { class: "pn" }, h("span", { class: "dot", style: `background:var(${cols[k]})` }), pname(pi),
          null),
        h("div", { class: "pm", text: meta }),
        h("div", { class: "links" },
          h("a", { href: `https://www.wikidata.org/wiki/${pp.q}`, target: "_blank", rel: "noopener", text: t("wikidata") }),
          pp.t ? h("a", { href: `https://www.themoviedb.org/person/${pp.t}`, target: "_blank", rel: "noopener", text: t("tmdb") }) : null),
        h("div", { class: "eyebrow", style: "margin-top:10px", text: t("other_unions") }),
        h("ul", null, ...pp.us.map((ui) => {
          const o = U[ui], other = o.a === pi ? o.b : o.a;
          const label = `${pname(other)}`;
          return h("li", null, ui === u.i || !pass(o) || (S.q && !o.search.includes(norm(S.q.trim()))) ? h("span", { class: ui === u.i ? "cur" : "", text: label }) : h("button", { type: "button", text: label, onclick: () => selectCouple(ui) }),
            h("span", { class: "y", text: `${yearsText(o)} · ${t("o_" + o.out)}` }));
        }))));
    });
    box.append(people);
    renderCoupleChart(u);
  }
  function fact(l, v) { return h("div", { class: "fact" }, h("div", { class: "l", text: l }), h("div", { class: "v", text: v })); }
  function renderCoupleChart(u) {
    const host = $("#c-chart");
    if (!host) return;
    const [p, q] = coupleOf(u), cols = coupleCols(u);
    const ppl = [p, q].map((pi, k) => ({ pi, c: cols[k], f: P[pi].f }));
    if (!ppl.some((d) => d.f)) { host.replaceChildren(h("div", { class: "empty", text: t("no_curve") })); return; }
    let y0 = Math.floor(u.start) - 6, y1 = Math.ceil(u.end) + 1;
    for (const d of ppl) if (d.f) { y0 = Math.min(y0, d.f[0]); y1 = Math.max(y1, d.f[0] + d.f[1].length); }
    y1 = Math.min(y1, 2027);
    const W = widthOf(host), H = Math.round(Math.min(320, Math.max(220, W * 0.42))), M = { t: 26, r: 14, b: 30, l: 40 };
    const iw = W - M.l - M.r, ih = H - M.t - M.b;
    const x = d3.scaleLinear([y0, y1], [0, iw]), y = d3.scaleLinear([0, 100], [ih, 0]);
    const svg = svgIn(host, W, H, `${pname(p)} & ${pname(q)}`);
    const g = svg.append("g").attr("transform", `translate(${M.l},${M.t})`);
    const x0 = x(u.start), x1 = x(Math.min(u.end, y1));
    g.append("rect").attr("x", x0).attr("width", Math.max(1, x1 - x0)).attr("y", 0).attr("height", ih).style("fill", "var(--gold-wash)");
    const yt = [0, 25, 50, 75, 100];
    g.append("g").selectAll("line").data(yt).join("line").attr("class", (d) => (d === 0 ? "axis-line" : "grid-line"))
      .attr("x1", 0).attr("x2", iw).attr("y1", (d) => y(d)).attr("y2", (d) => y(d));
    g.append("g").selectAll("text").data(yt).join("text").attr("class", "tick").attr("x", -6).attr("y", (d) => y(d)).attr("dy", "0.32em")
      .attr("text-anchor", "end").text((d) => d);
    g.append("text").attr("class", "axis-title").attr("x", -M.l + 2).attr("y", -12).text(t("fame_axis"));
    const span = y1 - y0, step = span > 60 ? 20 : span > 30 ? 10 : 5;
    g.append("g").selectAll("text").data(d3.range(Math.ceil(y0 / step) * step, y1 + 1, step)).join("text").attr("class", "tick")
      .attr("x", (d) => x(d)).attr("y", ih + 18).attr("text-anchor", "middle").text((d) => d);
    // union markers
    g.append("line").attr("x1", x0).attr("x2", x0).attr("y1", -4).attr("y2", ih).style("stroke", "var(--gold)").style("stroke-width", 1.5);
    g.append("text").attr("class", "mark-label").attr("x", x0 + 4).attr("y", -6).text(t("began_l", { y: u.sy }));
    if (u.out !== "tog") {
      const lbl = u.out === "brk" ? t("end_brk", { y: endYear(u) }) : u.out === "dth" ? t("end_dth", { y: endYear(u) }) : u.out === "unf" ? t("end_unf",{y:endYear(u)}) : t("end_unc");
      g.append("line").attr("x1", x1).attr("x2", x1).attr("y1", -4).attr("y2", ih).style("stroke", "var(--ink-2)")
        .style("stroke-width", 1.5);
      const right = x1 > iw - 90;
      g.append("text").attr("class", "mark-label").attr("x", right ? x1 - 4 : x1 + 4).attr("y", x1 - x0 < 110 && !right ? 10 : -6)
        .attr("text-anchor", right ? "end" : "start").text(lbl);
    }
    const line = d3.line().defined((d) => d[1] !== null).x((d) => x(d[0])).y((d) => y(d[1]));
    for (const d of ppl) {
      if (!d.f) continue;
      const data = d.f[1].map((v, k) => [d.f[0] + k + 1, v]);
      g.append("path").attr("d", line(data)).style("fill", "none").style("stroke", `var(${d.c})`).style("stroke-width", 2.25)
        .style("stroke-linejoin", "round").style("stroke-linecap", "round");
      const single = data.filter((pt, k) => pt[1] !== null && (k === 0 || data[k - 1][1] === null) && (k === data.length - 1 || data[k + 1][1] === null));
      g.append("g").selectAll("circle").data(single).join("circle").attr("cx", (pt) => x(pt[0])).attr("cy", (pt) => y(pt[1])).attr("r", 2.5)
        .style("fill", `var(${d.c})`);
    }
    const cross = g.append("line").attr("class", "cross").attr("y1", 0).attr("y2", ih).style("opacity", 0);
    const dots = g.append("g");
    g.append("rect").attr("width", iw).attr("height", ih).style("fill", "transparent").style("cursor", "crosshair")
      .on("pointermove", (e) => {
        const [mx] = d3.pointer(e);
        const yr = Math.max(y0, Math.min(y1 - 1, Math.round(x.invert(mx)) - 1));
        const cx = x(yr + 1);
        cross.attr("x1", cx).attr("x2", cx).style("opacity", 1);
        const vals = ppl.map((d) => ({ d, v: d.f && yr >= d.f[0] && yr < d.f[0] + d.f[1].length ? d.f[1][yr - d.f[0]] : null }));
        dots.selectAll("circle").data(vals.filter((o) => o.v !== null)).join("circle").attr("cx", cx).attr("cy", (o) => y(o.v)).attr("r", 4)
          .style("fill", (o) => `var(${o.d.c})`).style("stroke", "var(--surface)").style("stroke-width", 2);
        tipShow(e, (el) => {
          tipHead(el, `${yr} score (available from ${yr+1})`);
          for (const o of vals) tipRow(el, o.d.c, o.v === null ? "–" : o.v.toFixed(1), pname(o.d.pi));
        });
      })
      .on("pointerleave", () => { cross.style("opacity", 0); dots.selectAll("*").remove(); tipHide(); });
  }

  // ───────────────────────────── page ─────────────────────────────
  function renderStatic() {
    document.documentElement.lang = "en";
    for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
    for (const el of document.querySelectorAll("[data-i18n-ph]")) el.placeholder = t(el.dataset.i18nPh);
    document.title = t("title");
    $("#footer").replaceChildren(h("p", { text: t("footer_built") }));
  }
  function update() {
    renderFilters();
    renderRailStats();
    renderSurvival();
    renderGlance();
    renderAtlas();
    renderHist();
    S.limit = 60;
    renderCoupleList();
  }
  function renderAllText() {
    renderStatic();
    renderKey();
    renderSplitControl();
    renderPlaySelects();
    syncPlayControls();
    update();
    renderPaper();
    renderCoupleDetail();
  }
  // events
  $("#reset").addEventListener("click", () => { S.dec.clear(); S.rel = "all"; S.cty.clear(); S.ctyQ = ""; $("#f-cty-q").value = ""; update(); });
  $("#f-cty-q").addEventListener("input", (e) => { S.ctyQ = e.target.value; renderCountryList(); });
  $("#cq").addEventListener("input", (e) => { S.q = e.target.value; S.limit = 60; renderCoupleList(); });
  initPlayControls();

  let lastW = window.innerWidth, rt = null;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (Math.abs(window.innerWidth - lastW) < 2) return;
      lastW = window.innerWidth;
      renderSurvival(); renderPaper(); renderAtlas(); renderHist();
      if (S.couple !== null) renderCoupleChart(U[S.couple]);
    }, 150);
  });

  // default couple: Joanne Woodward & Paul Newman (50 years, ended by his death: shows why death is censoring)
  const byName = (n) => P.findIndex((p) => p.n === n);
  const jw = byName("Joanne Woodward"), pn = byName("Paul Newman");
  const def = U.find((u) => (u.a === jw && u.b === pn) || (u.a === pn && u.b === jw));
  S.couple = def ? def.i : ORDER[0];

  renderAllText();
  window.addEventListener("pagehide", stopPlay);
})();
