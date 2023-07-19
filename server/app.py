from flask import Flask, render_template, request, redirect, make_response, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlite3 import IntegrityError
from flask_migrate import Migrate
from models import Grades, Subjects, Topics, Subtopics, CurriculumItems, SubCurriculumItems, User, Storage
from config import app, db, api
import cloudinary
import cloudinary.uploader
import cloudinary.api
import urllib.parse

migrate = Migrate(app, db)

CORS(app)

api = Api(app)

cloudinary.config(
    cloud_name='dfszptjw6',
    api_key='967281579244582',
    api_secret='W98igpwfxAxYSakegVO8oVmHPkc'
)

# Routes
@app.route('/search', methods=['POST'])
def search():
    search_args = request.get_json()['params']
    print(search_args)
    search_input = search_args.get('search_field')
    print(search_input)
    grade = search_args.get('grade')
    print(grade)
    subject = search_args.get('subject')
    print(subject)

    

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

    match = None
    topic_name = None

    for item in curriculum_items:
        if search_input.lower() in item.description.lower():
            match = {
                'subtopic_description': item.subtopic.description,
                'curriculum_description': item.description,
                'type': 'CurriculumItem'  # Add 'type' field to indicate the type of match
            }
            topic_name = item.subtopic.topic.topicname
            break

    if not match:
        for item in subcurriculum_items:
            if search_input.lower() in item.description.lower():
                match = {
                    'subcurriculum_description': item.description,
                    'curriculum_description': item.curriculumitem.description,
                    'subtopic_name': item.curriculumitem.subtopic.description,
                    'type': 'SubCurriculumItem'  # Add 'type' field to indicate the type of match
                }
                topic_name = item.curriculumitem.subtopic.topic.topicname
                break

    return make_response({
        'topic_name': topic_name,
        'match': match
    }, 200)

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

@app.route('/standard', methods=['POST'])
def get_standards_endpoint():
    search_args = request.get_json()['params']
    grade = search_args.get('grade')

    def indexing(grade):
        grade_obj = Grades.query.filter_by(gradename=grade).first()
        if grade_obj:
            grade_id = grade_obj.gradeid
            return grade_id
        return None

    grade_id = indexing(grade)

    if grade_id is None:
        return make_response("Invalid grade", 400)

    subjects = Subjects.query.filter_by(gradeid=grade_id).all()

    curriculum_matches = []
    subcurriculum_matches = []

    for subject in subjects:
        curriculum_items = CurriculumItems.query.join(Subtopics).join(Topics).join(Subjects).filter(
            Subjects.gradeid == grade_id, Subjects.subjectid == subject.subjectid).all()
        subcurriculum_items = SubCurriculumItems.query.join(CurriculumItems).join(Subtopics).join(Topics).join(
            Subjects).filter(Subjects.gradeid == grade_id, Subjects.subjectid == subject.subjectid).all()

        for item in curriculum_items:
            curriculum_matches.append({
                'subject_name': subject.subjectname,
                'curriculum_description': item.description,
                'curriculum_id': item.itemid
            })

        for item in subcurriculum_items:
            subcurriculum_matches.append({
                'subject_name': subject.subjectname,
                'subcurriculum_description': item.description,
                'curriculum_description': item.curriculumitem.description,
                'subtopic_name': item.curriculumitem.subtopic.description,
                'subcurriculum_id': item.itemid,
                'curriculum_id': item.itemid
            })

    return make_response({
        'curriculum_matches': curriculum_matches,
        'subcurriculum_matches': subcurriculum_matches
    }, 200)




@app.route('/upload', methods=['POST'])
def upload_file():
    user_id = request.form['user_id']
    file = request.files['file']

    # Check if the user has selected a file
    if file:
        # Upload the file to Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        resource_url = upload_result['secure_url']

        # Create a new storage entry
        storage = Storage(user_id=user_id, resource_url=resource_url)
        db.session.add(storage)
        db.session.commit()

        return redirect('/')
    else:
        return {'error': 'No file selected'}, 400

@app.route('/add_storage', methods=['POST'])
def add_storage():
    user_id = request.form['user_id']
    title = request.form['title']
    resource_url = request.form['resource_url']
    
    curriculum_item_ids = request.form.getlist('curriculum_item_ids')  # Assuming you pass the selected curriculum item IDs as a list
    subcurriculum_item_ids = request.form.getlist('subcurriculum_item_ids')  # Assuming you pass the selected subcurriculum item IDs as a list

    if resource_url.startswith('https://www.youtube.com/watch?v='):
        # Handle YouTube links
        parsed_url = urllib.parse.urlparse(resource_url)
        video_id = urllib.parse.parse_qs(parsed_url.query).get('v')
        if video_id:
            youtube_embed_url = f'https://www.youtube.com/embed/{video_id[0]}'
            resource_url = youtube_embed_url

    # Create a new storage entry
    storage = Storage(user_id=user_id, title=title, resource_url=resource_url)
    db.session.add(storage)
    db.session.commit()

    # Link storage with curriculum items
    if curriculum_item_ids:
        curriculum_items = CurriculumItems.query.filter(CurriculumItems.itemid.in_(curriculum_item_ids)).all()
        storage.curriculum_items.extend(curriculum_items)

    # Link storage with subcurriculum items
    if subcurriculum_item_ids:
        subcurriculum_items = SubCurriculumItems.query.filter(SubCurriculumItems.subitemid.in_(subcurriculum_item_ids)).all()
        storage.subcurriculum_items.extend(subcurriculum_items)

    db.session.commit()

    return redirect('/')

