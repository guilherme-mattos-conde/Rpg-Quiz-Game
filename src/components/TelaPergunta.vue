<template>
    <section id="tela-pergunta">
        <div id="titulo">
            <h2>Turno do {{ props.turno == 'P1' ? 'Jogador 1' : 'Jogador 2' }}</h2>
        </div>
        <div id="batalha">
            <div class="personagem">
                <img :src="'/images/personagens/' + personagemP1.nome.toLowerCase() + '.png'"
                    alt="Imagem do personagem" />
                <p class="vida">❤️ {{ personagemP1.vida }}</p>
            </div>
            <span>VS</span>
            <div class="personagem">
                <p class="vida">❤️ {{ personagemP2.vida }}</p>
                <img :src="'/images/personagens/' + personagemP2.nome.toLowerCase() + '.png'"
                    alt="Imagem do personagem" />
            </div>
        </div>

        <div id="caixa-exibicao">
            <div id="pergunta" v-if="caixaExibicao == 'pergunta'">
                <p class="texto-pergunta"><strong>Pergunta ({{ dificuldade }}):</strong> {{ pergunta?.enunciado }}</p>
                <div class="alternativas">
                    <div class="coluna">
                        <button class="alternativa" @click="responder('A')">{{ pergunta.alternativa_a }}</button>
                        <button class="alternativa" @click="responder('B')">{{ pergunta.alternativa_b }}</button>
                    </div>
                    <div class="coluna">
                        <button class="alternativa" @click="responder('C')">{{ pergunta.alternativa_c }}</button>
                        <button class="alternativa" @click="responder('D')">{{ pergunta.alternativa_d }}</button>
                    </div>
                </div>
            </div>
            <div id="resposta-correta" v-else-if="caixaExibicao == 'resposta-correta'">
                <h2>Resposta Correta!</h2>
                <a @click="avancar"><img id="btn-proximo-turno" src="../../public/images/btn-proximo-turno.png" alt=""></a>
            </div>
            <div id="resposta-incorreta" v-else-if="caixaExibicao == 'resposta-incorreta'">
                <h2>Resposta Incorreta!</h2>
                <a @click="avancar"><img id="btn-proximo-turno" src="../../public/images/btn-proximo-turno.png" alt=""></a>
            </div>
            <div id="vitoria" v-else-if="caixaExibicao == 'vitoria'">
                <h2>{{ turno == "P1" ? "Jogador 1" : "Jogador 2" }} Venceu!</h2>
                <a @click="avancar"><img id="btn-finalizar" src="../../public/images/btn-finalizar.png" alt=""></a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import IPergunta from "@/interfaces/IPergunta";
import IPersonagem from "@/interfaces/IPersonagem";

type Turno = 'P1' | 'P2';
type Alternativa = 'A' | 'B' | 'C' | 'D';
type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';
type CaixaExibicao = 'pergunta' | 'resposta-correta' | 'resposta-incorreta' | 'vitoria';

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
const emit = defineEmits(["habilidades", "inicio"]);
const idPergunta = ref<number>(0);
const pergunta = ref<IPergunta>(carregandoPergunta as IPergunta);
const personagemP1 = ref<IPersonagem>(carregandoPersonagem as IPersonagem);
const personagemP2 = ref<IPersonagem>(carregandoPersonagem as IPersonagem);
const caixaExibicao = ref<CaixaExibicao>('pergunta')

async function carregarPersonagens() {
    personagemP1.value = await buscarPersonagem(props.idP1);
    personagemP2.value = await buscarPersonagem(props.idP2);
}

async function carregarPergunta() {
    const perguntaAleatoria = await buscarPerguntaAleatoriaNaoRespondida(props.dificuldade);

    if (pergunta === null) {
        atualizarPerguntasRespondidas(props.dificuldade);
        carregarPergunta();
    } else {
        pergunta.value = perguntaAleatoria
    }
}

async function carregarDados() {
    await carregarPergunta();
    await carregarPersonagens();
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

async function atualizarVidaPersonagem(id: number, vida: number) {
    try {
        const res = await fetch(`http://localhost:3000/personagem/${id}/vida`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vida }),
        });

        if (!res.ok) {
            throw new Error(`Erro ao atualizar vida do personagem: ${res.status}`);
        }

        await carregarPersonagens();
    } catch (error) {
        console.error("Erro ao atualizar personagem!", error);
    }
}

