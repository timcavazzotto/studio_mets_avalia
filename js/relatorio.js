// relatorio.js — Classificações por domínio (porte de report.py) + radar SVG
// + geração da view HTML imprimível do relatório.

export function classifyParq(respostasSim) {
  if (respostasSim === null || respostasSim === undefined) return null;
  return respostasSim === 0 ? "Liberado(a)" : `${respostasSim} SIM — orientação adicional`;
}

export function classifySedentarismo(horas) {
  if (horas === null || horas === undefined) return null;
  if (horas >= 8) return "Elevado";
  if (horas >= 6) return "Moderado";
  return "Aceitável";
}

const DASS_CUTS = { depressao: [9, 13, 20, 27], ansiedade: [7, 9, 14, 19], estresse: [14, 18, 25, 33] };
export function classifyDass(score, campo) {
  if (score === null || score === undefined) return null;
  const c = DASS_CUTS[campo];
  if (score <= c[0]) return "Normal";
  if (score <= c[1]) return "Leve";
  if (score <= c[2]) return "Moderado";
  if (score <= c[3]) return "Severo";
  return "Extremamente severo";
}

export function classifyNordic(regioesLimitacao) {
  if (regioesLimitacao === null || regioesLimitacao === undefined) return null;
  return regioesLimitacao > 0 ? "Com limitação funcional" : "Sem limitação funcional";
}

export function classifyDieta(score) {
  if (score === null || score === undefined) return null;
  if (score >= 15) return "Padrão favorável";
  if (score >= 5) return "Padrão intermediário";
  return "Padrão de atenção";
}

export function classifyImc(imc) {
  if (imc === null || imc === undefined) return null;
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Eutrofia";
  if (imc < 30) return "Sobrepeso";
  return "Obesidade";
}

export function classifyLsns(score) {
  if (score === null || score === undefined) return null;
  return score < 12 ? "Risco de isolamento social" : "Rede social adequada";
}

export function classifyAuditc(score, sexo) {
  if (score === null || score === undefined) return null;
  const cutoff = sexo === "M" ? 4 : 3;
  return score >= cutoff ? "Uso de risco" : "Baixo risco";
}

export function classifyTrabalho(score) {
  if (score === null || score === undefined) return null;
  if (score >= 10) return "Tensão elevada";
  if (score >= 6) return "Tensão moderada";
  return "Tensão baixa";
}

export function classifyPreensaoAssimetria(diferencaPct) {
  if (diferencaPct === null || diferencaPct === undefined) return null;
  return diferencaPct >= 10 ? "Possível assimetria — considerar avaliação" : "Dentro do esperado";
}

export function classifyOssea(fatoresRisco) {
  if (fatoresRisco === null || fatoresRisco === undefined) return null;
  return fatoresRisco >= 2 ? "Considerar densitometria óssea" : "Baixo nº de fatores de risco";
}

export function classifyAfmvLazer(afmvLazer, afvLazer) {
  if (afmvLazer === null || afmvLazer === undefined) return null;
  const atende = afmvLazer >= 150 || (afvLazer !== null && afvLazer !== undefined && afvLazer >= 75);
  return atende ? "Atende a recomendação (bom)" : "Não atende a recomendação";
}

export function getClassificacao(tabela, campo, bloco, sexo) {
  bloco = bloco || {};
  if (tabela === "par_q") return classifyParq(bloco.respostas_sim);
  if (tabela === "ipaq" && campo === "afmv_lazer_min") return classifyAfmvLazer(bloco.afmv_lazer_min, bloco.afv_lazer_min);
  if (tabela === "ipaq") return null; // volume total é só informativo, sem classificação
  if (tabela === "sedentarismo") return classifySedentarismo(bloco.horas_dia_media);
  if (tabela === "sono") return bloco.classificacao || null;
  if (tabela === "dass21") return classifyDass(bloco[campo], campo);
  if (tabela === "nordic") return classifyNordic(bloco.regioes_limitacao);
  if (tabela === "dieta") return classifyDieta(bloco.escore_liquido);
  if (tabela === "antropometria" && campo === "imc") return classifyImc(bloco.imc);
  if (tabela === "antropometria" && campo === "diferenca_preensao_pct") return classifyPreensaoAssimetria(bloco.diferenca_preensao_pct);
  if (tabela === "lsns6") return classifyLsns(bloco.escore_total);
  if (tabela === "auditc") return classifyAuditc(bloco.escore_total, sexo);
  if (tabela === "trabalho") return classifyTrabalho(bloco.escore_tensao);
  if (tabela === "saude_ossea") return classifyOssea(bloco.fatores_risco);
  return null;
}

