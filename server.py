from flask import Flask, request, render_template, jsonify
from googletrans import Translator, LANGCODES, LANGUAGES
from argparse import ArgumentParser
import os

# Init Flask App
app = Flask(__name__)
app.secret_key = os.urandom(12)  # Generic key for dev purposes only

# Init Google Translate
translator = Translator()


# ======== Routing ======================================================= #
# -------- Home ---------------------------------------------------------- #
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# -------- Langauge Codes ------------------------------------------------ #
@app.route('/langcodes', methods=['GET'])
def langcodes():
    return jsonify(
        langcodes=LANGCODES,
    )

# -------- TRANSLATE ----------------------------------------------------- #
@app.route('/translate', methods=['POST'])
def translate():
    text = request.json['text']
    src = request.json['src']
    dest = request.json['dest']

    print(f'{src} -> {dest}: {text}')

    translation = translator.translate(text=text, src=src, dest=dest)

    print(translation.origin, ' -> ', translation.text)

    return jsonify(
        text=translation.text,
    )


# ======== Main ========================================================== #
if __name__ == '__main__':
    parser = ArgumentParser(description='Translation Tool')
    parser.add_argument("-p", "--port", type=int,
                        metavar="PORT", dest="port", default=5000,
                        help='Port number')
    parser.add_argument("--host", type=str, metavar="HOST",
                        dest="host", default="localhost")
    args = parser.parse_args()

    app.run(host=args.host, port=args.port, debug=True)
