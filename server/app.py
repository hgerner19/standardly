from flask import Flask, render_template, request, redirect, make_response, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlite3 import IntegrityError
from flask_migrate import Migrate
from models import Grades, Subjects, Topics, Subtopics, CurriculumItems, SubCurriculumItems, User, Storage
from config import app, db, api

migrate = Migrate(app, db)

CORS(app)

api = Api(app)

# Routes
@app.route('/search', methods=['GET'])
def search():
    search_input = request.args.get('search_field')
    grade = request.args.get('grade')
    subject = request.args.get('subject')

    # Need to iterate through the tables down till you get to Curriculum item.subtopic.id.....!!!!!!!!!
     def indexing(grade, subject):
        grade_obj = Grades.query.filter_by(gradename=grade).first()
        if grade_obj:
            grade_id = grade_obj.gradeid
            subject_obj = Subjects.query.filter_by(subjectname=subject, gradeid=grade_id).first()
            if subject_obj:
                subject_id = subject_obj.subjectid
                topic_obj = Topics.query.filter_by(subjectid=subject_id).first()
                if topic_obj:
                    topic_id = topic_obj.topicid
                    subtopic_obj = Subtopics.query.filter_by(topicid=topic_id).first()
                    if subtopic_obj:
                        return subtopic_obj.subtopicid
        
        return None

    subtopic_id = indexing(grade,subject)

    curriculum_items = CurriculumItems.query.join(Subtopics).filter(Subtopics.subtopicid == subtopic_id).all()
    subcurriculum_items = SubCurriculumItems.query.join(CurriculumItems).join(Subtopics).filter(Subtopics.subtopicid == subtopic_id).all()

    curriculum_matches = []
    for item in curriculum_items:
        if search_input.lower() in item.description.lower():
            curriculum_matches.append({
                'subtopic_name': item.subtopic.name,
                'curriculum_description': item.description
            })

    subcurriculum_matches = []
    for item in subcurriculum_items:
        if search_input.lower() in item.description.lower():
            subcurriculum_matches.append({
                'subcurriculum_description': item.description,
                'curriculum_description': item.curriculumitem.description,
                'subtopic_name': item.curriculumitem.subtopic.name
            })

    return jsonify({
        'curriculum_matches': curriculum_matches,
        'subcurriculum_matches': subcurriculum_matches
    })

@app.route('/users/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def user_by_id(id):
    user = User.query.filter(User.id == id).one_or_none()

    if user:
        if request.method == 'GET':
            response = make_response(user.to_dict(), 200)

        if request.method == 'DELETE':
            db.session.delete(user)
            db.session.commit()
            response = make_response({"success": f"User of id {id} deleted."})

        if request.method == 'PATCH':
            form_data = request.get_json()
            for attr in form_data:
                setattr(user, attr, form_data[attr])

            db.session.add(user)
            db.session.commit()

            response = make_response(customer.to_dict(), 201)
            for cookie in request.cookies:
                response.set_cookie(cookie, '', expires=0)

            response.set_cookie('user_name', user.first_name)
            response.set_cookie('user_email', user.email)

    else:
        response = make_response({"error": f"404: Customer of id {id} not found."})

    return response

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
        email = request_json.get('email')
        password = request_json.get('password')
        grade = request_json.get('grade')

        user = User(
            name = request_json["name"], 
            username = request_json["username"], 
            email = request_json["email"], 
            grade = request_json["grade"]
        )
        user.password_hash = password
        
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

        if user and user.authenticate(request.get_json()['password']):
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
