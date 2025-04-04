<template>
    <section id="selecionar-personagens">
        <div id="menu">
            <a @click="voltar()"><img class="btn" src="../../public/images/btn-voltar.png" alt=""></a>
            <div id="titulo">
                <h2>Selecione sua Carta</h2>
                <h2>{{ telaSelecao == 'P1' ? 'Jogador 1' : 'Jogador 2'}}</h2>
            </div>
            <a @click="avancar()"><img class="btn" src="../../public/images/btn-avancar.png" alt=""></a>
        </div>
        <div id="selecao-personagens">
            <section class="selecao-personagem" v-if="telaSelecao === 'P1'">
                <div class="personagem-selecionado">
                    <img class="img-personagem-selecionado" :src="'/images/personagens/' + personagemP1.nome.toLowerCase() + '.png'"
                        alt="Imagem do personagem" />
                    <div class="habilidades">
                        <h3>Habilidades</h3>
                        <ul>
                            <li>
                                <img :src="'/images/habilidades/' + personagemP1.habilidade_1.toLowerCase().replace(/\s+/g, '-') + '.png'"
                                    :alt="'Imagem ' + personagemP1.habilidade_1">
                            </li>
                            <li>
                                <img :src="'/images/habilidades/' + personagemP1.habilidade_2.toLowerCase().replace(/\s+/g, '-') + '.png'"
                                    :alt="'Imagem ' + personagemP1.habilidade_2">
                            </li>
                            <li>
                                <img :src="'/images/habilidades/' + personagemP1.habilidade_3.toLowerCase().replace(/\s+/g, '-') + '.png'"
                                    :alt="'Imagem ' + personagemP1.habilidade_3">
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="menu-personagens">
                    <div class="personagem" v-for="(personagem, index) in personagens" :key="index"
                        :class="{ selecionado: personagemP1.nome === personagem.nome }"
                        @click="escolhaPersonagem(1, personagem)">
                        <img :src="'/images/personagens/' + personagem.nome.toLowerCase() + '.png'"
                            :alt="'Imagem ' + personagem.nome" />
                    </div>
                </div>
            </section>
            <section class="selecao-personagem" v-if="telaSelecao === 'P2'">
                <div class="personagem-selecionado">
                    <img class="img-personagem-selecionado" :src="'/images/personagens/' + personagemP2.nome.toLowerCase() + '.png'"
                        alt="Imagem do personagem" />
                    <div class="habilidades">
                        <h3>Habilidades</h3>
                        <ul>
                            <li>
                                <img :src="'/images/habilidades/' + personagemP2.habilidade_1.toLowerCase().replace(/\s+/g, '-') + '.png'"
                                    :alt="'Imagem ' + personagemP2.habilidade_1">
                            </li>
                            <li>
                                <img :src="'/images/habilidades/' + personagemP2.habilidade_2.toLowerCase().replace(/\s+/g, '-') + '.png'"
                                    :alt="'Imagem ' + personagemP2.habilidade_2">
                            </li>
                            <li>
                                <img :src="'/images/habilidades/' + personagemP2.habilidade_3.toLowerCase().replace(/\s+/g, '-') + '.png'"
                                    :alt="'Imagem ' + personagemP2.habilidade_3">
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="menu-personagens">
                    <div class="personagem" v-for="(personagem, index) in personagens" :key="index"
                        :class="{ selecionado: personagemP2.nome === personagem.nome }"
                        @click="escolhaPersonagem(2, personagem)">
                        <img :src="'/images/personagens/' + personagem.nome.toLowerCase() + '.png'"
                            :alt="'Imagem ' + personagem.nome" />
                    </div>
                </div>
            </section>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { obterPersonagens } from "@/services/obterDados";
import IPersonagem from "@/interfaces/IPersonagem";

type Tela = 'P1' | 'P2';

const carregando = {
    'nome': 'carregando',
    'habilidade_1': 'carregando',
    'habilidade_2': 'carregando',
    'habilidade_3': 'carregando'
}

const emit = defineEmits(['inicio', 'habilidades']);
const personagens = ref<IPersonagem[]>([]);
const telaSelecao = ref<Tela>('P1');
const personagemP1 = ref<IPersonagem>(carregando as IPersonagem);
const personagemP2 = ref<IPersonagem>(carregando as IPersonagem);

async function carregarPersonagens() {
    personagens.value = await obterPersonagens();
    personagemP1.value = personagens.value[0];
    personagemP2.value = personagens.value[0];
}

function escolhaPersonagem(jogador: number, personagem: IPersonagem) {
    if (jogador === 1) {
        personagemP1.value = personagem;
    } else if (jogador === 2) {
        personagemP2.value = personagem;
    } else {
        console.log("Jogador inexistente!");
    }
}

async function inserirPersonagem(personagem: IPersonagem) {
    const res = await fetch("http://localhost:3000/personagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personagem),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao inserir personagem: ${errorText}`);
    }

    const data = await res.json();
    return data.id;
}

async function buscarPersonagens() {
    try {
        const res = await fetch("http://localhost:3000/personagens");

        if (!res.ok) {
            throw new Error(`Erro ao buscar personagens: ${res.status}`);
        }

        const data = await res.json();
        console.log("Personagens encontrados:", data);
    } catch (error) {
        console.error("Erro ao buscar personagens!", error);
    }
}

function voltar() {
    if (telaSelecao.value === 'P1') {
        emit('inicio');
    } else {
        telaSelecao.value = 'P1'
    }
}

async function avancar() {
    if (telaSelecao.value === 'P2') {
        const idP1 = await inserirPersonagem(personagemP1.value);
        const idP2 = await inserirPersonagem(personagemP2.value);
        await buscarPersonagens()
        emit('habilidades', idP1, idP2, 'P1');
    } else {
        telaSelecao.value = 'P2'
    }
}

onMounted(carregarPersonagens);
</script>

<style scoped>
#selecionar-personagens {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: url('../../public/images/fundo-selecionar-personagens.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
}
#menu {
    display: flex;
    align-items:flex-start;
    justify-content: space-between;
    width: 95vw;
    margin: 20px 0;

    #titulo {
        font-size: 20pt;
        color: white;
    }

    .btn {
        width: 180px;
    }
    .btn:hover {
        cursor: pointer;
    }
}
#selecao-personagens {
    margin-top: 10px;

    .personagem-selecionado {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 750px;
        margin-bottom: 25px;
    
        .img-personagem-selecionado {
            width: 280px;
        }
    
        .habilidades {
            h3 {
                font-size: 25pt;
                color: white;
            }
            ul {
                display: flex;
                flex-direction: column;
                margin-top: 20px;
                gap: 1rem;
                list-style: none;
            }
            img {
                width: 320px;
            }
        }
    }
}
#menu-personagens {
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
        cursor: pointer;
        width: 130px;
        border: 2px solid transparent;
    }
    .selecionado {
        img {
            border: 2px solid white;
        }
    }
}
</style>
