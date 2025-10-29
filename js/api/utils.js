const GITLAB_TOKEN = window.env.GITLAB_TOKEN;
const gitlabApiUrl = 'https://git.pdcase.com/api/v4';
const gitlabBaseUrl = 'https://git.pdcase.com';

// Headers de autenticação
const authHeaders = {
    "PRIVATE-TOKEN": GITLAB_TOKEN
};

// busca os dados básicos de um usuário pelo username.
async function pegaUsuarioPeloUsername(username) {
    try {
        const response = await fetch(`${gitlabApiUrl}/users?username=${username}`, { headers: authHeaders });
        if (!response.ok) throw new Error(`Usuário ${username} não encontrado ou erro ${response.status}`);
        const data = await response.json();
        return data[0]; // Retorna o primeiro usuário encontrado
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    }
}

// busca os detalhes completos do usuário (incluindo bio) pelo ID.
async function pegaDetalhesDoUsuario(id) {
    try {
        const response = await fetch(`${gitlabApiUrl}/users/${id}`, { headers: authHeaders });
        if (!response.ok) throw new Error(`Detalhes do usuário ${id} não encontrados ou erro ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
        return null;
    }
}

// pega todos os projetos (próprios e compartilhados) de um usuário pelo ID.
async function pegaProjetosDoUsuario(userId) {
try {
    const response = await fetch(`${gitlabApiUrl}/users/${userId}/projects`, { headers: authHeaders });
    if (!response.ok) throw new Error(`Projetos do usuário ${userId} não encontrados ou erro ${response.status}`);
    return await response.json();
} catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return []; // Retorna um array vazio em caso de erro
}
}

// pega detalhes de um projeto específico pelo ID.
async function pegaDetalhesDoProjeto(id) {
try {
    const response = await fetch(`${gitlabApiUrl}/projects/${id}`, { headers: authHeaders });
    if (!response.ok) throw new Error(`Projeto ${id} não encontrado ou erro ${response.status}`);
    return await response.json();
} catch (error) {
    console.error("Erro ao buscar detalhes do projeto:", error);
    return null;
}
}

// pega link de aplicação no ar de um projeto específico pelo ID.
async function pegaBadgesAplicacaoProjeto(id) {
try {
    const response = await fetch(`${gitlabApiUrl}/projects/${id}/badges`, { headers: authHeaders });
    if (!response.ok) throw new Error(`Projeto ${id} não encontrado ou erro ${response.status}`);
    const badges = await response.json();
    return badges;
} catch (error) {
    console.error("Erro ao buscar badges do projeto:", error);
    return null;
}
}

// função auxiliar para carregar avatares e imagens privadas como Blob URLs.
async function carregarImagemPrivada(url) {
    if (!url) {
        return '/imagens/icones/user.svg'; // imagem genérica
    }

    try {
        const response = await fetch(url, { headers: authHeaders });
        if (!response.ok) throw new Error(`Falha ao carregar imagem: ${response.status}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error(`Erro ao carregar imagem privada (${url}): `, error);
        return '/imagens/icones/user.svg'; // imagem genérica
    }
}

// lista os arquivos da pasta 'screenshots' de um projeto.
async function listaImagensDoRepositorio(id) {
    const path = 'screenshots'; // Pasta padrão das imagens
    try {
        const response = await fetch(`${gitlabApiUrl}/projects/${id}/repository/tree?path=${path}`, { headers: authHeaders });
        if (!response.ok) {
            if (response.status === 404) return []; // Pasta não existe ou vazia
            throw new Error(`Erro ${response.status} ao listar arquivos do projeto ${id}`);
        }
        const files = await response.json();
        // Garante que só retorna arquivos, não subpastas
        return files.filter(file => file.type === 'blob');
    } catch (error) {
        console.error("Erro ao listar imagens do repositório:", error);
        return [];
    }
}

// busca os membros (colaboradores) de um projeto.
async function pegaColaboradoresDoProjeto(id) {
    try {
        const response = await fetch(`${gitlabApiUrl}/projects/${id}/users`, { headers: authHeaders });
        if (!response.ok) throw new Error(`Erro ${response.status} ao buscar colaboradores do projeto ${id}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
        return [];
    }
}

// encontra a URL da imagem 'card' (com qualquer extensão comum) na pasta /screenshots de um projeto
async function encontraUrlImagemCardProjeto(projetoId, projetoPathComNamespace) {
    //Usa a função existente para listar arquivos na pasta screenshots
    const imageFiles = await listaImagensDoRepositorio(projetoId);

    if (!imageFiles || imageFiles.length === 0) {
        return null; //nenhuma imagem encontrada na pasta
    }

    //Procura por um arquivo chamado 'card' com extensões comuns
    const cardImageFile = imageFiles.find(file =>
        file.name.match(/^card\.(png|jpg|jpeg|gif|svg|webp)$/i) //Regex para 'card.' + extensão
    );

    if (cardImageFile) {
        const projetoDetalhes = await pegaDetalhesDoProjeto(projetoId);
        const branch = (projetoDetalhes && projetoDetalhes.default_branch) ? projetoDetalhes.default_branch : 'main';

        const filePathEncoded = cardImageFile.path.split('/').map(encodeURIComponent).join('/');
        return `${gitlabBaseUrl}/${projetoPathComNamespace}/-/raw/${encodeURIComponent(branch)}/${filePathEncoded}`;
    }

    return '/imagens/logo/projeto-sem-foto.png';
}

async function pegaLinguagens(idProjeto) {
    const response = await fetch(`${gitlabApiUrl}/projects/${idProjeto}/languages`, { headers: authHeaders });
    return await response.json()
}

async function criarVetorBadges(idProjeto) {
    const response = await pegaLinguagens(idProjeto);
    const nomesLinguagens = Object.keys(response);
    const imgsBadges = [];
    nomesLinguagens.map((linguagem) => {
        imgsBadges.push(`imagens/badges/${linguagem.toLowerCase()}.svg`)
    })
    return imgsBadges;
}

async function pegaImagensProjeto(idProjeto) {
    const path = 'screenshots';
    const files = await listaImagensDoRepositorio(idProjeto);

    const imagens = (files || []).filter(arquivo =>
        arquivo.type === "blob" &&
        /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(arquivo.name)
    );

    if (imagens.length === 0) {
        return ['/imagens/logo/projeto-sem-foto.png']
    }

    //obtém branch padrão do projeto
    const projetoDetalhes = await pegaDetalhesDoProjeto(idProjeto);
    const branch = (projetoDetalhes && projetoDetalhes.default_branch) ? projetoDetalhes.default_branch : 'main';

    //gwra links diretos para cada imagem usando API de files/raw com ref correto
    const linkImg = imagens.map(img =>
        `${gitlabApiUrl}/projects/${idProjeto}/repository/files/${encodeURIComponent(img.path)}/raw?ref=${encodeURIComponent(branch)}`
    );

    return linkImg;
}

async function pegaConteudoRawReadme(projeto) {
    if (!projeto.id) {
        console.warn("Projeto não encontrado");
        return null;
    }
    const path = encodeURIComponent('READ.md');
    const urlReadMe = `${gitlabApiUrl}/projects/${projeto.id}/repository/files/README.md/raw?ref=main`;

    try {
        const response = await fetch(urlReadMe, { headers: authHeaders })
        if (!response.ok) {
            console.warn(`README.md não encontrado no projeto ${projeto.name}`);
            return null;
        }
        return response.text()
    }
    catch {
        console.error("Outro erro ao buscar README");
        return null;
    }
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
    const divMae = document.querySelector('.div-cards-index');

    //pegando supervisor e responsável
    //const nome_resp = responsavel_tecnico(usuarioBasico.username)
    //const supervisor = supervisor(usuarioBasico.username)
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
                    <img src="./../imagens/badges/HTML.svg" alt="HTML" class="card-index__badges">
                    <img src="./../imagens/badges/CSS.svg" alt="CSS" class="card-index__badges">
                    <img src="./../imagens/badges/Javascript.svg" alt="Javascript" class="card-index__badges">
                    <img src="./../imagens/badges/PostgreSQL.svg" alt="PostgreSQL" class="card-index__badges">
                    <img src="./../imagens/badges/Python.svg" alt="python" class="card-index__badges">
                    <img src="./../imagens/badges/C++.svg" alt="C++" class="card-index__badges">
                    <img src="./../imagens/badges/Bootstrap.svg" alt="Bootstrap" class="card-index__badges">
                    <img src="./../imagens/badges/Figma.svg" alt="Figma" class="card-index__badges">
                    <img src="./../imagens/badges/Github.svg" alt="Github" class="card-index__badges">
                    <img src="./../imagens/badges/Gitlab.svg" alt="Gitlab" class="card-index__badges">
                </div>
                <div class="w-100 d-flex justify-content-evenly align-items-center m-0 p-0">
                    <div class="card-index__coordenadores d-flex justify-content-center align-items-center gap-1">
                        <img src="./../imagens/icones/Responsável Tecnico.svg" alt="responsável técnico"
                            class="card-index__icones">
                        <div>
                            <h2 class="fw-bold">Responsável técnico:</h2>
                            <p>Júlio Pereira</p>
                        </div>
                    </div>
                    <div class="card-index__coordenadores d-flex justify-content-center align-items-center gap-1">
                        <img src="/../imagens/icones/Supervisor.svg" alt="icone supervisor" class="card-index__icones">
                        <div>
                            <h2 class="fw-bold">Supervisor:</h2>
                            <p>Tiago Martins</p>
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