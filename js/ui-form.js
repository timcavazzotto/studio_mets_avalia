// ui-form.js — Gera o HTML do formulário de coleta e lê os valores preenchidos.
import * as F from "./formulario.js";

let medicamentosAtual = [];

function radioRow(fieldId, text, opts, defaultVal) {
  const inputs = opts.map(([v, l]) =>
    `<label><input type="radio" name="${fieldId}" value="${v}" ${v === defaultVal ? "checked" : ""}> ${l}</label>`
  ).join("");
  return `<div class="q"><div class="qtext">${text}</div><div class="opts">${inputs}</div></div>`;
}

function entryRow(fieldId, label, opts = {}) {
  const type = opts.type || "text";
  return `<div class="field-row"><label for="${fieldId}">${label}</label>
    <input type="${type}" id="${fieldId}" ${opts.step ? `step="${opts.step}"` : ""}></div>`;
}

function dropdownRow(fieldId, label, options) {
  const opts = options.map((o) => `<option value="${o}">${o}</option>`).join("");
  return `<div class="field-row"><label for="${fieldId}">${label}</label>
    <select id="${fieldId}">${opts}</select></div>`;
}

export function generateFormHTML() {
  let html = "";

  html += `<h2>0. Dados da Avaliação</h2>`;
  html += entryRow("objetivo", "Objetivo principal no treino");
  html += entryRow("tempo_treino_previo", "Tempo de treino de força/funcional prévio");

  html += `<h2>0b. Medicamentos de Uso Contínuo</h2>
    <div id="medsList" class="meds-list"></div>
    <div class="meds-add">
      <input type="text" id="med_nome" placeholder="Medicamento">
      <input type="text" id="med_dose" placeholder="Dose">
      <input type="text" id="med_freq" placeholder="Frequência">
      <input type="text" id="med_motivo" placeholder="Motivo">
      <input type="text" id="med_tempo" placeholder="Há quanto tempo">
      <button type="button" onclick="window.__addMedicamento()">+ Adicionar</button>
    </div>`;

  html += `<h2>1. Prontidão para Atividade Física — PAR-Q+</h2>`;
  F.PARQ_ITEMS.forEach((q, i) => { html += radioRow(`parq_${i}`, `${i + 1}. ${q}`, [[1, "Sim"], [0, "Não"]], 0); });

  html += `<h2>2. Nível de Atividade Física — IPAQ (forma longa)</h2><p class="hint">Pense nos últimos 7 dias.</p>`;
  F.IPAQ_DOMINIOS.forEach(([domKey, domLabel]) => {
    html += `<h3>${domLabel}</h3>`;
    F.IPAQ_INTENSIDADES.forEach(([intKey, intLabel]) => {
      html += `<div class="q"><div class="qtext">${intLabel}</div><div class="opts">
        <label>dias/sem <input type="number" min="0" max="7" style="width:4em" id="ipaq_${domKey}_${intKey}_dias"></label>
        <label>min/dia <input type="number" min="0" style="width:5em" id="ipaq_${domKey}_${intKey}_min"></label>
      </div></div>`;
    });
  });

  html += `<h2>3. Comportamento Sedentário</h2><p class="hint">Horas sentado(a) em um dia típico.</p>`;
  F.SBQ_ITEMS.forEach((item, i) => {
    html += `<div class="q"><div class="qtext">${item}</div><div class="opts">
      <label>dia útil (h) <input type="number" step="0.5" min="0" style="width:4em" id="sbq_${i}_sem"></label>
      <label>fim de semana (h) <input type="number" step="0.5" min="0" style="width:4em" id="sbq_${i}_fds"></label>
    </div></div>`;
  });

  html += `<h2>4. Qualidade do Sono — Questionário Interno</h2>
    <p class="hint">Instrumento descritivo próprio do estúdio, não validado publicado.</p>`;
  html += entryRow("sono_hora_dormir", "Horário habitual em que costuma dormir");
  html += entryRow("sono_hora_acordar", "Horário habitual em que costuma acordar");
  F.SONO_ITEMS.forEach(([texto, opts], i) => { html += radioRow(`sono_${i}`, `${i + 1}. ${texto}`, opts); });
  html += radioRow("sono_apneia", "9. Alguém já percebeu ronco intenso, pausas respiratórias ou engasgos durante o sono? (rastreio — não soma no escore)", F.SONO_APNEIA_OPTS);

  html += `<h2>5. Saúde Mental — DASS-21</h2><p class="hint">O quanto cada frase se aplicou a você na última semana.</p>`;
  F.DASS_ITEMS.forEach(([texto], i) => { html += radioRow(`dass_${i}`, `${i + 1}. ${texto}`, F.DASS_OPTS); });

  html += `<h2>6. Dores e Queixas Musculoesqueléticas — Questionário Nórdico</h2>
    <p class="hint">Marque o que se aplica para cada região do corpo.</p>`;
  F.NORDIC_REGIOES.forEach((regiao, i) => {
    html += `<div class="q"><div class="qtext">${regiao}</div><div class="opts">
      <label><input type="checkbox" id="nord_${i}_12m"> 12 meses</label>
      <label><input type="checkbox" id="nord_${i}_imp"> Limitou atividades</label>
      <label><input type="checkbox" id="nord_${i}_7d"> 7 dias</label>
    </div></div>`;
  });

  html += `<h2>7. Padrão Alimentar</h2><p class="hint">Screener estruturado (frequência semanal).</p>`;
  F.DIET_ITEMS.forEach(([texto], i) => { html += entryRow(`diet_${i}`, texto, { type: "number", step: "0.5" }); });

  html += `<h2>8. Medidas Corporais</h2>`;
  html += entryRow("peso", "Peso (kg)", { type: "number", step: "0.1" });
  html += entryRow("altura", "Altura (cm)", { type: "number", step: "0.1" });
  html += entryRow("cintura", "Circunf. cintura (cm)", { type: "number", step: "0.1" });
  html += entryRow("quadril", "Circunf. quadril (cm)", { type: "number", step: "0.1" });
  html += entryRow("gordura", "% Gordura (se disponível)", { type: "number", step: "0.1" });
  html += entryRow("pa", "PA sistólica/diastólica (ex: 120/80)");
  html += entryRow("preensao_dir", "Preensão manual — mão direita (kgf)", { type: "number", step: "0.1" });
  html += entryRow("preensao_esq", "Preensão manual — mão esquerda (kgf)", { type: "number", step: "0.1" });

  html += `<h2>9. Conexão Social — LSNS-6</h2>`;
  F.LSNS_ITEMS.forEach((texto, i) => { html += radioRow(`lsns_${i}`, `${i + 1}. ${texto}`, F.LSNS_OPTS); });

  html += `<h2>10. Uso de Substâncias — AUDIT-C</h2>`;
  F.AUDIT_ITEMS.forEach(([texto, opts], i) => { html += radioRow(`audit_${i}`, `${i + 1}. ${texto}`, opts); });
  html += dropdownRow("fumo", "Situação de tabagismo", ["nunca", "ex", "atual"]);

  html += `<h2>11. Utilização de Serviços de Saúde (últimos 12 meses)</h2>`;
  html += entryRow("visita_clinico", "Consultas clínico geral", { type: "number" });
  html += entryRow("visita_esp", "Consultas especialistas (total)", { type: "number" });
  html += entryRow("visita_ps", "Idas a pronto-socorro/emergência", { type: "number" });
  html += entryRow("visita_int", "Internações hospitalares", { type: "number" });
  html += entryRow("visita_fisio", "Sessões de fisioterapia", { type: "number" });
  html += entryRow("visita_psi", "Consultas psicólogo/psiquiatra", { type: "number" });

  html += `<h2>12. Exames e Biomarcadores Sanguíneos (opcional)</h2>
    <p class="hint">Preencha apenas se disponível.</p>`;
  F.BIOMARCADORES.forEach(([fieldId, label, unidade]) => { html += entryRow(fieldId, `${label} (${unidade})`, { type: "number", step: "0.01" }); });

  html += `<h2>13. Saúde Óssea (opcional — indicado para mulheres 45+)</h2>`;
  F.OSSEA_ITEMS.forEach((texto, i) => { html += radioRow(`ossea_${i}`, `${i + 1}. ${texto}`, [[1, "Sim"], [0, "Não"]], 0); });
  html += entryRow("dxa_coluna", "T-score DXA coluna (se disponível)", { type: "number", step: "0.1" });
  html += entryRow("dxa_femur", "T-score DXA fêmur (se disponível)", { type: "number", step: "0.1" });

  html += `<h2>14. Trabalho: Carga Horária, Ambiente e Estresse Ocupacional</h2>`;
  html += entryRow("trab_horas", "Horas de trabalho por dia (média)", { type: "number", step: "0.5" });
  html += dropdownRow("trab_modalidade", "Modalidade", ["presencial", "remoto", "hibrido"]);
  html += dropdownRow("trab_tipo", "Tipo de esforço predominante", ["sedentario", "leve", "pesado"]);
  html += dropdownRow("trab_turno", "Turno predominante", ["diurno", "noturno", "misto"]);
  F.TRAB_ITEMS.forEach(([texto], i) => { html += radioRow(`trab_${i}`, texto, F.TRAB_OPTS); });
  html += entryRow("trab_estresse_geral", "Estresse percebido no trabalho hoje (0-10)", { type: "number", step: "1" });

  return html;
}

