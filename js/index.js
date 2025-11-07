document.addEventListener('DOMContentLoaded', () => {
    const filterModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('filterModal'));
    const searchInput = document.getElementById('filter-name');
    const clearBtn = document.getElementById('clear-btn');
    const searchBtn = document.getElementById('search-btn');
    const addFilterBtn = document.getElementById('add-filter-btn');
    const addedFiltersContainer = document.getElementById('added-filters-container');
    const nameInput = document.getElementById('filter-name');
    const cardsContainer = document.querySelector('.div-cards-index');

    const selectionRow = document.getElementById('selection-row');
    const badgeSelect = selectionRow.querySelector('.badge-select');
    const levelSelect = selectionRow.querySelector('.level-select');
    const badgeDropdownMenu = selectionRow.querySelector('.badge-dropdown-menu');
    const levelDropdownMenu = selectionRow.querySelector('.level-dropdown-menu');

    // ícones SVG para uso
    const addIconSVG = '<img src="/imagens/icones/adicionar-icone.svg" alt="Adicionar filtro" class="icon">';
    const removeIconSVG = '<img src="/imagens/icones/remover-icone.svg" alt="Remover filtro" class="icon">';
    const arrowIconSVG = `<img src="/imagens/icones/down.svg" class="dropdown-arrow icon"  alt="seta para abrir">`;
    const starFilledSVG = '<img src="/imagens/icones/estrela-preenchida.svg" class="star" alt="">';
    const starEmptySVG = '<img src="/imagens/icones/estrela-vazia.svg" class="star" alt="">';

    // Dicionario com opções de badges e níveis
    const badgeOptions = [{ name: 'Angular', imgSrc: '/imagens/badges/angular.svg' }, { name: 'Bootstrap', imgSrc: '/imagens/badges/bootstrap.svg' }, { name: 'C++', imgSrc: '/imagens/badges/c++.svg' }, { name: 'CSS', imgSrc: '/imagens/badges/css.svg' }, { name: 'Docker', imgSrc: '/imagens/badges/docker.svg' }, { name: 'Figma', imgSrc: '/imagens/badges/figma.svg' }, { name: 'Git', imgSrc: '/imagens/badges/git.svg' }, { name: 'GitHub', imgSrc: '/imagens/badges/github.svg' }, { name: 'GitLab', imgSrc: '/imagens/badges/gitlab.svg' }, { name: 'Go', imgSrc: '/imagens/badges/go.svg' }, { name: 'HTML', imgSrc: '/imagens/badges/html.svg' }, { name: 'Java', imgSrc: '/imagens/badges/java.svg' }, { name: 'JavaScript', imgSrc: '/imagens/badges/javascript.svg' }, { name: 'Lua', imgSrc: '/imagens/badges/lua.svg' }, { name: 'MySQL', imgSrc: '/imagens/badges/mysql.svg' }, { name: 'PHP', imgSrc: '/imagens/badges/php.svg' }, { name: 'PostgreSQL', imgSrc: '/imagens/badges/postgresql.svg' }, { name: 'Python', imgSrc: '/imagens/badges/python.svg' }, { name: 'React', imgSrc: '/imagens/badges/react.svg' }, { name: 'Rust', imgSrc: '/imagens/badges/rust.svg' }, { name: 'Scrum', imgSrc: '/imagens/badges/scrum.svg' }, { name: 'Spring Boot', imgSrc: '/imagens/badges/springboot.svg' }, { name: 'Swagger', imgSrc: '/imagens/badges/swagger.svg' }, { name: 'TypeScript', imgSrc: '/imagens/badges/typescript.svg' }, { name: 'Vue.js', imgSrc: '/imagens/badges/vuejs.svg' }, { name: 'SQLAlchemy', imgSrc: '/imagens/badges/sqlalchemy.svg' }, { name: 'SQLite', imgSrc: '/imagens/badges/sqlite.svg' }];
    const levelOptions = [{ name: 'Iniciante', stars: 1 }, { name: 'Básico', stars: 2 }, { name: 'Intermediário', stars: 3 }, { name: 'Avançado', stars: 4 }, { name: 'Especialista', stars: 5 }];

    let currentSelectedBadge = null;
    let currentSelectedLevel = null;

    // html para exibir o nível selecionado com estrelas
    const createLevelDisplayHTML = (level) => {
        const starsHTML = `${starFilledSVG.repeat(level.stars)}${starEmptySVG.repeat(5 - level.stars)}`;
        return `
            <div>${starsHTML}</div>
            <span class="level-escrito">${level.name}</span>
        `;
    };

    // html para exibir o select de nível vazio - não selecionado
    const createLevelSelectHTML = () => {
        return `
            <div class="custom-dropdown">
                <div class="dropdown-select level-select disabled">
                    <span>Nenhum nível selecionado</span>
                </div>
            </div>
        `;
    };

    // html para cada filtro adicionado
    const createAddedFilterHTML = (badge, level) => {
        const rowId = `added-filter-${Date.now()}`;
        const levelDisplayHTML = level ? createLevelDisplayHTML(level) : createLevelSelectHTML();

        return `
        <div class="filter-row-layout added-filter-row" id="${rowId}" data-badge="${badge.name}" data-level="${level ? level.name : ''}">
            <div class="badge-column">
                <img src="${badge.imgSrc}" alt="${badge.name}" class="badge-display">
            </div>
            <div class="level-column">
                <div class="level-display">
                    ${levelDisplayHTML}
                </div>
            </div>
            <div class="action-column">
                <button class="btn-remove-filter" data-remove-id="${rowId}">${removeIconSVG}</button>
            </div>
        </div>
    `;
    };

    // limpa seleção atual para valores padrão
    const resetSelection = () => {
        currentSelectedBadge = null;
        currentSelectedLevel = null;
        badgeSelect.innerHTML = `<span>Badges</span>${arrowIconSVG}`;
        levelSelect.innerHTML = `<span class="sem-exp-marcada">Níveis de experiência</span>${arrowIconSVG}`;
    };

    // atualiza opções de badges disponíveis no dropdown, removendo as já adicionadas
    function updateBadgeOptions() {
        const addedBadges = new Set(
            [...addedFiltersContainer.querySelectorAll('.added-filter-row')].map(row => row.dataset.badge)
        );
        const availableBadges = badgeOptions.filter(b => !addedBadges.has(b.name));
        renderBadgeDropdown(availableBadges);
    }

    // renderiza as opções de badges no dropdown
    function renderBadgeDropdown(badges) {
        badgeDropdownMenu.innerHTML = badges.map(b =>
            `<div class="badge-item" data-badge="${b.name}">
                <img src="${b.imgSrc}" class="badge-item-img" alt="Badge ${b.name}">
            </div>`
        ).join('');
    }

    // popula os dropdowns inicialmente
    const populateDropdowns = () => {
        addFilterBtn.innerHTML = addIconSVG;
        updateBadgeOptions();
        levelDropdownMenu.innerHTML = levelOptions.map(l => `<div class="level-item" data-level="${l.name}"><div>${starFilledSVG.repeat(l.stars)}${starEmptySVG.repeat(5 - l.stars)}</div><span>${l.name}</span></div>`).join('');
    };

    // fecha todos os dropdowns, exceto o passado como argumento
    const closeAllDropdowns = (except) => {
        document.querySelectorAll('.dropdown-select.open').forEach(select => {
            if (select !== except) {
                select.classList.remove('open');
                select.nextElementSibling.classList.remove('show');
            }
        });
    };


    // aplica o filtro de nome
    function aplicarFiltro() {
        const termoBusca = searchInput.value.toLowerCase().trim();
        const todosCards = cardsContainer.querySelectorAll('.card-index');

        todosCards.forEach(card => {
            const nomeDoCard = (card.dataset.name || '').toLowerCase();

            if (nomeDoCard.includes(termoBusca)) {
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        });
    }

    // limpar todos os filtros
    const clearFilters = () => {
        nameInput.value = '';
        addedFiltersContainer.innerHTML = '';
        resetSelection();
        updateBadgeOptions();
    };

    // adiciona filtro selecionado
    addFilterBtn.addEventListener('click', () => {
        if (!currentSelectedBadge) {
            alert('Por favor, selecione uma badge para adicionar.');
            return;
        }

        const levelToAdd = currentSelectedLevel;
        const newFilterHTML = createAddedFilterHTML(currentSelectedBadge, levelToAdd);
        addedFiltersContainer.insertAdjacentHTML('beforeend', newFilterHTML);
        resetSelection();
        updateBadgeOptions();
    });

    // Listener para cliques na página
    document.addEventListener('click', (e) => {
        // abrir/fechar dropdowns
        const dropdownSelect = e.target.closest('.dropdown-select:not(.disabled)');
        if (dropdownSelect) {
            const dropdownMenu = dropdownSelect.nextElementSibling;
            const isOpen = dropdownSelect.classList.contains('open');
            closeAllDropdowns(isOpen ? null : dropdownSelect);
            dropdownSelect.classList.toggle('open');
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('show');
            }
            return;
        }

        // selecionar badge
        const badgeItem = e.target.closest('#selection-row .badge-item');
        if (badgeItem) {
            const badgeName = badgeItem.dataset.badge;
            currentSelectedBadge = badgeOptions.find(b => b.name === badgeName);
            badgeSelect.innerHTML = `<div>${badgeItem.innerHTML}</div>` + arrowIconSVG;
            closeAllDropdowns();
            return;
        }

        // selecionar nível
        const levelItem = e.target.closest('#selection-row .level-item');
        if (levelItem) {
            const levelName = levelItem.dataset.level;
            currentSelectedLevel = levelOptions.find(l => l.name === levelName);
            levelSelect.innerHTML = `<div class="level-item">${levelItem.innerHTML}</div>` + arrowIconSVG;
            closeAllDropdowns();
            return;
        }

        // remover filtro adicionado
        const removeBtn = e.target.closest('.btn-remove-filter');
        if (removeBtn) {
            document.getElementById(removeBtn.dataset.removeId).remove();
            updateBadgeOptions();
            return;
        }

        // fechar dropdowns se clicar fora
        if (!e.target.closest('.custom-dropdown')) {
            closeAllDropdowns();
        }
    });



    // Event Listeners:

    // Adiciona listener para o banner do projeto PD Vitrine
    const bannerVitrine = document.getElementById('banner-projeto-vitrine');
    if (bannerVitrine) {
        bannerVitrine.addEventListener('click', (event) => {
            event.preventDefault(); // Impede a navegação imediata
            localStorage.setItem('projetoId', '1219');
            window.location.href = 'projeto.html';
        });
    }

    const bannerVitrineMobile = document.getElementById('banner-projeto-vitrine-mobile');
    if (bannerVitrineMobile) {
        bannerVitrineMobile.addEventListener('click', (event) => {
            event.preventDefault(); // Impede a navegação imediata
            localStorage.setItem('projetoId', '1219');
            window.location.href = 'projeto.html';
        });
    }

    searchInput.addEventListener('input', aplicarFiltro); // filtra em tempo real enquanto o usuário digita

    clearBtn.addEventListener('click', clearFilters); // Limpa filtros

    // clique no botão pesquisar
    searchBtn.addEventListener('click', () => {
        aplicarFiltro();

        filterModal.hide();
    });

    populateDropdowns();
});

