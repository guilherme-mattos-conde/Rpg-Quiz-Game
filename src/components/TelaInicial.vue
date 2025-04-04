<template>
    <section id="tela-inicial">
        <img id="titulo" src="../../public/images/titulo.png" alt="">
        <a @click="selecionarPersonagens"><img id="btn-iniciar" src="../../public/images/btn-iniciar.png" alt=""></a>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { obterPerguntas } from '@/services/obterDados';
import IPergunta from '@/interfaces/IPergunta';

const perguntas = ref<IPergunta[]>([]);
const emit = defineEmits(["personagens"]);

async function excluirPersonagens() {
    await fetch("http://localhost:3000/personagens", {
    method: "DELETE"
  });
}

async function excluirPerguntas() {
    await fetch("http://localhost:3000/perguntas", {
    method: "DELETE"
  });
}

async function inserirPerguntas(perguntas: IPergunta[]) {
    const res = await fetch("http://localhost:3000/perguntas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perguntas),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao inserir personagem: ${errorText}`);
    }

    const data = await res.json();
    return data.id;
}

async function selecionarPersonagens() {
    perguntas.value = await obterPerguntas();
    await excluirPersonagens();
    await excluirPerguntas();
    await inserirPerguntas(perguntas.value);
    emit('personagens');
}
</script>

<style scoped>
#tela-inicial {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5rem;
    height: 100vh;
    width: 100vw;
    background: url('../../public/images/fundo-tela-inicial.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
}
#titulo {
    width: 800px;
}
#btn-iniciar {
    width: 400px;
}
#btn-iniciar:hover {
    cursor: pointer;
}
</style>
