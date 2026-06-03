// ======================================================
// DADOS
// ======================================================

let patrimonio = 12500;

let rentabilidade = 14.8;

let perfil = "Moderado";

let graficoCarteira = null;

// ======================================================
// CARDS
// ======================================================

function atualizarCards() {

    document.getElementById("patrimonioTotal")
        .innerText =
        "R$ " + patrimonio.toLocaleString("pt-BR");

    document.getElementById("rentabilidade")
        .innerText =
        rentabilidade + "%";

    document.getElementById("perfilInvestidor")
        .innerText =
        perfil;
}

atualizarCards();

// ======================================================
// GRÁFICO
// ======================================================

function criarGraficoPatrimonio() {

    const ctx =
        document.getElementById("graficoPatrimonio");

    if (!ctx) return;

    let carteira =
    JSON.parse(localStorage.getItem("carteira")) || [];

let labels = [];

let patrimonio = [];

let acumulado = 0;
    
carteira.forEach((ativo, index) => {

    acumulado += parseFloat(ativo.valor) || 0;

    labels.push(`Aporte ${index + 1}`);

    patrimonio.push(acumulado);
});    

new Chart(ctx, {

        type: "line",

        data: {

    labels: labels,

    datasets: [{

        label: "Patrimônio Acumulado",

        data: patrimonio,

            

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

                        color: "#94a3b8"
                    },

                    grid: {

                        color:
                            "rgba(255,255,255,0.05)"
                    }
                },

                y: {

                    ticks: {

                        color: "#94a3b8"
                    },

                    grid: {

                        color:
                            "rgba(255,255,255,0.05)"
                    }
                }
            }
        }
    });
}

criarGraficoPatrimonio();

// ======================================================
// SIMULADOR
// ======================================================

function simularInvestimento() {

    let aporte =
        parseFloat(
            document.getElementById("aporteMensal").value
        ) || 0;

    let taxa =
        parseFloat(
            document.getElementById("taxaJuros").value
        ) || 0;

    let tempo =
        parseFloat(
            document.getElementById("tempoInvestimento").value
        ) || 0;

    let jurosMensal =
        taxa / 100 / 12;

    let meses =
        tempo * 12;

    let montante = 0;

    for (let i = 0; i < meses; i++) {

        montante =
            (montante + aporte) *
            (1 + jurosMensal);
    }

    document.getElementById("resultadoSimulador")
        .innerText =
        "R$ " +
        montante.toLocaleString("pt-BR", {

            minimumFractionDigits: 2
        });
}

// ======================================================
// INSIGHTS
// ======================================================

function gerarInsights() {

    const lista =
        document.getElementById("listaInsights");

    lista.innerHTML = "";

    adicionarInsight(
        "Diversificação",
        "Você pode aumentar sua segurança diversificando seus investimentos."
    );

    adicionarInsight(
        "Renda Passiva",
        "FIIs podem ajudar na geração de renda mensal."
    );

    adicionarInsight(
        "Longo Prazo",
        "Aportes consistentes geram crescimento exponencial."
    );

    adicionarInsight(
        "Perfil",
        "Seu perfil moderado permite equilíbrio entre segurança e crescimento."
    );
}

function adicionarInsight(titulo, texto) {

    const lista =
        document.getElementById("listaInsights");

    lista.innerHTML += `

        <div class="insight-item">

            <div class="insight-tag">
                ${titulo}
            </div>

            <div class="insight-text">
                ${texto}
            </div>

        </div>

    `;
}

gerarInsights();

// ======================================================
// CARTEIRA DINÂMICA
// ======================================================

let carteira =
    JSON.parse(
        localStorage.getItem("carteira")
    ) || [

        {
            nome: "Ações",
            porcentagem: 40,
            classe: "acoes"
        },

        {
            nome: "FIIs",
            porcentagem: 25,
            classe: "fiis"
        },

        {
            nome: "Cripto",
            porcentagem: 15,
            classe: "cripto"
        },

        {
            nome: "Renda Fixa",
            porcentagem: 20,
            classe: "renda-fixa"
        }
    ];

