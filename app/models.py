# from app import db # importing database object

# # Creating Templates Table
# class Templates(db.Model):

#     #Table Name
#     __tablename__ = 'templates'

#     # Create (columns) for the table

#     template_id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.Text)
#     description = db.Column(db.Text)

#     def __init__(self, name, description):
#         self.name = name
#         self.description = description

#     # string representation of the row (helps with debugging)
#     def __repr__(self):
#         return f"Template Name: {name}, Description: {description}"


# Models/Tables for the database are created here

# Class to create templates
class Templates():
    # initialise values
    def __init__(self, template_id, name, description, markup):
        self.template_id = template_id
        self.name = name
        self.description = description
        self.markup = markup

    # String representation of the record
    def __repr__(self):
        return f"ID: {self.template_id} Name: {self.name} Description: {self.description} Markup: {self.markup}"
