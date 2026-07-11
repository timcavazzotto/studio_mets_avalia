// formulario.js — Especificação das perguntas e lógica de pontuação da
// Avaliação Integrada de Estilo de Vida. Porte fiel de formulario.py (Python).
// Módulo puro (sem dependência de DOM ou Firebase) para poder ser testado isoladamente.

export const PARQ_ITEMS = [
  "O médico já lhe disse que você possui uma condição cardíaca ou pressão arterial elevada?",
  "Você sente dor no peito em repouso, durante as atividades da vida diária ou quando faz esforço físico?",
  "Você perde o equilíbrio devido a tontura ou já perdeu a consciência nos últimos 12 meses?",
  "Você já recebeu diagnóstico de alguma outra condição crônica (diabetes, doença renal, respiratória, etc.)?",
  "Você atualmente toma medicamentos prescritos para alguma condição crônica?",
  "Você tem algum problema ósseo, articular ou de partes moles que possa ser agravado por exercício?",
  "O médico já recomendou que você só faça atividade física supervisionada por profissional de saúde?",
];

export const IPAQ_DOMINIOS = [
  ["trabalho", "Trabalho"],
  ["transporte", "Transporte (deslocamentos)"],
  ["domestico", "Tarefas domésticas / jardim"],
  ["lazer", "Tempo livre / lazer"],
];
export const IPAQ_INTENSIDADES = [
  ["vigorosa", "Atividade vigorosa (ex: carregar peso, corrida)", 8.0],
  ["moderada", "Atividade moderada (ex: carregar peso leve, ritmo médio)", 4.0],
  ["caminhada", "Caminhada", 3.3],
];

export const SBQ_ITEMS = [
  "Assistindo TV/streaming",
  "Usando computador/celular (fora do trabalho)",
  "Sentado(a) durante o trabalho/estudo",
  "Sentado(a) em transporte (carro, ônibus)",
  "Sentado(a) conversando/socializando",
  "Sentado(a) ouvindo música/sem fazer nada em especial",
];

export const SONO_ITEMS = [
  ["Quanto tempo você geralmente demora para pegar no sono, depois de deitar?",
    [[0, "Até 15 min"], [1, "16-30 min"], [2, "31-60 min"], [3, "Mais de 60 min"]]],
  ["Em média, quantas horas de sono você tem por noite?",
    [[0, "7h ou mais"], [1, "6-6h59"], [2, "5-5h59"], [3, "Menos de 5h"]]],
  ["Quantas vezes por semana você acorda durante a noite com dificuldade para voltar a dormir?",
    [[0, "Nunca"], [1, "1-2x/sem"], [2, "3-4x/sem"], [3, "Quase toda noite"]]],
  ["Com que frequência você acorda com a sensação de sono reparador/revigorante?",
    [[0, "Sempre"], [1, "Frequentemente"], [2, "Raramente"], [3, "Nunca"]]],
  ["Com que frequência você usa algum medicamento, chá ou substância para conseguir dormir?",
    [[0, "Nunca"], [1, "Menos de 1x/sem"], [2, "1-2x/sem"], [3, "3x/sem ou mais"]]],
  ["Com que frequência a sonolência durante o dia atrapalha suas atividades (trabalho, treino, dirigir)?",
    [[0, "Nunca"], [1, "Raramente"], [2, "Algumas vezes"], [3, "Frequentemente"]]],
  ["Como você classificaria a qualidade geral do seu sono nas últimas 4 semanas?",
    [[0, "Muito boa"], [1, "Boa"], [2, "Ruim"], [3, "Muito ruim"]]],
  ["Quantos dias por semana você mantém um horário regular para dormir e acordar?",
    [[0, "6-7 dias"], [1, "4-5 dias"], [2, "2-3 dias"], [3, "0-1 dia"]]],
];
export const SONO_APNEIA_OPTS = [[1, "Sim"], [0, "Não"], [2, "Não sei / nunca dormi acompanhado(a)"]];

