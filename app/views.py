from app import app
from flask import render_template, request, jsonify
from jinja2 import Template
from .db import connect_to_db, create_template_id,get_template_names, get_template_variables, get_markup_variables, insert_template, insert_variable, display_table, get_template_row, render_variables_markup, delete_template_from_db, edit_template_db, edit_variables_db

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
    markup = template_data['markup']
    variables = get_template_variables(template_name) # get variables from the database
    # markup_variable_keys = get_markup_variables(template_name) # get variable keys from markup template
    # markup=Template(markup).render({'var1': 'Var 1'})
    # print(75*"=")
    # print(f"Template Data: {template_data}")
    # print(f"Markup: {markup}")
    # print(75*"=")
    
    # set path to the templates html file
    #return html of template component 
    return jsonify('', render_template('display-template.html', data=template_data, variables=variables, markup=markup))


# Call this API to create and save a new template after user has set input variables and written the markup
@app.route('/api/save-template', methods=['GET', 'POST'])
def save_template():
    # data = request.form['markup']
    # Get name, description, markup and list of variables of the new template and store in a dictionary
    template_data = request.get_json()
    try:
        template_name = template_data['template_name']
        template_desc = template_data['template_desc']
        markup = template_data['markup']
        variables = template_data['variables']
        template_id = create_template_id(template_name)
    except:
        template_name = ""
        template_desc = ""
        markup = "No Markup Provided"
        variables = ["No Variables declared"]
        return "There was an error please check your inputs"
    # insert template data into template table
    insert_template(template_name, template_desc, markup)
    # insert variables into variables table with relationship to template_id
    insert_variable(variables, template_id)
    return "Saved Template"

# get template names to display in the sidebar 
@app.route('/api/get-template-names', methods=['GET', 'POST'])
def show_template_names():
    template_names = get_template_names()
    return jsonify(template_names)

# get template data
@app.route('/api/get-template-data', methods=['GET', 'POST'])
def get_template_data():
    template_id = request.form['template_id']
    template_data = get_template_row(template_id)
    variables = get_template_variables(template_name)
    return jsonify(template_data)

# get variable values entered by the user when Show Configuration button clicked
@app.route('/api/show-config', methods=['POST'])
def show_configuration():
    data = request.get_json()
    template_id = data['template_id'] # get template id to display corresponding markup
    variables = data['variables'] 
    # get template data from database by passing template id
    template_data = get_template_row(template_id)
    # get markup from template_data
    markup = template_data['markup']
    print(variables)
    rendered_markup = render_variables_markup(variables, markup)
    print(f"rendered_markup from api/show-config: \n {rendered_markup}")
    return rendered_markup

# show the entire templates table from the database
@app.route('/api/display-all-templates', methods=['GET', 'POST'])
def display_all_templates():
    table = display_table("templates")
    return jsonify(table)


# Manage Templplates (Edit/Delete)
@app.route('/manage-templates', methods=['GET', 'POST'])
def manage_templates():
    templates = display_table("templates")
    return render_template('manage-templates.html', templates=templates)

# Delete Template
@app.route('/delete-template', methods=['GET', 'POST'])
def delete_template():
    template_id = request.form['template_id']
    delete_template_from_db(template_id) # delete template and variables
    return template_id

# Edit Template
@app.route('/edit-template/<template_id>', methods=['GET', 'POST'])
def edit_template(template_id):
    template_data =  get_template_row(template_id)
    variables = get_template_variables(template_id)
    print(75*"=")
    print("TEMPLATE DATA")
    print(template_data)
    print(75*"=")
    print("Variables")
    print(variables)
    return render_template('edit-template.html', data=template_data, template_id=template_data['id'], template_name=template_data['name'], template_desc=template_data['description'], markup=template_data['markup'], variables=variables, var_count=len(variables))

# Save template changes after edit
@app.route('/api/save-changes', methods=['GET', 'POST'])
def save_changes_after_edit():
    new_template_data = request.get_json()
    prev_template_id = new_template_data['prevId']
    new_variables = new_template_data['newVariables']
    edit_template_db(prev_template_id, new_template_data)
    edit_variables_db(prev_template_id, new_variables)
    print(new_template_data)
    return render_template('manage-templates.html')