async function obterFiltrosSelecionados() {
    const badgesAdicionadas = document.getElementById('added-filters-container');
    let nomeDigitado = document.getElementById('filter-name').value.toLowerCase().trim();
    //dentro de badges adicionadas entra na div added-filter-row. para badge entra em badge-column e
    const vetorBadges = badgesAdicionadas.querySelectorAll('.added-filter-row')

    //para linguagens
    let vetorLinguagens = []
    vetorBadges.forEach(badge => {
        const novaLinguagem = badge.querySelector('.badge-column').querySelector('.badge-display').alt.toLowerCase();
        let novoNivel = badge.querySelector('.level-column').querySelector('.level-display').querySelector('.level-escrito');
        if (novoNivel) {
            novoNivel = novoNivel.textContent;
        }
        else {
            novoNivel = "Sem classificação";
        }
        vetorLinguagens.push({ linguagem: novaLinguagem, nivel: novoNivel });
    })

    const selectionRow = document.querySelector('#selection-row');
    const badgeEsquecida = selectionRow.querySelector('.badge-select img');

    if (badgeEsquecida && badgeEsquecida.alt.includes('Badge')) {
        const altText = badgeEsquecida.alt;
        const linguagemFormatada = altText.replace('Badge ', '').toLowerCase();

        const levelSelect = selectionRow.querySelector('.level-select');
        const nivelEsquecido = levelSelect.querySelector('.level-item span');

        let nivelTexto = "Sem classificação";
        if (nivelEsquecido) {
            nivelTexto = nivelEsquecido.textContent.trim();
        }

        vetorLinguagens.push({
            linguagem: linguagemFormatada,
            nivel: nivelTexto
        });

        console.log('Badge esquecida adicionada:', vetorLinguagens);
    }

    //return vetorLinguagens
    let informacoes = [];
    informacoes = await lerInfos(); //puxa dados do json
    //se username tem badge A, B, C... adicionarCard(username)
    const userFiltrados = informacoes.filter(usuario => { //filtrando os usuarios do json que atendem às filtragens
        return vetorLinguagens.every(filtro => {
            const badgeUsuario = usuario.badges[filtro.linguagem];
            //n passa se não tiver a badge
            if (!badgeUsuario) return false;
            if (filtro.nivel && filtro.nivel !== "Sem classificação") {
                return badgeUsuario.descricao === filtro.nivel; //filtragem exclusiva (não inclui niveis melhores)
            }
            return true;
        })
    })
    let userFiltrados2 = []; //filtrados por nome também
    userFiltrados.forEach(user => {
        if (!nomeDigitado) {
            userFiltrados2.push(user)
        }
        else if (user.nome_completo.toLowerCase().includes(nomeDigitado) || user.nome.toLowerCase().includes(nomeDigitado)) {
            userFiltrados2.push(user);
        }
    });
    return userFiltrados2
}

//evento de click que libera a filtragem
const botaoPesquisar = document.querySelector('.btn-filter-action')
botaoPesquisar.addEventListener('click', async () => {
    const lista = await obterFiltrosSelecionados()
    const divCards = document.querySelector('.div-cards-index');
    divCards.innerHTML = '';
    const body = document.querySelector('body')
    if (lista.length === 0) {
        const toast = document.getElementById('toast');
        toast.style.display = 'flex';
        toast.style.opacity = '1'
        //Esconde o toast depois de 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.style.display = 'none', 300);
        }, 3000);
        setTimeout(() => {
            inicializar()
        }, 100);
        setTimeout(() => document.getElementById('modal__filtragem').click(), 1400);
    }
    else {
        lista.forEach(pessoa => {
            adicionarCard(pessoa.nome)
        })
    }

})

