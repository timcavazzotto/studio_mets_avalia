// app.js — Ponto de entrada da aplicação (login, abas, orquestração geral)
import { loginComGoogle, logout, onAuth, addPaciente, listPacientes, saveAvaliacao, updateAvaliacao, getHistorico, getUltimaAvaliacao, deleteAvaliacao } from "./db.js";
import { computeScores } from "./formulario.js";
import { generateFormHTML, getRawValues, getMedicamentos, resetMedicamentos, preencherAPartirDe, preencherFormularioCompleto, limparFormulario } from "./ui-form.js";
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

// E-mails autorizados a usar o sistema (ajuste para os seus Google reais).
// Isso é só uma camada de conveniência/UX — a segurança de verdade está
// nas Regras de Segurança do Firestore (veja README.md) — as duas listas
// precisam ficar iguais.
const EMAILS_AUTORIZADOS = [
  "consultoriacvzt@gmail.com",
  "thimf178@gmail.com",
];

onAuth((user) => {
  if (user && !EMAILS_AUTORIZADOS.includes(user.email)) {
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
  try {
    pacientesCache = await listPacientes();
  } catch (err) {
    console.error(err);
    alert("Falha ao carregar pacientes: " + err.message + "\n\n(Código: " + (err.code || "desconhecido") + ")");
    pacientesCache = [];
  }
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
  try {
    await addPaciente({
      nome,
      data_nascimento: $("#pac-nascimento").value || null,
      sexo: $("#pac-sexo").value || null,
      objetivo_inicial: $("#pac-objetivo").value || null,
    });
    e.target.reset();
    await refreshPacientes();
    alert("Paciente cadastrado.");
  } catch (err) {
    console.error(err);
    alert("Falha ao cadastrar paciente: " + err.message + "\n\n(Código: " + (err.code || "desconhecido") + ")");
  }
});

// ---------------- Aba Nova Avaliação ----------------
$("#btn-carregar-anterior").addEventListener("click", async () => {
  const pacienteId = $("#select-paciente-nova").value;
  if (!pacienteId) { alert("Selecione o paciente primeiro."); return; }
  try {
    const ultima = await getUltimaAvaliacao(pacienteId);
    if (!ultima) { alert("Este paciente ainda não possui avaliações anteriores."); return; }
    preencherAPartirDe(ultima);
    alert(`Dados da avaliação nº ${ultima.numero_avaliacao} (${ultima.data_avaliacao}) carregados (objetivo e medicamentos).`);
  } catch (err) {
    console.error(err);
    alert("Falha ao carregar avaliação anterior: " + err.message);
  }
});

$("#select-paciente-nova").addEventListener("change", () => {
  sairModoEdicao();
  limparFormulario();
});

// estado de edição: quando preenchido, "Calcular e Salvar" atualiza essa avaliação
// em vez de criar uma nova
let avaliacaoEmEdicao = null; // { pacienteId, avaliacaoId, numero_avaliacao }

function sairModoEdicao() {
  avaliacaoEmEdicao = null;
  $("#btn-cancelar-edicao").classList.add("hidden");
  $("#aviso-edicao").classList.add("hidden");
  $("#btn-calcular-salvar").textContent = "Calcular e Salvar Avaliação";
}

$("#btn-cancelar-edicao").addEventListener("click", () => {
  sairModoEdicao();
  limparFormulario();
  $("#data-avaliacao").value = new Date().toISOString().slice(0, 10);
});

$("#btn-calcular-salvar").addEventListener("click", async () => {
  const pacienteId = $("#select-paciente-nova").value;
  const dataAvaliacao = $("#data-avaliacao").value;
  if (!pacienteId) { alert("Selecione o paciente."); return; }
  if (!dataAvaliacao) { alert("Informe a data da avaliação."); return; }
  if (avaliacaoEmEdicao && avaliacaoEmEdicao.pacienteId !== pacienteId) {
    alert("Você está editando uma avaliação de outro paciente. Clique em \"Cancelar edição\" antes de trocar de paciente.");
    return;
  }

  const raw = getRawValues();
  const scores = computeScores(raw);
  const dadosGerais = { data_avaliacao: dataAvaliacao, objetivo: raw.objetivo, tempo_treino_previo: raw.tempo_treino_previo };

  const resumo = `IPAQ: ${scores.ipaq.classificacao} (${scores.ipaq.met_min_semana} MET-min/sem)
Sedentarismo: ${scores.sedentarismo.horas_dia_media} h/dia
Sono: ${scores.sono.classificacao || "não preenchido"}
DASS-21: D=${scores.dass21.depressao ?? "--"} A=${scores.dass21.ansiedade ?? "--"} S=${scores.dass21.estresse ?? "--"}
IMC: ${scores.antropometria.imc ?? "--"}`;

  const acao = avaliacaoEmEdicao ? "ATUALIZAR" : "salvar";
  if (!confirm(`Resumo da avaliação:\n\n${resumo}\n\n${avaliacaoEmEdicao ? "Salvar as alterações desta avaliação (irá sobrescrever a versão antiga)?" : "Salvar esta avaliação?"}`)) return;

  try {
    if (avaliacaoEmEdicao) {
      await updateAvaliacao(pacienteId, avaliacaoEmEdicao.avaliacaoId, dadosGerais, scores, getMedicamentos(), raw, avaliacaoEmEdicao.numero_avaliacao);
      $("#status-nova").textContent = "Avaliação atualizada com sucesso.";
      alert("Avaliação atualizada com sucesso.");
      sairModoEdicao();
    } else {
      await saveAvaliacao(pacienteId, dadosGerais, scores, getMedicamentos(), raw);
      $("#status-nova").textContent = "Avaliação salva com sucesso.";
      alert("Avaliação salva com sucesso. Você já pode gerar o relatório na aba Histórico/Relatório.");
    }
  } catch (err) {
    console.error(err);
    alert(`Falha ao ${avaliacaoEmEdicao ? "atualizar" : "salvar"}: ` + err.message);
  }
});

// ---------------- Aba Histórico / Relatório ----------------
let historicoCache = [];
let pacienteAtualCache = null;

$("#btn-carregar-historico").addEventListener("click", async () => {
  const pacienteId = $("#select-paciente-hist").value;
  if (!pacienteId) { alert("Selecione o paciente."); return; }
  try {
    historicoCache = await getHistorico(pacienteId);
    pacienteAtualCache = pacientesCache.find((p) => p.id === pacienteId);
    renderTabelaHistorico(pacienteId);
  } catch (err) {
    console.error(err);
    alert("Falha ao carregar histórico: " + err.message);
  }
});

function renderTabelaHistorico(pacienteId) {
  const tbody = $("#tabela-historico tbody");
  tbody.innerHTML = historicoCache.map((h) => `<tr>
    <td>${h.numero_avaliacao}</td><td>${h.data_avaliacao}</td>
    <td>${h.ipaq?.met_min_semana ?? ""}</td><td>${h.sono?.escore_total ?? ""}</td><td>${h.dass21?.depressao ?? ""}</td>
    <td>
      <button type="button" class="btn-acao" data-editar="${h.id}">Editar</button>
      <button type="button" class="btn-acao excluir" data-excluir="${h.id}">Excluir</button>
    </td>
  </tr>`).join("");

  tbody.querySelectorAll("[data-editar]").forEach((btn) => {
    btn.addEventListener("click", () => iniciarEdicaoAvaliacao(pacienteId, btn.dataset.editar));
  });
  tbody.querySelectorAll("[data-excluir]").forEach((btn) => {
    btn.addEventListener("click", () => excluirAvaliacao(pacienteId, btn.dataset.excluir));
  });
}

function iniciarEdicaoAvaliacao(pacienteId, avaliacaoId) {
  const av = historicoCache.find((h) => h.id === avaliacaoId);
  if (!av) return;
  if (!av.dados_brutos) {
    alert("Esta avaliação foi salva antes da função de edição existir, então não dá para reabrir os campos individuais aqui. Você ainda pode excluí-la e lançar de novo, se precisar corrigir algo.");
    return;
  }

  // muda para a aba Nova Avaliação, seleciona o paciente e preenche tudo
  document.querySelector('.tab-btn[data-tab="tab-nova"]').click();
  $("#select-paciente-nova").value = pacienteId;
  $("#data-avaliacao").value = av.data_avaliacao;
  preencherFormularioCompleto(av.dados_brutos, av.medicamentos);

  avaliacaoEmEdicao = { pacienteId, avaliacaoId: av.id, numero_avaliacao: av.numero_avaliacao };
  $("#btn-cancelar-edicao").classList.remove("hidden");
  $("#btn-calcular-salvar").textContent = "Salvar Alterações";
  const aviso = $("#aviso-edicao");
  aviso.textContent = `Editando a avaliação nº ${av.numero_avaliacao} (${av.data_avaliacao}) — ao salvar, esta avaliação será atualizada (não cria uma nova).`;
  aviso.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirAvaliacao(pacienteId, avaliacaoId) {
  const av = historicoCache.find((h) => h.id === avaliacaoId);
  if (!confirm(`Excluir permanentemente a avaliação nº ${av?.numero_avaliacao} (${av?.data_avaliacao})? Esta ação não pode ser desfeita.`)) return;
  try {
    await deleteAvaliacao(pacienteId, avaliacaoId);
    historicoCache = historicoCache.filter((h) => h.id !== avaliacaoId);
    renderTabelaHistorico(pacienteId);
    alert("Avaliação excluída.");
  } catch (err) {
    console.error(err);
    alert("Falha ao excluir: " + err.message);
  }
}

$("#btn-gerar-relatorio").addEventListener("click", () => {
  if (!historicoCache.length) { alert("Carregue o histórico do paciente primeiro."); return; }
  abrirRelatorio(pacienteAtualCache, historicoCache);
});
