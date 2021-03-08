import sqlite3
# from models import Templates
from .models import Templates

# connect to database
def connect_to_db():
    conn = sqlite3.connect('template_data.db') # establish connection to the database
    c = conn.cursor()
    return c

# function to create table, will only be needed once, in the beginning
def create_table(table_name):
    # creating templates database
    conn = sqlite3.connect('../template_data.db') # establish connection to the database
    c = conn.cursor()
    c.execute(f"""CREATE TABLE {table_name} (
        template_id TEXT NOT NULL PRIMARY KEY,
        name TEXT,
        description TEXT,
        markup BLOB);""")
    conn.commit() # commit changes
    conn.close() # close connection
    # execute_sql(sql_query)

# Function to execute the SQL Commands
def execute_sql(sql_query):
    conn = sqlite3.connect('../test_database.db') # establish connection to the database
    c = conn.cursor()
    c.execute(sql_query,) # exectute the query
    result = c.fetchall()
    conn.commit() # commit changes
    conn.close() # close connection
    return result

# display_table
def display_table(table_name):
    c = connect_to_db()
    c.execute(f"SELECT * FROM {table_name};")
    table = c.fetchall()
    return table

# create template_id which will be the primary key. primary key will be the template name converted to lowercase and space replaced with _
# eg "Syslog Host" will become "syslog_host"
def create_template_id(template_name):
    primary_key = template_name.lower().replace(' ', '_') # convert template name to lowercase and replace ' ' with '_'
    return primary_key

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

def get_template_names():
    conn = sqlite3.connect('template_data.db')
    c = conn.cursor()
    c.execute("SELECT name FROM templates")
    template_names = c.fetchall()
    print(template_names)
    return template_names

# get the entire row for a template name
def get_template_row(template_name):
    c = connect_to_db()
    c.execute(f"SELECT * FROM templates WHERE name='{template_name}'")
    row = c.fetchone()
    return row