// ---------------- Medicamentos (lista dinâmica) ----------------
export function resetMedicamentos(lista = []) {
  medicamentosAtual = [...lista];
  renderMedicamentos();
}

export function getMedicamentos() {
  return medicamentosAtual;
}

function renderMedicamentos() {
  const el = document.getElementById("medsList");
  if (!el) return;
  if (medicamentosAtual.length === 0) {
    el.innerHTML = `<p class="hint">Nenhum medicamento adicionado.</p>`;
    return;
  }
  el.innerHTML = medicamentosAtual.map((m, i) =>
    `<div class="med-item">
      <span><b>${m.nome}</b> — ${m.dose} — ${m.frequencia} — ${m.motivo} — ${m.tempo_uso}</span>
      <button type="button" onclick="window.__removeMedicamento(${i})">Remover</button>
    </div>`
  ).join("");
}

window.__addMedicamento = function () {
  const nome = document.getElementById("med_nome").value.trim();
  if (!nome) { alert("Informe o nome do medicamento."); return; }
  medicamentosAtual.push({
    nome,
    dose: document.getElementById("med_dose").value.trim(),
    frequencia: document.getElementById("med_freq").value.trim(),
    motivo: document.getElementById("med_motivo").value.trim(),
    tempo_uso: document.getElementById("med_tempo").value.trim(),
  });
  ["med_nome", "med_dose", "med_freq", "med_motivo", "med_tempo"].forEach((id) => { document.getElementById(id).value = ""; });
  renderMedicamentos();
};

