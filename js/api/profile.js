// renderiza o card HTML de um projeto.
let informacoes = []
async function carregarDados() {
    //busca as informações do json
    informacoes = await lerInfos()
}

async function renderizarCardProjeto(projeto) {
    const badgesHtml = await criarVetorBadges(projeto.id);

    const vetorLinks = await pegaImagensProjeto(projeto.id);
    if (vetorLinks && vetorLinks.length > 0) {
        return `
            <div class="card-tela-perfil">
                <figure class="figure-card-tela-perfil">
                <img 
                    src="${vetorLinks[0]}" 
                    alt="Imagem do projeto ${projeto.name}" 
                    class="img-card-tela-perfil"
                > 
                    <figcaption>Imagem do projeto ${projeto.name}</figcaption> 
                </figure>
                <div class="conteudo-card-tela-perfil">
                    <div class="titulo-descricao-tela-perfil">
                        <h2 class="title-card-tela-perfil">${projeto.name}</h2>
                        <p class="descricao-card-tela-perfil">${projeto.description || 'Sem descrição.'}</p>
                    </div>
                    <div class="badges-card-projeto">
                        ${badgesHtml.map(badge => `
                                <img src="${badge}" alt="${badge}">
                                `)
            }
                    </div>
                    <button class="btn-ver-mais" data-project-id="${projeto.id}">Ver Mais</button>
                </div>
            </div>
        `;
    }

}
/**
// Preenche o card principal do perfil
async function preencherCardPerfil(usuario, resp, sup, badges, form) { //usuario vem da API, os demais vem do JSON
    if (!usuario) return;
    const projetos = await pegaProjetosDoUsuario(usuario.id)
    const resultado = projetos.find((proj) => {
        return proj.name === usuario.username
    })

    let readmePessoal = null;
    let readmePessoal2 = 'Nenhum README encontrado no GitLab do usuário'
    try {
        readmePessoal = await pegaConteudoRawReadme(resultado);
        if (readmePessoal) {
            readmePessoal2 = marked.parse(readmePessoal);
        }
    }
    catch (error) {
        console.warn("User sem README")
    }


    // Usa a função de utils.js para carregar o avatar principal
    const nomeEl = document.querySelector('.nome');
    const fotoEl = document.querySelector('.foto-usuario');
    const descricaoEl = document.querySelector('.descricao'); // Bio curta
    const bioCompletaEl = document.querySelector('.caixa-quem-sou-eu'); // "Quem sou eu"
    const linkGitlabEl = document.querySelector('.link-gitlab');
    const linkLinkedinEl = document.querySelector('.link-linkedin');
    const butDownload = document.querySelector('.baixar-curriculo');
    //carregados pelo JSON
    const cardFormacoes = document.getElementById('formacao-desktop');
    const cardBadges = document.querySelector('.badges-section')
    const resp_tec = document.querySelector('.nome-lider-resp');
    const superv = document.querySelector('.nome-lider-sup')

    if (cardFormacoes) {
        cardFormacoes.innerHTML = readmeFormacoes || "README DE FORMAÇÕES NÃO ENCONTRADO"
    }
    else {
        cardFormacoes.innerHTML = "README DE FORMAÇÕES NÃO ENCONTRADO"
    }

    //botao de download
    butDownload.dataset.username = usuario.username


    if (cardBadges) {
        cardBadges.innerHTML = '';
        const badgesHTML = Object.entries(badges)
            .map(([linguagem, dados]) => {
                const nivel = dados.nivel;
                let estrelasHTML = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= nivel) {
                        //preenchida
                        estrelasHTML += `
                        <figure><img src="imagens/icones/estrela-preenchida.svg" alt="" class="icon-estrela">
                            <figcaption></figcaption>
                        </figure>
                    `;
                    } else {
                        //vazia
                        estrelasHTML += `
                        <figure><img src="imagens/icones/estrela-vazia.svg" alt="" class="icon-estrela">
                            <figcaption></figcaption>
                        </figure>
                    `;
                    }
                }

                return `
                <div class="badges">

                    <figure class="badge-house"><img class="badge-icon" src="imagens/badges/${linguagem}.svg" alt="">
                        <figcaption></figcaption>
                    </figure>

                    <p class="exp-texto">${dados.descricao}</p>

                    <div class="estrelas-badges">
                        ${estrelasHTML}
                    </div>

                </div>
            `;
            })
            .join('');
        cardBadges.innerHTML = badgesHTML;
    }



    //if (cardFormacoes) cardFormacoes.innerHTML = form;
    //if (cardBadges) cardBadges.innerHTML = badges;
    if (resp_tec) resp_tec.innerHTML = resp;
    if (superv) superv.innerHTML = sup;

    if (nomeEl) nomeEl.textContent = usuario.name || 'Nome não informado';
    if (fotoEl) fotoEl.src = usuario.avatar_url;
    if (descricaoEl) descricaoEl.textContent = usuario.bio || 'Sem descrição.';
    if (bioCompletaEl) bioCompletaEl.innerHTML = readmePessoal2 || 'Nenhuma informação adicional fornecida.';

    // Atualiza links sociais
    if (linkGitlabEl) {
        linkGitlabEl.href = usuario.web_url;
        linkGitlabEl.target = '_blank';
    }
    if (linkLinkedinEl) {
        linkLinkedinEl.href = `https://${usuario.linkedin}`;
        linkLinkedinEl.target = '_blank';
    }
}
*/
// Preenche o card principal do perfil
async function preencherCardPerfil(usuario, todosOsProjetos, resp, sup, badges) {
    if (!usuario) return;
    const resultado = todosOsProjetos.find((proj) => {
        return proj.name === usuario.username
    })

    let readmePessoal = null;
    let readmePessoal2 = 'Nenhum README encontrado no GitLab do usuário'
    try {
        readmePessoal = await pegaConteudoRawReadme(resultado);
        if (readmePessoal) {
            readmePessoal2 = marked.parse(readmePessoal);
        }
    }
    catch (error) {
        console.warn("User sem README")
    }

    const result = todosOsProjetos.find((proj) => {
        return proj.name === usuario.username + '.formacoes'
    })

    let readmeFormacoes = null;
    let readmeFormacoes2 = 'Nenhum README de formações encontrado'
    try {
        readmeFormacoes = await pegaConteudoRawReadme(result);
        if (readmeFormacoes) {
            readmeFormacoes2 = marked.parse(readmeFormacoes);
        }
    }
    catch (error) {
        console.warn("User sem README de formações")
    }


    // Usa a função de utils.js para carregar o avatar principal
    const nomeEl = document.querySelector('.nome');
    const fotoEl = document.querySelector('.foto-usuario');
    const descricaoEl = document.querySelector('.descricao'); // Bio curta
    const bioCompletaEl = document.querySelector('.caixa-quem-sou-eu'); // "Quem sou eu"
    const linkGitlabEl = document.querySelector('.link-gitlab');
    const linkLinkedinEl = document.querySelector('.link-linkedin');
    const linkTeamsEl = document.querySelector('.link-teams');
    const butDownload = document.querySelector('.baixar-curriculo');
    //carregados pelo JSON
    const cardFormacoes = document.getElementById('formacao-desktop');
    const cardBadges = document.querySelector('.badges-section')
    const resp_tec = document.querySelector('.nome-lider-resp');
    const superv = document.querySelector('.nome-lider-sup')

    if (cardFormacoes) {
        cardFormacoes.innerHTML = readmeFormacoes2;
    }
    else {
        cardFormacoes.innerHTML = "README DE FORMAÇÕES NÃO ENCONTRADO"
    }

    //botao de download
    butDownload.dataset.username = usuario.username


    if (cardBadges) {
        cardBadges.innerHTML = '';
        const badgesHTML = Object.entries(badges)
            .map(([linguagem, dados]) => {
                const nivel = dados.nivel;
                let estrelasHTML = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= nivel) {
                        //preenchida
                        estrelasHTML += `
                        <figure><img src="imagens/icones/estrela-preenchida.svg" alt="" class="icon-estrela">
                            <figcaption></figcaption>
                        </figure>
                    `;
                    } else {
                        //vazia
                        estrelasHTML += `
                        <figure><img src="imagens/icones/estrela-vazia.svg" alt="" class="icon-estrela">
                            <figcaption></figcaption>
                        </figure>
                    `;
                    }
                }

                return `
                <div class="badges">

                    <figure class="badge-house"><img class="badge-icon" src="imagens/badges/${linguagem}.svg" alt="">
                        <figcaption></figcaption>
                    </figure>

                    <p class="exp-texto">${dados.descricao}</p>

                    <div class="estrelas-badges">
                        ${estrelasHTML}
                    </div>

                </div>
            `;
            })
            .join('');
        cardBadges.innerHTML = badgesHTML;
    }



    //if (cardFormacoes) cardFormacoes.innerHTML = form;
    //if (cardBadges) cardBadges.innerHTML = badges;
    if (resp_tec) resp_tec.innerHTML = resp;
    if (superv) superv.innerHTML = sup;

    if (nomeEl) nomeEl.textContent = usuario.name || 'Nome não informado';
    if (fotoEl) fotoEl.src = usuario.avatar_url;
    if (descricaoEl) descricaoEl.textContent = usuario.bio || 'Sem descrição.';
    if (bioCompletaEl) bioCompletaEl.innerHTML = readmePessoal2 || 'Nenhuma informação adicional fornecida.';

    // Atualiza links sociais
    if (linkGitlabEl) {
        linkGitlabEl.href = usuario.web_url;
        linkGitlabEl.target = '_blank';
    }
    if (linkLinkedinEl) {
        linkLinkedinEl.href = `https://${usuario.linkedin}`;
        linkLinkedinEl.target = '_blank';
    }
    linkTeamsEl.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `mailto:${usuario.username}@pdcase.com.br`;
    });
}

