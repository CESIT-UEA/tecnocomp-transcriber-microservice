const { Queue } = require("bullmq");
const { randomUUID } = require("crypto");

const redis = require("../config/redis");
const bullConfig = require("../config/bullmq");

const queue = new Queue("transcricao", bullConfig);

async function criarTranscricao(req, res) {
    try {
        const { idModulo, urls } = req.body;

        if (!idModulo) {
            return res.status(400).json({
                error: "idModulo é obrigatório"
            });
        }

        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({
                error: "Lista de URLs é obrigatória"
            });
        }

        const jobs = [];

        for (let i = 0; i < urls.length; i++) {

            const url = urls[i];
            const id = randomUUID();

            await redis.set(
                `transcricao:${id}`,
                JSON.stringify({
                    id,
                    idModulo,
                    url,
                    ordem: i + 1,
                    status: "PENDENTE"
                })
            );

            await redis.sadd(
                `modulo:${idModulo}:jobs`,
                id
            );

            await queue.add("transcrever", {
                id,
                idModulo,
                url
            });

            jobs.push({
                id,
                ordem: i + 1,
                status: "PENDENTE"
            });
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

async function buscarStatusPorModulo(req, res) {
    try {

        const { idModulo } = req.params; 

        const ids = await redis.smembers(
            `modulo:${idModulo}:jobs`
        );

        if (ids.length === 0) {
            return res.status(404).json({
                error: "Nenhum treinamento encontrado para este módulo"
            });
        }

        const videos = [];

        for (const id of ids) {

            const job = await redis.get(
                `transcricao:${id}`
            );

            if (job) {
                videos.push(
                    JSON.parse(job)
                );
            }
        }

        videos.sort(
            (a, b) => a.ordem - b.ordem
        );

        const concluidos = videos.filter(
            v => v.status === "CONCLUIDO"
        ).length;

        const processando = videos.filter(
            v => v.status === "PROCESSANDO"
        ).length;

        const pendentes = videos.filter(
            v => v.status === "PENDENTE"
        ).length;

        const erros = videos.filter(
            v => v.status === "ERRO"
        ).length;

        const total = videos.length;

        let status = "PENDENTE";

        if (erros > 0) {
            status = "ERRO";
        } else if (processando > 0) {
            status = "PROCESSANDO";
        } else if (concluidos === total && total > 0) {
            status = "CONCLUIDO";
        }

        return res.json({
            idModulo,
            status,
            total,
            concluidos,
            processando,
            pendentes,
            erros,
            percentual:
                total > 0
                    ? Math.round(
                        (concluidos / total) * 100
                    )
                    : 0,
            videos
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Erro interno"
        });
    }
}

module.exports = {
    criarTranscricao,
    consultarTranscricao,
    buscarStatusPorModulo
};