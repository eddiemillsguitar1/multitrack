from flask import Flask, request, send_file
import soundfile as sf
import numpy as np
from scipy.signal import lfilter

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"


def apply_chorus_effect(audio_data, sample_rate):
    # Basic chorus effect implementation (placeholder)
    chorus_amount = 0.3  # Mid-level chorus amount
    delay = int(0.03 * sample_rate)  # 30ms delay for chorus
    decay = 0.5  # Decay factor

    chorus = np.copy(audio_data)
    for i in range(delay, len(audio_data)):
        chorus[i] += decay * audio_data[i - delay]

    return chorus


@app.route('/apply-chorus', methods=['POST'])
def apply_chorus():
    file = request.files['file']
    audio_data, sample_rate = sf.read(file)

    # Apply chorus effect
    modified_audio = apply_chorus_effect(audio_data, sample_rate)

    # Save the modified file
    output_file = 'output_with_chorus.wav'
    sf.write(output_file, modified_audio, sample_rate)

    return send_file(output_file, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
