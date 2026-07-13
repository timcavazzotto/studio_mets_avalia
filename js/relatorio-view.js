// relatorio-view.js — Monta o relatório em uma nova aba, pronta para
// "Imprimir / Salvar como PDF" (Ctrl+P no navegador).
import { computeRadarScores, buildRadarSVG, buildAchadosTableHTML, classifyOssea } from "./relatorio.js";

const PROFISSIONAL_NOME = "Timothy Cavazzotto, PhD";
const PROFISSIONAL_CREDENCIAL = "CREF 044011-PR";
const STUDIO_NOME = "METS Personal Studio";
const STUDIO_INSTAGRAM = "@studio.mets";
const STUDIO_TELEFONE = "(43) 996135268";
const STUDIO_ENDERECO = "R. Marechal Floriano, 424, Trianon – Guarapuava-PR";
const LOGO_URL = new URL("../assets/logo_mets.png", import.meta.url).href;

function calcIdade(nascimentoStr, dataStr) {
  if (!nascimentoStr || !dataStr) return null;
  const nasc = new Date(nascimentoStr), ref = new Date(dataStr);
  let idade = ref.getFullYear() - nasc.getFullYear();
  const m = ref.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < nasc.getDate())) idade--;
  return idade;
}

function medsTableHTML(meds) {
  if (!meds || meds.length === 0) return `<p class="muted">Nenhum medicamento de uso contínuo relatado.</p>`;
  const rows = meds.map((m) => `<tr><td>${m.nome || ""}</td><td>${m.dose || ""}</td><td>${m.frequencia || ""}</td><td>${m.motivo || ""}</td><td>${m.tempo_uso || ""}</td></tr>`).join("");
  return `<table class="tbl"><tr><th>Medicamento</th><th>Dose</th><th>Frequência</th><th>Motivo</th><th>Tempo de uso</th></tr>${rows}</table>`;
}

function biomarcadoresTableHTML(bio) {
  const entries = Object.entries(bio || {});
  if (entries.length === 0) return "";
  const rows = entries.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
  return `<h2 class="secao">Exames e Biomarcadores Sanguíneos (opcional)</h2>
    <table class="tbl"><tr><th>Marcador</th><th>Valor</th></tr>${rows}</table>
    <p class="muted small">Referências variam por laboratório — usar o laudo original como fonte primária.</p>`;
}

function osseaHTML(ossea) {
  if (!ossea || ossea.fatores_risco === null || ossea.fatores_risco === undefined) return "";
  const cls = classifyOssea(ossea.fatores_risco);
  let html = `<h2 class="secao">Saúde Óssea (opcional)</h2>
    <p>Fatores de risco identificados: ${ossea.fatores_risco}/7 — ${cls}</p>`;
  if (ossea.dxa_coluna || ossea.dxa_femur) {
    html += `<p>T-score DXA: coluna ${ossea.dxa_coluna ?? "—"} | fêmur ${ossea.dxa_femur ?? "—"}</p>`;
  }
  return html;
}

/** paciente: {id, nome, data_nascimento, sexo, ...}
 *  historico: lista de avaliações (ordem cronológica) já carregada do Firestore
 *  modoComparacao: "anterior" (padrão, avaliação imediatamente anterior) ou
 *                  "primeira" (compara sempre com a 1ª avaliação — baseline) */
