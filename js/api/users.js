const colaboradores = ['emanuel.bravo', 'leonardo.maciel', 'joao.tavares', 'caio.caldeira', 'geovanna.alves', 'matheus.lopes', 'kaue.santos', 'felipe.deoliveira', 'daniel.berbert', 'lucas.alves', 'leandro.ribeiro', 'matheus.casagrande', 'paulo.martins', 'bruno.luz', 'arthur.othero', 'thalisson.santos', 'marcos.alexandria', 'joao.seixas'];
// Inicia a criação dos cards
colaboradores.forEach(colaborador => adicionarCard(colaborador));

// Adiciona o listener para os botões "Ver Perfil"
document.querySelector('.div-cards-index').addEventListener('click', (event) => {
    const targetButton = event.target.closest('.card-index__btn-ver-mais');

    if (targetButton) {
        const username = targetButton.dataset.username;

        localStorage.setItem('perfilUsername', username);

        window.location.href = 'perfil.html';
    }
});