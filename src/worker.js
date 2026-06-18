const { Worker } = require("bullmq");
const fs = require("fs");
const axios = require("axios");

require('dotenv').config();

const requiredEnv = ["REDIS_HOST", "REDIS_PORT", "N8N_WEBHOOK_URL", "N8N_API_KEY"];

for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} não configurada`);
    }
}

const bullConfig = require("./config/bullmq");
const redis = require("./config/redis");

const { baixarAudio } = require("./services/youtube.service");

const { transcrever } = require("./services/whisper.service");

new Worker(
    "transcricao",
    async (job) => {

        const { id, idModulo, url } = job.data;
        let audioFile;

        try {
            console.log("=================================");
            console.log("JOB RECEBIDO");
            console.log("ID:", id);
            console.log("URL:", url);

            await redis.set(
                `transcricao:${id}`,
                JSON.stringify({
                    id,
                    idModulo,
                    url,
                    status: "PROCESSANDO"
                })
            );

            audioFile = `/tmp/${id}.mp3`;

            console.log("Baixando áudio...");

            await baixarAudio(url, audioFile);

            console.log("Iniciando Whisper...");

            const resultado = await transcrever(audioFile);

            console.log("Enviando para n8n...");

            await axios.post(process.env.N8N_WEBHOOK_URL, {
                id,
                idModulo,
                url,
                transcript: resultado
            },
                {
                    timeout: 30000,
                    headers: {
                        "x-api-key": process.env.N8N_API_KEY
                    }
                }
            );

            console.log("Webhook enviado com sucesso");

            await redis.set(
                `transcricao:${id}`,
                JSON.stringify({
                    id,
                    idModulo,
                    url,
                    status: "CONCLUIDO",
                })
            );

            console.log(`Transcrição concluída ${id}`);

        } catch (err) {

            await redis.set(
                `transcricao:${id}`,
                JSON.stringify({
                    id,
                    idModulo,
                    url,
                    status: "ERRO",
                    error: err.toString()
                })
            );

            console.error(`Erro no job ${id}`, err);
        } finally {
            try {
                if (audioFile && fs.existsSync(audioFile)) {
                    await fs.promises.unlink(audioFile);
                    console.log(`Áudio removido: ${audioFile}`);
                }

            } catch (cleanupError) {
                console.error(
                    `Erro ao limpar arquivos do job ${id}`,
                    cleanupError
                );
            }
        }
    },
    bullConfig
);