// db.js — Camada de acesso ao Firebase (Auth + Firestore)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs,
  query, orderBy, serverTimestamp, deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ---------------- Autenticação ----------------
export function loginComGoogle() {
  return signInWithPopup(auth, googleProvider);
}
export function logout() {
  return signOut(auth);
}
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ---------------- Pacientes ----------------
export async function addPaciente(dados) {
  const ref = await addDoc(collection(db, "pacientes"), {
    ...dados,
    criado_em: serverTimestamp(),
  });
  return ref.id;
}

export async function listPacientes() {
  const snap = await getDocs(query(collection(db, "pacientes"), orderBy("nome")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPaciente(pacienteId) {
  const snap = await getDoc(doc(db, "pacientes", pacienteId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ---------------- Avaliações ----------------
export async function saveAvaliacao(pacienteId, dadosGerais, scores, medicamentos, dadosBrutos) {
  const avaliacoesRef = collection(db, "pacientes", pacienteId, "avaliacoes");
  const existentes = await getDocs(avaliacoesRef);
  const numero = existentes.size + 1;

  const payload = {
    numero_avaliacao: numero,
    data_avaliacao: dadosGerais.data_avaliacao,
    objetivo: dadosGerais.objetivo || null,
    tempo_treino_previo: dadosGerais.tempo_treino_previo || null,
    medicamentos: medicamentos || [],
    dados_brutos: dadosBrutos || null, // guarda as respostas originais, permite reabrir para editar depois
    criado_em: serverTimestamp(),
    ...scores, // par_q, ipaq, sedentarismo, sono, dass21, nordic, dieta, antropometria,
    // lsns6, auditc, utilizacao_servicos, biomarcadores, saude_ossea, trabalho
  };
  const ref = await addDoc(avaliacoesRef, payload);
  return ref.id;
}

export async function updateAvaliacao(pacienteId, avaliacaoId, dadosGerais, scores, medicamentos, dadosBrutos, numeroAvaliacao) {
  const payload = {
    numero_avaliacao: numeroAvaliacao,
    data_avaliacao: dadosGerais.data_avaliacao,
    objetivo: dadosGerais.objetivo || null,
    tempo_treino_previo: dadosGerais.tempo_treino_previo || null,
    medicamentos: medicamentos || [],
    dados_brutos: dadosBrutos || null,
    editado_em: serverTimestamp(),
    ...scores,
  };
  await setDoc(doc(db, "pacientes", pacienteId, "avaliacoes", avaliacaoId), payload);
}

export async function getHistorico(pacienteId) {
  const avaliacoesRef = collection(db, "pacientes", pacienteId, "avaliacoes");
  const snap = await getDocs(query(avaliacoesRef, orderBy("data_avaliacao")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUltimaAvaliacao(pacienteId) {
  const historico = await getHistorico(pacienteId);
  return historico.length ? historico[historico.length - 1] : null;
}

export async function deleteAvaliacao(pacienteId, avaliacaoId) {
  await deleteDoc(doc(db, "pacientes", pacienteId, "avaliacoes", avaliacaoId));
}