window.__removeMedicamento = function (idx) {
  medicamentosAtual.splice(idx, 1);
  renderMedicamentos();
};

// ---------------- Leitura dos valores ----------------
function radioVal(fieldId) {
  const el = document.querySelector(`input[name="${fieldId}"]:checked`);
  return el ? Number(el.value) : null;
}
function checkVal(fieldId) {
  const el = document.getElementById(fieldId);
  return el ? (el.checked ? 1 : 0) : 0;
}
function textVal(fieldId) {
  const el = document.getElementById(fieldId);
  if (!el) return null;
  return el.value === "" ? null : el.value;
}

export function getRawValues() {
  const v = {};
  for (let i = 0; i < F.PARQ_ITEMS.length; i++) v[`parq_${i}`] = radioVal(`parq_${i}`);
  F.IPAQ_DOMINIOS.forEach(([domKey]) => {
    F.IPAQ_INTENSIDADES.forEach(([intKey]) => {
      v[`ipaq_${domKey}_${intKey}_dias`] = textVal(`ipaq_${domKey}_${intKey}_dias`);
      v[`ipaq_${domKey}_${intKey}_min`] = textVal(`ipaq_${domKey}_${intKey}_min`);
    });
  });
  for (let i = 0; i < F.SBQ_ITEMS.length; i++) {
    v[`sbq_${i}_sem`] = textVal(`sbq_${i}_sem`);
    v[`sbq_${i}_fds`] = textVal(`sbq_${i}_fds`);
  }
  for (let i = 0; i < F.SONO_ITEMS.length; i++) v[`sono_${i}`] = radioVal(`sono_${i}`);
  v.sono_apneia = radioVal("sono_apneia");
  for (let i = 0; i < F.DASS_ITEMS.length; i++) v[`dass_${i}`] = radioVal(`dass_${i}`);
  for (let i = 0; i < F.NORDIC_REGIOES.length; i++) {
    v[`nord_${i}_12m`] = checkVal(`nord_${i}_12m`);
    v[`nord_${i}_imp`] = checkVal(`nord_${i}_imp`);
    v[`nord_${i}_7d`] = checkVal(`nord_${i}_7d`);
  }
  for (let i = 0; i < F.DIET_ITEMS.length; i++) v[`diet_${i}`] = textVal(`diet_${i}`);
  ["peso", "altura", "cintura", "quadril", "gordura", "pa", "preensao_dir", "preensao_esq"].forEach((id) => { v[id] = textVal(id); });
  for (let i = 0; i < F.LSNS_ITEMS.length; i++) v[`lsns_${i}`] = radioVal(`lsns_${i}`);
  for (let i = 0; i < F.AUDIT_ITEMS.length; i++) v[`audit_${i}`] = radioVal(`audit_${i}`);
  v.fumo = textVal("fumo");
  ["visita_clinico", "visita_esp", "visita_ps", "visita_int", "visita_fisio", "visita_psi"].forEach((id) => { v[id] = textVal(id); });
  F.BIOMARCADORES.forEach(([fieldId]) => { v[fieldId] = textVal(fieldId); });
  for (let i = 0; i < F.OSSEA_ITEMS.length; i++) v[`ossea_${i}`] = radioVal(`ossea_${i}`);
  v.dxa_coluna = textVal("dxa_coluna");
  v.dxa_femur = textVal("dxa_femur");
  v.trab_horas = textVal("trab_horas");
  v.trab_modalidade = textVal("trab_modalidade");
  v.trab_tipo = textVal("trab_tipo");
  v.trab_turno = textVal("trab_turno");
  for (let i = 0; i < F.TRAB_ITEMS.length; i++) v[`trab_${i}`] = radioVal(`trab_${i}`);
  v.trab_estresse_geral = textVal("trab_estresse_geral");
  v.objetivo = textVal("objetivo");
  v.tempo_treino_previo = textVal("tempo_treino_previo");
  return v;
}

