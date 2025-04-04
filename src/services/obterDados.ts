import type IPergunta from '@/interfaces/IPergunta';
import type IPersonagem from '@/interfaces/IPersonagem';

async function obterDadosURL<T extends object> (url: string) {
    const res = await fetch(url);
    return res.json() as T;
}

export async function obterPerguntas() {
    return obterDadosURL<IPergunta[]>('https://gist.githubusercontent.com/guilherme-mattos-conde/ef185ef8e04de5594bfe2bc381ab306d/raw/6c3fa3d0ea32a6b08c0132ba3a035ac648237265/perguntas.json');
}

export async function obterPersonagens() {
    return obterDadosURL<IPersonagem[]>('https://gist.githubusercontent.com/guilherme-mattos-conde/85d732a7f7f60e668e26bf11439ba77f/raw/14347f465d250701416d13f4c06afedc5adcbd10/personagens.json');
}
