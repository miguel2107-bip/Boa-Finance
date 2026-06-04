// Objeto com as categorias de verdade para preencher o select
const categoriasPorTipo = {
    Receita: ["Salário", "Investimentos", "Freela", "Outros"],
    Despesa: ["Alimentação", "Transporte", "Lazer", "Moradia", "Saúde", "Outros"]
};

// FUNÇÃO NOVA: Preenche o select de categorias na tela
function atualizarCategorias() {
    const tipoSelect = document.getElementById("tipo");
    const categoriaSelect = document.getElementById("categoria");

    if (!tipoSelect || !categoriaSelect) return;

    const tipoSelecionado = tipoSelect.value; // Receita ou Despesa
    const opcoes = categoriasPorTipo[tipoSelecionado] || [];

    // Limpa as opções antigas
    categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

    // Cria as novas opções dinamicamente
    opcoes.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        categoriaSelect.appendChild(option);
    });
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
            <span class="tx-amount ${transacao.tipo === "Receita" ? "tx-pos" : "tx-neg"}">
                ${transacao.tipo === "Receita" ? "+" : "-"} R$ ${transacao.valor.toFixed(2).replace(".", ",")}
            </span>
            <button class="btn-excluir" data-index="${index}">Excluir</button>
        `;

        lista.appendChild(item);
    });

    // Configura os botões de excluir de forma segura
    document.querySelectorAll(".btn-excluir").forEach(botao => {
        botao.addEventListener("click", function() {
            const idx = parseInt(this.getAttribute("data-index"));
            excluirTransacao(idx);
        });
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

    let saldo = Array.isArray(transacoes) ? (receitas - despesas) : 0;

    document.getElementById("totalReceitas").innerText = "R$ " + receitas.toFixed(2).replace(".", ",");
    document.getElementById("totalDespesas").innerText = "R$ " + despesas.toFixed(2).replace(".", ",");
    document.getElementById("saldoTotal").innerText = "R$ " + saldo.toFixed(2).replace(".", ",");
}

function excluirTransacao(index) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    
    // Ajusta o índice por causa do reverse()
    transacoes.splice(transacoes.length - 1 - index, 1);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));

    alert("Transação excluída com sucesso!");
    // Recarrega os dados na tela na hora
    carregarTransacoes();
    atualizarResumoFinanceiro();
}

// EXECUÇÃO AUTOMÁTICA AO CARREGAR A PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    carregarTransacoes();
    atualizarResumoFinanceiro();
    
    // Se estiver na tela de adicionar transações, ativa o sistema de categorias
    const tipoSelect = document.getElementById("tipo");
    if (tipoSelect) {
        atualizarCategorias(); // Roda a primeira vez para iniciar as categorias
        tipoSelect.addEventListener("change", atualizarCategorias); // Atualiza se o usuário mudar de Receita para Despesa
    }
});