export function preencherAPartirDe(ultimaAvaliacao) {
  if (!ultimaAvaliacao) return;
  if (ultimaAvaliacao.objetivo) document.getElementById("objetivo").value = ultimaAvaliacao.objetivo;
  if (ultimaAvaliacao.tempo_treino_previo) document.getElementById("tempo_treino_previo").value = ultimaAvaliacao.tempo_treino_previo;
  resetMedicamentos(ultimaAvaliacao.medicamentos || []);
}

// ---------------- Editar avaliação existente ----------------
function setRadio(fieldId, value) {
  if (value === null || value === undefined) return;
  const el = document.querySelector(`input[name="${fieldId}"][value="${value}"]`);
  if (el) el.checked = true;
}
function setCheckbox(fieldId, value) {
  const el = document.getElementById(fieldId);
  if (el) el.checked = value === 1;
}
function setField(fieldId, value) {
  const el = document.getElementById(fieldId);
  if (el) el.value = value === null || value === undefined ? "" : value;
}

/** Limpa todos os campos do formulário (usar antes de iniciar uma nova avaliação
 * do zero, ou antes de carregar uma avaliação para edição). */
export function limparFormulario() {
  document.querySelectorAll('#form-container input[type="text"], #form-container input[type="number"]').forEach((el) => { el.value = ""; });
  document.querySelectorAll('#form-container input[type="radio"]').forEach((el) => { el.checked = false; });
  document.querySelectorAll('#form-container input[type="checkbox"]').forEach((el) => { el.checked = false; });
  document.querySelectorAll('#form-container select').forEach((el) => { el.selectedIndex = 0; });
  resetMedicamentos([]);
}

