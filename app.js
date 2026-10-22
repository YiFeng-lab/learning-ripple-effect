'use strict';
(() => {
  const data = window.RIPPLE_DATA;
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const degrees = $('degree'), majors = $('major'), genders = $('gender');
  const detail = $('detail'), tooltip = $('tooltip');
  const attitudes = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];
  const frequencies = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'];
  let selectedQuestion = null;

  function svgNode(tag, attrs = {}) {
    const element = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }
  function populate(select, key) {
    [...new Set(data.records.map(record => record[key]))].sort().forEach(value => {
      const option = document.createElement('option');
      option.value = value; option.textContent = value; select.append(option);
    });
  }
  function filteredRecords() {
    return data.records.filter(record =>
      (degrees.value === 'all' || record.degree === degrees.value) &&
      (majors.value === 'all' || record.major === majors.value) &&
      (genders.value === 'all' || record.gender === genders.value));
  }
  function hideTooltip() { tooltip.hidden = true; }
  function showTooltip(record, questionIndex, event, point) {
    const host = detail.open ? detail : document.body;
    if (tooltip.parentElement !== host) host.append(tooltip);
    tooltip.replaceChildren();
    const title = document.createElement('strong'); title.textContent = record.id;
    tooltip.append(title);
    const lines = [record.degree + ' · ' + record.major, record.gender,
      'Agreement: ' + attitudes[record.answers[questionIndex] - 1],
      'AI use: ' + frequencies[record.frequency - 1]];
    lines.forEach(line => { const div = document.createElement('div'); div.textContent = line; tooltip.append(div); });
    tooltip.hidden = false;
    const bounds = point.getBoundingClientRect();
    const x = event.clientX ?? bounds.x + bounds.width / 2;
    const y = event.clientY ?? bounds.y + bounds.height / 2;
    tooltip.style.left = Math.max(8, Math.min(x + 14, window.innerWidth - tooltip.offsetWidth - 10)) + 'px';
    tooltip.style.top = Math.max(8, Math.min(y + 14, window.innerHeight - tooltip.offsetHeight - 10)) + 'px';
  }
  function makeChart(questionIndex, records, expanded = false) {
    const size = expanded ? 540 : 250, center = size / 2, step = expanded ? 43 : 20;
    const svg = svgNode('svg', {viewBox: `0 0 ${size} ${size}`, role: 'img',
      'aria-label': `${data.questions[questionIndex]}: ${records.length} synthetic responses`});
    for (let i = 1; i <= 5; i++) svg.append(svgNode('circle', {cx: center, cy: center, r: i * step, class: 'ring'}));
    if (!expanded) svg.append(svgNode('circle', {cx: center, cy: center, r: step * 5, class: 'ripple-wave'}));
    const levels = new Map();
    records.forEach(record => { const score = record.answers[questionIndex]; if (!levels.has(score)) levels.set(score, []); levels.get(score).push(record); });
    const halos = svgNode('g'), dots = svgNode('g');
    levels.forEach((group, score) => group.forEach((record, index) => {
      const angle = index / group.length * Math.PI * 2 - Math.PI / 2 + score * .23;
      const x = center + Math.cos(angle) * score * step, y = center + Math.sin(angle) * score * step;
      const dotRadius = expanded ? 3.8 : 2.1;
      halos.append(svgNode('circle', {cx: x, cy: y, r: record.frequency * (expanded ? 3 : 1.8), class: 'point-halo'}));
      const point = svgNode('circle', {cx: x, cy: y, r: dotRadius, class: 'point'});
      if (expanded) { point.setAttribute('tabindex', '0'); point.setAttribute('aria-label', `${record.id}, ${attitudes[score - 1]}, AI use ${frequencies[record.frequency - 1]}`); }
      point.addEventListener('pointerenter', event => showTooltip(record, questionIndex, event, point));
      point.addEventListener('pointermove', event => showTooltip(record, questionIndex, event, point));
      point.addEventListener('pointerleave', hideTooltip);
      point.addEventListener('focus', event => showTooltip(record, questionIndex, event, point));
      point.addEventListener('blur', hideTooltip);
      dots.append(point);
    }));
    svg.append(halos, dots);
    return svg;
  }
  function renderDetail(records) {
    $('detail-title').textContent = 'Question ' + data.questions[selectedQuestion];
    $('detail-count').textContent = `${records.length} of ${data.records.length} synthetic responses · current filters`;
    $('detail-chart').replaceChildren(makeChart(selectedQuestion, records, true));
  }
  function openDetail(index) {
    hideTooltip(); selectedQuestion = index; renderDetail(filteredRecords()); detail.showModal();
  }
  function render() {
    hideTooltip();
    const records = filteredRecords();
    $('count').textContent = `${records.length} / ${data.records.length} demo responses`;
    $('empty').hidden = records.length !== 0;
    $('charts').replaceChildren();
    if (records.length) data.questions.forEach((question, index) => {
      const card = document.createElement('button');
      card.type = 'button'; card.className = 'chart-card'; card.setAttribute('aria-label', 'Explore question ' + question);
      card.append(makeChart(index, records));
      const label = document.createElement('span'); label.className = 'card-label'; label.textContent = question;
      const small = document.createElement('small'); small.textContent = '↗'; label.append(small); card.append(label);
      card.addEventListener('click', () => openDetail(index)); $('charts').append(card);
    });
    if (detail.open && selectedQuestion !== null) renderDetail(records);
  }
  if (!data || !Array.isArray(data.records)) { $('count').textContent = 'Demo data could not be loaded.'; return; }
  populate(degrees, 'degree'); populate(majors, 'major'); populate(genders, 'gender');
  $('filters').addEventListener('change', render);
  $('filters').addEventListener('submit', event => event.preventDefault());
  $('filters').addEventListener('reset', () => { degrees.value = majors.value = genders.value = 'all'; render(); });
  $('close-detail').addEventListener('click', () => detail.close());
  detail.addEventListener('close', () => { hideTooltip(); document.body.append(tooltip); });
  detail.addEventListener('click', event => { if (event.target === detail) { const rect = detail.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) detail.close(); } });
  document.addEventListener('scroll', hideTooltip, true);
  window.addEventListener('resize', hideTooltip);
  render();
})();
