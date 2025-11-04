// implementação do estilo de hover para desktop e click para mobile (botão de dowload)
const botao = document.querySelector('.baixar-curriculo');
const img = botao.querySelector('img')
const texto = botao.querySelector('p')

const originalSrc = "/imagens/icones/download.svg"
const hoverSrc = "/imagens/icones/downloadhover.svg"
const originalBg = "#F4BC1D"
const hoverBg = "#000000"

// comportamento mobile (click)
botao.addEventListener('click', () => {
    if (window.matchMedia("(max-width: 719px)").matches) {
        img.src = hoverSrc;
        botao.style.backgroundColor = hoverBg

        setTimeout(() => {
            img.src = originalSrc
            botao.style.backgroundColor = originalBg
        }, 500);
    }
});

//comportamento desktop (hover)
botao.addEventListener('mouseenter', () => {
    if (window.matchMedia("(min-width: 720px)").matches) {
        img.src = hoverSrc
        botao.style.backgroundColor = hoverBg
        texto.style.color = originalBg
    }
});

//pós hover
botao.addEventListener('mouseleave', () => {
    if (window.matchMedia("(min-width: 720px)").matches) {
        img.src = originalSrc
        botao.style.backgroundColor = originalBg
        texto.style.color = hoverBg
    }
});

//função para diminuir o conteúdo do texto 'Responsável Técnico' em telas menores
function ajustarResponsavel() {
    const responsavel = document.querySelector('#resp-tec-texto');
    if (!responsavel) return;
    if (window.matchMedia('(min-width: 720px) and (max-width: 1000px)').matches) {
        responsavel.textContent = "Responsável:";
    }
    else {
        responsavel.textContent = "Responsável Técnico:";
    }
};
ajustarResponsavel();
//a cada reajuste nas dimensões recalcula
window.addEventListener('resize', ajustarResponsavel);

//deixa apenas as estrelas (SEM DESCRIÇÃO) em telas menores de desktop
function ajustarExp() {
    const expTexto = document.querySelectorAll('.exp-texto');
    if (window.matchMedia('(min-width: 720px) and (max-width: 1000px)').matches) {
        expTexto.forEach(texto => {
            texto.style.display = "none";
        });
    }
    else {
        expTexto.forEach(texto => {
            texto.style.display = "block";
        });
    }
}

ajustarExp();
window.addEventListener('resize', ajustarExp);

//evento de download do curriculo
document.querySelectorAll('.baixar-curriculo').forEach(botao => {
    botao.addEventListener('click', () => {
        const username = botao.dataset.username
        const caminho = `../curriculos/${username}.pdf`
        const link = document.createElement('a');
        link.href = caminho;
        link.download = `${username}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
})