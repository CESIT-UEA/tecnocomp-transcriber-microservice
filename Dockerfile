FROM node:22

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --break-system-packages \
    yt-dlp \
    faster-whisper

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "src/server.js"]