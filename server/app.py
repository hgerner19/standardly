from flask import Flask, render_template, request, redirect, make_response, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlite3 import IntegrityError
from flask_migrate import Migrate
from models import Grades, Subjects, Topics, Subtopics, CurriculumItems, SubCurriculumItems, User, Storage
from config import app, db, api

migrate = Migrate(app, db)

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Create the Flask-RESTful API
api = Api(app)

# Define your models and tables here (Grades, Subjects, Topics, Subtopics, CurriculumItems, SubCurriculumItems, Storage, User)

# Routes
@app.route('/')
def index():
    # Fetch and display data from the database
    grades = Grades.query.all()
    subjects = Subjects.query.all()
    topics = Topics.query.all()
    subtopics = Subtopics.query.all()
    curriculum_items = CurriculumItems.query.all()
    subcurriculum_items = SubCurriculumItems.query.all()
    storage = Storage.query.all()
    users = User.query.all()

    return render_template('index.html', grades=grades, subjects=subjects, topics=topics,
                           subtopics=subtopics, curriculum_items=curriculum_items,
                           subcurriculum_items=subcurriculum_items, storage=storage, users=users)

@app.route('/add_user', methods=['POST'])
def add_user():
    # Create a new user
    name = request.form['name']
    username = request.form['username']
    grade = request.form['grade']

    user = User(name=name, username=username, grade=grade)
    db.session.add(user)
    db.session.commit()

    return redirect('/')

@app.route('/add_storage', methods=['POST'])
def add_storage():
    # Create a new storage entry
    user_id = request.form['user_id']
    resource_url = request.form['resource_url']

    storage = Storage(user_id=user_id, resource_url=resource_url)
    db.session.add(storage)
    db.session.commit()

    return redirect('/')

class Signup(Resource):
    def post(self):
        request_json = request.get_json()

        name = request_json.get('name')
        username = request_json.get('username')
        grade = request_json.get('grade')
        password = request_json.get('_password_hash')

        user = User(name=name, username=username, grade=grade)
        user._password_hash = password
        try:
            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            return user.to_dict(), 201

        except IntegrityError:
            return {'error': '422 Unprocessable Entity'}, 422

class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()

            return user.to_dict(), 200
        return {'error': '401 Unauthorized'}, 401

class Login(Resource):
    def post(self):
        user = User.query.filter_by(username=request.get_json()['username']).first()

        if user and user.verify_password(request.get_json()['password']):
            response = make_response(user.to_dict(), 200)
            response.set_cookie('user_name', user.name)
            response.set_cookie('user_username', user.username)
        else:
            response = make_response({'error': '401 Unauthorized'}, 401)

        return response

class Logout(Resource):
    def delete(self):
        response = make_response('Logged out')

        for cookie in request.cookies:
            response.set_cookie(cookie, '', expires=0)

        return response

@app.route('/cookies', methods=['GET'])
def cookies():
    if request.method == 'GET':
        username = request.cookies.get('user_username')
        user = User.query.filter(User.username == username).first()
        if user:
            response = make_response(user.to_dict(), 200)
            return response

        return {'error': '401 Unauthorized'}, 401

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(port=5555, debug=True)
