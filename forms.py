from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, TextAreaField, RadioField
from wtforms.validators import DataRequired

# QA data form
class QAForm(FlaskForm):
    answer = TextAreaField("Answer", validators=[DataRequired()])
    answer_known = RadioField("Answer known", choices=[("yes", "Yes"), ("no", "No")], validators=[DataRequired()])
    familiarity = RadioField("Familiarity", choices=[(1, "Not at all"), (2, "Slightly"), (3, "Somewhat"), (4, "Moderately"), (5, "Extremely")], validators=[DataRequired()])
    difficulty = RadioField("Difficulty", choices=[(1, "Not at all"), (2, "Slightly"), (3, "Somewhat"), (4, "Moderately"), (5, "Extremely")], validators=[DataRequired()])
    submit = SubmitField("Submit")

# Questionnaire data form
class Questionnaire(FlaskForm):
    freq_use = RadioField("Frequency_use", choices=[(1, "Never/Almost never"), (2, "About once per several months"), (3, "About once per month"), (4, "About once per week"), (5, "Several times per week")], validators=[DataRequired()])
    submit = SubmitField("Submit")
