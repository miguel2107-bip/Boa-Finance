// --- FUNÇÕES DE NAVEGAÇÃO E UTILS ---
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

// --- LÓGICA DE LOGIN ---
function Entrar() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        window.location.href = "home.html"; 
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

// --- LÓGICA DE REGISTRO ---
function CadastrarUsuario() {
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;
    const confirmarSenha = document.getElementById('reg-confirmar-senha').value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.find(u => u.email === email)) {
        alert("Este e-mail já está cadastrado.");
        return;
    }

    const novoUsuario = { email, senha };
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Define como logado e redireciona direto
    localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
    window.location.href = "home.html";
}

// --- LÓGICA DE RECUPERAÇÃO ---
function EnviarLinkRedefinicao() {
    const email = document.getElementById('rec-email').value;
    if (email) {
        alert("Link de redefinição enviado para: " + email);
        // Oculta a tela de recuperar e volta pra de login
        document.getElementById('tela-login').classList.remove('esconder');
        document.getElementById('tela-recuperar').classList.remove('mostrar');
    } else {
        alert("Digite um e-mail válido.");
    }
}