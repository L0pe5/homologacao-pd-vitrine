# Documentação Essencial da PD Vitrine usando API GitLab

Pprojeto JavaScript puro (vanilla JS) que consome a API do GitLab e um arquivo JSON local para construir uma vitrine de perfis e projetos.

## Arquitetura Central

A lógica é separada em duas partes:

1.  **utils.js (A Camada de API):**
    * **Propósito:** Funções de comunicação com a API.
    * **Regra Absoluta:** Este arquivo **não sabe** sobre o HTML. Ele não usa document.querySelector. Sua única responsabilidade é buscar dados (da API ou JSON) e retornar esses dados (objetos, arrays, etc.).
    * **Ideias:** Ser substituido posteriormente por um Backend real, com acesso a banco de dados por exemplo.

2.  **Arquivos "Controladores" (users.js, profile.js, project.js):**
    * **Propósito:** Cada arquivo é responsável por "controlar" uma única página HTML (carregar dados, gerar eventListeners).
    * **Fluxo:** Usa funções do utils.js para buscar os dados e, em seguida, usam document.querySelector e .innerHTML para manipular o DOM e exibir esses dados.

## Fluxo de Dados e Navegação

O formato utilizado para ter controle sobre o "estado" (saber qual perfil ou projeto mostrar), é salvando as informações entre as páginas usando o localStorage do navegador.

* **index.html -> perfil.html:**
    * users.js (na index.html) salva o username do card clicado:
        localStorage.setItem('perfilUsername', 'nome.usuario')
* **perfil.html -> projeto.html:**
    * profile.js (na perfil.html) lê o perfilUsername para saber quem exibir.
    * Ao clicar em um projeto, ele salva o projetoId:
        localStorage.setItem('projetoId', '1219')
* **projeto.html:**
    * project.js lê o projetoId para saber qual projeto buscar e exibir.

## Fontes de Dados

Exsitem duas fontes de dados que são combinadas:

1.  **API do GitLab (Dinâmica):** Fornece tudo que é "vivo" no GitLab:
    * Nomes de usuário, bios, avatares (pegaUsuarioPeloUsername, pegaDetalhesDoUsuario).
    * Listas de projetos (pegaProjetosDoUsuario).
    * Conteúdo de arquivos, como READMEs (pegaConteudoRawReadme).
    * Linguagens, Badges, colaboradores, etc.

2.  **info.json (Estática, precisa ser atualizada manualmente):** Fornece dados que *não* existem na API do GitLab ou que precisam ser gerenciados manualmente:
    * Responsável Técnico e Supervisor de cada colaborador.
    * A lista de "Badges" (skills) de um usuário, com seu nível e descrição.
    * users.js e profile.js são responsáveis por carregar este JSON e mesclar seus dados com os dados da API.

---

## Destaques por Arquivo (O que importa saber)

### utils.js (Camada da API)

* pegaProjetosDoUsuario(userId): Esta função é crucial. Ela busca em **dois** endpoints da API (/projects e /contributed_projects) e mescla os resultados para obter uma lista completa de todos os projetos que o usuário possui *ou* participa.
* carregarImagemPrivada(url): Como a API retorma URLs para imagens privadas, o <img> normal não consegue exibi-las. Esta função usa fetch com o token de autenticação para baixar a imagem como um Blob e criar uma URL local (blob:http...) que o navegador pode renderizar.
* pegaImagensProjeto(idProjeto): Busca na pasta /screenshots. Se a pasta não existir (erro 404), ela **não quebra**, apenas retorna um array com uma imagem "placeholder" padrão.
* pegaConteudoRawReadme(projeto): Tenta buscar um README.md. Se falhar (404), retorna null de forma segura.

### users.js (Controlador da index.html)

* colaboradores (Array): Esta lista no topo do arquivo é a **fonte da verdade** para quais usuários são exibidos na página principal. Para adicionar ou remover um usuário da vitrine, você deve editar este array.
* adicionarCard(pessoa): Esta é a função principal. Ela orquestra a busca de dados da API (usando utils.js) e do info.json (usando informacoes.find(...)) para construir o HTML de cada card de perfil.

### profile.js (Controlador da perfil.html)

* **Lógica de README Pessoal:** A seção "Quem sou eu" e "Formações" não vêm da bio do usuário. Elas são carragadas de repositórios GitLab especiais que seguem um padrão de nome:
    * **Quem sou eu:** Busca o README.md do projeto chamado username (ex: tiago.martins).
    * **Formações:** Busca o README.md do projeto chamado username.formacoes (ex: tiago.martins.formacoes).
* **Filtragem de Projetos:** Os dois projetos de README acima são **filtrados** e removidos da lista de projetos exibidos nas seções "Meus Projetos" e "Projetos Compartilhados".
* **Lógica de Separação de Projetos:**
    * **Individual:** O usuário é o dono (isOwner) E o número de colaboradores é 1.
    * **Compartilhado:** Qualquer outro caso (não é o dono, ou tem mais de 1 colaborador).
    * **Limite:** A exibição é limitada a 4 projetos em cada seção.

### project.js (Controlador da projeto.html)

* **Carregamento em Paralelo:** A página usa Promise.all para buscar todos os dados necessários (README, imagens, badges, colaboradores) de uma só vez. Isso torna o carregamento muito mais rápido.
* **Tratamento de README Nulo:** A função preencherInfoPrincipal verifica se o readmeContent é null (retornado pelo utils.js). Se for, ela usa a projeto.description como fallback, evitando que o marked.parse() quebre a página.
* **Link de "Aplicação":** O botão "Aplicação" não usa o homepage do GitLab. Em vez disso, a função preencherLinks busca os "Badges" do projeto na API e procura por um com o nome deploy para usar como o link.