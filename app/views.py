from app import app
from flask import render_template, request, jsonify

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
    template_name = 'syslog'
    # set path to the templates html file
    template_html_path = 'templates/' + template_name + '.html'
    #return html of template component 
    return jsonify('', render_template(template_html_path))

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
    # Get markup for template
    try:
        markup = request.form['markup']
    except:
        markup = "No Markup Provided"
    print("---------------------------")
    print(f"Markup: {markup}")

    # return jsonify(markup)


