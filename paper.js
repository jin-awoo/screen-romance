/* Manuscript sections. All estimates come from the frozen revised-draft results. */
window.SR_PAPER = (() => {
  'use strict';
  const copy = {
  "en": {
    "p_shared": "1 · Shared exposure",
    "p_shared_lede": "Higher shared-title exposure is associated with dissolution in the two- and three-year Cox models; the one-year Cox result is not significant.",
    "p_shared_note": "Eligible couples share a credit in the k years before the start. Exposure sums release-decade z-scores of log(1 + title popularity) from start − k years to start + 6 months; HRs are per unit. Shared titles do not establish that partners met on set.",
    "p_shared_table": "Exposure and dissolution",
    "p_ols_note": "OLS includes dissolved unions, including zero durations. Cox/KM require positive follow-up. Median-split KM comparisons are unadjusted.",
    "p_gap": "2 · Starting fame gap",
    "p_gap_lede": "With the main fame score and total fame controlled, a 10-point shift toward male dominance is associated with 3.0–4.0% lower dissolution hazard. The categorical result depends on the fame measure.",
    "p_gap_note": "Fame sums log(1 + cached TMDB title popularity) before the union, ranked against cached actors’ decade totals. This reference score is not observed historical fame. Gap = male − female; total = their sum. Primary window: one year.",
    "p_gap_table": "Gap models",
    "p_gap_models": "Linear: gap + total fame. Asymmetric: adds max(0, −gap); no significant improvement at any window. Gap per 10 points; total per 100. n = 4,314; 2,425 events.",
    "p_strata": "By total fame",
    "p_strata_note": "Dominance: ≥20-point gap. Total fame is split at the main-sample median. KM curves are unadjusted. High-fame female-ahead vs similar: p = 0.108; this does not establish equivalence.",
    "p_era": "By era",
    "p_era_note": "Era interactions are not significant. The comparisons establish neither modern emergence nor a constant association over time.",
    "p_metric": "Fame measures",
    "p_metric_note": "Modern-era male-ahead vs similar-fame models, controlling total fame. Each metric uses a common cached actor–decade reference for both partners; the same-window score is a separate measure.",
    "p_dynamic": "3 · Fame rises",
    "p_dynamic_lede": "Female rises are associated with higher subsequent dissolution hazard in all five windows. Male rises are significant at 1 and 4 years; direct female–male contrasts at 1 and 5 years.",
    "p_dynamic_note": "Both partners’ ≥30-point rises enter together, lagged one complete interval and retained thereafter. n = 4,314; 71,235 intervals; 2,425 events. Standard errors are model-based, without actor clustering.",
    "p_dynamic_table": "Rolling rises",
    "p_joint_rise": "Joint rises and surges",
    "p_joint_rise_note": "Reference: neither rises; lagged total fame is controlled. Both-rises need not mean equal gains. Surge HRs are per 10 points, with first-year fame controls. These models do not isolate absolute ascent or a causal dose-response.",
    "p_landmark": "Shocks and trajectories",
    "p_landmark_note": "Shock: female-first vs male-first (>30 points in one year), excluding simultaneous first shocks; follow-up starts the next 1 January. Trajectory: start-year to year +2 change, per 10 points, controlling initial gap and total fame; follow-up starts 1 January of year +3.",
    "p_billing": "4 · Billing filter",
    "p_billing_note": "Billing order <5; samples, popularity sources and reference distributions differ. Shared exposure uses one year. Shock n: 1,490 / 1,520; trajectory n: 494 / 244 (all / filtered). The metric check above keeps a common title-detail source and reference.",
    "p_sensitivity": "5 · Fame level and shared credits",
    "p_level_note": "Role-weighted acting fame ranked among actors active in the same trailing three years, pooling genders; inactivity is separate. Scores lag one year; models adjust both ages and stratify by start decade. n = 4,200.",
    "p_level_caution": "Female rise is not significant after level and activity-transition adjustment. Current level may follow ascent, so this does not establish zero total association with growth. The level model’s female–male difference is supported by a cluster-bootstrap interval.",
    "p_credit_note": "Window: Y−3 through start year Y; exposure sums release-decade z-scores of log(1 + popularity). Controls: both partners’ fame, activity, ages and start decade. “Both acting” requires acting credits for both; other credits include self, host, narrator, archive and cameo appearances, not a clean non-scripted category. Titles do not imply shared episodes. n = 1,307.",
    "low_fame": "Low total fame",
    "high_fame": "High total fame",
    "dom_m": "Male ahead",
    "dom_f": "Female ahead",
    "dom_e": "Similar fame",
    "window_k": "{k} yr",
    "p_value": "p",
    "lr_p": "LR p",
    "wald_p": "Female–male p",
    "th_hr": "HR [95% CI]",
    "th_variable": "Variable",
    "linear_gap": "Linear gap /10 points",
    "linear_total": "Linear total /100 points",
    "asym_gap": "Asymmetric gap /10 points",
    "asym_extra": "Extra female-side slope",
    "asym_total": "Asymmetric total /100 points",
    "lower_exp": "Low exposure",
    "higher_exp": "High exposure",
    "logrank": "Log-rank p",
    "med_low": "Low median (yr)",
    "med_high": "High median (yr)",
    "ols": "OLS (dissolved)",
    "cox": "Cox HR [95% CI]",
    "only_f": "Only female rises",
    "only_m": "Only male rises",
    "both_rise": "Both rise",
    "surge_f": "Female surge /10 points",
    "surge_m": "Male surge /10 points",
    "first_control": " + first-year fame controls",
    "shock_all": "Female-first vs male-first",
    "shock_modern": "First shock, modern",
    "trajectory_f": "Female trajectory /10 points",
    "trajectory_m": "Male trajectory /10 points",
    "all_credits": "All credits",
    "filtered": "Top-five roles",
    "relationship_control": " + relationship type",
    "level_f": "Female level /10 points",
    "level_m": "Male level /10 points",
    "rise_f": "Female rise (3 yr)",
    "rise_m": "Male rise (3 yr)",
    "rise_f_full": "Female rise + entry/exit + level",
    "rise_m_full": "Male rise + entry/exit + level",
    "scripted": "Both acting",
    "unscripted": "Other shared credits",
    "total_exposure": "Joint exposure",
    "era_m": "Male ahead vs similar",
    "era_f": "Female ahead vs similar",
    "era_im": "Male ahead × modern",
    "era_if": "Female ahead × modern",
    "metric_pop": "Popularity",
    "metric_rev": "Revenue",
    "metric_votes": "Vote count",
    "metric_bill": "Top-five roles",
    "metric_revised": "Same-window score",
    "d_total": "Total unions",
    "d_events": "Dissolved",
    "d_censored": "Right-censored",
    "d_fm": "Female–male unions",
    "d_screen": "Shared-credit flag, three years",
    "d_duration": "Observed duration (years)",
    "d_age1": "Partner 1 age at start",
    "d_age2": "Partner 2 age at start",
    "mean": "Mean",
    "sd": "SD",
    "median": "Median",
    "paper_figure_note": "Shading: 95% CI. Deaths are censored; KM survival is not the observed fraction alive and together."
  }
};

  function render(c) {
    const {D, LANG, t, h, $, d3, svgIn, widthOf, kmAt, atRisk, tipShow, tipHead, tipRow, tipNote, tipHide, hrRows} = c;
    const p = D.paper;
    const f = (v, n = 3) => v == null ? '—' : Number(v).toFixed(n);
    const pv = v => v == null ? '—' : v < .001 ? '<0.001' : f(v, v >= .045 && v <= .055 ? 4 : 3);
    const ci = (d, digits = 3) => `${f(d.HR ?? d.hr ?? d.estimate, digits)}${d.lo == null ? ' [—]' : ` [${f(d.lo)}, ${f(d.hi)}]`}`;
    const entry = (rows, section, term, note) => {
      const a = rows.filter(r => r.section === section && r.term === term && (!note || r.note === note));
      if (a.length !== 1) throw Error(`Missing/ambiguous manuscript result: ${section}/${term}`);
      return a[0];
    };
    const q = (rows, sec, term) => {
      const r = entry(rows, sec, term);
      const m = /95% CI ([\d.]+)-([\d.]+)/.exec(r.note || '');
      return {...r, HR:r.estimate, p:r.p_value, lo:m ? +m[1] : null, hi:m ? +m[2] : null};
    };
    const table = (id, heads, rows) => {
      const el = $(id); el.replaceChildren(
        h('thead', null, h('tr', null, ...heads.map(x => h('th', {scope:'col', text:x})))),
        h('tbody', null, ...rows.map(row => h('tr', null, ...row.map((x, i) => h(i === 0 ? 'th' : 'td', i === 0 ? {scope:'row',text:String(x)} : {text:String(x)}))))));
    };
    const resultRows = rows => rows.map(([label, d, n]) => [label, ci(d), pv(d.p), n ?? '—']);
    const resultTable = (id, rows) => table(id, [t('th_variable'),t('th_hr'),t('p_value'),'n'], resultRows(rows));
    function panels(id, specs) {
      const host = $(id); host.replaceChildren();
      for (const spec of specs) {
        const card = h('div', {class:'paper-plot'});
        card.append(h('h3',{text:spec.label}), h('p',{class:'caption',text:`n = ${spec.curves.reduce((s,g)=>s+g.n,0).toLocaleString()} · ${t('logrank')} ${pv(spec.p)}`}));
        const chart = h('div', {class:'chart'}); card.append(chart); host.append(card);
        const W = widthOf(chart, 250), H = 235, M = {t:20,r:12,b:38,l:42}, iw=W-M.l-M.r, ih=H-M.t-M.b;
        const xmax=spec.xmax || 70, x=d3.scaleLinear([0,xmax],[0,iw]), y=d3.scaleLinear([0,1],[ih,0]);
        const svg=svgIn(chart,W,H,spec.label), g=svg.append('g').attr('transform',`translate(${M.l},${M.t})`);
        for (const v of [0,.25,.5,.75,1]) {
          g.append('line').attr('class','grid-line').attr('x2',iw).attr('y1',y(v)).attr('y2',y(v));
          g.append('text').attr('class','tick').attr('x',-7).attr('y',y(v)).attr('dy','.32em').attr('text-anchor','end').text(`${Math.round(v*100)}%`);
        }
        for (const v of d3.ticks(0,xmax,5)) g.append('text').attr('class','tick').attr('x',x(v)).attr('y',ih+18).attr('text-anchor','middle').text(v);
        g.append('text').attr('class','axis-title').attr('x',iw).attr('y',ih+34).attr('text-anchor','end').text(t('km_x'));
        const colors=spec.curves.length===2?['--ref','--vis']:['--him','--her','--ref'];
        spec.curves.forEach((a,i)=>{
          const points=a.T.map((tt,j)=>[tt,a.S[j],a.LO[j],a.HI[j]]).filter(v=>v[0]<=xmax);
          if (a.maxT>xmax) { const j=points.length-1;points.push([xmax,points[j][1],points[j][2],points[j][3]]); }
          g.append('path').attr('d',d3.area().curve(d3.curveStepAfter).x(d=>x(d[0])).y0(d=>y(d[2])).y1(d=>y(d[3]))(points)).style('fill',`var(${colors[i]})`).style('opacity',.08);
          g.append('path').attr('d',d3.line().curve(d3.curveStepAfter).x(d=>x(d[0])).y(d=>y(d[1]))(points)).style('fill','none').style('stroke',`var(${colors[i]})`).style('stroke-width',2).style('stroke-dasharray',i===1?'6 3':i===2?'2 3':null);
        });
        const cross=g.append('line').attr('class','cross').attr('y2',ih).style('opacity',0);
        g.append('rect').attr('width',iw).attr('height',ih).style('fill','transparent').on('pointermove',e=>{
          const tt=Math.max(0,Math.min(xmax,Math.round(x.invert(d3.pointer(e)[0]))));cross.attr('x1',x(tt)).attr('x2',x(tt)).style('opacity',1);
          tipShow(e,el=>{tipHead(el,t('at_year',{t:tt}));spec.curves.forEach((a,i)=>{const s=kmAt(a,tt);tipRow(el,colors[i],s==null?'—':`${(s*100).toFixed(1)}%`,t(spec.names[i]));tipNote(el,`n ${atRisk(a,tt)}`);});});
        }).on('pointerleave',()=>{cross.style('opacity',0);tipHide();});
        const legend=h('div',{class:'legend-inline'});spec.curves.forEach((a,i)=>legend.append(h('span',{title:`${t('median')}: ${f(a.med,1)}`},h('span',{class:'lmark',style:`background:var(${colors[i]})`}),`${t(spec.names[i])} · n=${a.n}`)));card.append(legend);
      }
    }
    panels('#paper-shared-curves',[1,2,3].map(k=>({label:t('window_k',{k}),curves:p.curves.shared[k],p:p.shared[k].logrank_p,names:['lower_exp','higher_exp']})));
    const shr=[];
    for (const k of [1,2,3]) {
      const a=p.shared[k];
      shr.push([t('window_k',{k}),a.n,ci(a.cox,k===1?4:3),pv(a.cox.p),f(a['Lower exposure'],1),f(a['Higher exposure'],1),pv(a.logrank_p)]);
    }
    table('#paper-shared-table',[t('th_spec'),'n',t('cox'),t('p_value'),t('med_low'),t('med_high'),t('logrank')],shr);
    table('#paper-ols-table',[t('th_spec'),t('ols'),t('p_value'),'n'],[1,2,3].map(k=>{const r=p.q1_v2.find(x=>x.section==='Q1c'&&x.term===`std_exposure_${k}y`&&x.estimate_type.startsWith('OLS'));return [t('window_k',{k}),f(r.estimate),pv(r.p_value),r.n];}));
    const gap=[];
    for(const k of [1,2,3]) {
      const a=p.gap_models[k];
      for(const [label,d] of [['linear_gap',a.linear.g],['linear_total',a.linear.c],['asym_gap',a.asymmetric.g],['asym_extra',a.asymmetric.female_extra],['asym_total',a.asymmetric.c]]) gap.push([t('window_k',{k}),t(label),ci(d),pv(d.p),label==='asym_extra'?pv(a.lr_p):'—']);
    }
    table('#paper-gap-table',[t('th_spec'),t('th_variable'),t('th_hr'),t('p_value'),t('lr_p')],gap);
    const names=['dom_m','dom_f','dom_e'];
    panels('#paper-strata-curves',['Low','High'].map(k=>({label:t(k==='Low'?'low_fame':'high_fame'),curves:p.curves.strata[k],p:p.strata[k].p,names})));
    panels('#paper-era-curves',['Early','Modern'].map(k=>({label:t(k==='Early'?'era_early':'era_late'),curves:p.curves.era[k],p:p.era[k].high_p,names,xmax:k==='Modern'?35:70})));
    const era=[];
    for(const [term,label] of [['male_dom','era_m'],['female_dom','era_f']]) {
      const r=p.static_full_precision.categorical[term];
      era.push([`${'All eras'} · ${t(label)}`,r,p.static_full_precision.n]);
    }
    for(const k of ['Early','Modern']) for(const [term,label] of [['male_dom','era_m'],['female_dom','era_f']]) era.push([`${t(k==='Early'?'era_early':'era_late')} · ${t(label)}`,p.era[k].categorical[term],p.era[k].n]);
    for(const [term,label] of [['mdom_x_modern','era_im'],['fdom_x_modern','era_if']]) {const r=p.static_full_precision.interaction[term];era.push([t(label),r,p.static_full_precision.n]);}
    resultTable('#paper-era-table',era);
    const metric=[];
    for(const [section,label] of [['Q2 robustness — popularity (base)','metric_pop'],['Q2 robustness — revenue','metric_rev'],['Q2 robustness — votes','metric_votes'],['Q2 robustness — order<5 filtered','metric_bill']]){const r=q(p.q2_v2,section,'male_dom (modern, +fame ctrl)');metric.push([t(label),r,r.n]);}
    const revised=q(p.q7,'B dominance categories (ref = within 20 points), begun 1990s-2015','male_dom');
    metric.push([t('metric_revised'),revised,revised.n]);
    resultTable('#paper-metric-table',metric);
    const dyn=[];
    for (const k of [1,2,3,4,5]) {const a=p.dynamics.sweep[k];dyn.push([t('window_k',{k}),ci(a.terms[`fris${k}`]),pv(a.terms[`fris${k}`].p),ci(a.terms[`mris${k}`]),pv(a.terms[`mris${k}`].p),pv(a.contrast.p)]);}
    table('#paper-dynamic-table',[t('th_spec'),t('th_her'),t('p_value'),t('th_his'),t('p_value'),t('wald_p')],dyn);
    const marks=[];
    for(const k of [1,2,3,4,5]) for(const [sex,label,color] of [['f','her_short','--her'],['m','his_short','--him']]) {const d=p.dynamics.sweep[k].terms[`${sex}ris${k}`];marks.push({label:`${t('window_k',{k})} · ${t(label)}`,marks:[{d:{...d,hr:d.HR},c:color,ci:true}]});}
    const ext=marks.flatMap(r=>r.marks.flatMap(m=>[m.d.lo,m.d.hi]));
    hrRows($('#paper-dynamic-chart'),marks,[Math.min(.98,...ext)*.98,Math.max(...ext)*1.02],t('hr_log'));
    const four=[],dose=[];
    for(const k of [1,2,3]) {
      for(const term of ['only_f','only_m','both']) {four.push([`${t('window_k',{k})} · ${t(term==='both'?'both_rise':term)}`,p.dynamics.four_cell[k][term],p.dynamics.n]);}
      for(const mode of ['unadjusted','baseline_adjusted']) for(const sex of ['f','m']) dose.push([`${t('window_k',{k})} · ${t(`surge_${sex}`)}${mode==='baseline_adjusted'?t('first_control'):''}`,p.dynamics.dose[k][mode][`${sex}surge${k}`],p.dynamics.n]);
    }
    resultTable('#paper-four-table',four);resultTable('#paper-dose-table',dose);
    const land=p.landmarks.all;
    resultTable('#paper-landmark-table',[[t('shock_all'),land.shock.terms.female,land.shock.n],[t('shock_modern'),land.shock_modern.terms.female,land.shock_modern.n],[t('trajectory_f'),land.trajectory.terms.ftraj,land.trajectory.n],[t('trajectory_m'),land.trajectory.terms.mtraj,land.trajectory.n]]);
    const billing=[];
    // Static checks use q5; its old shock/trajectory rows are explicitly superseded.
    for(const [i,label] of [[0,'total_exposure'],[1,'linear_gap'],[2,'linear_total']]) {const r=p.q5_v2[i];billing.push([t(label),f(r['Orig HR']),pv(r['Orig p']),f(r['Filt HR']),pv(r['Filt p'])]);}
    for(const [key,term,label] of [['shock','female','shock_all'],['trajectory','ftraj','trajectory_f'],['trajectory','mtraj','trajectory_m']]) {const a=land[key].terms[term], b=p.landmarks.filtered[key].terms[term];billing.push([t(label),f(a.HR),pv(a.p),f(b.HR),pv(b.p)]);}
    table('#paper-billing-table',[t('th_variable'),t('all_credits'),t('p_value'),t('filtered'),t('p_value')],billing);
    const sensitivity=[];
    for(const [section,suffix] of [['C level',''],['C level + relationship type',t('relationship_control')]]) for(const [term,label] of [['f_level10','level_f'],['m_level10','level_m']]){const r=q(p.q6,section,term);sensitivity.push([t(label)+suffix,r,r.n]);}
    for(const [section,terms] of [['D k=3 rise+fall',[['f_rise_3y_ever','rise_f'],['m_rise_3y_ever','rise_m']]],['D k=3 rise+fall+entry+exit+level',[['f_rise_3y_ever','rise_f_full'],['m_rise_3y_ever','rise_m_full'],['f_level10','level_f'],['m_level10','level_m']]]]) for(const [term,label] of terms){const r=q(p.q6,section,term);const suffix=section.endsWith('+level')&&term.endsWith('level10')?(' (joint rise model)'):'';sensitivity.push([t(label)+suffix,r,r.n]);}
    resultTable('#paper-level-table',sensitivity);
    const credit=[];
    for(const [section,suffix] of [['C + all',''],['C + all + relationship type',t('relationship_control')]]) {const r=q(p.q8,section,'joint_exposure_3y');credit.push([t('total_exposure')+suffix,r,r.n]);}
    for(const [section,suffix] of [['D exposure split + all',''],['D exposure split + all + relationship type',t('relationship_control')]]) for(const [term,label] of [['joint_exposure_scripted_3y','scripted'],['joint_exposure_unscripted_3y','unscripted']]){const r=q(p.q8,section,term);credit.push([t(label)+suffix,r,r.n]);}
    resultTable('#paper-credit-table',credit);

  }
  return {copy,render};
})();
