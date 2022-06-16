from crypt import methods
from flask import Flask, jsonify, render_template, request, redirect, url_for
from h11 import Data
import json
import requests
from bs4 import BeautifulSoup
from forms import *

app = Flask(__name__)
app.config["SECRET_KEY"] = "my_secret"

@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/calibration")
def calibration():
    return render_template("calibration.html")

@app.route("/experiment", methods=["GET", "POST"])
def experiment():
    qa_form = QAForm()
    if qa_form.validate_on_submit():
        data = {}
        data["question"] = "What was the hit off Steppenwolf's self-titled debut LP?"
        data["answer"] = qa_form.answer.data
        data["answer_known"] = qa_form.answer_known.data
        data["familiarity"] = qa_form.familiarity.data
        data["difficulty"] = qa_form.difficulty.data
        # with open("data/QA_data/QA_data.json", "a") as f:
        #     json.dump(data, f)
        return redirect(url_for("questionnaire"))
    return render_template("experiment.html", template_form=qa_form)

@app.route("/experiment/et-data", methods=["POST"])
def eyetracking_data():
    data = request.get_json()
    with open("data/et_data/et_data.json", "a") as f:
        json.dump(data, f)
        f.write("\n")
    return data

@app.route("/wiki/<title>", methods=["GET"])
def get_article(title):
    URL_PATTERN = "https://en.wikipedia.org/api/rest_v1/page/html/{}"
    # URL_PATTERN = "https://en.wikipedia.org/wiki/{}?action=render"
    # STYLE_CSS = "https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles&skin=vector"
    # STYLE_CSS_2 = "https://en.wikipedia.org/w/load.php?lang=en&amp;modules=ext.cite.styles|ext.kartographer.style|ext.uls.interlanguage|ext.visualEditor.desktopArticleTarget.noscript|ext.wikimediaBadges|jquery.makeCollapsible.styles|skins.vector.styles.legacy|wikibase.client.init&only=styles&skin=vector"

    response = requests.get(URL_PATTERN.format(title))
    soup = BeautifulSoup(response.content, features="lxml")
    # soup.append(soup.new_tag("link", rel="stylesheet", href=STYLE_CSS))
    # soup.append(soup.new_tag("link", rel="stylesheet", href=STYLE_CSS_2))
    soup.head.append(soup.new_tag('style', type='text/css'))
    soup.head.style.append('body {font-family: sans-serif; font-size: calc(1em * 0.875); line-height: 1.6; margin: 2.5em;}')
    for a in soup.findAll("a"):
        if a.has_attr("href") and "File:" not in a["href"]:
            a["href"] = a["href"].replace("//en.wikipedia.org", "")
    return str(soup), 200

@app.route("/questionnaire", methods=["GET", "POST"])
def questionnaire():
    questionnaire = Questionnaire()
    if questionnaire.validate_on_submit():
        data = {}
        data["frequency_use"] = questionnaire.freq_use.data
        # with open("data/questionnaire_data/questionnaire_data.json", "a") as f:
        #     json.dump(data, f)
        return redirect(url_for('questionnaire'))
    return render_template("questionnaire.html", template_form=questionnaire)

# @app.route("/test_webpage", methods=["GET", "POST"])
# def test_webpage():
#     if request.method == "POST":
#         data = request.get_json()
#         with open("data/test_webpage_data.json", "a") as f:
#             json.dump(data, f)
#             f.write("\n")
#     return render_template("test_webpage.html")

# enables debug mode
if __name__ == "__main__":
    app.run(debug=True)