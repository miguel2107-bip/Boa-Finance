// Gerencia as categorias visíveis dependendo do tipo selecionado
function atualizarCategorias() {
    const tipoSelect = document.getElementById("tipo");
    const categoriaSelect = document.getElementById("categoria");
    
    if (!tipoSelect || !categoriaSelect) return;

    const tipo = tipoSelect.value;
    categoriaSelect.innerHTML = ""; // Limpa as opções atuais

    if (tipo === "Receita") {
        const opcoesReceita = ["Salário", "Investimentos", "Outros"];
        opcoesReceita.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            categoriaSelect.appendChild(opt);
        });
    } else if (tipo === "Despesa") {
        const opcoesDespesa = ["Alimentação", "Transporte", "Lazer", "Saúde", "Moradia", "Outros"];
        opcoesDespesa.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            categoriaSelect.appendChild(opt);
        });
    }
}

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

        // Estilos embutidos no botão garantem a aplicação visual correta independente de caminhos CSS externos
        item.innerHTML = `
            <div class="tx-info">
                <span class="tx-name">${transacao.descricao}</span>
                <span class="tx-date">${transacao.data || "Sem data"}</span>
            </div>

            <span class="tx-amount ${transacao.tipo === "Receita" ? "tx-pos" : "tx-neg"}">
                ${transacao.tipo === "Receita" ? "+" : "-"} 
                R$ ${parseFloat(transacao.valor).toFixed(2).replace(".", ",")}
            </span>

            <button class="btn-delete" onclick="excluirTransacao(${index})" style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background-color: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.2);
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s ease;
            ">
                <svg viewBox="0 0 24 24" width="14" height="14" style="stroke: currentColor; fill: none; stroke-width: 2px;">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
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

    document.getElementById("totalReceitas").innerText = "R$ " + receitas.toFixed(2).replace(".", ",");
    document.getElementById("totalDespesas").innerText = "R$ " + despesas.toFixed(2).replace(".", ",");
    document.getElementById("saldoTotal").innerText = "R$ " + saldo.toFixed(2).replace(".", ",");
}

function excluirTransacao(index) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

    // Removido o alert de sucesso! A transação é excluída imediatamente sem travar a interface
    transacoes.splice(transacoes.length - 1 - index, 1);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));

    carregarTransacoes();
    atualizarResumoFinanceiro();
    
    if (typeof criarGraficoBarra === "function") criarGraficoBarra();
    if (typeof criarGraficoPizza === "function") criarGraficoPizza();
}

// Executa as funções essenciais assim que o DOM carregar
document.addEventListener("DOMContentLoaded", function() {
    atualizarCategorias();
    carregarTransacoes();
    atualizarResumoFinanceiro();
});