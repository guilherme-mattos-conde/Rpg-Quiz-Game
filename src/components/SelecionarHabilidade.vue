<template>
    <h3>Selecione sua Habilidade</h3>
    <h2>{{ props.turno }}</h2>
    <div class="battle">
        <div class="personagem">
            <img :src="'/images/personagens/' + personagem.nome.toLowerCase() + '.png'" alt="Imagem do personagem" />
            <div>
                <h3>Habilidades</h3>

                <ul class="habilidades">
                    <li>
                        <img :src="'/images/habilidades/' + personagem.habilidade_1.toLowerCase().replace(/\s+/g, '_') + '.png'"
                            :alt="'Imagem ' + personagem.habilidade_1" @click="avancar('Fácil')">
                    </li>
                    <li>
                        <img :src="'/images/habilidades/' + personagem.habilidade_2.toLowerCase().replace(/\s+/g, '_') + '.png'"
                            :alt="'Imagem ' + personagem.habilidade_2" @click="avancar('Médio')">
                    </li>
                    <li>
                        <img :src="'/images/habilidades/' + personagem.habilidade_3.toLowerCase().replace(/\s+/g, '_') + '.png'"
                            :alt="'Imagem ' + personagem.habilidade_3" @click="avancar('Difícil')">
                    </li>
                </ul>
            </div>
        </div>
    </div>
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
const props = defineProps(["id", "turno"]);
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

function avancar (d: Dificuldade) {
    dificuldade.value = d;
    emit("pergunta", dificuldade);
}   

onMounted(carregarPersonagens);
</script>

<style scoped>
</style>