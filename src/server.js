require("dotenv").config();

const express = require("express");

const requiredEnv = ["PORT", "API_KEY_TRANSCRIBER", "REDIS_HOST", "REDIS_PORT" ];

for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} não configurada`);
    }
}

const app = express();

const transcricaoRoutes = require("./routes/transcricao.route");

app.use(express.json());


app.use("/api", transcricaoRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});