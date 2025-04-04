# 🎲 RPG Quiz Game

Um jogo de perguntas e respostas com temática RPG. Desenvolvido com Vue.js no frontend e Node.js no backend, utilizando MySQL como banco de dados.

## 🚀 Tecnologias Usadas

- **Frontend:** Vue.js + TypeScript  
- **Backend:** Node.js + TypeScript  
- **Banco de Dados:** MySQL  
- **Gerenciador de Banco:** MySQL Workbench  

## 📦 Como Instalar e Rodar o Projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/rpg-quiz-game.git
cd rpg-quiz-game
```
### 2️⃣ Instalar as dependências
```bash
npm install
```
## 🛠️ Configuração do Banco de Dados (MySQL Workbench)

### 1. Criar a conexão com o banco

Abra o **MySQL Workbench** e crie uma nova conexão com os seguintes dados:

- **Host:** `localhost`  
- **Porta:** `3000`  
- **Usuário:** `seu_usuario`  
- **Senha:** `sua_senha`  
- **Nome da conexão:** `RPG_Quiz_Game`

### 2. Importar o arquivo `database.sql`

1. No MySQL Workbench, vá em **File > Open SQL Script**
2. Selecione o arquivo `database.sql` que está na raiz do projeto
3. Certifique-se de que o banco `rpg_quiz_game` está selecionado no menu suspenso
4. Clique no botão de **raio (⚡)** para executar o script e criar as tabelas e dados necessários

## 🧪 Rodando o Projeto

### 1. Compilar o backend (Node.js + TypeScript)

```bash
npx tsc
```

### 2. Iniciar o backend

```bash
node dist/server
```
O backend será iniciado na porta 3000.

### 3. Iniciar o frontend (Vue.js)
Em outro terminal:
```bash
npm run serve
```
