function Entrar() {
    window.location.href = "home.html";
}

function Registrar() {
    window.location.href = "registrar.html"
}

function Logar() {
    window.location.href = "login.html"
}
function Register() {
    window.location.href = "home.html";
}
function Esqueci() {
    window.location.href = "esqueci.html"
}
function Inicio() {
    window.location.href = "login.html"
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

let graficoPizza;

function criarGraficoPizza() {
    const ctx = document.getElementById("graficoPizza");

    if (!ctx) return;

    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    let categorias = {
        "Alimentação": 0,
        "Transporte": 0,
        "Lazer": 0,
        "Saúde": 0,
        "Moradia": 0,
        "Outros": 0
    };

    transacoes.forEach(function(transacao) {
        if (transacao.tipo === "Despesa") {
            let valor = parseFloat(transacao.valor);

            if (categorias.hasOwnProperty(transacao.categoria)) {
                categorias[transacao.categoria] += valor;
            } else {
                categorias["Outros"] += valor;
            }
        }
    });

    if (graficoPizza) {
    graficoPizza.destroy();
}
    graficoPizza = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categorias),
            datasets: [{
                data: Object.values(categorias),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "white",
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

criarGraficoPizza();

let graficoBarra;

function salvarTransacao() {

    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;
    const data = document.getElementById("data").value;

    if (!descricao || !valor || !tipo || !categoria) {
        alert("Preencha todos os campos!");
        return;
    }

    const novaTransacao = {
        descricao,
        valor,
        tipo,
        categoria,
        data
    };

    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    transacoes.push(novaTransacao);

    localStorage.setItem("transacoes", JSON.stringify(transacoes));

    alert("Transação salva com sucesso!");

    window.location.href = "home.html";
}

function carregarTransacoes() {
    const lista = document.getElementById("listaTransacoes");

    if (!lista) return;

    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    lista.innerHTML = "";

    transacoes.reverse().slice(0, 5).forEach((transacao, index) => {
        const item = document.createElement("li");
        item.classList.add("tx-item");

        item.innerHTML = `
            <div class="tx-info">
                <span class="tx-name">${transacao.descricao}</span>
                <span class="tx-date">${transacao.data || "Sem data"}</span>
            </div>

            <span class="tx-amount ${
                transacao.tipo === "Receita" ? "tx-pos" : "tx-neg"
            }">
                ${transacao.tipo === "Receita" ? "+" : "-"} 
                R$ ${transacao.valor}
            </span>

            <button onclick="excluirTransacao(${index})">
                Excluir
            </button>
        `;

        lista.appendChild(item);
    });
}

carregarTransacoes();

function atualizarResumoFinanceiro() {
    if (!document.getElementById("totalReceitas")) return;

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

    let saldo = receitas - despesas;
    let economias = saldo > 0 ? saldo : 0;

    document.getElementById("totalReceitas").innerText =
        "R$ " + receitas.toFixed(2).replace(".", ",");

    document.getElementById("totalDespesas").innerText =
        "R$ " + despesas.toFixed(2).replace(".", ",");

    document.getElementById("saldoTotal").innerText =
        "R$ " + saldo.toFixed(2).replace(".", ",");
}

atualizarResumoFinanceiro();

function criarGraficoBarra() {
    const ctx = document.getElementById("graficoBarra");

    if (!ctx) return;

    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    let receitasMes = [0, 0, 0, 0, 0, 0];
    let despesasMes = [0, 0, 0, 0, 0, 0];

    transacoes.forEach(function(transacao) {
        if (!transacao.data) return;

        let data = new Date(transacao.data);
        let mes = data.getMonth(); // 0 até 11
        let valor = parseFloat(transacao.valor);

        // usa os últimos 6 meses fixos (Jan-Jun por enquanto)
        if (mes >= 0 && mes <= 5) {
            if (transacao.tipo === "Receita") {
                receitasMes[mes] += valor;
            }

            if (transacao.tipo === "Despesa") {
                despesasMes[mes] += valor;
            }
        }
    });

    if (graficoBarra) {
    graficoBarra.destroy();
}

graficoBarra = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            datasets: [
                {
                    label: "Receitas",
                    data: receitasMes
                },
                {
                    label: "Despesas",
                    data: despesasMes
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "white"
                    }
                },
                y: {
                    ticks: {
                        color: "white"
                    }
                }
            }
        }
    });
}

