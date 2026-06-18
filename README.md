# Serviço de Transcrição

Microserviço responsável por transcrever vídeos do YouTube utilizando `yt-dlp` e `Whisper`.  
Após a transcrição, o resultado é enviado automaticamente para um webhook do **n8n** para processamento de *embeddings* e armazenamento vetorial.

## 🚀 Tecnologias
* Node.js (Express)
* BullMQ & Redis
* yt-dlp & FFmpeg
* Whisper
* Docker

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=8003
API_KEY_TRANSCRIBER=
N8N_WEBHOOK_URL=
N8N_API_KEY=
REDIS_HOST=redis
REDIS_PORT=6379