// subescala: 'D' depressão, 'A' ansiedade, 'S' estresse
export const DASS_ITEMS = [
  ["Achei difícil me acalmar", "S"], ["Senti minha boca seca", "A"],
  ["Não consegui vivenciar nenhum sentimento positivo", "D"],
  ["Tive dificuldade em respirar em alguns momentos", "A"],
  ["Achei difícil ter iniciativa para fazer as coisas", "D"],
  ["Reagi de forma exagerada a situações", "S"], ["Senti tremores (ex.: nas mãos)", "A"],
  ["Senti que gastava muita energia com ansiedade", "S"],
  ["Preocupei-me com situações em que pudesse entrar em pânico", "A"],
  ["Senti que não tinha nada a esperar do futuro", "D"],
  ["Notei que ficava agitado(a) facilmente", "S"], ["Achei difícil relaxar", "S"],
  ["Senti-me triste e deprimido(a)", "D"],
  ["Fiquei intolerante com qualquer coisa que me impedisse de continuar o que estava fazendo", "S"],
  ["Senti que estava próximo(a) do pânico", "A"], ["Não consegui me entusiasmar com nada", "D"],
  ["Senti que não tinha valor como pessoa", "D"], ["Senti que estava muito irritável", "S"],
  ["Percebi alterações no batimento cardíaco na ausência de esforço físico", "A"],
  ["Senti medo sem motivo", "A"], ["Senti que a vida não tinha sentido", "D"],
];
export const DASS_OPTS = [[0, "0 - não se aplicou"], [1, "1 - um pouco"], [2, "2 - consideravelmente"], [3, "3 - muito/quase sempre"]];

export const NORDIC_REGIOES = [
  "Pescoço", "Ombros", "Parte superior das costas", "Cotovelos",
  "Parte inferior das costas (lombar)", "Punhos/mãos", "Quadril/coxas", "Joelhos", "Tornozelos/pés",
];

// [texto, é_protetor]
export const DIET_ITEMS = [
  ["Frutas inteiras (unidades/dia)", true],
  ["Porções de vegetais/legumes (porções/dia)", true],
  ["Porções de grãos integrais (porções/dia)", true],
  ["Litros de água (litros/dia)", true],
  ["Refeições feitas em casa (dias/semana)", true],
  ["Refrigerantes/bebidas açucaradas (doses/semana)", false],
  ["Alimentos ultraprocessados/fast-food (vezes/semana)", false],
  ["Doces/sobremesas industrializados (vezes/semana)", false],
  ["Frituras (vezes/semana)", false],
];

export const LSNS_ITEMS = [
  "Quantos parentes você vê ou fala pelo menos uma vez por mês?",
  "Com quantos parentes você se sente à vontade para falar sobre assuntos pessoais?",
  "Com quantos parentes você se sente próximo(a) a ponto de pedir ajuda?",
  "Quantos amigos você vê ou fala pelo menos uma vez por mês?",
  "Com quantos amigos você se sente à vontade para falar sobre assuntos pessoais?",
  "Com quantos amigos você se sente próximo(a) a ponto de pedir ajuda?",
];
export const LSNS_OPTS = [[0, "Nenhum"], [1, "1"], [2, "2-3"], [3, "4-8"], [4, "9+"]];

export const AUDIT_ITEMS = [
  ["Com que frequência você consome bebidas alcoólicas?",
    [[0, "Nunca"], [1, "Mensalmente ou menos"], [2, "2-4x/mês"], [3, "2-3x/semana"], [4, "4+x/semana"]]],
  ["Quantas doses de álcool você consome em um dia típico em que bebe?",
    [[0, "1-2"], [1, "3-4"], [2, "5-6"], [3, "7-9"], [4, "10+"]]],
  ["Com que frequência você consome 6 ou mais doses em uma única ocasião?",
    [[0, "Nunca"], [1, "Menos que mensal"], [2, "Mensalmente"], [3, "Semanalmente"], [4, "Diariamente/quase"]]],
];

export const OSSEA_ITEMS = [
  "Já teve alguma fratura após os 40 anos por trauma leve (queda da própria altura ou menos)?",
  "Tem histórico familiar (pai/mãe) de fratura de quadril?",
  "Está na menopausa ou teve menopausa precoce (antes dos 45 anos)?",
  "Já utilizou corticoide por mais de 3 meses consecutivos?",
  "Tem diagnóstico de doença que afeta o osso (ex.: doença celíaca, hipertireoidismo, artrite reumatoide)?",
  "Considera seu consumo diário de cálcio (leite/derivados, folhas verde-escuras) baixo?",
  "Fuma ou já fumou por longos períodos?",
];

// [texto, é_reverso]
export const TRAB_ITEMS = [
  ["Meu trabalho exige muito de mim em termos de ritmo e quantidade de tarefas.", false],
  ["Tenho pouca autonomia para decidir como realizar minhas tarefas.", false],
  ["Sinto pressão de prazos no trabalho.", false],
  ["Tenho apoio de colegas e/ou chefia quando preciso.", true],
  ["Levo preocupações do trabalho para casa ou para o fim de semana.", false],
];
export const TRAB_OPTS = [[0, "Nunca"], [1, "Raramente"], [2, "Às vezes"], [3, "Frequentemente"]];

