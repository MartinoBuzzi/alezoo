import { db } from "./firebase-init.js";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

function articoliRef(uid) {
  return collection(db, "carrelli", uid, "articoli");
}

export async function ottieniCarrello(uid) {
  const snap = await getDocs(articoliRef(uid));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function aggiungiAlCarrello(uid, articolo) {
  const ref = doc(db, "carrelli", uid, "articoli", articolo.id);
  const articoli = await ottieniCarrello(uid);
  const esistente = articoli.find((a) => a.id === articolo.id);

  if (esistente) {
    await updateDoc(ref, { quantita: esistente.quantita + 1 });
  } else {
    await setDoc(ref, {
      nome: articolo.nome,
      prezzo: articolo.prezzo,
      quantita: 1
    });
  }

  return ottieniCarrello(uid);
}

export async function aggiornaQuantita(uid, id, quantita) {
  const ref = doc(db, "carrelli", uid, "articoli", id);

  if (quantita <= 0) {
    await deleteDoc(ref);
  } else {
    await updateDoc(ref, { quantita });
  }

  return ottieniCarrello(uid);
}

export async function svuotaCarrello(uid) {
  const snap = await getDocs(articoliRef(uid));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export async function contaArticoliCarrello(uid) {
  const articoli = await ottieniCarrello(uid);
  return articoli.reduce((totale, a) => totale + a.quantita, 0);
}
