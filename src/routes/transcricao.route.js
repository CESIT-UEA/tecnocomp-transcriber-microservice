const express = require("express");

const { criarTranscricao, consultarTranscricao } = require("../controllers/transcricao.controller");
const apiKeyMiddleware = require("../middlewares/apiKey.middleware");

const router = express.Router();

router.post("/transcrever", apiKeyMiddleware, criarTranscricao);
router.get("/transcrever/:id", apiKeyMiddleware, consultarTranscricao);

module.exports = router;