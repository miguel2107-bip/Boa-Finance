 document.addEventListener('DOMContentLoaded', () => {
  const btnNovoGasto = document.getElementById('btnNovoGasto');
  const modalAdicionarGasto = document.getElementById('modalAdicionarGasto');
  const closeButton = document.querySelector('.close-button');
  const formGasto = document.getElementById('formGasto');
  const listaGastosDiv = document.getElementById('listaGastos');
  const totalGastosSpan = document.getElementById('totalGastos');

  // Função para abrir o modal
  if (btnNovoGasto) {
    btnNovoGasto.addEventListener('click', () => {
      if (modalAdicionarGasto) {
        modalAdicionarGasto.setAttribute('style', 'display: flex !important');
      }
    });
  }

  // Função para fechar o modal
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      if (modalAdicionarGasto) {
        modalAdicionarGasto.setAttribute('style', 'display: none !important');
        formGasto.reset(); // Limpa o formulário ao fechar
      }
    });
  }

  // Fechar o modal clicando fora dele
  window.addEventListener('click', (event) => {
    if (event.target === modalAdicionarGasto) {
      modalAdicionarGasto.setAttribute('style', 'display: none !important');
      formGasto.reset();
    }
  });

  // Função para salvar um novo gasto
  if (formGasto) {
    formGasto.addEventListener('submit', (event) => {
      event.preventDefault();

      const descricao = document.getElementById('descricaoGasto').value;
      const valor = parseFloat(document.getElementById('valorGasto').value);
      const categoria = document.getElementById('categoriaGasto').value;
      const data = document.getElementById('dataGasto').value;

      if (!descricao || isNaN(valor) || !categoria) {
        alert('Por favor, preencha todos os campos obrigatórios (Descrição, Valor, Categoria).');
        return;
      }

      const novoGasto = {
        descricao,
        valor,
        categoria,
        data: data || new Date().toISOString().split('T')[0] // Data atual se não for fornecida
      };

      let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
      gastos.push(novoGasto);
      localStorage.setItem('gastos', JSON.stringify(gastos));

      alert('Gasto salvo com sucesso!');
      if (modalAdicionarGasto) {
        modalAdicionarGasto.setAttribute('style', 'display: none !important');
        formGasto.reset();
      }
      carregarGastos();
      atualizarTotalGastos();
    });
  }

  // Função para carregar e exibir os gastos
  function carregarGastos() {
    if (!listaGastosDiv) return;

    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    listaGastosDiv.innerHTML = ''; // Limpa a lista antes de recarregar

    if (gastos.length === 0) {
      listaGastosDiv.innerHTML = '<p style="color: var(--muted); text-align: center;">Nenhum gasto registrado ainda.</p>';
      return;
    }

    gastos.forEach((gasto, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="gasto-info">
          <h3>${gasto.descricao}</h3>
          <span class="gasto-valor">- R$ ${gasto.valor.toFixed(2).replace('.', ',')}</span>
        </div>
        <p>Categoria: <span class="gasto-categoria">${gasto.categoria}</span></p>
        <p class="gasto-data">Data: ${gasto.data}</p>
        <button class="btn-excluir" data-index="${index}">Excluir</button>
      `;
      listaGastosDiv.appendChild(card);
    });

    // Adicionar event listeners para os botões de exclusão
    listaGastosDiv.querySelectorAll('.btn-excluir').forEach(button => {
      button.addEventListener('click', (event) => {
        const indexParaExcluir = parseInt(event.target.dataset.index);
        excluirGasto(indexParaExcluir);
      });
    });
  }

  // Função para excluir um gasto
  function excluirGasto(index) {
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.splice(index, 1);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    alert('Gasto excluído com sucesso!');
    carregarGastos();
    atualizarTotalGastos();
  }

  // Função para atualizar o total de gastos
  function atualizarTotalGastos() {
    if (!totalGastosSpan) return;

    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
    totalGastosSpan.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  // Inicializar carregando os gastos e o total ao carregar a página
  carregarGastos();
  atualizarTotalGastos();

  // Adicionar a função atualizarMesAtual() do script.js, se existir
  if (typeof atualizarMesAtual === 'function') {
    atualizarMesAtual();
  }
});