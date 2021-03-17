import os
import sqlite3
from jinja2 import Template, Environment, meta

try:
    from models import Templates
except:
    from .models import Templates


# connect to database
def connect_to_db():
    conn = sqlite3.connect('template_data.db') # establish connection to the database
    return conn

# function to create table, will only be needed once, in the beginning
def create_templates_table():
    # creating templates database
    conn = sqlite3.connect('../template_data.db') # establish connection to the database
    c = conn.cursor()
    c.execute("""CREATE TABLE templates (
        template_id TEXT NOT NULL PRIMARY KEY,
        name TEXT,
        description TEXT,
        markup BLOB);""")
    conn.commit() # commit changes
    conn.close() # close connection

# Create variables table that refrences to the templates table with foreign key = template_id
def create_variables_table():
    conn = sqlite3.connect('../template_data.db') # establish connection to the database
    c = conn.cursor()
    c.execute("""CREATE TABLE variables (
        variable_id integer PRIMARY KEY,
        variable_name TEXT,
        variable_display TEXT,
        datatype TEXT,
        template_id TEXT NOT NULL,
        FOREIGN KEY (template_id)
            REFERENCES templates (template_id)
        );""")
    conn.commit() # commit changes
    conn.close() # close connection

# Function to execute the SQL Commands
# def execute_sql(sql_query):
#     conn = sqlite3.connect('../test_database.db') # establish connection to the database
#     c = conn.cursor()
#     c.execute(sql_query,) # exectute the query
#     result = c.fetchall()
#     conn.commit() # commit changes
#     conn.close() # close connection
#     return result

# display_table
def display_table(table_name):
    conn = connect_to_db()
    c = conn.cursor()
    c.execute(f"SELECT * FROM {table_name};")
    table = c.fetchall()
    return table

# create template_id which will be the primary key. primary key will be the template name converted to lowercase and space replaced with _
# eg "Syslog Host" will become "syslog_host"
def create_template_id(template_name):
    primary_key = template_name.lower().replace(' ', '_') # convert template name to lowercase and replace ' ' with '_'
    return primary_key

# insert new template data in template table
def insert_template(name, description, markup):
    template_id = create_template_id(name)
    template = Templates(template_id, name, description, markup)
    conn = sqlite3.connect('template_data.db') # establish connection to the database
    c = conn.cursor()
    c.execute("""INSERT OR REPLACE INTO templates
    VALUES(
        :template_id,
        :name,
        :description,
        :markup
    ); """, {'template_id': template_id, 'name': name, 'description': description, 'markup': markup}) # exectute the query
    result = c.fetchall()
    conn.commit() # commit changes
    conn.close() # close connection
    print("Added template")
    # display_table("templates")

# insert new variable data in variable table and establish relationship with the template with template_id as foreign key
def insert_variable(variables, template_id):
    # there can be multiple variables for a template so we pass an array of variables as a parameter and iterate through that array
    for variable in variables:
        # if variable_display is empty, then set variable_display as variable_name
        if variable['variable_display'] == "":
            variable['variable_display'] = variable['variable_name']
        conn = connect_to_db()
        c = conn.cursor()
        c.execute("""INSERT OR REPLACE INTO variables(variable_name, variable_display, datatype, template_id)
        VALUES(
            :variable_name,
            :variable_display,
            :datatype,
            :template_id
        );""", {'variable_name': variable['variable_name'], 'variable_display': variable['variable_display'], 'datatype': variable['variable_datatype'], 'template_id': template_id})
        conn.commit()
        conn.close()

def get_template_names():
    conn = sqlite3.connect('template_data.db')
    c = conn.cursor()
    c.execute("SELECT name FROM templates")
    template_names = c.fetchall()
    print(template_names)
    return template_names

# get the entire row for a template name
def get_template_row(template_name):
    template_id = create_template_id(template_name)
    conn = connect_to_db()
    c = conn.cursor()
    c.execute(f"SELECT * FROM templates WHERE template_id='{template_id}'")
    row = c.fetchone()
    template_data = {
        'id': row[0],
        'name': row[1],
        'description': row[2],
        'markup': row[3]
    }
    conn.close()
    return template_data

