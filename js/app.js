// app.js — Ponto de entrada da aplicação (login, abas, orquestração geral)
import { loginComGoogle, logout, onAuth, addPaciente, listPacientes, saveAvaliacao, getHistorico, getUltimaAvaliacao } from "./db.js";
import { computeScores } from "./formulario.js";
import { generateFormHTML, getRawValues, getMedicamentos, resetMedicamentos, preencherAPartirDe } from "./ui-form.js";
import { abrirRelatorio } from "./relatorio-view.js";

const $ = (sel) => document.querySelector(sel);

// ---------------- Autenticação ----------------
$("#btn-login-google").addEventListener("click", async () => {
  $("#login-erro").textContent = "";
  try {
    await loginComGoogle();
  } catch (err) {
    if (err.code === "auth/popup-closed-by-user") return;
    $("#login-erro").textContent = "Não foi possível entrar. Verifique se este Google é o autorizado.";
    console.error(err);
  }
});

$("#btn-logout").addEventListener("click", () => logout());

// E-mail autorizado a usar o sistema (ajuste para o seu Google real).
// Isso é só uma camada de conveniência/UX — a segurança de verdade está
// nas Regras de Segurança do Firestore (veja README.md).
const EMAIL_AUTORIZADO = "consultoriacvzt@gmail.com";

onAuth((user) => {
  if (user && user.email !== EMAIL_AUTORIZADO) {
    $("#login-erro").textContent = `A conta ${user.email} não está autorizada a acessar este sistema.`;
    logout();
    return;
  }
  if (user) {
    $("#login-screen").classList.add("hidden");
    $("#app-screen").classList.remove("hidden");
    inicializarApp();
  } else {
    $("#login-screen").classList.remove("hidden");
    $("#app-screen").classList.add("hidden");
  }
});

// ---------------- Abas ----------------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
    btn.classList.add("active");
    $(`#${btn.dataset.tab}`).classList.remove("hidden");
  });
});

let appInicializado = false;
let pacientesCache = [];

async function inicializarApp() {
  if (appInicializado) return;
  appInicializado = true;

  // monta o formulário completo uma única vez
  $("#form-container").innerHTML = generateFormHTML();
  $("#data-avaliacao").value = new Date().toISOString().slice(0, 10);

  await refreshPacientes();
}

async function refreshPacientes() {
  pacientesCache = await listPacientes();
  const tbody = $("#tabela-pacientes tbody");
  tbody.innerHTML = pacientesCache.map((p) =>
    `<tr><td>${p.nome}</td><td>${p.data_nascimento || ""}</td><td>${p.sexo || ""}</td><td>${p.objetivo_inicial || ""}</td></tr>`
  ).join("");

  const options = pacientesCache.map((p) => `<option value="${p.id}">${p.nome}</option>`).join("");
  $("#select-paciente-nova").innerHTML = `<option value="">Selecione...</option>` + options;
  $("#select-paciente-hist").innerHTML = `<option value="">Selecione...</option>` + options;
}

// ---------------- Aba Pacientes ----------------
$("#form-novo-paciente").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = $("#pac-nome").value.trim();
  if (!nome) return;
  await addPaciente({
    nome,
    data_nascimento: $("#pac-nascimento").value || null,
    sexo: $("#pac-sexo").value || null,
    objetivo_inicial: $("#pac-objetivo").value || null,
  });
  e.target.reset();
  await refreshPacientes();
  alert("Paciente cadastrado.");
});

// ---------------- Aba Nova Avaliação ----------------
$("#btn-carregar-anterior").addEventListener("click", async () => {
  const pacienteId = $("#select-paciente-nova").value;
  if (!pacienteId) { alert("Selecione o paciente primeiro."); return; }
  const ultima = await getUltimaAvaliacao(pacienteId);
  if (!ultima) { alert("Este paciente ainda não possui avaliações anteriores."); return; }
  preencherAPartirDe(ultima);
  alert(`Dados da avaliação nº ${ultima.numero_avaliacao} (${ultima.data_avaliacao}) carregados (objetivo e medicamentos).`);
});

$("#select-paciente-nova").addEventListener("change", () => {
  resetMedicamentos([]);
});

$("#btn-calcular-salvar").addEventListener("click", async () => {
  const pacienteId = $("#select-paciente-nova").value;
  const dataAvaliacao = $("#data-avaliacao").value;
  if (!pacienteId) { alert("Selecione o paciente."); return; }
  if (!dataAvaliacao) { alert("Informe a data da avaliação."); return; }

  const raw = getRawValues();
  const scores = computeScores(raw);
  const dadosGerais = { data_avaliacao: dataAvaliacao, objetivo: raw.objetivo, tempo_treino_previo: raw.tempo_treino_previo };

  const resumo = `IPAQ: ${scores.ipaq.classificacao} (${scores.ipaq.met_min_semana} MET-min/sem)
Sedentarismo: ${scores.sedentarismo.horas_dia_media} h/dia
Sono: ${scores.sono.classificacao || "não preenchido"}
DASS-21: D=${scores.dass21.depressao ?? "--"} A=${scores.dass21.ansiedade ?? "--"} S=${scores.dass21.estresse ?? "--"}
IMC: ${scores.antropometria.imc ?? "--"}`;

  if (!confirm(`Resumo da avaliação:\n\n${resumo}\n\nSalvar esta avaliação?`)) return;

  try {
    await saveAvaliacao(pacienteId, dadosGerais, scores, getMedicamentos());
    $("#status-nova").textContent = "Avaliação salva com sucesso.";
    alert("Avaliação salva com sucesso. Você já pode gerar o relatório na aba Histórico/Relatório.");
  } catch (err) {
    console.error(err);
    alert("Falha ao salvar: " + err.message);
  }
});

// ---------------- Aba Histórico / Relatório ----------------
let historicoCache = [];
let pacienteAtualCache = null;

$("#btn-carregar-historico").addEventListener("click", async () => {
  const pacienteId = $("#select-paciente-hist").value;
  if (!pacienteId) { alert("Selecione o paciente."); return; }
  historicoCache = await getHistorico(pacienteId);
  pacienteAtualCache = pacientesCache.find((p) => p.id === pacienteId);

  const tbody = $("#tabela-historico tbody");
  tbody.innerHTML = historicoCache.map((h) =>
    `<tr><td>${h.numero_avaliacao}</td><td>${h.data_avaliacao}</td><td>${h.ipaq?.met_min_semana ?? ""}</td><td>${h.sono?.escore_total ?? ""}</td><td>${h.dass21?.depressao ?? ""}</td></tr>`
  ).join("");
});

$("#btn-gerar-relatorio").addEventListener("click", () => {
  if (!historicoCache.length) { alert("Carregue o histórico do paciente primeiro."); return; }
  abrirRelatorio(pacienteAtualCache, historicoCache);
});
