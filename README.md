Serviço de transcrição 

Microserviço responsável por transcrever vídeos do YouTube utilizando yt-dlp e Whisper.

Após a transcrição, o resultado é enviado automaticamente para um webhook do n8n para processamento de embeddings e armazenamento vetorial.

Tecnologias
Node.js
Express
BullMQ
Redis
yt-dlp
FFmpeg
Whisper
Docker

Variáveis de Ambiente

Crie um arquivo .env baseado no .env.example.

PORT=8003

API_KEY_TRANSCRIBER=

N8N_WEBHOOK_URL=
N8N_API_KEY=

REDIS_HOST=redis
REDIS_PORT=6379

Endpoints
Criar transcrições

POST /api/transcrever

Headers
x-api-key: SUA_API_KEY
Content-Type: application/json
Body
{
  "idModulo": 123,
  "urls": [
    "https://youtu.be/cBFad2hb5NY",
    "https://youtu.be/jNQXAC9IVRw"
  ]
}
Resposta
{
  "total": 2,
  "jobs": [
    {
      "id": "uuid",
      "status": "PENDENTE"
    }
  ]
}
Consultar status da transcrição

GET /api/transcrever/:id

Headers
x-api-key: SUA_API_KEY
Exemplo
GET /api/transcrever/819b9a37-8d3a-42ac-8700-64b13c247aba
Resposta
{
  "id": "819b9a37-8d3a-42ac-8700-64b13c247aba",
  "idModulo": 123,
  "url": "https://www.youtube.com/embed/3V6MvoEsoeQ?si=Dxujn2VdQo1AYgPw",
  "status": "PROCESSANDO"
}
