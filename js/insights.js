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
    const box = document.getElementById("insightBox");

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

document.addEventListener("DOMContentLoaded", function () {
    renderizarMetas();
});