async function atualizarPerguntaRespondida(id: number) {
    const res = await fetch(`http://localhost:3000/pergunta/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao atualizar pergunta: ${errorText}`);
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

async function buscarPerguntaAleatoriaNaoRespondida(dificuldade: Dificuldade) {
    try {
        const res = await fetch(`http://localhost:3000/pergunta/${dificuldade}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ao buscar pergunta: ${errorText}`);
        }

        const data = await res.json();

        idPergunta.value = data.id_pergunta

        return data;
    } catch (error) {
        console.error("Erro ao buscar personagens!", error);
    }
}

async function responder(res: Alternativa) {
    const resCerta = pergunta.value.alternativa_correta;

    const carregarDano = (personagem: IPersonagem) => {
        var dano = 0;

        switch (props.dificuldade) {
            case "Fácil": dano = personagem.dano_habilidade_1; break;
            case "Médio": dano = personagem.dano_habilidade_2; break;
            case "Difícil": dano = personagem.dano_habilidade_3; break;
        }

        return dano;
    }

    console.log("Resposta escolhida:", res);
    console.log("Resposta correta:", resCerta);

    atualizarPerguntaRespondida(idPergunta.value);

    if (res === resCerta) {
        const atacante = props.turno === 'P1' ? personagemP1.value : personagemP2.value;
        const defensor = props.turno === 'P1' ? personagemP2.value : personagemP1.value;
        const defensorId = props.turno === 'P1' ? props.idP2 : props.idP1;

        const dano = carregarDano(atacante);
        const vida = Math.max(0, defensor.vida - dano);

        await atualizarVidaPersonagem(defensorId, vida);
        defensor.vida = vida;

        caixaExibicao.value = vida > 0 ? 'resposta-correta' : 'vitoria';
    } else {
        caixaExibicao.value = 'resposta-incorreta';
    }
}

function avancar() {
    caixaExibicao.value == 'vitoria' ? emit('inicio') : emit('habilidades');
}

onMounted(carregarDados)
</script>

<style scoped>
#tela-pergunta {
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
#batalha {
    display: flex;
    margin-top: 10px;
    justify-content: space-around;
    align-items: center;
    width: 80vw;
    margin: 20px 0;

    .personagem {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        margin-bottom: 25px;

        img {
            width: 280px;
        }

        .vida {
            font-size: 20pt;
            color: white;
            margin: 10px 20px;
        }
    }

    span {
        font-size: 50pt;
        color: white;
    }
}
#caixa-exibicao {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 700px;
    gap: 2rem;
}
#pergunta {
    display: flex;
    justify-content: space-between;
    width: 75vw;
    height: 120px;
    background: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border: 2px solid black;
    border-radius: 20px;

    .texto-pergunta {
        font-size: 15pt;
        color: black;
        text-align: justify;
        width: 450px;
    }
    .alternativas {
        display: flex;
        width: 600px;
        justify-content: space-around;
    }
    .coluna {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 2rem
    }
    .alternativa {
        font-size: 12pt;
        min-width: 200px;
        height: 40px;
        cursor: pointer;
        background-color: rgb(127, 21, 21);
        color: white;
        border: 2px solid black;
        opacity: 90%;
        border-radius: 10px;
        transition: .5s;
    }
    .alternativa:hover {
        opacity: 100%;
        border: 2px solid black
    }
}
#resposta-correta, #resposta-incorreta {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 300px;
    height: 120px;
    padding: 20px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.8);

    #btn-proximo-turno {
        cursor: pointer;
        height: 80px;
    }
}
#resposta-correta {
    border: 2px solid rgb(39, 185, 39);
}
#resposta-incorreta {
    border: 2px solid red;
}
#vitoria {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 300px;
    height: 120px;
    padding: 20px;
    border: 2px solid rgb(255, 225, 0);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.8);

    #btn-finalizar {
        cursor: pointer;
        height: 70px;
    }
}
</style>