// --- FUNÇÕES DE NAVEGAÇÃO ENTRE TELAS ---
function MostrarTelaRecuperar(event) {
    event.preventDefault();
    document.getElementById('tela-login').classList.add('esconder');
    document.getElementById('tela-recuperar').classList.add('mostrar');
}

function MostrarTelaLogin(event) {
    event.preventDefault();
    document.getElementById('tela-login').classList.remove('esconder');
    document.getElementById('tela-recuperar').classList.remove('mostrar');
}

// --- LÓGICA DE LOGIN E CADASTRO ---
function Entrar() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        alert("Login realizado com sucesso!");
        window.location.href = "dashboard.html"; // Altere para sua página de destino
    } else {
        alert("E-mail ou senha inválidos.");
    }
}

function Registrar() {
    // Redireciona para a página de registro (ou mude a lógica para abrir uma div)
    window.location.href = "registrar.html"; 
}

function EnviarLinkRedefinicao() {
    const email = document.getElementById('rec-email').value;
    if (email) {
        alert("Simulação: Um link de recuperação foi enviado para " + email);
        MostrarTelaLogin(event);
    } else {
        alert("Por favor, digite um e-mail.");
    }
}