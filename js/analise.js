const transacoes =
    JSON.parse(localStorage.getItem("transacoes")) || [];

let receitas = 0;
let despesas = 0;
let resultado = 0;

transacoes.forEach(transacao => {

    const valor =
        parseFloat(transacao.valor) || 0;

    if (transacao.tipo === "Receita") {
        receitas += valor;
    }

    if (transacao.tipo === "Despesa") {
        despesas += valor;
    }
});

resultado = receitas - despesas;

function gerarInsights(receitas, despesas) {

    const listaInsights =
        document.getElementById("listaInsights");

    listaInsights.innerHTML = "";

    const insights = [];

    // RESULTADO

    if (receitas > despesas) {

        insights.push({
            titulo: "Saúde Financeira",
            texto:
                "Seu saldo está positivo. Continue mantendo controle dos gastos."
        });

    } else {

        insights.push({
            titulo: "Atenção",
            texto:
                "Suas despesas estão maiores que suas receitas."
        });
    }

    // ECONOMIA

    const taxa = receitas > 0
        ? ((receitas - despesas) / receitas) * 100
        : 0;

    if (taxa >= 20) {

        insights.push({
            titulo: "Economia",
            texto:
                "Sua taxa de economia está excelente."
        });

    } else if (taxa > 0) {

        insights.push({
            titulo: "Economia",
            texto:
                "Você está economizando pouco este mês."
        });

    } else {

        insights.push({
            titulo: "Alerta",
            texto:
                "Você não conseguiu economizar este mês."
        });
    }

    // RENDERIZAR

    insights.forEach(item => {

        listaInsights.innerHTML += `
            <div class="insight-item">

                <span class="insight-tag">
                    ${item.titulo}
                </span>

                <p class="insight-text">
                    ${item.texto}
                </p>

            </div>
        `;
    });
}

function atualizarCards() {

    document.getElementById("receitas")
        .innerText =
        "R$ " + receitas.toFixed(2);

    document.getElementById("despesas")
        .innerText =
        "R$ " + despesas.toFixed(2);

    document.getElementById("resultado")
        .innerText =
        "R$ " + resultado.toFixed(2);

    const resultadoElemento =
    document.getElementById("resultado");

if (resultado >= 0) {

    resultadoElemento.style.color =
        "#00f5b4";

} else {

    resultadoElemento.style.color =
        "#ef4444";
}
}

function atualizarDRE() {

    document.getElementById("dreReceitas")
        .innerText =
        "R$ " + receitas.toFixed(2);

    document.getElementById("dreDespesas")
        .innerText =
        "R$ " + despesas.toFixed(2);

    document.getElementById("dreResultado")
        .innerText =
        "R$ " + resultado.toFixed(2);

    const resultadoDRE =
        document.getElementById("dreResultado");

    if (resultado >= 0) {

        resultadoDRE.style.color =
            "#00f5b4";

    } else {

        resultadoDRE.style.color =
            "#ef4444";
    }
}

function atualizarKPIs(receitas, despesas, transacoes) {

    // TAXA DE ECONOMIA

    let taxa = 0;

    if (receitas > 0) {

        taxa =
            ((receitas - despesas) / receitas) * 100;
    }

    document.getElementById("taxaEconomia")
        .innerText = taxa.toFixed(0) + "%";

    // MÉDIA DE GASTOS

    let totalDespesas = transacoes.filter(
        t => t.tipo === "Despesa"
    );

    let media = 0;

    if (totalDespesas.length > 0) {

        media =
            despesas / totalDespesas.length;
    }

    document.getElementById("mediaGastos")
        .innerText =
        "R$ " + media.toFixed(2);

    // MAIOR CATEGORIA

    let categorias = {};

    totalDespesas.forEach(t => {

        if (!categorias[t.categoria]) {

            categorias[t.categoria] = 0;
        }

        categorias[t.categoria] +=
            parseFloat(t.valor);
    });

    let maiorCategoria = "-";
    let maiorValor = 0;

    for (let categoria in categorias) {

        if (categorias[categoria] > maiorValor) {

            maiorValor = categorias[categoria];

            maiorCategoria = categoria;
        }
    }

    document.getElementById("maiorCategoria")
        .innerText = maiorCategoria;

    // SAÚDE FINANCEIRA

    let saude = "Boa";

    if (despesas > receitas) {

        saude = "Ruim";

    } else if (taxa < 10) {

        saude = "Atenção";
    }

    document.getElementById("saudeFinanceira")
        .innerText = saude;
}

