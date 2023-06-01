
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Grades, Subjects, Topics, Subtopics, CurriculumItems, SubCurriculumItems

engine = create_engine('sqlite:///app.db')
Base.metadata.bind = engine
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

DBSession = sessionmaker(bind=engine)
session = DBSession()

session.query(SubCurriculumItems).delete()
session.query(CurriculumItems).delete()
session.query(Subtopics).delete()
session.query(Topics).delete()
session.query(Subjects).delete()
session.query(Grades).delete()

with open('../data/1-raw/standards') as file:
    data = json.load(file)

for grade_name, grade_data in data.items():
    print(f"Processing Grade: {grade_name}")
    grade = Grades(gradename=grade_name)
    print(grade)
    session.add(grade)

    for subject_name, subject_data in grade_data.items():
        #print(f"\tProcessing Subject: {subject_name}")
        subject = Subjects(subjectname=subject_name, grade=grade)
        session.add(subject)

        for topic_name, topic_data in subject_data.items():
            #print(f"\t\tProcessing Topic: {topic_name}")
            topic = Topics(topicname=topic_name, subject=subject)
            session.add(topic)

            if isinstance(topic_data, dict):
                for subtopic_name, subtopic_data in topic_data.items():
                    #print(f"\t\t\tProcessing Subtopic: {subtopic_name}")
                    subtopic = Subtopics(topic=topic)

                    if 'content' in subtopic_data:
                        subtopic.description = subtopic_data['content']

                    session.add(subtopic)

                    if 'curriculum_items' in subtopic_data:
                        for curriculum_item_name, curriculum_item_data in subtopic_data['curriculum_items'].items():
                            #print(f"\t\t\t\tProcessing Curriculum Item: {curriculum_item_name}")
                            curriculum_item = CurriculumItems(description=curriculum_item_data['content'], subtopic=subtopic)
                            session.add(curriculum_item)

                            if 'subcurriculum_items' in curriculum_item_data:
                                for subcurriculum_item_name, subcurriculum_item_data in curriculum_item_data['subcurriculum_items'].items():
                                    if isinstance(subcurriculum_item_data, str):
                                        #print(f"\t\t\t\t\tProcessing Subcurriculum Item: {subcurriculum_item_name}")
                                        subcurriculum_item = SubCurriculumItems(description=subcurriculum_item_data, curriculumitem=curriculum_item)
                                        session.add(subcurriculum_item)
                                    elif isinstance(subcurriculum_item_data, dict) and 'description' in subcurriculum_item_data:
                                        #print(f"\t\t\t\t\tProcessing Subcurriculum Item: {subcurriculum_item_name}")
                                        subcurriculum_item = SubCurriculumItems(description=subcurriculum_item_data['description'], curriculumitem=curriculum_item)
                                        session.add(subcurriculum_item)

session.commit()
print("Data population completed.")

