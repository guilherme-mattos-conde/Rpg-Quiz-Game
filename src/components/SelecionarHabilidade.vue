<template>
    <section id="selecionar-habilidade">
        <div id="titulo">
            <h2>Selecione sua Habilidade</h2>
            <h2>{{ props.turno == 'P1' ? 'Jogador 1' : 'Jogador 2' }}</h2>
        </div>
        <div id="selecao-habilidade">
            <img class="img-personagem" :src="'/images/personagens/' + personagem.nome.toLowerCase() + '.png'"
                alt="Imagem do personagem" />
            <div class="habilidades">
                <h3>Habilidades</h3>
                <ul>
                    <li>
                        <img :src="'/images/habilidades/' + personagem.habilidade_1.toLowerCase().replace(/\s+/g, '-') + '.png'"
                            :alt="'Imagem ' + personagem.habilidade_1" @click="avancar('Fácil')">
                    </li>
                    <li>
                        <img :src="'/images/habilidades/' + personagem.habilidade_2.toLowerCase().replace(/\s+/g, '-') + '.png'"
                            :alt="'Imagem ' + personagem.habilidade_2" @click="avancar('Médio')">
                    </li>
                    <li>
                        <img :src="'/images/habilidades/' + personagem.habilidade_3.toLowerCase().replace(/\s+/g, '-') + '.png'"
                            :alt="'Imagem ' + personagem.habilidade_3" @click="avancar('Difícil')">
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from "vue";
import IPersonagem from "@/interfaces/IPersonagem";

type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';

const carregando = {
    'nome': 'Carregando',
    'habilidade_1': 'Carregando',
    'habilidade_2': 'Carregando',
    'habilidade_3': 'Carregando'
}

const emit = defineEmits(["pergunta"]);
const props = defineProps<{ id: number, turno: string }>();
const personagem = ref<IPersonagem>(carregando as IPersonagem);

const dificuldade = ref<Dificuldade>()

async function carregarPersonagens() {
    personagem.value = await buscarPersonagem(props.id);
}

async function buscarPersonagem(id: number) {
    try {
        const res = await fetch(`http://localhost:3000/personagem/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            throw new Error(`Erro ao buscar personagem: ${res.status}`);
        }

        const data = await res.json();
        return data[0];
    } catch (error) {
        console.error("Erro ao buscar personagens!", error);
    }
}

function avancar(d: Dificuldade) {
    dificuldade.value = d;

    emit("pergunta", dificuldade.value);
}

onMounted(carregarPersonagens);
</script>

<style scoped>
#selecionar-habilidade {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: url('../../public/images/fundo-tela-pergunta.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
}

#titulo {
    text-align: center;
    margin: 20px 0;
    font-size: 20pt;
    color: white;
}

#selecao-habilidade {
    margin-top: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 750px;
    margin-bottom: 25px;

    .img-personagem {
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

        li:hover {
            cursor: pointer;
        }

        img {
            width: 320px;
        }
    }
}
</style>