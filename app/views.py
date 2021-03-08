from app import app
from flask import render_template, request, jsonify
from .db import connect_to_db, get_template_names, insert_template, display_table, get_template_row

@app.route("/")
def index():
    return render_template('index.html')

# Show form to allow users to create their own templates
@app.route('/create', methods=['GET', 'POST'])
def create_template():
    #return html of template component to display on webpage with AJAX 
    return jsonify('', render_template('create-template.html'))

# Display template selected by the user
@app.route('/display-template', methods=['GET', 'POST'])
def display_template():
    # get template name
    template_name = request.form['template_name']
    template_data =  get_template_row(template_name)
    # set path to the templates html file
    #return html of template component 
    return jsonify('', render_template('display-template.html', data=template_data))

# Function to receive input variables set by the user in the Create Template form
@app.route('/api/set-inputs', methods=['GET', 'POST'])
def set_inputs():
    # store input variables received from frontend in input_variables
    input_variables = request.get_json()
    return input_variables

# Call this API to create and save a new template after user has set input variables and written the markup
@app.route('/api/save-template', methods=['GET', 'POST'])
def save_template():
    # data = request.form['markup']
    # Get name, description and markup of the new template
    try:
        template_name = request.form['template_name']
        template_desc = request.form['template_desc']
        markup = request.form['markup']
    except:
        template_name = ""
        template_desc = ""
        markup = "No Markup Provided"
    print("---------------------------")
    print(f"Markup: {markup}")
    insert_template(template_name, template_desc, markup)
    return "Saved Template"

# get template names to display in the sidebar 
@app.route('/api/get-template-names', methods=['GET', 'POST'])
def show_template_names():
    template_names = get_template_names()
    return jsonify(template_names)

# show the entire templates table from the database
@app.route('/display-all-templates', methods=['GET', 'POST'])
def display_all_templates():
    table = display_table("templates")
    return jsonify(table)