export const DOMAIN_ROWS = [
  ["Prontidão p/ exercício (PAR-Q+)", "par_q", "respostas_sim"],
  ["Atividade física — volume total (MET-min/sem, todos os domínios)", "ipaq", "met_min_semana"],
  ["Atividade física — AFMV tempo livre (min/sem)", "ipaq", "afmv_lazer_min"],
  ["Sedentarismo (SBQ)", "sedentarismo", "horas_dia_media"],
  ["Sono (instrumento interno)", "sono", "escore_total"],
  ["Depressão (DASS-21)", "dass21", "depressao"],
  ["Ansiedade (DASS-21)", "dass21", "ansiedade"],
  ["Estresse (DASS-21)", "dass21", "estresse"],
  ["Dor — regiões/12m (Nórdico)", "nordic", "regioes_12m"],
  ["Padrão alimentar (screener)", "dieta", "escore_liquido"],
  ["IMC (kg/m2)", "antropometria", "imc"],
  ["Relação cintura/quadril", "antropometria", "rcq"],
  ["Preensão manual — direita (kgf)", "antropometria", "preensao_direita"],
  ["Preensão manual — esquerda (kgf)", "antropometria", "preensao_esquerda"],
  ["Diferença entre mãos (%)", "antropometria", "diferenca_preensao_pct"],
  ["Conexão social (LSNS-6)", "lsns6", "escore_total"],
  ["Uso de álcool (AUDIT-C)", "auditc", "escore_total"],
  ["Tensão ocupacional (trabalho)", "trabalho", "escore_tensao"],
];

const MENOR_MELHOR = new Set(["par_q", "sedentarismo", "sono", "dass21", "nordic", "auditc", "trabalho"]);

function fmt(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number" && !Number.isInteger(v)) return v.toFixed(1);
  return String(v);
}

function deltaSymbol(atual, anterior, menorEhMelhor) {
  if (atual === null || atual === undefined || anterior === null || anterior === undefined) return "";
  const diff = atual - anterior;
  if (Math.abs(diff) < 1e-9) return "→";
  const melhorou = menorEhMelhor ? diff < 0 : diff > 0;
  return melhorou ? "↑ melhora" : "↓ atenção";
}

// ---------------- Radar (SVG) ----------------
function clip100(v) { return Math.max(0, Math.min(100, v)); }

export function computeRadarScores(r) {
  const s = {};
  const ipaq = r.ipaq || {};
  s["Atividade Física"] = ipaq.afmv_lazer_min != null ? clip100((ipaq.afmv_lazer_min / 300) * 100) : null;
  const sed = r.sedentarismo || {};
  s["Sedentarismo (inv.)"] = sed.horas_dia_media != null ? clip100(100 - ((sed.horas_dia_media - 4) / 8) * 100) : null;
  const sono = r.sono || {};
  s["Sono (inv.)"] = sono.escore_total != null ? clip100(100 - (sono.escore_total / 24) * 100) : null;
  const dass = r.dass21 || {};
  if (dass.depressao != null && dass.ansiedade != null && dass.estresse != null) {
    const media = (dass.depressao + dass.ansiedade + dass.estresse) / 3;
    s["Saúde Mental (inv.)"] = clip100(100 - (media / 42) * 100);
  } else s["Saúde Mental (inv.)"] = null;
  const nord = r.nordic || {};
  s["Dor/Queixas (inv.)"] = nord.regioes_12m != null ? clip100(100 - (nord.regioes_12m / 9) * 100) : null;
  const dieta = r.dieta || {};
  s["Alimentação"] = dieta.escore_liquido != null ? clip100(((dieta.escore_liquido + 20) / 50) * 100) : null;
  const antro = r.antropometria || {};
  s["Composição Corporal"] = antro.imc != null ? clip100(100 - Math.abs(antro.imc - 22) * 5) : null;
  const lsns = r.lsns6 || {};
  s["Conexão Social"] = lsns.escore_total != null ? clip100((lsns.escore_total / 30) * 100) : null;
  const audit = r.auditc || {};
  s["Substâncias (inv.)"] = audit.escore_total != null ? clip100(100 - (audit.escore_total / 12) * 100) : null;
  const trab = r.trabalho || {};
  s["Trabalho (inv.)"] = trab.escore_tensao != null ? clip100(100 - (trab.escore_tensao / 15) * 100) : null;
  return s;
}

