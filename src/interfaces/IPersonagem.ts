type String50 = string & { lenght: 50 }

export default interface IPersonagem {
    nome: String50,
    vida: number,
    habilidade_1: String50,
    habilidade_2: String50,
    habilidade_3: String50,
    dano_habilidade_1: number,
    dano_habilidade_2: number,
    dano_habilidade_3: number
}
