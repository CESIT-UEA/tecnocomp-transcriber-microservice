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

async function transcrever(audioFile) {

    return await run(
        `python3 python/transcrever.py "${audioFile}"`
    );
}

module.exports = {
    transcrever
};