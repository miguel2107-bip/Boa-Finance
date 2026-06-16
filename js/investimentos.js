// ======================================================
// DADOS
// ======================================================

let perfil = "Moderado";

let graficoCarteira = null;

function calcularPatrimonio() {

    return carteira.reduce((total, ativo) => {

        return total + (parseFloat(ativo.valor) || 0);

    }, 0);
}

function calcularRentabilidade() {

    if (carteira.length === 0) return 0;

    const taxas = {

        "renda-fixa": 10,

        "fiis": 12,

        "acoes": 15,

        "cripto": 20

    };

    let soma = 0;

    carteira.forEach((ativo) => {

        soma +=
            ativo.porcentagem *
            (taxas[ativo.classe] || 0);

    });

    return soma / 100;
}

// ======================================================
// CARDS
// ======================================================

function atualizarCards() {

    const patrimonio = calcularPatrimonio();

    document.getElementById("patrimonioTotal")
        .innerText =
        patrimonio.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    document.getElementById("rentabilidade")
    .innerText =
    calcularRentabilidade().toFixed(1) + "%";

    const perfilSalvo =
    localStorage.getItem(
        "perfilInvestidor"
    ) || "Não definido";

document.getElementById(
    "perfilInvestidor"
).innerText =
    perfilSalvo;
}

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

    const perfil =
        localStorage.getItem(
            "perfilInvestidor"
        );

    if (perfil === "Conservador") {

        adicionarInsight(
            "Reserva de Emergência",
            "Mantenha de 6 a 12 meses de despesas em investimentos de alta liquidez."
        );

        adicionarInsight(
            "Segurança",
            "Priorize renda fixa e ativos de menor volatilidade."
        );

        adicionarInsight(
            "Diversificação",
            "Evite concentrar todo o patrimônio em um único investimento."
        );
    }

    else if (perfil === "Moderado") {

        adicionarInsight(
            "Equilíbrio",
            "Combine renda fixa e renda variável para equilibrar risco e retorno."
        );

        adicionarInsight(
            "Aportes",
            "Realize aportes mensais para acelerar o crescimento patrimonial."
        );

        adicionarInsight(
            "Rebalanceamento",
            "Revise sua carteira periodicamente para manter sua estratégia."
        );
    }

    else if (perfil === "Arrojado") {

        adicionarInsight(
            "Crescimento",
            "Busque oportunidades de longo prazo sem ignorar a gestão de risco."
        );

        adicionarInsight(
            "Diversificação",
            "Mesmo assumindo mais risco, diversifique setores e classes de ativos."
        );

        adicionarInsight(
            "Disciplina",
            "Evite decisões emocionais durante períodos de volatilidade."
        );
    }

    else {

        adicionarInsight(
            "Perfil não definido",
            "Responda o questionário para receber recomendações personalizadas."
        );
    }
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
    ) || [];

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

        const valor =
    parseFloat(
        document.getElementById("valorAtivo").value
    );

    // VALIDAÇÃO

    if (
        nome === "" ||
        isNaN(porcentagem) ||
        isNaN(valor)
    ) {

        alert("Preencha os campos.");

        return;
    }

    // NOVO ATIVO

    carteira.push({

        nome: nome,

        porcentagem: porcentagem,

        valor: valor,

        classe: tipo
    });

    localStorage.setItem(
        "carteira",
        JSON.stringify(carteira)
    );

    // RECARREGAR

    carregarCarteira();

    atualizarCards();

    //analisarPerfil();

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

    atualizarCards();

    gerarInsights();

    //analisarPerfil();

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

function finalizarQuizPerfil() {

    const q1 =
        document.querySelector(
            'input[name="q1"]:checked'
        );

    const q2 =
        document.querySelector(
            'input[name="q2"]:checked'
        );

    const q3 =
        document.querySelector(
            'input[name="q3"]:checked'
        );

    if (!q1 || !q2 || !q3) {

        alert(
            "Responda todas as perguntas."
        );

        return;
    }

    const total =
        parseInt(q1.value) +
        parseInt(q2.value) +
        parseInt(q3.value);

    let perfil = "";

    if (total <= 4) {

        perfil = "Conservador";

    } else if (total <= 7) {

        perfil = "Moderado";

    } else {

        perfil = "Arrojado";
    }

    localStorage.setItem(
        "perfilInvestidor",
        perfil
    );

    document.getElementById(
        "perfilInvestidor"
    ).innerText = perfil;

    gerarInsights();

    document.getElementById(
        "modalPerfil"
    ).style.display = "none";
}

criarGraficoCarteira();

atualizarCards();

const perfilSalvo =
    localStorage.getItem(
        "perfilInvestidor"
    );

if (perfilSalvo) {

    document.getElementById(
        "modalPerfil"
    ).style.display = "none";

} else {

    document.getElementById(
        "modalPerfil"
    ).style.display = "flex";
}
