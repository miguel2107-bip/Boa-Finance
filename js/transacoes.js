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

    [...transacoes].reverse().slice(0, 5).forEach((transacao, index) => {
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

function excluirTransacao(index) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    // como usamos reverse(), precisamos ajustar o índice
    transacoes.splice(transacoes.length - 1 - index, 1);

    localStorage.setItem("transacoes", JSON.stringify(transacoes));

    alert("Transação excluída com sucesso!");
}