// busca todos os dados iniciais do perfil (JSON e API)
async function buscarDadosIniciais(username) {
    // 1. Carrega dados do info.json
    const response = await fetch('./info.json');
    if (!response.ok) {
        throw new Error('Erro ao carregar info.json');
    }
    informacoes = await response.json();
    const dadosUsuario = informacoes.find(usuario => usuario.nome === username);

    // 2. Busca dados da API
    const usuarioBasico = await pegaUsuarioPeloUsername(username);
    if (!usuarioBasico) {
        throw new Error('Usuário não encontrado.');
    }
    const userId = usuarioBasico.id;

    const [usuarioDetalhado, todosOsProjetos] = await Promise.all([
        pegaDetalhesDoUsuario(userId),
        pegaProjetosDoUsuario(userId)
    ]);

    // 3. Filtra os projetos
    const nomeProjetoReadme = username;
    const nomeProjetoFormacoes = `${username}.formacoes`;
    const projetosFiltrados = todosOsProjetos.filter(projeto => {
        return projeto.name !== nomeProjetoReadme && projeto.name !== nomeProjetoFormacoes;
    });

    return { usuarioDetalhado, todosOsProjetos, projetosFiltrados, dadosUsuario };
}

// renderiza as listas de projetos (individuais e compartilhados)
async function renderizarProjetos(projetos, usuarioDetalhado) {
    const containerMeusProjetos = document.querySelector('.container-meus-projetos .container-card-tela-perfil');
    const containerProjetosCompartilhados = document.querySelector('.container-projetos-compartilhados .container-card-tela-perfil');

    containerMeusProjetos.innerHTML = '';
    containerProjetosCompartilhados.innerHTML = '';

    let meusProjetosCount = 0;
    let projetosCompartilhadosCount = 0;

    // Promise.all para renderizar cards E buscar colaboradores em paralelo
    const cardsPromises = projetos.map(async (projeto) => {
        const [cardHtml, colaboradores] = await Promise.all([
            renderizarCardProjeto(projeto),
            pegaColaboradoresDoProjeto(projeto.id)
        ]);

        const collaboratorCount = colaboradores.length;
        const isOwner = (usuarioDetalhado && projeto.namespace.kind === 'user' && projeto.namespace.name === usuarioDetalhado.name);

        let listType;
        if (isOwner && collaboratorCount === 1) {
            listType = 'individual'; // caso seja dono do projeto e único colaborador
        } else {
            listType = 'shared'; // caso contrário, é compartilhado
        }

        return { html: cardHtml, type: listType };
    });

    const renderedCards = await Promise.all(cardsPromises);

    renderedCards.forEach(cardData => {
        if (cardData.type === 'individual' && meusProjetosCount < 4) {
            containerMeusProjetos.innerHTML += cardData.html;
            meusProjetosCount++;
        } else if (cardData.type === 'shared' && projetosCompartilhadosCount < 4) {
            containerProjetosCompartilhados.innerHTML += cardData.html;
            projetosCompartilhadosCount++;
        }
    });

    // Adiciona mensagens caso não existam projetos
    if (meusProjetosCount === 0) {
        containerMeusProjetos.innerHTML = '';
    }
    if (projetosCompartilhadosCount === 0) {
        containerProjetosCompartilhados.innerHTML = '';
    }
}

