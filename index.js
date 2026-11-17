
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const sql = mysql.createPool({
    host: process.env.HOST_BANCO,
    user: process.env.USUARIO_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.NOME_BANCO
});

app.get("/", (request, response) => {
    const comando = "SELECT * FROM musicas_michelnovakc";

    sql.query(comando, (error, dados) => {
        if (error) {
            console.log(error);
            return response.status(500).json({
                mensagem: "Erro ao consultar músicas!"
            });
        }

        response.json(dados);
    });
});

app.post("/cadastrar", (request, response) => {
    const { titulo, artista, genero, ano, duracao } = request.body;

    const comando = "INSERT INTO musicas_michelnovakc (titulo, artista, genero, ano, duracao) VALUES (?, ?, ?, ?, ?)";

    sql.query(comando, [titulo, artista, genero, ano, duracao], (error) => {
        if (error) {
            console.log(error);
            return response.status(500).json({
                mensagem: "Erro ao cadastrar música!"
            });
        }

        response.status(201).json({
            mensagem: "Música cadastrada com sucesso!"
        });
    });
});

app.get("/musica/:id", (request, response) => {
    const { id } = request.params;

    const comando = "SELECT * FROM musicas_michelnovakc WHERE id = ?";

    sql.query(comando, [id], (error, dados) => {
        if (error) {
            console.log(error);
            return response.status(500).json({
                mensagem: "Erro ao buscar música!"
            });
        }

        if (dados.length === 0) {
            return response.status(404).json({
                mensagem: "Música não encontrada!"
            });
        }

        response.json(dados[0]);
    });
});

app.put("/editar/:id", (request, response) => {
    const { id } = request.params;
    const { titulo, artista, genero, ano, duracao } = request.body;

    const comando = "UPDATE musicas_michelnovakc SET titulo = ?, artista = ?, genero = ?, ano = ?, duracao = ? WHERE id = ?";

    sql.query(comando, [titulo, artista, genero, ano, duracao, id], (error, resultado) => {
        if (error) {
            console.log(error);
            return response.status(500).json({
                mensagem: "Erro ao editar música!"
            });
        }

        if (resultado.affectedRows === 0) {
            return response.status(404).json({
                mensagem: "Música não encontrada!"
            });
        }

        response.json({
            mensagem: "Música alterada com sucesso!"
        });
    });
});

app.delete("/apagar/:id", (request, response) => {
    const { id } = request.params;

    const comando = "DELETE FROM musicas_michelnovakc WHERE id = ?";

    sql.query(comando, [id], (error, resultado) => {
        if (error) {
            console.log(error);
            return response.status(500).json({
                mensagem: "Erro ao apagar música!"
            });
        }

        if (resultado.affectedRows === 0) {
            return response.status(404).json({
                mensagem: "Música não encontrada!"
            });
        }

        response.json({
            mensagem: "Música apagada com sucesso!"
        });
    });
});

export default app;
