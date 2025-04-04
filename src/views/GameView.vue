<template>
    <Suspense>
        <template #default>
            <div>
                <TelaInicial v-if="fase === 'inicio'" @personagens="selecionarPersonagens"/>
                <SelecionarPersonagens v-if="fase === 'personagens'" @inicio="telaInicial" @habilidades="definirValores"/>
                <SelecionarHabilidade :id="id" :turno="turno" v-if="fase === 'habilidades'" @pergunta="telaPergunta"/>
                <TelaPergunta :idP1="idP1" :idP2="idP2" :turno="turno" :dificuldade="dificuldade" v-if="fase === 'pergunta'" @habilidades="alterarTurno" @inicio="telaInicial"/>
            </div>
        </template>
        <template #fallback>
            <div>Carregando...</div>
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TelaInicial from "@/components/TelaInicial.vue";
import SelecionarPersonagens from "../components/SelecionarPersonagens.vue";
import SelecionarHabilidade from "@/components/SelecionarHabilidade.vue";
import TelaPergunta from "@/components/TelaPergunta.vue";

type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';
type Turno = 'P1' | 'P2';
type Fases = 'inicio' | 'personagens' | 'habilidades' | 'pergunta';

const fase = ref<Fases>('inicio');
const dificuldade = ref<Dificuldade>("" as Dificuldade);
const turno = ref<Turno>('P1');
const idP1 = ref<number>(0);
const idP2 = ref<number>(0);
const id = ref<number>(0);

function definirValores(id1: number, id2: number, t: Turno) {
    idP1.value = id1
    idP2.value = id2
    turno.value = t
    
    selecionarHabilidade()
}

function alterarTurno() {
    turno.value = turno.value === "P1" ? "P2" : "P1";
    id.value = (turno.value === 'P1') ? idP1.value : idP2.value;
    
    fase.value = 'habilidades';
    
    selecionarHabilidade()
}

function telaInicial() {
    fase.value = 'inicio';
}

function selecionarPersonagens () {
    fase.value = 'personagens';
}

function selecionarHabilidade() {
    id.value = (turno.value === 'P1') ? idP1.value : idP2.value;
    
    fase.value = 'habilidades';
}

function telaPergunta(d: Dificuldade) {
    dificuldade.value = d;
    fase.value = "pergunta";
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
html, body {
    height: 100vh;
    width: 100vw;
}
</style>