import {
  auth,
  signInWithEmailAndPassword
} from "./firebase-config.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    loginMessage.textContent = "Preencha e-mail e senha.";
    return;
  }

  loginMessage.textContent = "Entrando...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";
  } catch (error) {
    console.error(error);
    loginMessage.textContent = "E-mail ou senha inválidos.";
  }
});

function handleEnterLogin(event) {
  if (event.key === "Enter") {
    loginBtn.click();
  }
}

emailInput.addEventListener("keydown", handleEnterLogin);
passwordInput.addEventListener("keydown", handleEnterLogin);