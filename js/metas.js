function atualizarMetaFinanceira() {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(function(transacao) {
        let valor = parseFloat(transacao.valor);

        if (transacao.tipo === "Receita") {
            receitas += valor;
        } else if (transacao.tipo === "Despesa") {
            despesas += valor;
        }
    });

    let economiaAtual = receitas - despesas;

    if (economiaAtual < 0) {
        economiaAtual = 0;
    }

    let metaTotal = parseFloat(localStorage.getItem("metaFinanceira")) || 10000;

    let porcentagem = (economiaAtual / metaTotal) * 100;

    if (porcentagem > 100) {
        porcentagem = 100;
    }

    document.getElementById("valorMetaAtual").innerText =
        "R$ " + economiaAtual.toFixed(2).replace(".", ",");

    document.getElementById("textoMeta").innerText =
        "Meta: R$ " + metaTotal.toFixed(2).replace(".", ",");

    document.getElementById("porcentagemMeta").innerText =
        Math.floor(porcentagem) + "%";

    let mensagem = "";

if (porcentagem < 20) {
    mensagem = "Toda grande conquista começa com o primeiro passo 🚀";
}
else if (porcentagem < 50) {
    mensagem = "Você já começou. Continue firme 💪";
}
else if (porcentagem < 80) {
    mensagem = "Metade do caminho já ficou para trás 🔥";
}
else if (porcentagem < 100) {
    mensagem = "Você está muito perto de conquistar sua meta ⭐";
}
else {
    mensagem = "Meta concluída! Você mandou muito bem 🏆";
}

document.getElementById("mensagemMeta").innerText = mensagem;    

    let circulo = document.getElementById("circuloMeta");

let raio = 50;
let circunferencia = 2 * Math.PI * raio;

circulo.style.strokeDasharray = circunferencia;
circulo.style.strokeDashoffset = circunferencia;

if (porcentagem > 0) {
    let offset = circunferencia - (porcentagem / 100) * circunferencia;
    circulo.style.strokeDashoffset = offset;
}

}

function editarMeta() {
    let novaMeta = prompt("Digite o valor da sua nova meta:");

    if (!novaMeta) return;

    novaMeta = parseFloat(novaMeta.replace(",", "."));

    if (isNaN(novaMeta) || novaMeta <= 0) {
        alert("Digite um valor válido.");
        return;
    }

    localStorage.setItem("metaFinanceira", novaMeta);

    atualizarMetaFinanceira();

    alert("Meta atualizada com sucesso!");
}

function novaMeta() {
    let nome = prompt("Digite o nome da meta:");
    if (!nome) return;

    let valorTotal = prompt("Digite o valor total da meta:");
    if (!valorTotal) return;

    valorTotal = parseFloat(valorTotal.replace(",", "."));

    if (isNaN(valorTotal) || valorTotal <= 0) {
        alert("Digite um valor válido.");
        return;
    }

    let metas = JSON.parse(localStorage.getItem("metas")) || [];

    metas.push({
        nome: nome,
        atual: 0,
        total: valorTotal
    });

    localStorage.setItem("metas", JSON.stringify(metas));

    alert("Meta criada com sucesso!");

    renderizarMetas();
}

function adicionarValorMeta(index) {
    let metas = JSON.parse(localStorage.getItem("metas")) || [];

    let valor = prompt("Quanto deseja adicionar nesta meta?");
    if (!valor) return;

    valor = parseFloat(valor.replace(",", "."));

    if (isNaN(valor) || valor <= 0) {
        alert("Digite um valor válido.");
        return;
    }

    metas[index].atual += valor;

    if (metas[index].atual > metas[index].total) {
        metas[index].atual = metas[index].total;
    }

    localStorage.setItem("metas", JSON.stringify(metas));

    renderizarMetas();
}

function excluirMeta(index) {
    let metas = JSON.parse(localStorage.getItem("metas")) || [];

    let confirmar = confirm("Deseja realmente excluir esta meta?");

    if (!confirmar) return;

    metas.splice(index, 1);

    localStorage.setItem("metas", JSON.stringify(metas));

    alert("Meta excluída com sucesso!");

    renderizarMetas();
}

function renderizarMetas() {
    const lista = document.getElementById("listaMetas");

    if (!lista) return;

    let metas = JSON.parse(localStorage.getItem("metas")) || [];

    lista.innerHTML = "";

    metas.forEach((meta, index) => {
        let porcentagem = (meta.atual / meta.total) * 100;

        if (porcentagem > 100) {
            porcentagem = 100;
        }

        let mensagem = "";

        if (porcentagem < 20) {
            mensagem = "Toda conquista começa com o primeiro passo 🚀";
        }
        else if (porcentagem < 50) {
            mensagem = "Você já começou. Continue firme 💪";
        }
        else if (porcentagem < 80) {
            mensagem = "Você está avançando muito bem 🔥";
        }
        else if (porcentagem < 100) {
            mensagem = "Falta pouco para concluir sua meta ⭐";
        }
        else {
            mensagem = "Meta concluída! Parabéns 🏆";
        }

        lista.innerHTML += `
            <div class="meta-card">
                <h3>${meta.nome}</h3>

                <p>
                    R$ ${meta.atual.toFixed(2).replace(".", ",")}
                    /
                    R$ ${meta.total.toFixed(2).replace(".", ",")}
                </p>

                <div class="circulo-meta">
                    <svg viewBox="0 0 120 120">

                        <circle
                            class="circulo-fundo"
                            cx="60"
                            cy="60"
                            r="45">
                        </circle>

                        <circle
                            class="circulo-progresso"
                            cx="60"
                            cy="60"
                            r="45"
                            style="
                                stroke-dasharray: 282.6;
                                stroke-dashoffset: ${282.6 - (porcentagem / 100) * 282.6};
                            ">
                        </circle>

                    </svg>

                    <span class="texto-circulo">
                        ${Math.floor(porcentagem)}%
                    </span>
                </div>

                <div class="frase-meta">
                    ${mensagem}
                </div>

                <div class="acoes-meta">
                    <button onclick="adicionarValorMeta(${index})">
                        Adicionar valor
                    </button>

                    <button onclick="excluirMeta(${index})">
                        Excluir
                    </button>
                </div>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderizarMetas();
});