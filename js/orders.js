import { db } from "./firebase-init.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

export async function creaOrdine(uid, email, articoli, totale) {
  return addDoc(collection(db, "ordini"), {
    uid,
    email,
    articoli,
    totale,
    creato: serverTimestamp()
  });
}
