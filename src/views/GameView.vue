<template>
    <Suspense>
        <template #default>
            <div>
                <TelaInicial v-if="fase === 'inicio'" @personagens="selecionarPersonagens"/>
                <SelecionarPersonagens v-if="fase === 'personagens'" @inicio="telaInicial" @habilidades="definirValores selecionarHabilidade"/>
                <SelecionarHabilidade :id="id" :turno="turno" v-if="fase === 'habilidades'" @pergunta="pergunta"/>
                <Pergunta :idP1="idP1" :idP2="idP2" :turno="turno" :dificuldade="dificuldade" v-if="fase === 'pergunta'" @habilidades="selecionarHabilidade"/>
            </div>
        </template>
        <template #fallback>
            <div>Carregando...</div>
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SelecionarPersonagens from "../components/SelecionarPersonagens.vue";
import SelecionarHabilidade from "@/components/SelecionarHabilidade.vue";
import Pergunta from "@/components/Pergunta.vue";
import TelaInicial from "@/components/TelaInicial.vue";

type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';
type Turno = 'P1' | 'P2';
type Fases = 'inicio' | 'personagens' | 'habilidades' | 'pergunta';

const fase = ref<Fases>('inicio');
const dificuldade = ref<Dificuldade>("" as Dificuldade);
const turno = ref<Turno>('P1');
const idP1 = ref();
const idP2 = ref();
const id = ref();

function definirValores(id1: number, id2: number, t: Turno) {
    idP1.value = id1
    idP2.value = id2
    turno.value = t
}

function telaInicial() {
    fase.value = 'inicio';
}

function selecionarPersonagens () {
    fase.value = 'personagens';
}

function selecionarHabilidade() {
    id.value = (turno.value === 'P1') ? idP1 : idP2;
    
    fase.value = 'habilidades';
}

function pergunta(d: Dificuldade) {
    dificuldade.value = d;
    fase.value = "pergunta";
}
</script>
