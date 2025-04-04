import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { inserirPersonagem, atualizarVidaPersonagem, excluirPersonagens, buscarPersonagem, buscarPersonagens, inserirPerguntas, atualizarPerguntaRespondida, atualizarPerguntasRespondidas, buscarPerguntaAleatoriaNaoRespondida, excluirPerguntas } from "./services/db";

type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/personagem", async (req, res) => {
    try {
        const id = await inserirPersonagem(req.body);
        res.status(201).json({ id, message: "Personagem inserido com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao inserir personagem" + error });
    }
});

app.get("/personagem/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const personagem = await buscarPersonagem(id);

        if (personagem != null) {
            res.json(personagem);
        } else {
            res.status(404).json({ error: "Personagem não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar personagem: " + error});
    }
});

app.get("/personagens", async (_req, res) => {
    try {
        const personagens = await buscarPersonagens();
        res.json(personagens);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar personagens" });
    }
});

app.put("/personagem/:id/vida", async (req, res) => {
    try {
        const { id } = req.params;
        const { vida } = req.body;
        
        const result = await atualizarVidaPersonagem(Number(id), vida);

        if (result) {
            res.json({ message: "Vida do personagem atualizada com sucesso!" });
        } else {
            res.status(404).json({ error: "Personagem não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar vida do personagem" });
    }
});

app.delete("/personagens", async (_req, res) => {
    try {
        const result = await excluirPersonagens();
        res.json({ message: `${result} personagens excluídos` });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir personagens" });
    }
});

app.post("/perguntas", async (req, res) => {
    try {
        await inserirPerguntas(req.body);
        res.status(201).json({message: "Perguntas iseridas com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao inserir perguntas" + error });
    }
});

app.get("/pergunta/:dificuldade", async (req, res) => {
    try {
        const dificuldade = req.params.dificuldade as unknown as Dificuldade;
        const perguntas = await buscarPerguntaAleatoriaNaoRespondida(dificuldade);
        res.json(perguntas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar pergunta" });
    }
});

app.put("/pergunta/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const respondida = true;
        const result = await atualizarPerguntaRespondida(Number(id), respondida);

        if (result) {
            res.json({ message: "Pergunta atualizada com sucesso!" });
        } else {
            res.status(404).json({ error: "Pergunta não encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar pergunta" });
    }
});

app.put("/perguntas/:dificuldade", async (req, res) => {
    try {
        const dificuldade = req.params as unknown as Dificuldade;
        const respondida = true;
        await atualizarPerguntasRespondidas(dificuldade, respondida);
        res.json({ message: "Perguntas atualizadas com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar pergunta" });
    }
});

app.delete("/perguntas", async (_req, res) => {
    try {
        const result = await excluirPerguntas();
        res.json({ message: `${result} perguntas excluídas` });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir perguntas" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