# get all variables for a template
def get_template_variables(template_name):
    template_id = create_template_id(template_name)
    conn = connect_to_db()
    c = conn.cursor()
    c.execute(f"SELECT variable_display, variable_name, datatype FROM variables WHERE template_id='{template_id}'")
    variables_tuple = c.fetchall()
    print("Variables Tuple")
    print(variables_tuple)
    # return variables as a dictionary
    variables=[]
    var_dict = {}
    for var in variables_tuple:
        var_dict['name'] = var[1]
        var_dict['display'] = var[0]
        var_dict['datatype'] = var[2]
        var_dict_copy = var_dict.copy()
        variables.append(var_dict_copy)
    conn.close()
    return variables


# get undeclared variables from the Jinja Markup to initialise variables
def get_markup_variables(template_name):
    template_id = create_template_id(template_name) # get template ID for template name
    template_data = get_template_row(template_name) # get template data
    template_markup = template_data[3] # get markup from template data
    # get variable keys from jinja2 template string
    # for example a Jinja template: "This is Jinja template with {{ x }} and {{ y }} variables",
    # will return {'x', 'y'}
    env = Environment()
    ast = env.parse(template_markup)
    markup_variables = meta.find_undeclared_variables(ast) 
    print(markup_variables)
    return markup_variables

# render variable values in Jinja markup
def render_variables_markup(variables, markup):
    # print(f"Original Markup: \n {markup}")
    env = Environment()
    ast = env.parse(markup)
    markup_variable_keys = meta.find_undeclared_variables(ast) # returns SET of variables
    print(f"Markup Variable Keys: {markup_variable_keys}")
    markup = Template(markup) # convert from string to jinja template
    # variable_values = {"VAR_1", "VAR_2", "VAR_3"} 
    # markup_variables = dict(zip(markup_variable_keys, variable_values)) # make dict from set and assign values
    # print(f"Markup Variables Dictionary: {variables_dict}")
    markup_render = markup.render(variables) 
    print("MARKUP RENDER" + 50*"=")
    print(markup_render)
    return markup_render

# Delete template from template table and variables associated with it from variables table
def delete_template_from_db(template_id):
    conn = connect_to_db()
    c = conn.cursor()
    c.execute("DELETE FROM templates WHERE template_id=:template_id", {'template_id': template_id})
    c.execute("DELETE FROM variables WHERE template_id=:template_id", {'template_id': template_id})
    conn.commit()
    conn.close()

# Edit template values
def edit_template_db(prev_template_id, new_template_data):
    conn = connect_to_db()
    c = conn.cursor()
    new_template_id = new_template_data['id']
    c.execute("""UPDATE templates
    SET description = :new_description, markup = :new_markup
    WHERE template_id = :prev_template_id ;""", 
    {'prev_template_id': prev_template_id, 'new_description': new_template_data['desc'], 'new_markup': new_template_data['markup']})
    conn.commit()
    conn.close()

# Edit variables
def edit_variables_db(template_id, new_variables):
    prev_variables = get_template_variables(template_id)
    # Step 1: find newly inserted variables. I.E. Variables present in new_variables but not in prev_variables
    inserted_vars = [variable for variable in new_variables if variable not in prev_variables]
    # Step 2: find deleted variables. I.E. Variables present in prev_variables but not in new_variables
    deleted_vars = [variable for variable in prev_variables if variable not in new_variables]
    print("INSERTED VARIABLES: ")
    print(inserted_vars)
    print("DELETED VARIABLES: ")
    print(deleted_vars)
    conn = connect_to_db()
    c = conn.cursor()
    for variable in inserted_vars:
        c.execute("""
        INSERT INTO variables (variable_name, variable_display, datatype, template_id)
        VALUES (:name, :display, :datatype, :template_id);
        """, {
            'name': variable['name'],
            'display': variable['display'],
            'datatype': variable['datatype'],
            'template_id': template_id,
        })
    for variable in deleted_vars:
        c.execute("""
        DELETE FROM variables
        WHERE variable_name=:name AND variable_display=:display AND datatype=:datatype AND template_id=:template_id;
        """, {
            'name': variable['name'],
            'display': variable['display'],
            'datatype': variable['datatype'],
            'template_id': template_id,
        })
    conn.commit()
    conn.close()
    print("Updated Variables")