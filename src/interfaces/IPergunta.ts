type Alternativa = 'A' | 'B' | 'C' | 'D';
type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';
type String255 = string & { lenght : 255 };

export default interface IPergunta {
	enunciado: string,
	alternativa_a: String255,
	alternativa_b: String255,
	alternativa_c: String255,
	alternativa_d: String255,
	alternativa_correta: Alternativa;
	dificuldade: Dificuldade,
	respondida: boolean
}