@app.route('/tracker', methods=['POST'])
def tracker():
    search_args = request.get_json()['params']
    grade = search_args.get('grade')

    subjects_data = {}
    def indexing(grade):
        grade_obj = Grades.query.filter_by(gradename=grade).first()
        if grade_obj:
            grade_id = grade_obj.gradeid
            return grade_id
        return None

    grade_id = indexing(grade)

    if grade_id is None:
        return make_response("Invalid grade", 400)
   
    subjects = Subjects.query.filter_by(gradeid=grade_id).all()

    print(f"Number of subjects: {len(subjects)}")

    # Iterate over each subject
    for subject in subjects:
        subject_name = subject.subjectname
        subject_object = {
            'subjectname': subject_name,
            'topics': {}
        }

        topics = Topics.query.filter_by(subjectid=subject.subjectid).all()

        print(f"Subject: {subject_name}, Number of topics: {len(topics)}")

        for topic in topics:
            topic_name = topic.topicname
            topic_data = {
                'subtopics': {}
            }

            subtopics = Subtopics.query.filter_by(topicid=topic.topicid).all()

            print(f"Subject: {subject_name}, Topic: {topic_name}, Number of subtopics: {len(subtopics)}")

            for subtopic in subtopics:
                subtopic_data = {
                    'curriculumitems': {}
                }

                curriculum_items = CurriculumItems.query.filter_by(subtopicid=subtopic.subtopicid).all()

                print(f"Subject: {subject_name}, Topic: {topic_name}, Subtopic: {subtopic.description}, Number of curriculum items: {len(curriculum_items)}")

                for curriculum_item in curriculum_items:
                    curriculum_item_data = {
                        'subcurriculumitems': {}
                    }

                    subcurriculum_items = SubCurriculumItems.query.filter_by(itemid=curriculum_item.itemid).all()

                    print(f"Subject: {subject_name}, Topic: {topic_name}, Subtopic: {subtopic.description}, Curriculum Item: {curriculum_item.description}, Number of subcurriculum items: {len(subcurriculum_items)}")

                    for subcurriculum_item in subcurriculum_items:
                        subcurriculum_item_data = {
                            'description': subcurriculum_item.description
                        }

                        curriculum_item_data['subcurriculumitems'][subcurriculum_item.subitemid] = subcurriculum_item_data

                    curriculum_item_data['description'] = curriculum_item.description

                    # Add curriculum item data to the subtopic
                    subtopic_data['curriculumitems'][curriculum_item.itemid] = curriculum_item_data

                subtopic_data['description'] = subtopic.description
                subtopic_data['subtopicid'] = subtopic.subtopicid

                # Add subtopic data to the topic
                topic_data['subtopics'][subtopic.subtopicid] = subtopic_data

            topic_data['description'] = topic_name

            # Add topic data to the subject
            subject_object['topics'][topic.topicid] = topic_data

        # Add subject object to the subjects data
        subjects_data[subject_name] = subject_object

    print(subjects_data)

    return make_response(subjects_data, 200)

@app.route('/plans', methods=['POST'])
def plans():
    search_args = request.get_json()['params']
    grade = search_args.get('grade')

    subjects_data = {}

    def indexing(grade):
        grade_obj = Grades.query.filter_by(gradename=grade).first()
        if grade_obj:
            grade_id = grade_obj.gradeid
            return grade_id
        return None

    grade_id = indexing(grade)

    if grade_id is None:
        return make_response("Invalid grade", 400)

    # Fetch subjects based on the selected grade
    subjects = Subjects.query.filter_by(gradeid=grade_id).all()

    # Iterate over each subject
    for subject in subjects:
        subject_name = subject.subjectname
        subject_object = {
            'subjectname': subject_name,
            'topics': {}
        }

        # Fetch topics for the subject
        topics = Topics.query.filter_by(subjectid=subject.subjectid).all()

        # Iterate over each topic
        for topic in topics:
            topic_name = topic.topicname
            topic_data = {
                'subtopics': {}
            }

            # Fetch subtopics for the topic
            subtopics = Subtopics.query.filter_by(topicid=topic.topicid).all()

            # Iterate over each subtopic
            for subtopic in subtopics:
                subtopic_data = {
                    'curriculumitems': {}
                }

                # Fetch curriculum items for the subtopic
                curriculum_items = CurriculumItems.query.filter_by(subtopicid=subtopic.subtopicid).all()

                # Iterate over each curriculum item
                for curriculum_item in curriculum_items:
                    curriculum_item_data = {
                        'subcurriculumitems': {}
                    }

                    # Fetch subcurriculum items for the curriculum item
                    subcurriculum_items = SubCurriculumItems.query.filter_by(itemid=curriculum_item.itemid).all()

                    # Iterate over each subcurriculum item
                    for subcurriculum_item in subcurriculum_items:
                        subcurriculum_item_data = {
                            'id': subcurriculum_item.subitemid,
                            'description': subcurriculum_item.description
                        }

                        # Add subcurriculum item data to the curriculum item
                        curriculum_item_data['subcurriculumitems'][subcurriculum_item.subitemid] = subcurriculum_item_data

                    curriculum_item_data['id'] = curriculum_item.itemid
                    curriculum_item_data['description'] = curriculum_item.description

                    # Add curriculum item data to the subtopic
                    subtopic_data['curriculumitems'][curriculum_item.itemid] = curriculum_item_data

                subtopic_data['description'] = subtopic.description
                subtopic_data['subtopicid'] = subtopic.subtopicid

                # Add subtopic data to the topic
                topic_data['subtopics'][subtopic.subtopicid] = subtopic_data

            topic_data['description'] = topic_name

            # Add topic data to the subject
            subject_object['topics'][topic.topicid] = topic_data

        # Add subject object to the subjects data
        subjects_data[subject_name] = subject_object

    return make_response(subjects_data, 200)


    

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
        print(user)
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

        # Clear the session
        session.pop('user_id', None)

        # Clear all cookies
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
