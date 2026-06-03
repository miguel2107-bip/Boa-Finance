import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuração do seu projeto Boa-Finance
const firebaseConfig = {
  apiKey: "AIzaSyAVRhC34U-v-Hnn5pbZC98bU1lVzYZUzz4",
  authDomain: "boa-finance.firebaseapp.com",
  projectId: "boa-finance",
  storageBucket: "boa-finance.firebasestorage.app",
  messagingSenderId: "439251622013",
  appId: "1:439251622013:web:5391ce63d819d0c594b914",
  measurementId: "G-4G52C3MMCP"
};

// Inicializa o Firebase e o serviço de Autenticação
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =================================================================
// VERIFICAÇÃO AUTOMÁTICA: REDIRECIONA DIRETO SE JÁ ESTIVER LOGADO
// =================================================================
onAuthStateChanged(auth, (user) => {
    const container = document.querySelector('.container');
    
    if (user) {
        // Se o Firebase identificar o login ativo, joga direto para a Home sem piscar a tela
        window.location.href = "home.html";
    } else {
        // Se NÃO estiver logado, remove qualquer bloqueio visual e exibe o formulário normalmente
        if (container) container.style.opacity = "1";
    }
});

// =================================================================
// LOGICA: VERIFICA SE JÁ EXISTE DADOS SALVOS AO CARREGAR A PÁGINA
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
    const emailSalvo = localStorage.getItem("boa_email");
    const senhaSalva = localStorage.getItem("boa_senha");
    const campoCheck = document.getElementById("lembrar");

    if (emailSalvo && senhaSalva) {
        if (document.getElementById("email")) document.getElementById("email").value = emailSalvo;
        if (document.getElementById("senha")) document.getElementById("senha").value = senhaSalva;
        if (campoCheck) campoCheck.checked = true;
    }
});

// =================================================================
// CONTROLE DE TRANSIÇÃO DE TELAS (SEM MUDAR DE PÁGINA)
// =================================================================

function MostrarTelaRecuperar(e) {
    if(e) e.preventDefault();
    document.getElementById('tela-login').classList.add('esconder');
    document.getElementById('tela-recuperar').classList.add('mostrar');
}

function MostrarTelaLogin(e) {
    if(e) e.preventDefault();
    document.getElementById('tela-login').classList.remove('esconder');
    document.getElementById('tela-recuperar').classList.remove('mostrar');
}

// =================================================================
// LÓGICA DA TELA DE LOGIN
// =================================================================

async function Entrar() {
    const email = document.getElementById('email')?.value;
    const senha = document.getElementById('senha')?.value;
    const desejaLembrar = document.getElementById('lembrar')?.checked;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        
        // Se o checkbox estiver marcado, guarda as credenciais no navegador, senão limpa
        if (desejaLembrar) {
            localStorage.setItem("boa_email", email);
            localStorage.setItem("boa_senha", senha);
        } else {
            localStorage.removeItem("boa_email");
            localStorage.removeItem("boa_senha");
        }

        // ALERTA REMOVIDO DAQUI PARA LOGAR DIRETO E INSTANTÂNEO!
        window.location.href = "home.html"; 
    } catch (error) {
        tratarErros(error);
    }
}

function Registrar() {
    window.location.href = "registrar.html"; 
}

// Lógica para enviar o e-mail de recuperação do Firebase
async function EnviarLinkRedefinicao() {
    const email = document.getElementById('rec-email')?.value;

    if (!email) {
        alert("Por favor, digite o seu e-mail para receber o link.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada.");
        MostrarTelaLogin(); 
    } catch (error) {
        tratarErros(error);
    }
}

// =================================================================
// LÓGICA DA TELA DE REGISTRO
// =================================================================

async function Register() {
    const email = document.getElementById('reg-email')?.value;
    const senha = document.getElementById('reg-senha')?.value;
    const confirmarSenha = document.getElementById('reg-confirmar-senha')?.value;

    if (!email || !senha || !confirmarSenha) {
        alert("Por favor, preencha todos os campos do registro.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem. Digite novamente.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, senha);
        alert("Conta criada com sucesso! Redirecionando...");
        window.location.href = "home.html";
    } catch (error) {
        tratarErros(error);
    }
}

function Logar() {
    window.location.href = "index.html"; 
}

// =================================================================
// FUNÇÃO AUXILIAR DE TRATAMENTO DE ERROS
// =================================================================
function tratarErros(error) {
    console.error("Erro Firebase:", error.code);
    switch (error.code) {
        case 'auth/invalid-credential':
            alert("E-mail ou senha incorretos.");
            break;
        case 'auth/email-already-in-use':
            alert("Este e-mail já está em uso por outra conta.");
            break;
        case 'auth/weak-password':
            alert("A senha deve conter pelo menos 6 caracteres.");
            break;
        case 'auth/invalid-email':
            alert("O formato do e-mail digitado é inválido.");
            break;
        default:
            alert("Ocorreu um erro: " + error.message);
    }
}

// Torna todas as funções visíveis globalmente para o HTML módulo
window.Entrar = Entrar;
window.Registrar = Registrar;
window.Register = Register;
window.Logar = Logar;
window.MostrarTelaRecuperar = MostrarTelaRecuperar;
window.MostrarTelaLogin = MostrarTelaLogin;
window.EnviarLinkRedefinicao = EnviarLinkRedefinicao;