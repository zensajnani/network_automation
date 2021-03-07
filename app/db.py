import sqlite3
from models import Templates



# function to create table, will only be needed once, in the beginning
def create_table():
    # creating templates database
    sql_query = """CREATE TABLE templates (
        template_id TEXT NOT NULL PRIMARY KEY,
        name TEXT,
        description TEXT,
        markup BLOB);"""
    execute_sql(sql_query)

# Function to execute the SQL Commands
def execute_sql(sql_query):
    conn = sqlite3.connect('../test_database.db') # establish connection to the database
    c = conn.cursor()
    c.execute(sql_query,) # exectute the query
    result = c.fetchall()
    conn.commit() # commit changes
    conn.close() # close connection
    return result

def display_table(table_name):
    sql_query = "SELECT * FROM templates;"
    result = execute_sql(sql_query)

# create template_id which will be the primary key. primary key will be the template name converted to lowercase and space replaced with _
# eg "Syslog Host" will become "syslog_host"
def create_template_id(template_name):
    primary_key = template_name.lower().replace(' ', '_') # convert template name to lowercase and replace ' ' with '_'
    return primary_key

def insert_template(name, description, markup):
    template_id = create_template_id(name)
    template = Templates(template_id, name, description, markup)
    conn = sqlite3.connect('../test_database.db') # establish connection to the database
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
    display_table("templates")


