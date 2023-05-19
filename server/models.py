from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Grades(Base):
    __tablename__ = 'grades'
    gradeid = Column(Integer, primary_key=True, autoincrement=True)
    gradename = Column(String)

class Subjects(Base):
    __tablename__ = 'subjects'
    subjectid = Column(Integer, primary_key=True, autoincrement=True)
    subjectname = Column(String)
    gradeid = Column(Integer, ForeignKey('grades.gradeid'))
    grade = relationship("Grades")

class Topics(Base):
    __tablename__ = 'topics'
    topicid = Column(Integer, primary_key=True, autoincrement=True)
    topicname = Column(String)
    subjectid = Column(Integer, ForeignKey('subjects.subjectid'))
    subject = relationship("Subjects")

class Subtopics(Base):
    __tablename__ = 'subtopics'
    subtopicid = Column(Integer, primary_key=True, autoincrement=True)
    subtopicname = Column(String)
    topicid = Column(Integer, ForeignKey('topics.topicid'))
    topic = relationship("Topics")

class CurriculumItems(Base):
    __tablename__ = 'curriculumitems'
    itemid = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String)
    curriculumcode = Column(String)
    subtopicid = Column(Integer, ForeignKey('subtopics.subtopicid'))
    subtopic = relationship("Subtopics")

class SubCurriculumItems(Base):
    __tablename__ = 'subcurriculumitems'
    subitemid = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String)
    subcurriculumcode = Column(String)
    itemid = Column(Integer, ForeignKey('curriculumitems.itemid'))
    curriculumitem = relationship("CurriculumItems")