export function abrirRelatorio(paciente, historico, modoComparacao = "anterior") {
  const atual = historico[historico.length - 1];
  let anterior = null;
  if (historico.length >= 2) {
    anterior = modoComparacao === "primeira" ? historico[0] : historico[historico.length - 2];
  }
  const sexo = paciente.sexo;
  const idade = calcIdade(paciente.data_nascimento, atual.data_avaliacao);

  const comparar = anterior ? [anterior, atual] : [atual];
  const series = comparar.map((h) => ({ label: h.data_avaliacao, scores: computeRadarScores(h) }));
  const radarSVG = buildRadarSVG(series);

  const rotuloComparacao = modoComparacao === "primeira" ? "Primeira avaliação (baseline)" : "Avaliação anterior";

  const achadosHTML = buildAchadosTableHTML(atual, anterior, sexo);
  const medsHTML = medsTableHTML(atual.medicamentos);
  const bioHTML = biomarcadoresTableHTML(atual.biomarcadores);
  const osseaHtmlStr = osseaHTML(atual.saude_ossea);

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Relatório — ${paciente.nome}</title>
<style>
  @page { margin: 2cm 1.5cm; }
  body{font-family:"Segoe UI",Calibri,Arial,sans-serif;color:#1f2933;font-size:13px;max-width:900px;margin:0 auto;padding:20px;}
  header.doc-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #30475e;padding-bottom:10px;margin-bottom:20px;}
  header.doc-header img{height:55px;}
  .prof{text-align:right;}
  .prof .nome{font-weight:bold;color:#30475e;font-size:15px;}
  .prof .cred{color:#5a6b7a;font-size:12px;}
  h1.titulo{color:#30475e;text-align:center;font-size:26px;margin:10px 0 4px;}
  .subtitulo{text-align:center;color:#5a6b7a;font-style:italic;margin-bottom:16px;}
  table.info{width:100%;border-collapse:collapse;margin-bottom:20px;}
  table.info td{border:1px solid #d7dee4;padding:6px 10px;}
  h2.secao{color:#30475e;border-bottom:1px solid #30475e;padding-bottom:4px;margin-top:28px;font-size:16px;}
  .tbl{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px;}
  .tbl th,.tbl td{border:1px solid #d7dee4;padding:6px 8px;text-align:left;}
  .tbl th{background:#f2f5f6;}
  .muted{color:#5a6b7a;}
  .small{font-size:11px;}
  .radar-wrap{text-align:center;margin:10px 0;overflow-x:auto;}
  .radar-wrap svg{max-width:100%;height:auto;}
  @media (max-width: 700px){
    body{padding:12px;font-size:12.5px;}
    header.doc-header{flex-direction:column;align-items:center;text-align:center;gap:8px;}
    .prof{text-align:center;}
    h1.titulo{font-size:20px;}
    table.info{display:block;overflow-x:auto;white-space:nowrap;}
    .tbl{display:block;overflow-x:auto;white-space:nowrap;}
  }
  @media print{
    .radar-wrap{overflow-x:visible;}
    table.info, .tbl{display:table;white-space:normal;}
  }
  footer.doc-footer{background:#30475e;color:white;text-align:center;padding:10px;margin-top:30px;font-size:11px;}
  footer.doc-footer .nome{font-weight:bold;font-size:12px;}
  .interp-box{border:1px dashed #b7c0c7;padding:10px;font-style:italic;color:#5a6b7a;margin-top:8px;}
  @media print { .no-print{display:none;} }
</style>
</head><body>

<div class="no-print" style="text-align:center;margin-bottom:16px;">
  <button onclick="window.print()" style="padding:8px 16px;font-size:14px;">Imprimir / Salvar como PDF</button>
</div>

<header class="doc-header">
  <img src="${LOGO_URL}" alt="Mets Personal Studio">
  <div class="prof">
    <div class="nome">${PROFISSIONAL_NOME}</div>
    <div class="cred">${PROFISSIONAL_CREDENCIAL}</div>
  </div>
</header>

<h1 class="titulo">${paciente.nome}</h1>
<p class="subtitulo">Acompanhamento longitudinal — Medicina do Estilo de Vida</p>

<table class="info">
  <tr><td><b>Data de Nascimento:</b> ${paciente.data_nascimento || "—"}</td><td><b>Idade:</b> ${idade ?? "—"}</td></tr>
  <tr><td><b>Avaliação atual:</b> ${atual.data_avaliacao}</td><td><b>${anterior ? rotuloComparacao + ":" : "Avaliação anterior:"}</b> ${anterior ? anterior.data_avaliacao : "— (primeira avaliação)"}</td></tr>
</table>

<h2 class="secao">1. Perfil Visual — Radar Comparativo</h2>
<div class="radar-wrap">${radarSVG}</div>
<p class="muted small">Escala 0–100 (100 = melhor perfil). Domínios marcados "(inv.)" têm a direção do instrumento original invertida apenas para esta visualização — os escores clínicos originais estão na tabela abaixo.</p>

<h2 class="secao">2. Interpretação e Recomendações</h2>
<div class="interp-box">[Espaço para o profissional inserir a interpretação clínica dos achados abaixo, priorizando os domínios com variação negativa e ajustando a prescrição de treino.]</div>

<h2 class="secao">3. Achados por Domínio (escores clínicos originais)</h2>
${achadosHTML}

<h2 class="secao">4. Medicamentos de Uso Contínuo (avaliação atual)</h2>
${medsHTML}

${bioHTML}
${osseaHtmlStr}

<footer class="doc-footer">
  <div class="nome">${STUDIO_NOME}</div>
  <div>${STUDIO_INSTAGRAM} &nbsp;|&nbsp; ${STUDIO_TELEFONE}</div>
  <div>${STUDIO_ENDERECO}</div>
</footer>

</body></html>`;

  const win = window.open("", "_blank");
  win.document.open();
  win.document.write(html);
  win.document.close();
}
