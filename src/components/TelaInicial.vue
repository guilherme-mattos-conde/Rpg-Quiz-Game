<template>
    <h2>RPG Quiz</h2>
    <button class="btn-iniciar" @click="selecionarPersonagens">Duelar!</button>
</template>

<script setup lang="ts">
const emit = defineEmits(["personagens"]);

async function limparPersonagens() {
    await fetch("http://localhost:3000/personagens", {
    method: "DELETE"
  });
}

async function selecionarPersonagens() {
    await limparPersonagens();
    emit('personagens');
}
</script>

<style scoped>
</style>