/** Preenche o formulário inteiro a partir do objeto "dados_brutos" salvo numa
 * avaliação anterior — usado para reabrir e editar uma avaliação já existente. */
export function preencherFormularioCompleto(raw, medicamentos) {
  limparFormulario();
  if (!raw) return;

  for (let i = 0; i < F.PARQ_ITEMS.length; i++) setRadio(`parq_${i}`, raw[`parq_${i}`]);
  F.IPAQ_DOMINIOS.forEach(([domKey]) => {
    F.IPAQ_INTENSIDADES.forEach(([intKey]) => {
      setField(`ipaq_${domKey}_${intKey}_dias`, raw[`ipaq_${domKey}_${intKey}_dias`]);
      setField(`ipaq_${domKey}_${intKey}_min`, raw[`ipaq_${domKey}_${intKey}_min`]);
    });
  });
  for (let i = 0; i < F.SBQ_ITEMS.length; i++) {
    setField(`sbq_${i}_sem`, raw[`sbq_${i}_sem`]);
    setField(`sbq_${i}_fds`, raw[`sbq_${i}_fds`]);
  }
  setField("sono_hora_dormir", raw.sono_hora_dormir);
  setField("sono_hora_acordar", raw.sono_hora_acordar);
  for (let i = 0; i < F.SONO_ITEMS.length; i++) setRadio(`sono_${i}`, raw[`sono_${i}`]);
  setRadio("sono_apneia", raw.sono_apneia);
  for (let i = 0; i < F.DASS_ITEMS.length; i++) setRadio(`dass_${i}`, raw[`dass_${i}`]);
  for (let i = 0; i < F.NORDIC_REGIOES.length; i++) {
    setCheckbox(`nord_${i}_12m`, raw[`nord_${i}_12m`]);
    setCheckbox(`nord_${i}_imp`, raw[`nord_${i}_imp`]);
    setCheckbox(`nord_${i}_7d`, raw[`nord_${i}_7d`]);
  }
  for (let i = 0; i < F.DIET_ITEMS.length; i++) setField(`diet_${i}`, raw[`diet_${i}`]);
  ["peso", "altura", "cintura", "quadril", "gordura", "pa", "preensao_dir", "preensao_esq"].forEach((id) => setField(id, raw[id]));
  for (let i = 0; i < F.LSNS_ITEMS.length; i++) setRadio(`lsns_${i}`, raw[`lsns_${i}`]);
  for (let i = 0; i < F.AUDIT_ITEMS.length; i++) setRadio(`audit_${i}`, raw[`audit_${i}`]);
  setField("fumo", raw.fumo);
  ["visita_clinico", "visita_esp", "visita_ps", "visita_int", "visita_fisio", "visita_psi"].forEach((id) => setField(id, raw[id]));
  F.BIOMARCADORES.forEach(([fieldId]) => setField(fieldId, raw[fieldId]));
  for (let i = 0; i < F.OSSEA_ITEMS.length; i++) setRadio(`ossea_${i}`, raw[`ossea_${i}`]);
  setField("dxa_coluna", raw.dxa_coluna);
  setField("dxa_femur", raw.dxa_femur);
  setField("trab_horas", raw.trab_horas);
  setField("trab_modalidade", raw.trab_modalidade);
  setField("trab_tipo", raw.trab_tipo);
  setField("trab_turno", raw.trab_turno);
  for (let i = 0; i < F.TRAB_ITEMS.length; i++) setRadio(`trab_${i}`, raw[`trab_${i}`]);
  setField("trab_estresse_geral", raw.trab_estresse_geral);
  setField("objetivo", raw.objetivo);
  setField("tempo_treino_previo", raw.tempo_treino_previo);

  resetMedicamentos(medicamentos || []);
}
