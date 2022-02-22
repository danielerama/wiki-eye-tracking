from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/experiment", methods=['GET', 'POST'])
def experiment():
    if request.method == 'POST':
        data = request.get_json()
        with open("data.json", "w") as f:
            json.dump(data, f)

    return render_template("experiment.html")

# enables debug mode
if __name__ == "__main__":
    app.run(debug=True)