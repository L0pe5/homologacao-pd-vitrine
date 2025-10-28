async function lerInfos() {
    const infos = require('./badges.json')
    return infos;
}

async function responsavel_tecnico(user) {
    const vetor = await lerInfos();
    const usuario = vetor.find(pessoa => pessoa.nome === user)
    return usuario.responsavel_tecnico;
}

async function supervisor(user) {
    const vetor = await lerInfos();
    const usuario = vetor.find(pessoa => pessoa.nome === user)
    return usuario.supervisor;
}

async function formacoes(user) {
    const vetor = await lerInfos();
    const usuario = vetor.find(pessoa => pessoa.nome === user)
    return usuario.formacoes;
}

async function badges(user) {
    const vetor = await lerInfos();
    const usuario = vetor.find(pessoa => pessoa.nome === user)
    return usuario.badges;
}

async function main() {
    const resp = await responsavel_tecnico('leonardo.maciel')
    const sup = await supervisor('leonardo.maciel')
    const form = await formacoes('leonardo.maciel')
    const linguagens = await badges('leonardo.maciel')

    console.log(resp, sup, form, linguagens);
}

main()