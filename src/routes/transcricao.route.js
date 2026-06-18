const express = require("express");

const { criarTranscricao, consultarTranscricao, buscarStatusPorModulo } = require("../controllers/transcricao.controller");
const apiKeyMiddleware = require("../middlewares/apiKey.middleware");

const router = express.Router();

router.post("/transcrever", apiKeyMiddleware, criarTranscricao);
router.get("/transcrever/:id", apiKeyMiddleware, consultarTranscricao);
router.get("/modulo/:idModulo/status", apiKeyMiddleware, buscarStatusPorModulo)

module.exports = router;