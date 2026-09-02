import { osservaAutenticazione, esci } from "./auth.js";
import { contaArticoliCarrello } from "./cart.js";
import { isUtenteAdmin } from "./admin.js";

const root = document.body.dataset.root || "";

osservaAutenticazione(async (user) => {
  const authItem = document.getElementById("authNavItem");
  const cartItem = document.getElementById("cartNavItem");
  const cartCount = document.getElementById("cartCount");
  const adminItem = document.getElementById("adminNavItem");

  if (!authItem) return;

  if (user) {
    authItem.innerHTML = `<a href="#" id="logoutLink">Esci (${user.email})</a>`;

    document.getElementById("logoutLink").addEventListener("click", async (event) => {
      event.preventDefault();
      await esci();
      window.location.href = root + "index.html";
    });

    if (cartItem) {
      cartItem.style.display = "";
      if (cartCount) {
        cartCount.textContent = await contaArticoliCarrello(user.uid);
      }
    }

    if (adminItem) {
      const admin = await isUtenteAdmin(user.uid);
      adminItem.style.display = admin ? "" : "none";
    }
  } else {
    authItem.innerHTML = `<a href="${root}pagine/login.html">Accedi</a>`;
    if (cartItem) cartItem.style.display = "none";
    if (adminItem) adminItem.style.display = "none";
  }
});
