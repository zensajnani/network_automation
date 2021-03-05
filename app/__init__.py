from flask import Flask

app = Flask(__name__, template_folder='./pages')

from app import views

