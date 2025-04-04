import mysql from "mysql2/promise";
import dotenv from "dotenv";

import IPersonagem from "@/interfaces/IPersonagem";
import IPergunta from "@/interfaces/IPergunta";

type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';

dotenv.config();

async function connect () {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    return connection;
}

export async function inserirPersonagem(p: IPersonagem): Promise<number> {
    const conn = await connect();
    try {
        const sql = "INSERT INTO Personagens(nome, vida, habilidade_1, habilidade_2, habilidade_3, dano_habilidade_1, dano_habilidade_2, dano_habilidade_3) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [p.nome, p.vida, p.habilidade_1, p.habilidade_2, p.habilidade_3, p.dano_habilidade_1, p.dano_habilidade_2, p.dano_habilidade_3];
        const [result] = await conn.query<mysql.ResultSetHeader>(sql, values);
    
        return result.insertId;
    } catch (error) {
        console.error("Erro ao inserir personagem: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function atualizarVidaPersonagem(id: number, vida: number): Promise<number> {
    const conn = await connect();

    try{
        const sql = "UPDATE Personagens SET vida = ? WHERE id_personagem = ?";
        const values = [vida, id];
        const [result] = await conn.query<mysql.ResultSetHeader>(sql, values);
        return result.affectedRows;
    } catch (error) {
        console.error("Erro ao atualizar vida do personagem: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function excluirPersonagens(): Promise<number> {
    const conn = await connect();
    try {
        const sql = "DELETE FROM Personagens";
        const [result] = await conn.query<mysql.ResultSetHeader>(sql)
        
        return result.affectedRows;
    } catch (error) {
        console.error("Erro ao excluir personagens: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function buscarPersonagem(id: number): Promise<IPersonagem | null> {
    const conn = await connect();
    try {
        const sql = "SELECT * FROM Personagens WHERE id_personagem = ?";
        const values = [id];
        const [rows] = await conn.query<IPersonagem & mysql.ResultSetHeader>(sql, values);
    
        return rows;
    } catch (error) {
        console.error("Erro ao buscar personagem: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function buscarPersonagens(): Promise<IPersonagem[]> {
    const conn = await connect();
    try {
        const sql = "SELECT * FROM Personagens";
        const [rows] = await conn.query<IPersonagem[] & mysql.RowDataPacket[]>(sql);
    
        return rows;
    } catch (error) {
        console.error("Erro ao buscar personagens: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function inserirPerguntas(perguntas: IPergunta[]): Promise<number> {
    const conn = await connect();
    try {
        let perguntasInseridas = 0;

        for (let p of perguntas) {
            const sql = "INSERT INTO Perguntas (enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_correta, dificuldade) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [p.enunciado, p.alternativa_a, p.alternativa_b, p.alternativa_c, p.alternativa_d, p.alternativa_correta, p.dificuldade];
            const [result] = await conn.query<mysql.ResultSetHeader>(sql, values);
            perguntasInseridas += result.affectedRows;
        }

        return perguntasInseridas;
    } catch (error) {
        console.error("Erro ao inserir perguntas: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function excluirPerguntas() {
    const conn = await connect();
    try {
        const sql = "DELETE FROM Perguntas";
        const [result] = await conn.query<mysql.ResultSetHeader>(sql)
        
        return result.affectedRows;
    } catch (error) {
        console.error("Erro ao excluir perguntas: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function atualizarPerguntaRespondida(id: number, respondida: boolean): Promise<number> {
    const conn = await connect();

    try{
        const sql = "UPDATE Perguntas SET respondida = ? WHERE id_pergunta = ?";
        const values = [respondida, id];
        const [result] = await conn.query<mysql.ResultSetHeader>(sql, values);
        return result.affectedRows;
    } catch (error) {
        console.error("Erro ao atualizar pergunta: ", error);
        throw error;
    } finally {
        conn.end();
    }
}

export async function atualizarPerguntasRespondidas(dificuldade: Dificuldade, respondida: boolean): Promise<number> {
    const conn = await connect();

    try{
        const sql = "UPDATE Perguntas SET respondida = ? WHERE dificuldade = ?";
        const values = [respondida, dificuldade];
        const [result] = await conn.query<mysql.ResultSetHeader>(sql, values);
        return result.affectedRows;
    } catch (error) {
        console.error("Erro ao atualizar perguntas: ", error);
        throw error;
    } finally {
        conn.end()
    }
}

export async function buscarPerguntaAleatoriaNaoRespondida(dificuldade: Dificuldade): Promise<IPergunta | null> {
    const conn = await connect();
    try {
        const sql = "SELECT * FROM Perguntas WHERE dificuldade = ? AND respondida = FALSE ORDER BY RAND() LIMIT 1";
        const values = [dificuldade];
        const [rows] = await conn.query<IPergunta[] & mysql.RowDataPacket[]>(sql, values);
        
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Erro ao buscar pergunta aleatória: ", error);
        throw error;
    } finally {
        conn.end();
    }
}