criarGraficoBarra();

function excluirTransacao(index) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    // como usamos reverse(), precisamos ajustar o índice
    transacoes.splice(transacoes.length - 1 - index, 1);

    localStorage.setItem("transacoes", JSON.stringify(transacoes));

    alert("Transação excluída com sucesso!");

    carregarTransacoes();
    atualizarResumoFinanceiro();
    criarGraficoPizza();
    criarGraficoBarra();
}

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

        lista.innerHTML += `
            <div class="meta-card">
                <h3>${meta.nome}</h3>

                <p>
                    R$ ${meta.atual.toFixed(2).replace(".", ",")}
                    /
                    R$ ${meta.total.toFixed(2).replace(".", ",")}
                </p>

                <div class="barra-meta">
                    <div
                        class="progresso-meta"
                        style="width: ${porcentagem}%">
                    </div>
                </div>

                <p>${Math.floor(porcentagem)}%</p>

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
    const botao = document.querySelector(".btn-meta");

    if (botao) {
        botao.onclick = novaMeta;
    }

    renderizarMetas();
});

javascript
function atualizarComparativoMensal() {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    let hoje = new Date();
    let mesAtual = hoje.getMonth();
    let anoAtual = hoje.getFullYear();

    let mesAnterior = mesAtual - 1;
    let anoAnterior = anoAtual;

    if (mesAnterior < 0) {
        mesAnterior = 11;
        anoAnterior--;
    }

    let atual = {
        receitas: 0,
        despesas: 0
    };

    let anterior = {
        receitas: 0,
        despesas: 0
    };

    transacoes.forEach(function(transacao) {
        if (!transacao.data) return;

        let data = new Date(transacao.data);
        let mes = data.getMonth();
        let ano = data.getFullYear();
        let valor = parseFloat(transacao.valor) || 0;

        if (mes === mesAtual && ano === anoAtual) {
            if (transacao.tipo === "Receita") {
                atual.receitas += valor;
            }

            if (transacao.tipo === "Despesa") {
                atual.despesas += valor;
            }
        }

        if (mes === mesAnterior && ano === anoAnterior) {
            if (transacao.tipo === "Receita") {
                anterior.receitas += valor;
            }

            if (transacao.tipo === "Despesa") {
                anterior.despesas += valor;
            }
        }
    });

    let saldoAtual = atual.receitas - atual.despesas;
    let saldoAnterior = anterior.receitas - anterior.despesas;

    function calcularTexto(valorAtual, valorAnterior, idElemento) {
        let elemento = document.getElementById(idElemento);

        if (!elemento) return;

        if (valorAnterior === 0) {
            elemento.innerText = "Primeiro mês registrado";
            return;
        }

        let diferenca =
            ((valorAtual - valorAnterior) / valorAnterior) * 100;

        let texto = "";
        let classe = "";

        if (diferenca >= 0) {
            texto = `↑ ${diferenca.toFixed(1).replace(".", ",")}% vs mês anterior`;
            classe = "up";
        } else {
            texto = `↓ ${Math.abs(diferenca).toFixed(1).replace(".", ",")}% vs mês anterior`;
            classe = "down";
        }

        elemento.innerText = texto;
        elemento.className = `card-trend ${classe}`;
    }

    calcularTexto(
        saldoAtual,
        saldoAnterior,
        "trendSaldo"
    );

    calcularTexto(
        atual.receitas,
        anterior.receitas,
        "trendReceitas"
    );

    calcularTexto(
        atual.despesas,
        anterior.despesas,
        "trendDespesas"
    );
}

atualizarComparativoMensal();

function atualizarCategoriaDestaque() {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    let categorias = {
        "Alimentação": 0,
        "Transporte": 0,
        "Lazer": 0,
        "Saúde": 0,
        "Moradia": 0,
        "Outros": 0
    };

    let totalDespesas = 0;

    transacoes.forEach(function(transacao) {
        if (transacao.tipo === "Despesa") {
            let valor = parseFloat(transacao.valor) || 0;
            totalDespesas += valor;

            if (categorias.hasOwnProperty(transacao.categoria)) {
                categorias[transacao.categoria] += valor;
            } else {
                categorias["Outros"] += valor;
            }
        }
    });

    let maiorCategoria = "Nenhuma";
    let maiorValor = 0;

    for (let categoria in categorias) {
        if (categorias[categoria] > maiorValor) {
            maiorValor = categorias[categoria];
            maiorCategoria = categoria;
        }
    }

    let elemento = document.getElementById("categoriaDestaque");

    if (!elemento) return;

    if (totalDespesas === 0) {
        elemento.innerHTML = `
            Categoria que mais consome:
            <strong>Nenhuma ainda</strong>
        `;
        return;
    }

    let porcentagem =
        (maiorValor / totalDespesas) * 100;

    elemento.innerHTML = `
        Categoria que mais consome:
        <strong>
            ${maiorCategoria} (${porcentagem.toFixed(1).replace(".", ",")}%)
        </strong>
    `;
}

atualizarCategoriaDestaque();

function gerarInsights() {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    if (transacoes.length === 0) {
        const insight = document.getElementById("insightPrincipal");

        if (insight) {
            insight.innerText = "Nenhuma transação cadastrada ainda.";
        }

        return;
    }

    let categorias = {};

    transacoes.forEach(function(transacao) {
        if (transacao.tipo === "Despesa") {
            let valor = parseFloat(transacao.valor);

            if (!categorias[transacao.categoria]) {
                categorias[transacao.categoria] = 0;
            }

            categorias[transacao.categoria] += valor;
        }
    });

    let maiorCategoria = "";
    let maiorValor = 0;

    for (let categoria in categorias) {
        if (categorias[categoria] > maiorValor) {
            maiorValor = categorias[categoria];
            maiorCategoria = categoria;
        }
    }

    const insight = document.getElementById("insightPrincipal");

    if (insight) {
        insight.innerText =
            `Sua maior despesa atual é ${maiorCategoria}, com R$ ${maiorValor.toFixed(2).replace(".", ",")} 💸`;
    }
}

gerarInsights();

function gerarInsights() {
    const box = document.getElementById("insightsBox");

    if (!box) return;

    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    let receitas = 0;
    let despesas = 0;

    let categorias = {};

    transacoes.forEach(function(transacao) {
        let valor = parseFloat(transacao.valor);

        if (transacao.tipo === "Receita") {
            receitas += valor;
        }

        if (transacao.tipo === "Despesa") {
            despesas += valor;

            if (!categorias[transacao.categoria]) {
                categorias[transacao.categoria] = 0;
            }

            categorias[transacao.categoria] += valor;
        }
    });

    let saldo = receitas - despesas;

    let maiorCategoria = "";
    let maiorValor = 0;

    for (let categoria in categorias) {
        if (categorias[categoria] > maiorValor) {
            maiorValor = categorias[categoria];
            maiorCategoria = categoria;
        }
    }

    let mensagemSaldo = "";

    if (saldo > 0) {
        mensagemSaldo = "Você está economizando bem este mês 💰";
    } else {
        mensagemSaldo = "Suas despesas estão maiores que sua receita ⚠️";
    }

    box.innerHTML = `
        <p>📌 Maior gasto: <strong>${maiorCategoria || "Nenhum"}</strong></p>
        <p>💸 Total gasto nessa categoria: <strong>R$ ${maiorValor.toFixed(2)}</strong></p>
        <p>📊 Saldo atual: <strong>R$ ${saldo.toFixed(2)}</strong></p>
        <p>🧠 Insight: <strong>${mensagemSaldo}</strong></p>
    `;
}

gerarInsights();

