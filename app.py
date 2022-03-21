from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/calibration", methods=['GET', 'POST'])
def calibration():
    if request.method == 'POST':
        data = request.get_json()
        with open("data.json", "w") as f:
            json.dump(data, f)

    return render_template("calibration.html")

@app.route("/experiment")
def experiment():
    # return render_template("experiment.html")
    return render_template("experiment.html")

@app.route('/show_wiki_page')
def show_wiki_page():
    return render_template('unito_wiki_page.html')

# enables debug mode
if __name__ == "__main__":
    app.run(debug=True)