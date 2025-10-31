const colaboradores = ['emanuel.bravo', 'leonardo.maciel', 'joao.tavares', 'caio.caldeira', 'geovanna.alves', 'Matheus.lopes', 'kaue.santos', 'felipe.deoliveira', 'daniel.berbert', 'lucas.alves', 'leandro.ribeiro', 'matheus.casagrande', 'paulo.martins', 'bruno.luz', 'arthur.othero', 'thalisson.santos', 'marcos.alexandria', 'joao.seixas'];
//const colaboradores = ['emanuel.bravo', 'leonardo.maciel', 'geovanna.alves', 'matheus.lopes'];

let informacoes = [];

async function carregarDados() {
    informacoes = await lerInfos()
}

// monta e adiciona o card de um colaborador na página.
async function adicionarCard(pessoa) {
    // Usa a função de utils.js
    const usuarioBasico = await pegaUsuarioPeloUsername(pessoa);
    if (!usuarioBasico) {
        console.warn(`Usuário ${pessoa} não encontrado ou API falhou.`);
        return;
    }

    // Usa a função de utils.js para pegar detalhes (incluindo bio)
    const usuarioDetalhado = await pegaDetalhesDoUsuario(usuarioBasico.id);
    const bio = usuarioDetalhado ? usuarioDetalhado.bio : '';
    const avatarUrl = usuarioBasico.avatar_url;

    const dadosUsuario = informacoes.find(usuario => usuario.nome === pessoa)
    console.log(dadosUsuario.nome)
    const responsavel = dadosUsuario ? dadosUsuario.responsavel_tecnico : '-';
    const supervisor = dadosUsuario ? dadosUsuario.supervisor : '-';
    const badges = dadosUsuario ? dadosUsuario.badges : '-';
    const formacoes = dadosUsuario ? dadosUsuario.formacoes : '-';

    const divMae = document.querySelector('.div-cards-index');

    const badgesHTML = Object.entries(badges)
        .map(([linguagem, dados]) => `
            <img src="./../imagens/badges/${linguagem}.svg"
                alt="${linguagem}"
                title="${dados.descricao} (Nível ${dados.nivel})"
                class="card-index__badges">
        `)
        .join('');


    divMae.innerHTML += `
        <article
            data-name="${usuarioBasico.name}"
            class="col card-index d-flex flex-column justify-content-center align-items-center m-0 p-0 position-relative">
            <div class="card-index__retangulo-amarelo position-absolute top-0 start-0 position-relative">
                <figure class="m-0">
                <img
                    src="${avatarUrl || '/imagens/icones/user.svg'}"
                    alt="foto padrão"
                    class="card-index__foto rounded-circle position-absolute top-100 start-50 translate-middle"
                />
                    <figcaption>Foto padrão</figcaption>
                </figure>
            </div>
            <div class="card-index__conteudo d-flex flex-column justify-content-evenly align-items-center ">
                <div class=" d-flex flex-column justify-content-evenly align-items-center">
                    <h2 class="card-index__nome text-capitalize m-0 p-0">${usuarioBasico.name}</h2>
                    <p class="card-index__descricao text-center lh-sm m-0 p-0">${bio || ''}</p>
                </div>
                <div class="w-100 d-flex justify-content-center align-items-center flex-wrap gap-1 gap-md-2">
                    ${badgesHTML}
                </div>
                <div class="w-100 d-flex justify-content-evenly align-items-center m-0 p-0">
                    <div class="card-index__coordenadores d-flex justify-content-center align-items-center gap-1">
                        <img src="./../imagens/icones/Responsável Tecnico.svg" alt="responsável técnico"
                            class="card-index__icones">
                        <div class="div-dos-chefes">
                            <h2 class="fw-bold">Responsável técnico:</h2>
                            <p>${responsavel}</p>
                        </div>
                    </div>
                    <div class="card-index__coordenadores d-flex justify-content-center align-items-center gap-1">
                        <img src="/../imagens/icones/Supervisor.svg" alt="icone supervisor" class="card-index__icones">
                        <div class="div-dos-chefes">
                            <h2 class="fw-bold">Supervisor:</h2>
                            <p>${supervisor}</p>
                        </div>
                    </div>
                </div>
                <button
                    data-username="${usuarioBasico.username}"
                    data-id="${usuarioBasico.id}"
                    class="card-index__btn-ver-mais d-flex justify-content-center align-items-center border border-0 text-decoration-none ">
                    Ver Perfil
                </button>
            </div>
        </article>
    `;
}

// Inicializa tudo
async function inicializar() {
    await carregarDados(); // Aguarda o carregamento do badges.json
    colaboradores.forEach(colaborador => adicionarCard(colaborador));


    // Evento de redirecionamento
    document.querySelector('.div-cards-index').addEventListener('click', (event) => {
        const targetButton = event.target.closest('.card-index__btn-ver-mais');
        if (targetButton) {
            const username = targetButton.dataset.username;
            localStorage.setItem('perfilUsername', username);
            //localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
            window.location.href = 'perfil.html';
        }
    });
}

inicializar();