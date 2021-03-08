# this file initialises the Flask app

import os
from flask import Flask
# from flask_sqlalchemy import SQLAlchemy # to work with SQL database

# Set basedir variable as absolute path of parent directory
# which in this case is configGenerator/
# this is the path where the database will be saved
# we are using the os library to make this application independent of the operating system
# and also to enable us to run the application on other machines locally
# this will also work in a production environment
basedir = os.path.abspath(os.pardir)

# by default all the HTML files are accessed from the templates/ directory
# we needed to change the name of the directory as it interferes with out program logic
# the word template has another meaning with respect to the context of this project
# to avoid confusion, enhance readability and make the code easier to understand,
# we have renamed the templates/ directory to pages/
app = Flask(__name__, template_folder='./pages') # creating flask app

# connecting Flask application to the database
# setup database location 
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialise Database
# db = SQLAlchemy(app)

# importing views.py from the app/ directory
# views.py countains all the URL routes
from app import views

