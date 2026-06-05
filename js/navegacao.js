function Entrar() {
    window.location.href = "home.html";
}

function Registrar() {
    window.location.href = "registrar.html"
}

function Logar() {
    window.location.href = "index.html"
}
function Register() {
    window.location.href = "home.html";
}
function Esqueci() {
    window.location.href = "esqueci.html"
}
function Inicio() {
    window.location.href = "index.html"
}
function Transação() {
    window.location.href = "transacoes.html"
}

function Orçamento() {
    window.location.href = "orcamento.html"
}
function NT() {
    window.location.href = "nt.html"
}


const menuToggle =
    document.getElementById("menu-toggle");

const sidebar =
    document.querySelector(".sidebar");

const overlay =
    document.getElementById("overlay");

if (menuToggle && sidebar && overlay) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("aberta");

        overlay.classList.toggle("ativo");
    });

    overlay.addEventListener("click", () => {

        sidebar.classList.remove("aberta");

        overlay.classList.remove("ativo");
    });
}