const RADAR_COLORS = ["#30475e", "#b5651d", "#5a8a99", "#8a3f6b"];

function multilineLabel(x, y, text, anchor, fontSize = 12.5, lineHeight = 14) {
  const words = text.split(" ");
  const n = words.length;
  const startDy = -((n - 1) / 2) * lineHeight;
  const tspans = words.map((w, i) => `<tspan x="${x}" dy="${i === 0 ? startDy : lineHeight}">${w}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-size="${fontSize}" fill="#1f2933" text-anchor="${anchor}">${tspans}</text>`;
}

/** seriesList: [{label, scores}] — 1 ou mais séries (avaliações) a sobrepor no mesmo radar. */
export function buildRadarSVG(seriesList) {
  const labels = Object.keys(seriesList[0].scores);
  const N = labels.length;
  const W = 820, H = 760, cx = 410, cy = 390, R = 210;
  const angleFor = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;

  let grid = "";
  [20, 40, 60, 80, 100].forEach((g) => {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = angleFor(i);
      const rr = R * (g / 100);
      pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`);
    }
    grid += `<polygon points="${pts.join(" ")}" fill="none" stroke="#cccccc" stroke-width="1"/>`;
  });

  let axes = "", labelsSvg = "";
  for (let i = 0; i < N; i++) {
    const a = angleFor(i);
    const x2 = cx + R * Math.cos(a), y2 = cy + R * Math.sin(a);
    axes += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#cccccc" stroke-width="1"/>`;
    const lx = cx + (R + 42) * Math.cos(a), ly = cy + (R + 42) * Math.sin(a);
    const anchor = Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle";
    labelsSvg += multilineLabel(lx, ly, labels[i], anchor);
  }

  let polys = "";
  seriesList.forEach((serie, si) => {
    const color = RADAR_COLORS[si % RADAR_COLORS.length];
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = angleFor(i);
      const v = serie.scores[labels[i]] || 0;
      const rr = R * (v / 100);
      pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`);
    }
    polys += `<polygon points="${pts.join(" ")}" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="2.5"/>`;
  });

  let legend = "";
  seriesList.forEach((serie, si) => {
    const color = RADAR_COLORS[si % RADAR_COLORS.length];
    const y = 24 + si * 18;
    legend += `<rect x="${W - 150}" y="${y - 10}" width="12" height="12" fill="${color}"/>
      <text x="${W - 132}" y="${y}" font-size="12" fill="#1f2933">${serie.label}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="white"/>
    <text x="${cx}" y="20" font-size="15" fill="#1f2933" text-anchor="middle">Perfil de Estilo de Vida</text>
    ${grid}${axes}${polys}${labelsSvg}${legend}
  </svg>`;
}

// ---------------- Tabela de achados (HTML) ----------------
export function buildAchadosTableHTML(atual, anterior, sexo) {
  let rows = "";
  for (const [label, tabela, campo] of DOMAIN_ROWS) {
    const blocoAtual = atual[tabela] || {};
    const blocoAnt = (anterior && anterior[tabela]) || {};
    const vAtual = blocoAtual[campo];
    const vAnt = anterior ? blocoAnt[campo] : null;
    const clsAtual = getClassificacao(tabela, campo, blocoAtual, sexo);

    let variacao = "";
    if (anterior) {
      if (tabela === "antropometria" && campo === "imc" && vAtual != null && vAnt != null) {
        const dA = Math.abs(vAtual - 21.7), dP = Math.abs(vAnt - 21.7);
        variacao = Math.abs(dA - dP) < 1e-9 ? "→" : dA < dP ? "↑ melhora" : "↓ atenção";
      } else if (tabela === "antropometria" && campo === "rcq") {
        variacao = vAtual != null && vAnt != null ? deltaSymbol(vAtual, vAnt, true) : "";
      } else {
        variacao = deltaSymbol(vAtual, vAnt, MENOR_MELHOR.has(tabela));
      }
    }

    rows += `<tr><td>${label}</td><td>${fmt(vAtual)}</td><td>${clsAtual || "—"}</td>
      <td>${anterior ? fmt(vAnt) : "—"}</td><td>${variacao}</td></tr>`;
  }
  return `<table class="tbl">
    <tr><th>Domínio</th><th>Atual</th><th>Classificação Atual</th><th>Anterior</th><th>Variação</th></tr>
    ${rows}
  </table>`;
}
