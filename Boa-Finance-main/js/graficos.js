function criarGraficoBarra() {

    const ctx = document.getElementById("graficoBarra");

    if (!ctx) return;

    let transacoes =
        JSON.parse(localStorage.getItem("transacoes")) || [];

    const mesesNomes = [
        "Jan", "Fev", "Mar", "Abr",
        "Mai", "Jun", "Jul", "Ago",
        "Set", "Out", "Nov", "Dez"
    ];

    let hoje = new Date();
    let mesAtual = hoje.getMonth();

    let labels = [];
    let receitasMes = [];
    let despesasMes = [];

    // últimos 6 meses
    for (let i = 5; i >= 0; i--) {

        let indiceMes = mesAtual - i;

        if (indiceMes < 0) {
            indiceMes += 12;
        }

        labels.push(mesesNomes[indiceMes]);

        receitasMes.push(0);
        despesasMes.push(0);
    }

    transacoes.forEach(function(transacao) {

        if (!transacao.data) return;

        let data = new Date(transacao.data);

        let mes = data.getMonth();

        let valor = parseFloat(transacao.valor);

        let posicao =
            labels.indexOf(mesesNomes[mes]);

        if (posicao !== -1) {

            if (transacao.tipo === "Receita") {
                receitasMes[posicao] += valor;
            }

            if (transacao.tipo === "Despesa") {
                despesasMes[posicao] += valor;
            }
        }
    });

    if (graficoBarra instanceof Chart) {
    graficoBarra.destroy();
}

    graficoBarra = new Chart(ctx, {

        type: "bar",

        data: {
            labels: labels,

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


let graficoPizza;

function criarGraficoPizza() {

    const ctx =
        document.getElementById("graficoPizza");

    if (!ctx) return;

    let transacoes =
        JSON.parse(localStorage.getItem("transacoes")) || [];

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

            let valor =
                parseFloat(transacao.valor) || 0;

            if (
                categorias.hasOwnProperty(
                    transacao.categoria
                )
            ) {

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

                backgroundColor: [
                    "#10b981",
                    "#3b82f6",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#64748b"
                ],

                borderWidth: 0
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
                        padding: 18,
                        font: {
                            size: 13
                        }
                    }
                }
            }
        }
    });
}

