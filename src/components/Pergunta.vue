<template>
        <h3>Selecione sua Habilidade</h3>
    <h2>{{ turno }}</h2>
    <div class="battle">
        <div class="personagem-p1">
            <img :src="'/images/personagens/' + personagemP1.nome.toLowerCase() + '.png'" alt="Imagem do personagem" />
            <span>❤️ {{ personagemP1.vida }}</span>
        </div>
        <span>VS</span>
        <div class="personagem-p2">
            <img :src="'/images/personagens/' + personagemP2.nome.toLowerCase() + '.png'" alt="Imagem do personagem" />
            <span>❤️ {{ personagemP2.vida }}</span>
        </div>
    </div>
    
    <div class="question-screen">
        <h3>Pergunta:</h3>
        <p>{{ pergunta?.enunciado }}</p>
        <div class="options">
            <button class="alternativa" @click="responder('A')">{{ pergunta.alternativa_a }}</button>
            <button class="alternativa" @click="responder('B')">{{ pergunta.alternativa_b }}</button>
            <button class="alternativa" @click="responder('C')">{{ pergunta.alternativa_c }}</button>
            <button class="alternativa" @click="responder('D')">{{ pergunta.alternativa_d }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import IPergunta from "@/interfaces/IPergunta";
import IPersonagem from "@/interfaces/IPersonagem";

type Turno = 'P1' | 'P2';
type Alternativa = 'A' | 'B' | 'C' | 'D';
type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';

const carregandoPergunta = {
    "enunciado": "Carregando",
    "alternativa_a": "Carregando",
    "alternativa_b": "Carregando",
    "alternativa_c": "Carregando",
    "alternativa_d": "Carregando",
    "alternativa_correta": "Carregando",
    "dificuldade": "Carregando",
}
const carregandoPersonagem = {
    'nome': 'Carregando',
    'habilidade_1': 'Carregando',
    'habilidade_2': 'Carregando',
    'habilidade_3': 'Carregando'
}

const props = defineProps<{ idP1: number, idP2: number, turno: Turno, dificuldade: Dificuldade }>();
const emit = defineEmits(["habilidades"]);
const perguntas = ref<IPergunta[]>([])
const pergunta = ref<IPergunta>(carregandoPergunta as IPergunta);
const personagemP1 = ref<IPersonagem>(carregandoPersonagem as IPersonagem);
const personagemP2 = ref<IPersonagem>(carregandoPersonagem as IPersonagem);

async function carregarPersonagens() {
    personagemP1.value = await buscarPersonagem(props.idP1);
    personagemP2.value = await buscarPersonagem(props.idP2);
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

async function carregarPergunta() {
    const perguntasFiltradas = await buscarPerguntas(props.dificuldade);

    if(perguntasFiltradas.length === 0) {
        atualizarPerguntasRespondidas(props.dificuldade);
        carregarPergunta()
    } else {
        pergunta.value = perguntasFiltradas[Math.floor(Math.random() * perguntasFiltradas.length)];
    }
}

async function atualizarPerguntasRespondidas(dificuldade: Dificuldade) {
    const res = await fetch(`http://localhost:3000/perguntas/${dificuldade}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao atualizar perguntas: ${errorText}`);
    }
}

async function buscarPerguntas(dificuldade: Dificuldade) {
    try {
        const res = await fetch(`http://localhost:3000/perguntas/${dificuldade}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao buscar perguntas: ${errorText}`);
    }

    const data = await res.json();
    return data;
    } catch (error) {
        console.error("Erro ao buscar personagens!", error);
    }
}

function responder(res: Alternativa) {
    const resCerta = pergunta.value.alternativa_correta
    console.log("Resposta escolhida:", res);
    console.log("Resposta correta:", pergunta.value?.alternativa_correta);

    if(res === resCerta) {
        if (props.turno === 'P1') {
            const dano = carregarDano(personagemP1.value)
            //diminuir vida do P2
        } else {
            const dano = carregarDano(personagemP1.value)
            //diminuir vida do P1
        }
    }

    emit("habilidades");
};

function carregarDano(personagem: IPersonagem) {
    var dano = 0;

    switch(props.dificuldade) {
        case "Fácil": dano = personagem.dano_habilidade_1; break;
        case "Médio": dano = personagem.dano_habilidade_1; break;
        case "Difícil": dano = personagem.dano_habilidade_1; break;
    }

    return dano;
}

onMounted(carregarPergunta);
</script>

<style scoped></style>