export const BIOMARCADORES = [
  ["bio_glicemia", "Glicemia de jejum", "mg/dL"],
  ["bio_hba1c", "Hemoglobina glicada (HbA1c)", "%"],
  ["bio_ct", "Colesterol total", "mg/dL"],
  ["bio_ldl", "LDL-c", "mg/dL"],
  ["bio_hdl", "HDL-c", "mg/dL"],
  ["bio_tg", "Triglicerídeos", "mg/dL"],
  ["bio_pcr", "PCR ultrassensível", "mg/L"],
  ["bio_vitd", "Vitamina D (25-OH)", "ng/mL"],
  ["bio_tsh", "TSH", "µUI/mL"],
  ["bio_insulina", "Insulina de jejum", "µUI/mL"],
  ["bio_ferritina", "Ferritina", "ng/mL"],
  ["bio_acido_urico", "Ácido úrico", "mg/dL"],
];

// ---------------- Pontuação ----------------

function n(v) {
  if (v === null || v === undefined || v === "") return null;
  const f = Number(v);
  return Number.isNaN(f) ? null : f;
}

/** raw: objeto simples {field_id: valor_bruto} vindo dos widgets do formulário.
 * Retorna um objeto aninhado no mesmo formato usado por db.js para salvar no Firestore. */
