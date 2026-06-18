from faster_whisper import WhisperModel
import sys

audio_file = sys.argv[1]

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(audio_file)

texto = ""

for segment in segments:
    minutos = int(segment.start // 60)
    segundos = int(segment.start % 60)

    texto += f"[{minutos:02d}:{segundos:02d}] {segment.text}\n"

print(texto)