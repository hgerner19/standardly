import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Grades, Subjects, Topics, Subtopics, CurriculumItems, SubCurriculumItems
from prettytable import PrettyTable

engine = create_engine('postgresql://postgres:charlie@localhost:5432/standards_data')
Base.metadata.bind = engine


Base.metadata.create_all(engine)


DBSession = sessionmaker(bind=engine)
session = DBSession()


with open('../data/1-raw/standards') as file:
    data = json.load(file)

for grade_name, grade_data in data.items():
    grade = Grades(gradename=grade_name)
    session.add(grade)

    for subject_name, subject_data in grade_data.items():
        subject = Subjects(subjectname=subject_name, grade=grade)
        session.add(subject)

        for topic_name, topic_data in subject_data.items():
            topic = Topics(topicname=topic_name, subject=subject)
            session.add(topic)

            if isinstance(topic_data, dict):
                for subtopic_name, subtopic_data in topic_data.items():
                    subtopic = Subtopics(subtopicname=subtopic_name, topic=topic)
                    session.add(subtopic)

                    if 'content' in subtopic_data:
                        curriculum_item = CurriculumItems(description=subtopic_data['content'], subtopic=subtopic)
                        session.add(curriculum_item)

                    if 'curriculum_items' in subtopic_data:
                        for curriculum_item_name, curriculum_item_data in subtopic_data['curriculum_items'].items():
                            curriculum_item = CurriculumItems(description=curriculum_item_data['content'], subtopic=subtopic)
                            session.add(curriculum_item)

                            if 'subcurriculum_items' in curriculum_item_data:
                                for subcurriculum_item_name, subcurriculum_item_data in curriculum_item_data['subcurriculum_items'].items():
                                    subcurriculum_item = SubCurriculumItems(description=subcurriculum_item_data, curriculumitem=curriculum_item)
                                    session.add(subcurriculum_item)




session.commit()
grades = session.query(Grades).all()

if grades:
    # Create a table instance
    table = PrettyTable()
    table.field_names = ["Grade ID", "Grade Name"]

    # Add rows to the table
    for grade in grades:
        table.add_row([grade.gradeid, grade.gradename])

    # Print the table
    print(table)
else:
    print("Grades table is empty.")

session.close()
