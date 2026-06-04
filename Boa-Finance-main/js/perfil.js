import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuração padrão do Boa-Finance
const firebaseConfig = {
  apiKey: "AIzaSyAVRhC34U-v-Hnn5pbZC98bU1lVzYZUzz4",
  authDomain: "boa-finance.firebaseapp.com",
  projectId: "boa-finance",
  storageBucket: "boa-finance.firebasestorage.app",
  messagingSenderId: "439251622013",
  appId: "1:439251622013:web:5391ce63d819d0c594b914",
  measurementId: "G-4G52C3MMCP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// MONITORAMENTO DO USUÁRIO LOGADO
onAuthStateChanged(auth, (user) => {
    if (user) {
        const emailUsuario = user.email; // Ex: jaqueline@gmail.com
        
        // 1. Extrai a primeira letra e joga para maiúscula (Ex: "J")
        const inicialMoldada = emailUsuario[0].toUpperCase(); 

        // 2. Troca a letra "L" padrão da bolinha verde pela inicial do email
        const campoBolinha = document.getElementById('bola-avatar');
        if (campoBolinha) {
            campoBolinha.innerText = inicialMoldada;
        }

        // 3. Pega apenas a parte do texto antes do '@' e deixa a primeira letra maiúscula
        let nomeSimplificado = emailUsuario.split('@')[0];
        nomeSimplificado = nomeSimplificado.charAt(0).toUpperCase() + nomeSimplificado.slice(1);

        // 4. Modifica o texto do perfil para exibir o nome limpo
        const campoTextoEmail = document.getElementById('letra-perfil');
        if (campoTextoEmail) {
            campoTextoEmail.innerText = nomeSimplificado;
        }

    } else {
        // Se não tiver usuário logado, barra o acesso e joga pro index
        window.location.href = "index.html";
    }
});

// FUNÇÃO DE LOGOUT (BOTAÃO DE SAIR)
const btnSair = document.getElementById('btn-sair');
if (btnSair) {
    btnSair.addEventListener('click', async (e) => {
        e.preventDefault(); // Impede o link de navegar antes de deslogar
        try {
            await signOut(auth);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    });
}