const { Queue } = require("bullmq");
const { randomUUID } = require("crypto");

const redis = require('../config/redis')
const bullConfig = require("../config/bullmq");

const queue = new Queue("transcricao", bullConfig);


async function criarTranscricao(req, res) {
    try {
        const { idModulo, urls } = req.body;

        if (!idModulo){
            return res.status(400).json({ error: "idModulo é obrigatório"})
        }

        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ error: "Lista de URLs é obrigatória" })
        }

        const jobs = [];

        for(const url of urls){
            const id = randomUUID();

            await redis.set(
                `transcricao:${id}`,
                JSON.stringify({
                    id,
                    idModulo,
                    url,
                    status: "PENDENTE"
                })
            );

            await queue.add("transcrever", {
                id,
                idModulo,
                url
            });

            jobs.push({
                id,
                status: "PENDENTE"
            })   
        }

        return res.json({
            total: jobs.length,
            jobs
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Erro interno"
        });
    }
}

async function consultarTranscricao(req, res) {
    try {
        const { id } = req.params;

        const dados = await redis.get(
            `transcricao:${id}`
        );

        if (!dados) {
            return res.status(404).json({
                error: "Transcrição não encontrada"
            });
        }

        return res.json(
            JSON.parse(dados)
        );

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Erro interno"
        });
    }
}

module.exports = {
    criarTranscricao,
    consultarTranscricao
};