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
        --js-runtimes node:/usr/local/bin/node \
        --extractor-args "youtube:getpot_bgutil_baseurl=http://bgutil-provider:4416" \
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