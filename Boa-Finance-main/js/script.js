function atualizarMesAtual() {

    const elemento = document.getElementById("mesAtual");

    if (!elemento) return;

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const hoje = new Date();

    const mes = meses[hoje.getMonth()];
    const ano = hoje.getFullYear();

    elemento.innerText = `${mes} ${ano}`;
}

atualizarMesAtual();

document.addEventListener("DOMContentLoaded", () => {

    carregarTransacoes();

    atualizarResumoFinanceiro();

    criarGraficoPizza();

    criarGraficoBarra();

});