atualizarKPIs(receitas, despesas, transacoes);

function criarGraficoEvolucao() {

    const ctx =
        document.getElementById("graficoEvolucao");

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

    let saldoMensal = [];

    // últimos 6 meses

    for (let i = 5; i >= 0; i--) {

        let indiceMes = mesAtual - i;

        if (indiceMes < 0) {
            indiceMes += 12;
        }

        labels.push(mesesNomes[indiceMes]);

        saldoMensal.push(0);
    }

    transacoes.forEach(transacao => {

        if (!transacao.data) return;

        let data = new Date(transacao.data);

        let mes = data.getMonth();

        let valor =
            parseFloat(transacao.valor);

        let posicao =
            labels.indexOf(mesesNomes[mes]);

        if (posicao !== -1) {

            if (transacao.tipo === "Receita") {

                saldoMensal[posicao] += valor;

            } else {

                saldoMensal[posicao] -= valor;
            }
        }
    });

    new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Saldo Mensal",

                data: saldoMensal,

                borderColor: "#00f5b4",

                backgroundColor:
                    "rgba(0,245,180,0.15)",

                fill: true,

                tension: 0.4,

                pointRadius: 5,

                pointBackgroundColor:
                    "#00f5b4"
            }]
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

function analisarCategorias(transacoes) {

    let categorias = {};

    transacoes.forEach(transacao => {

        if (transacao.tipo === "Despesa") {

            let categoria =
                transacao.categoria || "Outros";

            let valor =
                parseFloat(transacao.valor);

            if (!categorias[categoria]) {

                categorias[categoria] = 0;
            }

            categorias[categoria] += valor;
        }
    });

    let maiorCategoria = "";
    let maiorValor = 0;
    let totalDespesas = 0;

    for (let categoria in categorias) {

        totalDespesas += categorias[categoria];

        if (categorias[categoria] > maiorValor) {

            maiorValor = categorias[categoria];

            maiorCategoria = categoria;
        }
    }

    if (maiorCategoria) {

        let porcentagem =
            (maiorValor / totalDespesas) * 100;

        adicionarInsight(
            "Categoria dominante",
            `${maiorCategoria} representa ${porcentagem.toFixed(0)}% dos seus gastos.`
        );
    }
}

function adicionarInsight(titulo, texto) {

    const lista =
        document.getElementById("listaInsights");

    lista.innerHTML += `
    
        <div class="insight-item">

            <span class="insight-tag">
                ${titulo}
            </span>

            <p class="insight-text">
                ${texto}
            </p>

        </div>
    `;
}

function iniciarAnalise() {

    atualizarCards();

    atualizarDRE();

    atualizarKPIs(
        receitas,
        despesas,
        transacoes
    );

    criarGraficoEvolucao();

    gerarInsights(
        receitas,
        despesas
    );

    analisarCategorias(
        transacoes
    );
}

iniciarAnalise();

// ======================================================
// GRÁFICO DE CATEGORIAS
// ======================================================

function criarGraficoCategorias() {

    const ctx =
        document.getElementById(
            "graficoAnalise"
        );

    if (!ctx) return;

    let transacoes =
        JSON.parse(
            localStorage.getItem("transacoes")
        ) || [];

    let categorias = {};

    transacoes.forEach((transacao) => {

        if (transacao.tipo === "Despesa") {

            let categoria =
                transacao.categoria || "Outros";

            let valor =
                parseFloat(transacao.valor) || 0;

            if (!categorias[categoria]) {

                categorias[categoria] = 0;
            }

            categorias[categoria] += valor;
        }
    });

    const labels =
        Object.keys(categorias);

    const valores =
        Object.values(categorias);

    new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: valores,

                backgroundColor: [

                    "#00f5b4",
                    "#3b82f6",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#14b8a6",
                    "#eab308"
                ],

                borderWidth: 0
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {

                legend: {

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

criarGraficoCategorias();