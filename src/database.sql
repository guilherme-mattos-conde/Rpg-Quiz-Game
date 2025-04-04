CREATE DATABASE IF NOT EXISTS rpg_quiz_game;
USE rpg_quiz_game;

CREATE TABLE IF NOT EXISTS Personagens (
		id_personagem INT PRIMARY KEY AUTO_INCREMENT,
		nome VARCHAR(50) NOT NULL,
		vida INT NOT NULL,
        habilidade_1 VARCHAR(50) NOT NULL,
        habilidade_2 VARCHAR(50) NOT NULL,
        habilidade_3 VARCHAR(50) NOT NULL,
        dano_habilidade_1  INT NOT NULL,
        dano_habilidade_2  INT NOT NULL,
        dano_habilidade_3  INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Perguntas (
	id_pergunta INT PRIMARY KEY AUTO_INCREMENT,
	enunciado TEXT NOT NULL,
	alternativa_a VARCHAR(255) NOT NULL,
	alternativa_b VARCHAR(255) NOT NULL,
	alternativa_c VARCHAR(255) NOT NULL,
	alternativa_d VARCHAR(255) NOT NULL,
	alternativa_correta ENUM('A', 'B', 'C', 'D') NOT NULL,
	dificuldade ENUM('Fácil', 'Médio', 'Difícil') NOT NULL,
	respondida BOOLEAN DEFAULT FALSE
);
