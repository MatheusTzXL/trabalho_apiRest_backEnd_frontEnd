const listaVeiculos = document.getElementById('lista-veiculos');
const addVeiculoButton = document.getElementById('add-veiculo');
const updateVeiculoButton = document.getElementById('update-veiculo');

addVeiculoButton.addEventListener('click', () => {
  const modelo = document.getElementById('modelo').value;
  const ano = document.getElementById('ano').value;
  const preco = document.getElementById('preco').value;

  fetch('http://127.0.0.1:5000/veiculos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ modelo, ano, preco }),
  })
  .then(response => response.json())
  .then(() => {
    listarVeiculos(); // Recarrega a lista após adicionar
  });
});

function listarVeiculos() {
  fetch('http://127.0.0.1:5000/veiculos')
    .then(response => response.json())
    .then(veiculos => {
      listaVeiculos.innerHTML = ''; // Limpa a lista
      veiculos.forEach(veiculo => {
        const itemVeiculo = document.createElement('li');
        const precoFormatado = parseFloat(veiculo.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        itemVeiculo.innerHTML = `${veiculo.modelo} - Ano: ${veiculo.ano} - Preço: ${precoFormatado} 
          <button onclick="prepararAtualizacao(${veiculo.id}, '${veiculo.modelo}', ${veiculo.ano}, ${veiculo.preco})">Atualizar</button>
          <button onclick="deletarVeiculo(${veiculo.id})">Excluir</button>`;
        listaVeiculos.appendChild(itemVeiculo);
      });
    });
}

function deletarVeiculo(veiculoId) {
  fetch(`http://127.0.0.1:5000/veiculos/${veiculoId}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(() => {
    listarVeiculos(); // Recarrega a lista após excluir
  });
}

function prepararAtualizacao(id, modelo, ano, preco) {
  document.getElementById('update-id').value = id;
  document.getElementById('update-modelo').value = modelo;
  document.getElementById('update-ano').value = ano;
  document.getElementById('update-preco').value = preco;
}

updateVeiculoButton.addEventListener('click', () => {
  const id = document.getElementById('update-id').value;
  const modelo = document.getElementById('update-modelo').value;
  const ano = document.getElementById('update-ano').value;
  const preco = document.getElementById('update-preco').value;

  fetch(`http://127.0.0.1:5000/veiculos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ modelo, ano, preco }),
  })
  .then(response => response.json())
  .then(() => {
    listarVeiculos(); // Recarrega a lista após atualizar
    // Limpa o formulário de atualização
    document.getElementById('update-id').value = '';
    document.getElementById('update-modelo').value = '';
    document.getElementById('update-ano').value = '';
    document.getElementById('update-preco').value = '';
  });
});

// Carrega a lista de veículos ao iniciar
listarVeiculos();