function carregarCarteira() {

    const grid =
        document.getElementById("carteiraGrid");

    grid.innerHTML = "";

    carteira.forEach((ativo, index) => {

        grid.innerHTML += `

            <div class="ativo-item">

                <div class="ativo-topo">

    <span>
        ${ativo.nome}
    </span>

    <div class="ativo-acoes">

        <span>
            ${ativo.porcentagem}%
        </span>

        <button
            class="btn-remover"
            onclick="removerAtivo(${index})">

            ×

        </button>

    </div>

</div>

                <div class="barra">

                    <div
                        class="barra-fill ${ativo.classe}"
                        style="
                            width:
                            ${ativo.porcentagem}%;
                        ">
                    </div>

                </div>

            </div>

        `;
    });
}

carregarCarteira();

// ======================================================
// PERFIL AUTOMÁTICO
// ======================================================

function analisarPerfil() {

    let risco = 0;

    carteira.forEach((ativo) => {

        if (
            ativo.nome === "Cripto"
        ) {

            risco += ativo.porcentagem * 3;
        }

        else if (
            ativo.nome === "Ações"
        ) {

            risco += ativo.porcentagem * 2;
        }

        else if (
            ativo.nome === "FIIs"
        ) {

            risco += ativo.porcentagem * 1.5;
        }

        else {

            risco += ativo.porcentagem;
        }
    });

    let perfilFinal = "";

    if (risco < 140) {

        perfilFinal =
            "Conservador";
    }

    else if (risco < 220) {

        perfilFinal =
            "Moderado";
    }

    else {

        perfilFinal =
            "Agressivo";
    }

    document.getElementById(
        "perfilInvestidor"
    ).innerText =
        perfilFinal;
}

analisarPerfil();

// ======================================================
// ADICIONAR ATIVOS
// ======================================================

function adicionarAtivo() {

    const nome =
        document.getElementById("nomeAtivo").value;

    const porcentagem =
        parseFloat(
            document.getElementById(
                "porcentagemAtivo"
            ).value
        );

    const tipo =
        document.getElementById("tipoAtivo").value;

    // VALIDAÇÃO

    if (
        nome === "" ||
        isNaN(porcentagem)
    ) {

        alert("Preencha os campos.");

        return;
    }

    // NOVO ATIVO

    carteira.push({

        nome: nome,

        porcentagem: porcentagem,

        classe: tipo
    });

    localStorage.setItem(
        "carteira",
        JSON.stringify(carteira)
    );

    // RECARREGAR

    carregarCarteira();

    analisarPerfil();

    criarGraficoCarteira();

    // LIMPAR CAMPOS

    document.getElementById(
        "nomeAtivo"
    ).value = "";

    document.getElementById(
        "porcentagemAtivo"
    ).value = "";
}

// ======================================================
// REMOVER ATIVO
// ======================================================

function removerAtivo(index) {

    carteira.splice(index, 1);

    localStorage.setItem(
        "carteira",
        JSON.stringify(carteira)
    );

    carregarCarteira();

    analisarPerfil();

    criarGraficoCarteira();
}

// ======================================================
// GRÁFICO DA CARTEIRA
// ======================================================

function criarGraficoCarteira() {

    const ctx =
        document.getElementById(
            "graficoCarteira"
        );

    if (!ctx) return;

    const labels =
        carteira.map(ativo => ativo.nome);

    const valores =
        carteira.map(
            ativo => ativo.porcentagem
        );

    if (graficoCarteira) {

    graficoCarteira.destroy();
}

graficoCarteira = new Chart(ctx, {

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
                    "#14b8a6"
                ],

                borderWidth: 0
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "70%",

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

criarGraficoCarteira();