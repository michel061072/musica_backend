
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
    const comandoSelect = "SELECT * FROM musicas_michelnovakc";

    sql.query(comandoSelect, (error, data) => {
        if (error) {
            console.error(error);
            return response.status(500).json({
                erro: "Erro ao consultar as músicas"
            });
        }

        response.json(data);
    });
});

app.listen(3000, () => {
    console.log("Servidor online em http://localhost:3000");
});

export default app;
