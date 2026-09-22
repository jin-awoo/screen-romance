/* Screen Romance: interactive companion to "The gendered fragility of celebrity relationships".
   Data: window.SR_DATA from data.js (built by build_site_data.py). Charts: d3 v7. No model is fitted here:
   Kaplan-Meier curves are recomputed for the filtered sample, hazard ratios are read from analysis/results. */
(() => {
  "use strict";
  const D = window.SR_DATA;
  if (!D || !window.d3) {
    document.body.prepend(Object.assign(document.createElement("p"), {
      textContent: "The data file (data.js) or the chart library did not load. Rebuild with web/build_site_data.py and reload.",
      style: "padding:16px;color:#b00",
    }));
    return;
  }

  // ───────────────────────────── i18n ─────────────────────────────
  const T = {
    en: {
      billing: "CS2Nordics 2026 · Computational social science · Wikidata × TMDB",
      title: "Screen Romance",
      subtitle: "The gendered fragility of celebrity relationships",
      authors: "Jin Han · Petter Holme — Aalto University · Kobe University",
      key_claim: '<span class="her">Her</span> fame is linked to breakup. <span class="him">His</span> is not.',
      key_her_l: "her fame · HR {hr} [{lo}, {hi}]",
      key_him_l: "his fame · HR {hr} [{lo}, {hi}], n.s.",
      key_note: "Change in breakup hazard per +10 percentile points of current fame. Cox model with both partners, fame lagged one year, adjusted for both ages and start decade; 5,000 different-sex unions, 1950–2015.",
      filters: "Filters", reset: "Reset",
      f_era: "Start decade", f_rel: "Relationship", f_cty: "Citizenship of either partner", f_cty_ph: "Search countries",
      rel_all: "All", rel_spouse: "Married", rel_partner: "Unmarried",
      sample: "Selected unions",
      st_unions: "Unions", st_people: "People",
      st_brk: "Broke up", st_dth: "Ended by a partner's death", st_unc: "Partner died, end uncertain", st_tog: "Together at the end of the data",
      rail_note: "Filters apply to every chart on the page except the fitted models.",
      s1_eyebrow: "How long they last",
      s1_title: "Share of couples still together, by years since the union began",
      s1_lede: "Kaplan–Meier curves for the unions you selected. A partner's death ends the observation instead of counting as a breakup. Hover over the chart to read any year.",
      split_by: "Compare by",
      sp_her: "Her fame", sp_his: "His fame", sp_joint: "Joint exposure", sp_kind: "Shared titles", sp_rel: "Relationship", sp_era: "Era",
      g_high_her: "She is in the more famous half", g_high_his: "He is in the more famous half",
      g_low: "Less famous half", g_none: "No acting work in the 3 years before",
      j_high: "Higher joint exposure", j_low: "Lower joint exposure", j_none: "No shared title",
      k_unscripted: "Only seen together (as themselves)", k_scripted: "Acted together", k_none: "No shared title",
      rel_spouse_g: "Married", rel_partner_g: "Unmarried partners",
      era_early: "Began 1950–1989", era_late: "Began 1990–2015",
      cap_her: "Her fame in the 3 years before the union, as a percentile among actresses with acting work, split at the median ({m}th percentile). Different-sex unions with a dated outcome.",
      cap_his: "His fame in the 3 years before the union, as a percentile among actors with acting work, split at the median ({m}th percentile). Different-sex unions with a dated outcome.",
      cap_joint: "Summed popularity of every title both partners appeared in during the 3 years up to the union, split at the median among couples who share one. Talk shows and appearances as themselves count.",
      cap_kind: "Titles both partners appeared in during the 3 years up to the union. “Acted together” = at least one scripted film or series; “only seen together” = talk shows, award shows or appearances as themselves only.",
      cap_rel: "Marriages vs. unmarried partnerships as recorded in Wikidata. A partnership that became a marriage is followed as one union.",
      cap_era: "By the year the union began.",
      th_group: "Group", th_n: "Unions", th_med: "Median, years", th_s10: "Together at 10 y", th_s20: "at 20 y",
      km_x: "Years since the union began", km_y: "Still together",
      not_reached: "not reached", at_year: "Year {t}", at_risk: "{n} still followed",
      g_median_l: "median years together (Kaplan–Meier), selected different-sex unions",
      years_unit: "years", outcome_title: "How the {n} selected unions ended",
      costar_l: "co-starred in a title released in the 3 years before the start year",
      cross_l: "partners share no citizenship",
      dose_title: "Breakup within 10 years, by fame before the union",
      dose_note: "Kaplan–Meier estimate with 95% confidence interval. Quarters are among partners with acting work in the 3 years before the union; groups under 30 unions are not drawn.",
      dx0: "No work", dx1: "Bottom quarter", dx2: "Second", dx3: "Third", dx4: "Top quarter",
      her_l: "Her fame", his_l: "His fame", dose_y: "Broke up within 10 years", too_few: "too few unions",
      s2_eyebrow: "What the models say",
      s2_title: "Her fame raises the breakup hazard in every specification; his stays near 1",
      s2_lede: "Hazard ratios from the Cox models in the analysis scripts (q6, q7, q8). They are fixed full-sample results and do not change with the filters. A ratio of 1.08 means an 8% higher breakup hazard per +10 percentile points.",
      fm_level: "During the union", fm_pre: "Before the union",
      forest_x: "Hazard ratio per +10 percentile points (log scale)", hr_log: "Hazard ratio (log scale)",
      cap_level: "Current fame = percentile among actors with acting work in the last 3 years, updated every year and lagged one year; not working is a separate term. Her vs. his coefficient: p {p}.",
      cap_pre: "Fame in the window before the union began, both partners in one model with both ages and start decade.",
      row_main: "Main model", row_reltype: "+ relationship type", row_bootstrap: "Cluster bootstrap interval", row_ipw: "Weighted for TMDB matching",
      row_spouses: "Spouses only", row_partners: "Unmarried partners only", row_early: "Began 1950s–80s", row_late: "Began 1990s–2015",
      row_both_items: "Recorded on both partners' pages", row_no_presenter: "No presenter-only partner", row_start_ok: "Start year undisputed",
      row_snapshot: "Single TMDB snapshot", row_us: "At least one US citizen", row_non_us: "No US citizen",
      row_pct3: "Fame in the 3 years before", row_pct1: "Fame in the year before", row_lead: "Lead film roles only (no popularity)", row_allcred: "Every credit, talk shows included",
      as_table: "Show as a table", th_spec: "Specification", th_her: "Her HR [95% CI]", th_his: "His HR [95% CI]",
      no_diff: "no difference", her_short: "Her", his_short: "His",
      rise_title: "A rise adds nothing once her level is known",
      rise_note: "Hazard ratio of a rise of at least 30 points within 1, 3 or 5 years. Hollow: the rise alone. Filled: with current fame level, falls, entries and exits in the same model.",
      rise_alone: "Rise alone", rise_with: "With current level", rise_row: "{who} · {k}-year rise",
      spot_title: "Seen together, not working together",
      spot_note: "Titles both partners appeared in during the 3 years up to the union. Cox models with both partners' fame, ages and decade strata (q8).",
      sp_unscr_exp: "Seen together, per unit of exposure", sp_scr_exp: "Acted together, per unit of exposure",
      sp_unscr_only: "Only seen together vs. no shared title", sp_scr_any: "Acted together vs. no shared title",
      s3_eyebrow: "Who pairs with whom",
      s3_title: "Where the partners come from",
      s3_lede: "Each circle is a country of citizenship, sized by the number of unions involving it; arcs join the countries of partners who share no citizenship. Press play to step through the years, or click a country to filter the whole page.",
      play: "Play", pause: "Pause", all_years: "All years", window_start: "Window start", window: "Window", years_n: "{n} years",
      speed: "Speed", slow: "Slow", standard: "Standard", fast: "Fast", reset_map: "Reset",
      map_sub: "{n} unions · {c} cross-border", map_node: "Unions involving the country", map_arc: "Couples across borders",
      hist_title: "Unions by start year and outcome",
      atlas_caption: "Citizenship from Wikidata. A couple counts as cross-border only if the partners share no citizenship; historical states (e.g. the Soviet Union, West Germany) are drawn at their main successor. Click a bar to move the window.",
      top_countries: "Countries", top_pairs: "Cross-border pairs",
tip_click_on: "Click to filter the page by this country", tip_click_off: "Click to remove this filter",
      s4_eyebrow: "Couples",
      s4_title: "Two careers, one relationship",
      s4_lede: "Pick a couple to see both partners' fame, year by year, around their union. The list puts couples whose partners are both well known today first (TMDB popularity); search by name in English or Chinese.",
      find_couple: "Search a name", find_couple_ph: "Search a name, e.g. Newman or 泰勒",
      c_count: "{n} couples", show_more: "Show {n} more", no_match: "No couple matches the name and filters.",
      o_brk: "Broke up", o_dth: "Ended by a partner's death", o_unc: "Partner died, end uncertain", o_tog: "Together at data end",
      f_type: "Relationship", f_start: "Began", f_end: "Ended", f_dur: "Length", f_joint: "Shared titles, 3 years up to the start",
      yes: "Yes", no: "No", joint_fmt: "{s} acted · {u} as themselves",
      dur_fmt: "{y} years", dur_cens: "{y}+ years",
      fame_note: "Fame = percentile among actors with acting work in the previous 3 years (0 = no acting credits in that window). Shaded: the union.",
      age_at: "{a} at the start", born: "born {y}", died: "died {y}",
      other_unions: "Recorded relationships", no_curve: "No TMDB career data for either partner.",
      began_l: "Began {y}", end_brk: "Broke up {y}", end_dth: "Death {y}", end_unc: "Partner died",
      same_sex: "Same-sex union: shown here and on the map, not part of the her/his comparisons.",
      fame_axis: "Fame percentile", wikidata: "Wikidata", tmdb: "TMDB",
      s5_eyebrow: "About the data", s5_title: "Questions and answers",
      faq: [
        ["What is in the data?",
          "<p>5,389 marriages and unmarried partnerships between two actors that began between 1950 and 2015, taken from Wikidata's spouse and unmarried-partner statements, with both partners' death dates and recorded end causes. Careers come from TMDB: about 9,800 actors and 516,000 credits, linked through Wikidata and IMDb identifiers; 99.5% of identities are verified across sources.</p>"],
        ["How is fame measured?",
          "<p>Every acting credit counts, weighted by the title's popularity rank within its medium and decade and by role size (billing order in films, number of episodes in series). Talk shows, news and appearances as oneself are left out of fame (they are counted separately as joint exposure).</p><p>A person's fame in a year is their percentile among all actors with acting work in the same 3-year window. People without acting work in the window get 0 and a separate “not working” flag, so the models never confuse a break in credits with low fame.</p>"],
        ["Why is a partner's death not a breakup?",
          "<p>About one in five recorded endings is a partner's death. Counting those as breakups would make long, stable marriages look fragile, so a death simply ends the observation (right-censoring). Unions that are still intact are censored at the end of the data.</p>"],
        ["What do the curves show, and what do the models show?",
          "<p>The curves are Kaplan–Meier estimates: the share of unions still together a given number of years after they began, recomputed live for the filters you choose. They describe; they adjust for nothing.</p><p>The hazard ratios come from Cox models with both partners' fame in one model, adjusted for both ages and the start decade, with fame lagged one year. They are fixed full-sample results from the analysis scripts and do not change with the filters.</p>"],
        ["Does her fame cause breakups?",
          "<p>We cannot say. The data show an association: we do not observe who left or why. Fame builds on today's TMDB popularity; a measure without popularity (counting lead film roles) shows the same pattern. The association weakens after the tenth year of a union. The sample is notable actors only, with no non-celebrity comparison group.</p>"],
        ["Where do names and countries come from?",
          "<p>Names, citizenships and relationship dates are Wikidata's; Chinese names are Wikidata's Chinese labels where one exists. Errors in Wikidata carry over, and a recorded end date can be missing: about a quarter of unions coded “partner died, end uncertain” were probably unrecorded divorces, so those unions are left out of the survival analysis. Corrections are best made on Wikidata itself.</p>"],
        ["Who made this, and how should it be cited?",
          "<p>Jin Han (Aalto University) and Petter Holme (Aalto University; Kobe University). Contact: <a href=\"mailto:jin.1.han@aalto.fi\">jin.1.han@aalto.fi</a>. Please cite: Han, J. and Holme, P., <i>The gendered fragility of celebrity relationships</i>, working paper, 2026.</p><p>Data: Wikidata (CC0) and the TMDB API. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>"],
      ],
      footer_refs: "Related work: Stuart, Moon & Casciaro (2011) SSRN 1749612 · Jensen & Kim (2015) Organ. Sci. 26(1) · Folke & Rickne (2020) Am. Econ. J. Appl. Econ. 12(1) · Schwartz & Gonalons-Pons (2016) RSF 2(4).",
      footer_built: "Data built {d} from datasets/v2 and features/features02. This product uses the TMDB API but is not endorsed or certified by TMDB.",
      dec_label: "{d}s", dec_last: "2010–15",
    },
    zh: {
      billing: "CS2Nordics 2026 · 计算社会科学 · Wikidata × TMDB",
      title: "银幕情缘",
      subtitle: "名人关系的性别化脆弱性",
      authors: "Jin Han · Petter Holme — 阿尔托大学 · 神户大学",
      key_claim: '<span class="her">她</span>的名气与分手相关，<span class="him">他</span>的不相关。',
      key_her_l: "她的名气 · 风险比 {hr} [{lo}, {hi}]",
      key_him_l: "他的名气 · 风险比 {hr} [{lo}, {hi}]，不显著",
      key_note: "当前名气每高 10 个百分位，分手风险的变化。Cox 模型同时纳入双方名气（滞后一年），并控制双方年龄与开始年代；5,000 段异性关系，1950–2015 年。",
      filters: "筛选", reset: "重置",
      f_era: "开始年代", f_rel: "关系类型", f_cty: "任一方的国籍", f_cty_ph: "搜索国家",
      rel_all: "全部", rel_spouse: "婚姻", rel_partner: "未婚伴侣",
      sample: "当前样本",
      st_unions: "段关系", st_people: "人",
      st_brk: "分手或离婚", st_dth: "因一方去世而结束", st_unc: "一方去世，结束时间不确定", st_tog: "数据截止时仍在一起",
      rail_note: "筛选作用于本页除模型估计以外的所有图表。",
      s1_eyebrow: "关系能维持多久",
      s1_title: "关系开始后，仍在一起的伴侣比例",
      s1_lede: "按当前筛选计算的 Kaplan–Meier 生存曲线。一方去世视为观察结束（删失），不算作分手。将鼠标移到图上可读取任意年份。",
      split_by: "比较维度",
      sp_her: "她的名气", sp_his: "他的名气", sp_joint: "共同曝光", sp_kind: "共同作品", sp_rel: "关系类型", sp_era: "年代",
      g_high_her: "她属于较有名的一半", g_high_his: "他属于较有名的一半",
      g_low: "较不有名的一半", g_none: "此前 3 年没有表演作品",
      j_high: "共同曝光较高", j_low: "共同曝光较低", j_none: "没有共同作品",
      k_unscripted: "只同框（以本人身份出镜）", k_scripted: "合作演出过", k_none: "没有共同作品",
      rel_spouse_g: "婚姻", rel_partner_g: "未婚伴侣",
      era_early: "始于 1950–1989 年", era_late: "始于 1990–2015 年",
      cap_her: "她在关系开始前 3 年的名气：在有表演作品的女演员中的百分位，以中位数（第 {m} 百分位）分成两半。样本为结局日期明确的异性关系。",
      cap_his: "他在关系开始前 3 年的名气：在有表演作品的男演员中的百分位，以中位数（第 {m} 百分位）分成两半。样本为结局日期明确的异性关系。",
      cap_joint: "关系开始前 3 年内双方共同出现的所有作品的热度之和，在有共同作品的伴侣中以中位数分组。脱口秀和以本人身份出镜也计入。",
      cap_kind: "关系开始前 3 年内双方共同出现的作品。“合作演出过”= 至少一部有剧本的电影或剧集；“只同框”= 仅有脱口秀、颁奖礼或以本人身份出镜。",
      cap_rel: "Wikidata 记录的婚姻与未婚伴侣关系。先同居后结婚的伴侣按一段关系追踪。",
      cap_era: "按关系开始的年份。",
      th_group: "组别", th_n: "关系数", th_med: "中位年数", th_s10: "10 年仍在一起", th_s20: "20 年",
      km_x: "关系开始后的年数", km_y: "仍在一起",
      not_reached: "未到达", at_year: "第 {t} 年", at_risk: "仍在观察 {n} 段",
      g_median_l: "当前所选异性关系维持的中位年数（Kaplan–Meier）",
      years_unit: "年", outcome_title: "所选 {n} 段关系的结局",
      costar_l: "开始年份之前 3 年内曾合作演出",
      cross_l: "双方没有共同国籍",
      dose_title: "按关系前名气分组：10 年内分手的比例",
      dose_note: "Kaplan–Meier 估计及 95% 置信区间。四分位在关系前 3 年有表演作品的人中划分；不足 30 段关系的组不画出。",
      dx0: "无作品", dx1: "最低四分之一", dx2: "第二", dx3: "第三", dx4: "最高四分之一",
      her_l: "她的名气", his_l: "他的名气", dose_y: "10 年内分手", too_few: "样本过少",
      s2_eyebrow: "模型结果",
      s2_title: "在每一种模型设定下，她的名气都提高分手风险；他的名气始终接近 1",
      s2_lede: "风险比来自分析脚本（q6、q7、q8）中的 Cox 模型，是基于全样本的固定结果，不随筛选变化。风险比 1.08 表示名气每高 10 个百分位，分手风险高 8%。",
      fm_level: "关系存续期间", fm_pre: "关系开始之前",
      forest_x: "每 +10 个百分位的风险比（对数刻度）", hr_log: "风险比（对数刻度）",
      cap_level: "当前名气 = 在最近 3 年有表演作品的演员中的百分位，逐年更新并滞后一年；是否在工作另设变量。她与他系数之差：p {p}。",
      cap_pre: "关系开始前窗口内的名气；双方名气同在一个模型中，并控制双方年龄与开始年代。",
      row_main: "主模型", row_reltype: "+ 关系类型", row_bootstrap: "聚类自助法区间", row_ipw: "按 TMDB 匹配加权",
      row_spouses: "仅婚姻", row_partners: "仅未婚伴侣", row_early: "始于 1950–80 年代", row_late: "始于 1990–2015 年",
      row_both_items: "双方条目都有记录", row_no_presenter: "排除仅为主持人的一方", row_start_ok: "开始年份无争议",
      row_snapshot: "单一 TMDB 快照", row_us: "至少一方为美国公民", row_non_us: "双方都不是美国公民",
      row_pct3: "关系前 3 年的名气", row_pct1: "关系前 1 年的名气", row_lead: "只计主演电影（不含热度）", row_allcred: "计入全部作品（含脱口秀）",
      as_table: "以表格显示", th_spec: "模型设定", th_her: "她 风险比 [95% CI]", th_his: "他 风险比 [95% CI]",
      no_diff: "无差异", her_short: "她", his_short: "他",
      rise_title: "知道她的名气水平后，名气“上升”本身不再有影响",
      rise_note: "1、3 或 5 年内名气上升至少 30 个百分位的风险比。空心：只放入上升；实心：同时放入当前名气水平、下降、入行和退出。",
      rise_alone: "只放入上升", rise_with: "加入当前水平", rise_row: "{who} · {k} 年上升",
      spot_title: "与同框曝光有关，与合作演出无关",
      spot_note: "关系开始前 3 年内双方共同出现的作品。Cox 模型控制双方名气、年龄，并按年代分层（q8）。",
      sp_unscr_exp: "同框曝光，每单位", sp_scr_exp: "合作演出曝光，每单位",
      sp_unscr_only: "只同框 vs 没有共同作品", sp_scr_any: "合作演出过 vs 没有共同作品",
      s3_eyebrow: "谁与谁结合",
      s3_title: "伴侣们来自哪里",
      s3_lede: "每个圆代表一个国籍，大小表示涉及该国的关系数；弧线连接没有共同国籍的伴侣。点击播放可逐年浏览，点击国家可筛选整个页面。",
      play: "播放", pause: "暂停", all_years: "全部年份", window_start: "窗口起点", window: "时间窗", years_n: "{n} 年",
      speed: "速度", slow: "慢", standard: "标准", fast: "快", reset_map: "重置",
      map_sub: "{n} 段关系 · {c} 段跨国", map_node: "涉及该国的关系数", map_arc: "跨国伴侣",
      hist_title: "按开始年份与结局统计的关系数",
      atlas_caption: "国籍来自 Wikidata。只有双方没有任何共同国籍时才算跨国伴侣；历史国家（如苏联、西德）画在其主要继承国的位置。点击柱子可移动时间窗。",
      top_countries: "国家", top_pairs: "跨国组合",
tip_click_on: "点击以按该国筛选整个页面", tip_click_off: "点击取消该筛选",
      s4_eyebrow: "个案",
      s4_title: "两段事业，一段关系",
      s4_lede: "选择一对伴侣，查看两人在关系前后逐年的名气。列表把双方今天都较知名的伴侣排在前面（按 TMDB 热度），可用中英文姓名搜索。",
      find_couple: "搜索姓名", find_couple_ph: "搜索姓名，如 Newman 或 泰勒",
      c_count: "{n} 对", show_more: "再显示 {n} 对", no_match: "没有符合姓名和筛选条件的伴侣。",
      o_brk: "分手/离婚", o_dth: "因一方去世结束", o_unc: "一方去世，结束时间不确定", o_tog: "数据截止时仍在一起",
      f_type: "关系类型", f_start: "开始", f_end: "结束", f_dur: "持续", f_joint: "开始前 3 年至开始当年的共同作品",
      yes: "是", no: "否", joint_fmt: "{s} 部剧本作品 · {u} 次本人出镜",
      dur_fmt: "{y} 年", dur_cens: "{y} 年以上",
      fame_note: "名气 = 在前 3 年有表演作品的演员中的百分位（该窗口内没有表演作品记为 0）。阴影：关系存续期。",
      age_at: "开始时 {a} 岁", born: "生于 {y}", died: "卒于 {y}",
      other_unions: "记录在案的关系", no_curve: "双方都没有 TMDB 职业数据。",
      began_l: "{y} 开始", end_brk: "{y} 分手", end_dth: "{y} 去世", end_unc: "一方去世",
      same_sex: "同性关系：显示在这里和地图上，但不参与她/他的比较。",
      fame_axis: "名气百分位", wikidata: "Wikidata", tmdb: "TMDB",
      s5_eyebrow: "关于数据", s5_title: "问与答",
      faq: [
        ["数据包含什么？",
          "<p>5,389 段两位演员之间的婚姻和未婚伴侣关系，开始于 1950–2015 年，来自 Wikidata 的配偶与伴侣记录，并附有双方的死亡日期和记录在案的结束原因。职业数据来自 TMDB：约 9,800 位演员、51.6 万条演出记录，通过 Wikidata 与 IMDb 标识符关联；99.5% 的身份经多个来源核实。</p>"],
        ["名气如何衡量？",
          "<p>每一条表演作品都计入，按作品在同媒介、同年代中的热度排名以及角色大小（电影的署名顺序、剧集的集数）加权。脱口秀、新闻和以本人身份出镜不计入名气（另作为“共同曝光”统计）。</p><p>某人某年的名气，是其在同一 3 年窗口内所有有表演作品的演员中的百分位。窗口内没有表演作品的人记为 0，并另设“未在工作”标记，因此模型不会把作品空档误当成名气低。</p>"],
        ["为什么一方去世不算分手？",
          "<p>记录在案的关系结束中，约五分之一是一方去世。若把这些算作分手，长久稳定的婚姻会显得脆弱，因此去世只表示观察结束（右删失）。仍然存续的关系在数据截止时删失。</p>"],
        ["曲线和模型分别说明什么？",
          "<p>曲线是 Kaplan–Meier 估计：关系开始若干年后仍在一起的比例，会根据你选择的筛选条件实时重新计算。它们只是描述，不做任何调整。</p><p>风险比来自 Cox 模型：双方名气同在一个模型中，控制双方年龄和开始年代，名气滞后一年。它们是分析脚本中的全样本固定结果，不随筛选变化。</p>"],
        ["是她的名气导致了分手吗？",
          "<p>无法下此结论。数据显示的是相关：我们看不到是谁离开、为什么离开。名气的计算依赖 TMDB 当前的热度；不使用热度的指标（只计主演电影）显示出同样的模式。这种关联在关系进入第十年后减弱。样本只包括知名演员，没有非名人对照组。</p>"],
        ["姓名和国籍从哪里来？",
          "<p>姓名、国籍和关系日期都来自 Wikidata；中文名取自 Wikidata 的中文标签（如有）。Wikidata 中的错误会被带入，关系结束日期也可能缺失：被标为“一方去世，结束时间不确定”的关系中，约四分之一其实可能是未记录的离婚，因此这些关系不进入生存分析。更正最好直接在 Wikidata 上进行。</p>"],
        ["谁制作了本站？如何引用？",
          "<p>Jin Han（阿尔托大学）与 Petter Holme（阿尔托大学；神户大学）。联系：<a href=\"mailto:jin.1.han@aalto.fi\">jin.1.han@aalto.fi</a>。引用：Han, J. and Holme, P., <i>The gendered fragility of celebrity relationships</i>, working paper, 2026.</p><p>数据：Wikidata（CC0）与 TMDB API。本产品使用 TMDB API，但未经 TMDB 认可或认证。</p>"],
      ],
      footer_refs: "相关文献：Stuart, Moon & Casciaro (2011) SSRN 1749612 · Jensen & Kim (2015) Organ. Sci. 26(1) · Folke & Rickne (2020) Am. Econ. J. Appl. Econ. 12(1) · Schwartz & Gonalons-Pons (2016) RSF 2(4)。",
      footer_built: "数据于 {d} 由 datasets/v2 与 features/features02 构建。本产品使用 TMDB API，但未经 TMDB 认可或认证。",
      dec_label: "{d} 年代", dec_last: "2010–15",
    },
  };

  let LANG = "en";
  const langParam = new URLSearchParams(location.search).get("lang");
  try {
    if (langParam === "en" || langParam === "zh") throw 0;
    const saved = localStorage.getItem("sr-lang");
    if (saved === "en" || saved === "zh") LANG = saved;
    else if ((navigator.language || "").toLowerCase().startsWith("zh")) LANG = "zh";
  } catch (e) {
    if (langParam === "en" || langParam === "zh") LANG = langParam;
    else if ((navigator.language || "").toLowerCase().startsWith("zh")) LANG = "zh";
  }
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
  const locale = () => (LANG === "zh" ? "zh-CN" : "en-US");
  const fmtN = (x) => new Intl.NumberFormat(locale()).format(x);
  const fmtP = (x, d = 0) => (x * 100).toFixed(d) + "%";
  const r2 = (x) => (Math.round(x * 100 + 1e-7) / 100).toFixed(2);
  const fmtYrs = (x) => (x === null ? t("not_reached") : x.toFixed(1));
  const fmtPv = (p) => (p === null || p === undefined ? "" : p < 0.001 ? "< 0.001" : "= " + p.toFixed(p < 0.01 ? 3 : 2));
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let displayNames = null, displayNamesLang = null;
  function regionName(a2) {
    try {
      if (displayNamesLang !== LANG) {
        displayNames = new Intl.DisplayNames([LANG === "zh" ? "zh-Hans" : "en"], { type: "region" });
        displayNamesLang = LANG;
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
    u.sy = Math.floor(u.start);
    u.dec = Math.min(2010, Math.floor(u.sy / 10) * 10);
    u.out = u.et === 0 ? "brk" : u.et === 2 ? "dth" : u.et === 3 ? "unc" : "tog";
    const ca = P[u.a].c, cb = P[u.b].c;
    const shared = ca.find((c) => cb.includes(c));
    u.ca = shared || ca[0] || null;
    u.cb = shared || cb[0] || null;
    u.cross = !!(u.ca && u.cb && u.ca !== u.cb);
    u.cset = new Set([...ca, ...cb]);
    u.score = Math.sqrt((P[u.a].pop + 0.1) * (P[u.b].pop + 0.1)); // both partners known today: geometric mean of TMDB popularity
    u.search = norm([P[u.a].n, P[u.a].z, P[u.b].n, P[u.b].z].filter(Boolean).join(" | "));
    P[u.a].us.push(i);
    P[u.b].us.push(i);
    return u;
  });
  for (const p of P) p.us.sort((a, b) => U[a].start - U[b].start);
  const ORDER = U.map((u) => u.i).sort((a, b) => U[b].score - U[a].score);
  const pname = (i) => (LANG === "zh" && P[i].z ? P[i].z : P[i].n);
  const OUT_KEYS = ["brk", "dth", "unc", "tog"];
  const OUT_COL = { brk: "--o-brk", dth: "--o-dth", unc: "--o-unc", tog: "--o-tog" };
  const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010];
  const CTY_COUNT = new Map();
  for (const u of U) for (const c of u.cset) CTY_COUNT.set(c, (CTY_COUNT.get(c) || 0) + 1);

  // ───────────────────────────── state ─────────────────────────────
  const S = { dec: new Set(), rel: "all", cty: new Set(), ctyQ: "", split: "her", forest: "level",
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
    const cnt = { brk: 0, dth: 0, unc: 0, tog: 0 };
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
  const SPLITS = {
    her: { get: (u) => u.hg, cap: "cap_her", groups: [
      { v: 2, k: "g_high_her", c: "--her", w: 2.75 }, { v: 1, k: "g_low", c: "--ref", w: 2 }, { v: 0, k: "g_none", c: "--none", w: 2 }] },
    his: { get: (u) => u.mg, cap: "cap_his", groups: [
      { v: 2, k: "g_high_his", c: "--him", w: 2.75 }, { v: 1, k: "g_low", c: "--ref", w: 2 }, { v: 0, k: "g_none", c: "--none", w: 2 }] },
    joint: { get: (u) => u.jg, cap: "cap_joint", groups: [
      { v: 2, k: "j_high", c: "--vis", w: 2.75 }, { v: 1, k: "j_low", c: "--ref", w: 2 }, { v: 0, k: "j_none", c: "--none", w: 2 }] },
    kind: { get: (u) => u.jk, cap: "cap_kind", groups: [
      { v: 2, k: "k_unscripted", c: "--vis", w: 2.75 }, { v: 1, k: "k_scripted", c: "--aqua", w: 2.75 }, { v: 0, k: "k_none", c: "--ref", w: 2 }] },
    rel: { get: (u) => u.rel, cap: "cap_rel", groups: [
      { v: 0, k: "rel_spouse_g", c: "--vis", w: 2.5 }, { v: 1, k: "rel_partner_g", c: "--aqua", w: 2.5 }] },
    era: { get: (u) => (u.sy < 1990 ? 0 : 1), cap: "cap_era", groups: [
      { v: 0, k: "era_early", c: "--aqua", w: 2.5 }, { v: 1, k: "era_late", c: "--vis", w: 2.5 }] },
  };
  const survBase = () => U.filter((u) => u.sample === 1 && pass(u));

  function renderSplitControl() {
    $("#split").replaceChildren(...Object.keys(SPLITS).map((k) => h("button", { type: "button", "aria-pressed": S.split === k ? "true" : "false",
      text: t("sp_" + k), onclick: () => { S.split = k; renderSplitControl(); renderSurvival(); } })));
  }

  function renderSurvival() {
    const host = $("#km-chart");
    const W = widthOf(host), H = Math.round(Math.min(400, Math.max(260, W * 0.52)));
    const M = { t: 26, r: 18, b: 44, l: 46 }, iw = W - M.l - M.r, ih = H - M.t - M.b;
    const sp = SPLITS[S.split];
    const base = survBase();
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
    const th = D.thresholds;
    $("#km-caption").textContent = t(sp.cap, { m: Math.round(S.split === "his" ? th.his_median : th.her_median) });
  }

  function renderGlance() {
    const base = survBase();
    const f = km(base);
    const rows = U.filter(pass);
    const cnt = { brk: 0, dth: 0, unc: 0, tog: 0 };
    for (const u of rows) cnt[u.out]++;
    const n = rows.length || 1;
    const costar = base.length ? base.filter((u) => u.costar === 1).length / base.length : 0;
    const cross = rows.length ? rows.filter((u) => u.cross).length / rows.length : 0;
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
        h("div", { class: "mini" }, h("div", { class: "v", text: fmtP(cross) }), h("div", { class: "l", text: t("cross_l") }))));
  }

  function renderDose() {
    const host = $("#dose-chart");
    const base = survBase();
    const cats = [0, 1, 2, 3, 4];
    const series = [{ k: "her_l", get: (u) => u.fq, c: "--her", off: -1 }, { k: "his_l", get: (u) => u.mq, c: "--him", off: 1 }];
    $("#dose-legend").replaceChildren(...series.map((s) => h("span", null, h("span", { class: "lmark", style: `background:var(${s.c})` }), t(s.k))));
    const pts = [];
    for (const s of series) for (const c of cats) {
      const rows = base.filter((u) => s.get(u) === c);
      if (rows.length < 30) { pts.push({ s, c, n: rows.length, v: null }); continue; }
      const f = km(rows), i = kmIdx(f, 10);
      pts.push({ s, c, n: rows.length, v: 1 - f.S[i], lo: 1 - f.HI[i], hi: 1 - f.LO[i] });
    }
    const W = widthOf(host), H = 210, M = { t: 22, r: 12, b: 40, l: 46 }, iw = W - M.l - M.r, ih = H - M.t - M.b;
    const x = d3.scaleBand(cats, [0, iw]).padding(0.25), y = d3.scaleLinear([0, 0.8], [ih, 0]);
    const svg = svgIn(host, W, H, t("dose_title"));
    const g = svg.append("g").attr("transform", `translate(${M.l},${M.t})`);
    const yt = [0, 0.2, 0.4, 0.6, 0.8];
    g.append("g").selectAll("line").data(yt).join("line").attr("class", (d) => (d === 0 ? "axis-line" : "grid-line"))
      .attr("x1", 0).attr("x2", iw).attr("y1", (d) => y(d)).attr("y2", (d) => y(d));
    g.append("g").selectAll("text").data(yt).join("text").attr("class", "tick").attr("x", -8).attr("y", (d) => y(d)).attr("dy", "0.32em")
      .attr("text-anchor", "end").text((d) => fmtP(d));
    g.append("text").attr("class", "axis-title").attr("x", -M.l + 2).attr("y", -10).text(t("dose_y"));
    g.append("g").selectAll("text").data(cats).join("text").attr("class", "tick").attr("x", (c) => x(c) + x.bandwidth() / 2).attr("y", ih + 18)
      .attr("text-anchor", "middle").text((c) => t("dx" + c));
    const off = Math.min(12, x.bandwidth() / 5);
    const cx = (p) => x(p.c) + x.bandwidth() / 2 + p.s.off * off;
    for (const s of series) {
      const ps = pts.filter((p) => p.s === s && p.v !== null && p.c > 0);
      g.append("path").attr("d", d3.line().x(cx).y((p) => y(p.v))(ps)).style("fill", "none").style("stroke", `var(${s.c})`)
        .style("stroke-width", 1.5).style("opacity", 0.45);
    }
    const drawn = pts.filter((p) => p.v !== null);
    g.append("g").selectAll("line").data(drawn).join("line").attr("x1", cx).attr("x2", cx).attr("y1", (p) => y(p.lo)).attr("y2", (p) => y(p.hi))
      .style("stroke", (p) => `var(${p.s.c})`).style("stroke-width", 2).style("stroke-linecap", "round");
    g.append("g").selectAll("circle").data(drawn).join("circle").attr("cx", cx).attr("cy", (p) => y(p.v)).attr("r", 5)
      .style("fill", (p) => `var(${p.s.c})`).style("stroke", "var(--surface)").style("stroke-width", 2);
    g.append("g").selectAll("rect").data(cats).join("rect").attr("x", (c) => x(c) - (x.step() - x.bandwidth()) / 2).attr("width", x.step())
      .attr("y", 0).attr("height", ih).style("fill", "transparent")
      .on("pointermove", (e, c) => tipShow(e, (el) => {
        tipHead(el, t("dx" + c));
        for (const p of pts.filter((q) => q.c === c)) tipRow(el, p.s.c, p.v === null ? t("too_few") : fmtP(p.v),
          p.v === null ? t(p.s.k) : `${t(p.s.k)} [${fmtP(p.lo)}, ${fmtP(p.hi)}] · n ${fmtN(p.n)}`);
      }))
      .on("pointerleave", tipHide);
  }

  // ───────────────────────────── models ─────────────────────────────
  function renderKey() {
    const m = D.models.level[0];
    $("#key-claim").innerHTML = t("key_claim");
    const pc = (hr) => { const v = Math.round((hr - 1) * 100); return (v >= 0 ? "+" : "−") + Math.abs(v) + "%"; };
    $("#key-her").textContent = pc(m.her.hr);
    $("#key-him").textContent = pc(m.his.hr);
    $("#key-her-l").textContent = t("key_her_l", { hr: r2(m.her.hr), lo: r2(m.her.lo), hi: r2(m.her.hi) });
    $("#key-him-l").textContent = t("key_him_l", { hr: r2(m.his.hr), lo: r2(m.his.lo), hi: r2(m.his.hi) });
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

  function renderForestMode() {
    $("#forest-mode").replaceChildren(...["level", "pre"].map((k) => h("button", { type: "button", "aria-pressed": S.forest === k ? "true" : "false",
      text: t("fm_" + k), onclick: () => { S.forest = k; renderForestMode(); renderForest(); } })));
  }
  function renderForest() {
    const rows = S.forest === "level" ? D.models.level : D.models.pre;
    const host = $("#forest");
    $("#forest-legend").replaceChildren(h("span", null, h("span", { class: "lmark", style: "background:var(--her)" }), t("her_l")),
      h("span", null, h("span", { class: "lmark", style: "background:var(--him)" }), t("his_l")));
    const W = widthOf(host), narrow = W < 540, LW = narrow ? Math.round(W * 0.42) : 230, rowH = 30, M = { t: 6, b: 44, r: 14 };
    const H = M.t + rows.length * rowH + M.b, y0 = rows.length * rowH;
    const lo = d3.min(rows, (r) => Math.min(r.her.lo, r.his.lo)), hi = d3.max(rows, (r) => Math.max(r.her.hi, r.his.hi));
    const x = d3.scaleLog([Math.min(lo, 0.99) * 0.997, Math.max(hi, 1.01) * 1.003], [LW, W - M.r]);
    const svg = svgIn(host, W, H, t("s2_title"));
    const g = svg.append("g").attr("transform", `translate(0,${M.t})`);
    forestAxis(g, x, logTicks(x.domain()[0], x.domain()[1], narrow ? 4 : 8), y0, t("forest_x"));
    rows.forEach((r, i) => {
      const yc = i * rowH + rowH / 2;
      const row = g.append("g");
      if (i % 2 === 0) row.append("rect").attr("x", 0).attr("y", yc - rowH / 2).attr("width", W).attr("height", rowH).style("fill", "var(--surface-2)");
      row.append("text").attr("class", "row-label" + (i === 0 ? " strong" : "")).attr("x", LW - 12).attr("y", yc).attr("dy", "0.32em")
        .attr("text-anchor", "end").style("font-size", narrow ? "11px" : null).text(t("row_" + r.key));
      for (const [who, c, dy] of [["her", "--her", -5], ["his", "--him", 5]]) {
        const d = r[who];
        row.append("line").attr("x1", x(d.lo)).attr("x2", x(d.hi)).attr("y1", yc + dy).attr("y2", yc + dy)
          .style("stroke", `var(${c})`).style("stroke-width", 2).style("stroke-linecap", "round");
        row.append("circle").attr("cx", x(d.hr)).attr("cy", yc + dy).attr("r", 4.5).style("fill", `var(${c})`)
          .style("stroke", "var(--surface)").style("stroke-width", 2);
      }
      row.append("rect").attr("x", 0).attr("y", yc - rowH / 2).attr("width", W).attr("height", rowH).style("fill", "transparent")
        .on("pointermove", (e) => tipShow(e, (el) => {
          tipHead(el, t("row_" + r.key) + (r.her.n ? ` · n ${fmtN(r.her.n)}` : ""));
          tipRow(el, "--her", r2(r.her.hr), `${t("her_short")} [${r2(r.her.lo)}, ${r2(r.her.hi)}]${r.her.p !== null ? " p " + fmtPv(r.her.p) : ""}`);
          tipRow(el, "--him", r2(r.his.hr), `${t("his_short")} [${r2(r.his.lo)}, ${r2(r.his.hi)}]${r.his.p !== null ? " p " + fmtPv(r.his.p) : ""}`);
        }))
        .on("pointerleave", tipHide);
    });
    $("#forest-caption").textContent = S.forest === "level" ? t("cap_level", { p: fmtPv(D.models.wald_level) }) : t("cap_pre");
    $("#forest-table").replaceChildren(
      h("thead", null, h("tr", null, ...["th_spec", "th_her", "th_his", "th_n"].map((k) => h("th", { text: k === "th_n" ? "n" : t(k) })))),
      h("tbody", null, ...rows.map((r) => h("tr", null, h("td", { text: t("row_" + r.key) }),
        h("td", { text: `${r2(r.her.hr)} [${r2(r.her.lo)}, ${r2(r.her.hi)}]` }),
        h("td", { text: `${r2(r.his.hr)} [${r2(r.his.lo)}, ${r2(r.his.hi)}]` }),
        h("td", { text: r.her.n ? fmtN(r.her.n) : "–" })))));
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
  function renderRise() {
    $("#rise-legend").replaceChildren(
      h("span", null, h("span", { class: "lmark hollow", style: "border-color:var(--ink-2)" }), t("rise_alone")),
      h("span", null, h("span", { class: "lmark", style: "background:var(--ink-2)" }), t("rise_with")));
    const rows = [];
    for (const r of D.models.rise) for (const [who, c] of [["her", "--her"], ["his", "--him"]]) rows.push({
      label: t("rise_row", { who: t(who + "_short"), k: r.k }),
      marks: [{ d: r[who + "_alone"], c, hollow: true, name: t("rise_alone") }, { d: r[who + "_with_level"], c, hollow: false, name: t("rise_with") }],
    });
    hrRows($("#rise-chart"), rows, [0.8, 1.45], t("hr_log"));
  }
  function renderSpot() {
    const j = D.models.joint;
    const rows = [
      { label: t("sp_unscr_exp"), marks: [{ d: j.unscripted_all, c: "--vis", ci: true }] },
      { label: t("sp_scr_exp"), marks: [{ d: j.scripted_all, c: "--aqua", ci: true }] },
      { label: t("sp_unscr_only"), marks: [{ d: j.kind_unscripted_all, c: "--vis", ci: true }] },
      { label: t("sp_scr_any"), marks: [{ d: j.kind_scripted_all, c: "--aqua", ci: true }] },
    ];
    hrRows($("#spot-chart"), rows, [0.75, 2.0], t("hr_log"));
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
      for (const c of new Set([u.ca, u.cb].filter(Boolean))) {
        const nd = nodes.get(c) || { a2: c, n: 0, x: 0 };
        nd.n++; if (u.cross) nd.x++;
        nodes.set(c, nd);
      }
      if (u.cross) { const key = [u.ca, u.cb].sort().join("|"); pairs.set(key, (pairs.get(key) || 0) + 1); }
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
      tipRow(el, "--arc", fmtP(d.x / d.n), t("map_arc"));
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
    const by = new Map(years.map((y) => [y, { y, brk: 0, dth: 0, unc: 0, tog: 0, n: 0 }]));
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
  const endYear = (u) => Math.floor(u.end);
  const yearsText = (u) => (u.out === "tog" ? `${u.sy}–` : `${u.sy}–${endYear(u)}`);
  const relText = (u) => (u.rel === 0 ? t("rel_spouse_g") : t("rel_partner_g"));
  function renderCoupleList() {
    const q = norm(S.q.trim());
    const list = ORDER.filter((i) => pass(U[i]) && (!q || U[i].search.includes(q)));
    $("#c-count").textContent = t("c_count", { n: fmtN(list.length) });
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
    if (!u) return;
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
          LANG === "zh" && pp.z ? h("span", { style: "color:var(--muted);font-weight:400;margin-left:6px", text: pp.n }) : null),
        h("div", { class: "pm", text: meta }),
        h("div", { class: "links" },
          h("a", { href: `https://www.wikidata.org/wiki/${pp.q}`, target: "_blank", rel: "noopener", text: t("wikidata") }),
          pp.t ? h("a", { href: `https://www.themoviedb.org/person/${pp.t}`, target: "_blank", rel: "noopener", text: t("tmdb") }) : null),
        h("div", { class: "eyebrow", style: "margin-top:10px", text: t("other_unions") }),
        h("ul", null, ...pp.us.map((ui) => {
          const o = U[ui], other = o.a === pi ? o.b : o.a;
          const label = `${pname(other)}`;
          return h("li", null, ui === u.i ? h("span", { class: "cur", text: label }) : h("button", { type: "button", text: label, onclick: () => selectCouple(ui) }),
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
      const lbl = u.out === "brk" ? t("end_brk", { y: endYear(u) }) : u.out === "dth" ? t("end_dth", { y: endYear(u) }) : t("end_unc");
      g.append("line").attr("x1", x1).attr("x2", x1).attr("y1", -4).attr("y2", ih).style("stroke", "var(--ink-2)")
        .style("stroke-width", 1.5);
      const right = x1 > iw - 90;
      g.append("text").attr("class", "mark-label").attr("x", right ? x1 - 4 : x1 + 4).attr("y", x1 - x0 < 110 && !right ? 10 : -6)
        .attr("text-anchor", right ? "end" : "start").text(lbl);
    }
    const line = d3.line().defined((d) => d[1] !== null).x((d) => x(d[0])).y((d) => y(d[1]));
    for (const d of ppl) {
      if (!d.f) continue;
      const data = d.f[1].map((v, k) => [d.f[0] + k + 0.5, v]);
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
        const yr = Math.max(y0, Math.min(y1 - 1, Math.floor(x.invert(mx))));
        const cx = x(yr + 0.5);
        cross.attr("x1", cx).attr("x2", cx).style("opacity", 1);
        const vals = ppl.map((d) => ({ d, v: d.f && yr >= d.f[0] && yr < d.f[0] + d.f[1].length ? d.f[1][yr - d.f[0]] : null }));
        dots.selectAll("circle").data(vals.filter((o) => o.v !== null)).join("circle").attr("cx", cx).attr("cy", (o) => y(o.v)).attr("r", 4)
          .style("fill", (o) => `var(${o.d.c})`).style("stroke", "var(--surface)").style("stroke-width", 2);
        tipShow(e, (el) => {
          tipHead(el, String(yr));
          for (const o of vals) tipRow(el, o.d.c, o.v === null ? "–" : String(o.v), pname(o.d.pi));
        });
      })
      .on("pointerleave", () => { cross.style("opacity", 0); dots.selectAll("*").remove(); tipHide(); });
  }

  // ───────────────────────────── page ─────────────────────────────
  function renderStatic() {
    document.documentElement.lang = LANG === "zh" ? "zh-CN" : "en";
    for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
    for (const el of document.querySelectorAll("[data-i18n-ph]")) el.placeholder = t(el.dataset.i18nPh);
    document.title = LANG === "zh" ? "银幕情缘 · Screen Romance" : "Screen Romance";
    $("#lang-en").setAttribute("aria-pressed", LANG === "en" ? "true" : "false");
    $("#lang-zh").setAttribute("aria-pressed", LANG === "zh" ? "true" : "false");
    $("#faq-list").replaceChildren(...T[LANG].faq.map(([q, a], i) => {
      const d = h("details", i === 0 ? { open: true } : null, h("summary", { text: q }));
      const ans = h("div", { class: "ans" });
      ans.innerHTML = a; // static, author-written copy
      d.append(ans);
      return d;
    }));
    $("#footer").replaceChildren(h("p", { text: t("footer_refs") }), h("p", { text: t("footer_built", { d: D.built }) }));
  }
  function update() {
    renderFilters();
    renderRailStats();
    renderSurvival();
    renderGlance();
    renderDose();
    renderAtlas();
    renderHist();
    S.limit = 60;
    renderCoupleList();
  }
  function renderAllText() {
    renderStatic();
    renderKey();
    renderSplitControl();
    renderForestMode();
    renderPlaySelects();
    syncPlayControls();
    update();
    renderForest();
    renderRise();
    renderSpot();
    renderCoupleDetail();
  }
  function setLang(l) {
    LANG = l;
    try { localStorage.setItem("sr-lang", l); } catch (e) { /* storage unavailable: language resets on reload */ }
    renderAllText();
  }

  // events
  $("#lang-en").addEventListener("click", () => setLang("en"));
  $("#lang-zh").addEventListener("click", () => setLang("zh"));
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
      renderSurvival(); renderDose(); renderForest(); renderRise(); renderSpot(); renderAtlas(); renderHist();
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
