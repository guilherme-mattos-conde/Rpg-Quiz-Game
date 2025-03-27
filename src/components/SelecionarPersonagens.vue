<template>
    <div class="menu">
        <button id="btn-voltar" class="botoes" @click="voltar()">Voltar</button>
        <div>
            <h3>Selecione sua Carta</h3>
            <h2>{{ telaSelecao }}</h2>
        </div>
        <button id="btn-avancar" class="botoes" @click="avancar()">Avançar</button>
    </div>
    <div class="selecao-personagens">
        <section class="selecao-p1" v-if="telaSelecao === 'P1'">
            <div class="menu-personagens">
                <div class="personagem" v-for="(personagem, index) in personagens" :key="index"
                    :class="{ selecionado: personagemP1.nome === personagem.nome }"
                    @click="escolhaPersonagem(1, personagem)">
                    <img :src="'/images/personagens/' + personagem.nome.toLowerCase() + '.png'"
                        :alt="'Imagem ' + personagem.nome" />
                </div>
            </div>
            <div class="personagem-selecionado">
                <img :src="'/images/personagens/' + personagemP1.nome.toLowerCase() + '.png'"
                    alt="Imagem do personagem" />
                <div>
                    <h3>Habilidades</h3>
                    <ul class="habilidades">
                        <li>
                            <img :src="'/images/habilidades/' + personagemP1.habilidade_1.toLowerCase().replace(/\s+/g, '_') + '.png'"
                                :alt="'Imagem ' + personagemP1.habilidade_1">
                        </li>
                        <li>
                            <img :src="'/images/habilidades/' + personagemP1.habilidade_2.toLowerCase().replace(/\s+/g, '_') + '.png'"
                                :alt="'Imagem ' + personagemP1.habilidade_2">
                        </li>
                        <li>
                            <img :src="'/images/habilidades/' + personagemP1.habilidade_3.toLowerCase().replace(/\s+/g, '_') + '.png'"
                                :alt="'Imagem ' + personagemP1.habilidade_3">
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <section class="selecao-p2" v-else-if="telaSelecao === 'P2'">
            <div class="menu-personagens">
                <div class="personagem" v-for="(personagem, index) in personagens" :key="index"
                    :class="{ selecionado: personagemP2.nome === personagem.nome }"
                    @click="escolhaPersonagem(2, personagem)">
                    <img :src="'/images/personagens/' + personagem.nome.toLowerCase() + '.png'"
                        :alt="'Imagem ' + personagem.nome" />
                </div>
            </div>
            <div class="personagem-selecionado">
                <img :src="'/images/personagens/' + personagemP2.nome.toLowerCase() + '.png'"
                    alt="Imagem do personagem" />
                <div>
                    <h3>Habilidades</h3>

                    <ul class="habilidades">
                        <li>
                            <img :src="'/images/habilidades/' + personagemP2.habilidade_1.toLowerCase().replace(/\s+/g, '_') + '.png'"
                                :alt="'Imagem ' + personagemP2.habilidade_1">
                        </li>
                        <li>
                            <img :src="'/images/habilidades/' + personagemP2.habilidade_2.toLowerCase().replace(/\s+/g, '_') + '.png'"
                                :alt="'Imagem ' + personagemP2.habilidade_2">
                        </li>
                        <li>
                            <img :src="'/images/habilidades/' + personagemP2.habilidade_3.toLowerCase().replace(/\s+/g, '_') + '.png'"
                                :alt="'Imagem ' + personagemP2.habilidade_3">
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </div>
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
</style>
