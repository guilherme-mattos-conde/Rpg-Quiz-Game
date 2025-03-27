import type IPergunta from '@/interfaces/IPergunta';
import type IPersonagem from '@/interfaces/IPersonagem';

async function obterDadosURL<T extends object> (url: string) {
    const res = await fetch(url);
    return res.json() as T;
}

export async function obterPerguntas() {
    return obterDadosURL<IPergunta[]>('https://gist.githubusercontent.com/guilherme-mattos-conde/ef185ef8e04de5594bfe2bc381ab306d/raw/10a11a1618fcd94f5204bfa577c334ae0478c096/perguntas.json');
}

export async function obterPersonagens() {
    return obterDadosURL<IPersonagem[]>('https://gist.githubusercontent.com/guilherme-mattos-conde/85d732a7f7f60e668e26bf11439ba77f/raw/1a62f1cfde20e63562d93d33e1e41ba3b7564b91/personagens.json');
}
