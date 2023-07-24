from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
            # do not serialize the password, its a security breach
        }

class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120),  unique=False, nullable=False)
    birth_year = db.Column(db.String(50), unique=False, nullable=False)
    skin_color = db.Column(db.String(50), unique=False, nullable=False)
    hair_color = db.Column(db.String(50), unique=False, nullable=False)
    gender = db.Column(db.String(50), unique=False, nullable=False)
    height = db.Column(db.String(50), unique=False, nullable=False)
    mass = db.Column(db.String(50), unique=False, nullable=False)
    image_url = db.Column(db.String(360), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "birth_year": self.birth_year,
            "skin_color": self.skin_color,
            "hair_color": self.hair_color,
            "gender": self.gender,
            "height": self.height,
            "mass": self.mass,
            "image_url": self.image_url
        }