// adiciona os listeners de clique para os botões "Ver Mais"
function adicionarListenersDeNavegacao() {
    const containersProjetos = document.querySelectorAll('.container-card-tela-perfil');
    containersProjetos.forEach(container => {
        container.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.btn-ver-mais'); // Procura pelo botão
            if (targetButton && targetButton.dataset.projectId) {
                const projectId = targetButton.dataset.projectId;
                localStorage.setItem('projetoId', projectId); // Salva o ID do projeto clicado
                window.location.href = 'projeto.html'; // Navega para a página do projeto
            }
        });
    });
}

// função principal que executa quando a página de perfil carrega
document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('perfilUsername');

    if (!username) {
        document.body.innerHTML = '<h1>Usuário não especificado.</h1>';
        return;
    }

    try {
        // 1. Buscar todos os dados (JSON e API)
        const { usuarioDetalhado, todosOsProjetos, projetosFiltrados, dadosUsuario } = await buscarDadosIniciais(username);

        // 2. Extrair dados do JSON
        const responsavel = dadosUsuario ? dadosUsuario.responsavel_tecnico : '-';
        const supervisor = dadosUsuario ? dadosUsuario.supervisor : '-';
        const badges = dadosUsuario ? dadosUsuario.badges : '-';

        // 3. Preencher o card de perfil
        await preencherCardPerfil(usuarioDetalhado, todosOsProjetos, responsavel, supervisor, badges);

        // 4. Renderizar os cards de projeto
        await renderizarProjetos(projetosFiltrados, usuarioDetalhado);

        // 5. Adicionar listeners de navegação
        adicionarListenersDeNavegacao();

    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        document.body.innerHTML = `<h1>Erro ao carregar o perfil.</h1><p>${error.message}</p>`;
    }
});