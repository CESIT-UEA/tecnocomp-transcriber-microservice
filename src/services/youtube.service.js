const { exec } = require("child_process");

function run(comando) {
    return new Promise((resolve, reject) => {

        exec(
            comando,
            {
                maxBuffer: 50 * 1024 * 1024
            },
            (err, stdout, stderr) => {

                if (err) {
                    reject(stderr);
                    return;
                }

                resolve(stdout);
            }
        );
    });
}

async function baixarAudio(url, destino) {

   await run(
        `yt-dlp \
        --cookies /app/cookies.txt \
        --extractor-args "youtube:player_client=android" \
        -x \
        --audio-format mp3 \
        -o "${destino}" \
        "${url}"`
    );
    return destino;
}

module.exports = {
    baixarAudio
};