export function computeScores(raw) {
  const out = {};

  // PAR-Q+
  let parqYes = 0;
  for (let i = 0; i < PARQ_ITEMS.length; i++) if (raw[`parq_${i}`] === 1) parqYes++;
  out.par_q = { respostas_sim: parqYes };

  // IPAQ
  let totalMet = 0, walkMin = 0, modMin = 0, vigMin = 0;
  for (const [domKey] of IPAQ_DOMINIOS) {
    for (const [intKey, , met] of IPAQ_INTENSIDADES) {
      const dias = n(raw[`ipaq_${domKey}_${intKey}_dias`]) || 0;
      const min = n(raw[`ipaq_${domKey}_${intKey}_min`]) || 0;
      const totalMin = dias * min;
      totalMet += met * totalMin;
      if (intKey === "caminhada") walkMin += totalMin;
      else if (intKey === "moderada") modMin += totalMin;
      else if (intKey === "vigorosa") vigMin += totalMin;
    }
  }
  let classif = "Baixo";
  if (totalMet >= 3000 || (vigMin > 0 && vigMin / 8 >= 3)) classif = "Alto";
  else if (totalMet >= 600) classif = "Moderado";
  out.ipaq = {
    met_min_semana: Math.round(totalMet), classificacao: classif,
    min_caminhada: walkMin, min_moderada: modMin, min_vigorosa: vigMin,
  };

  // Sedentarismo (SBQ)
  let sittingWeek = 0, sittingWeekend = 0;
  for (let i = 0; i < SBQ_ITEMS.length; i++) {
    sittingWeek += n(raw[`sbq_${i}_sem`]) || 0;
    sittingWeekend += n(raw[`sbq_${i}_fds`]) || 0;
  }
  const avgDaily = (sittingWeek * 5 + sittingWeekend * 2) / 7;
  out.sedentarismo = { horas_dia_media: Math.round(avgDaily * 10) / 10 };

  // Sono
  const sonoVals = SONO_ITEMS.map((_, i) => raw[`sono_${i}`]);
  if (sonoVals.every((v) => v !== null && v !== undefined)) {
    const sonoTotal = sonoVals.reduce((a, b) => a + b, 0);
    let sonoLabel;
    if (sonoTotal >= 16) sonoLabel = "Atenção — qualidade de sono comprometida";
    else if (sonoTotal >= 9) sonoLabel = "Qualidade de sono intermediária";
    else sonoLabel = "Boa qualidade de sono";
    out.sono = { escore_total: sonoTotal, classificacao: sonoLabel, flag_apneia: raw.sono_apneia === 1 };
  } else {
    out.sono = {};
  }

  // DASS-21
  const dassVals = DASS_ITEMS.map((_, i) => raw[`dass_${i}`]);
  if (dassVals.every((v) => v !== null && v !== undefined)) {
    const sum = (sub) => DASS_ITEMS.reduce((acc, [, s], i) => (s === sub ? acc + dassVals[i] : acc), 0) * 2;
    out.dass21 = { depressao: sum("D"), ansiedade: sum("A"), estresse: sum("S") };
  } else {
    out.dass21 = {};
  }

  // Nordic
  let r12 = 0, rImp = 0, r7 = 0;
  for (let i = 0; i < NORDIC_REGIOES.length; i++) {
    if (raw[`nord_${i}_12m`] === 1) r12++;
    if (raw[`nord_${i}_imp`] === 1) rImp++;
    if (raw[`nord_${i}_7d`] === 1) r7++;
  }
  out.nordic = { regioes_12m: r12, regioes_limitacao: rImp, regioes_7d: r7 };

  // Dieta
  let dietScore = 0, dietFilled = 0;
  DIET_ITEMS.forEach(([, protetor], i) => {
    const v = n(raw[`diet_${i}`]);
    if (v !== null) {
      dietFilled++;
      dietScore += protetor ? Math.min(v, 7) : -Math.min(v, 7);
    }
  });
  out.dieta = { escore_liquido: dietFilled > 0 ? dietScore : null };

  // Antropometria
  const peso = n(raw.peso), altura = n(raw.altura);
  const imc = peso && altura ? Math.round((peso / Math.pow(altura / 100, 2)) * 10) / 10 : null;
  const cintura = n(raw.cintura), quadril = n(raw.quadril);
  const rcq = cintura && quadril ? Math.round((cintura / quadril) * 100) / 100 : null;
  const preensaoDir = n(raw.preensao_dir), preensaoEsq = n(raw.preensao_esq);
  let diferencaPreensaoPct = null;
  if (preensaoDir && preensaoEsq) {
    const maior = Math.max(preensaoDir, preensaoEsq);
    diferencaPreensaoPct = Math.round((Math.abs(preensaoDir - preensaoEsq) / maior) * 1000) / 10;
  }
  out.antropometria = {
    peso, altura, imc, cintura, quadril, rcq,
    percentual_gordura: n(raw.gordura), pa: raw.pa || null,
    preensao_direita: preensaoDir, preensao_esquerda: preensaoEsq,
    diferenca_preensao_pct: diferencaPreensaoPct,
  };

  // LSNS-6
  const lsnsVals = LSNS_ITEMS.map((_, i) => raw[`lsns_${i}`]);
  out.lsns6 = { escore_total: lsnsVals.every((v) => v !== null && v !== undefined) ? lsnsVals.reduce((a, b) => a + b, 0) : null };

  // AUDIT-C
  const auditVals = AUDIT_ITEMS.map((_, i) => raw[`audit_${i}`]);
  out.auditc = {
    escore_total: auditVals.every((v) => v !== null && v !== undefined) ? auditVals.reduce((a, b) => a + b, 0) : null,
    tabagismo: raw.fumo || null,
  };

  // Utilização de serviços
  out.utilizacao_servicos = {
    consultas_clinico: n(raw.visita_clinico), consultas_especialista: n(raw.visita_esp),
    idas_ps: n(raw.visita_ps), internacoes: n(raw.visita_int),
    sessoes_fisio: n(raw.visita_fisio), consultas_psi: n(raw.visita_psi),
  };

  // Biomarcadores (mapa simples)
  const biomarcadores = {};
  for (const [fieldId] of BIOMARCADORES) {
    const v = n(raw[fieldId]);
    if (v !== null) biomarcadores[fieldId.replace("bio_", "")] = v;
  }
  out.biomarcadores = biomarcadores;

  // Saúde óssea
  const osseaVals = OSSEA_ITEMS.map((_, i) => raw[`ossea_${i}`]).filter((v) => v !== null && v !== undefined);
  out.saude_ossea = {
    fatores_risco: osseaVals.length > 0 ? osseaVals.reduce((a, b) => a + b, 0) : null,
    dxa_coluna: n(raw.dxa_coluna), dxa_femur: n(raw.dxa_femur),
  };

  // Trabalho
  const trabVals = TRAB_ITEMS.map((_, i) => raw[`trab_${i}`]);
  let trabTotal = null;
  if (trabVals.every((v) => v !== null && v !== undefined)) {
    trabTotal = TRAB_ITEMS.reduce((acc, [, rev], i) => acc + (rev ? 3 - trabVals[i] : trabVals[i]), 0);
  }
  out.trabalho = {
    horas_dia: n(raw.trab_horas), modalidade: raw.trab_modalidade || null,
    tipo_esforco: raw.trab_tipo || null, turno: raw.trab_turno || null,
    escore_tensao: trabTotal, estresse_percebido: n(raw.trab_estresse_geral),
  };

  return out;
}
