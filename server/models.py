from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from flask_bcrypt import Bcrypt
from config import db

bcrypt = Bcrypt()
Base = db.Model


class Grades(Base, SerializerMixin):
    __tablename__ = 'grades'
    gradeid = Column(Integer, primary_key=True, autoincrement=True)
    gradename = Column(String)

class Subjects(Base, SerializerMixin):
    __tablename__ = 'subjects'
    subjectid = Column(Integer, primary_key=True, autoincrement=True)
    subjectname = Column(String)
    gradeid = Column(Integer, ForeignKey('grades.gradeid'))
    grade = relationship("Grades")


class Topics(Base, SerializerMixin):
    __tablename__ = 'topics'
    topicid = Column(Integer, primary_key=True, autoincrement=True)
    topicname = Column(String)
    subjectid = Column(Integer, ForeignKey('subjects.subjectid'))
    subject = relationship("Subjects")


class Subtopics(Base,SerializerMixin):
    __tablename__ = 'subtopics'
    subtopicid = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String)
    topicid = Column(Integer, ForeignKey('topics.topicid'))
    topic = relationship("Topics")


class CurriculumItems(Base,SerializerMixin):
    __tablename__ = 'curriculumitems'
    itemid = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String)
    curriculumcode = Column(String)
    subtopicid = Column(Integer, ForeignKey('subtopics.subtopicid'))
    subtopic = relationship("Subtopics")


class SubCurriculumItems(Base,SerializerMixin):
    __tablename__ = 'subcurriculumitems'
    subitemid = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String)
    subcurriculumcode = Column(String)
    itemid = Column(Integer, ForeignKey('curriculumitems.itemid'))
    curriculumitem = relationship("CurriculumItems")


# intermediate table for many-to-many relationship between Storage and CurriculumItems
storage_curriculumitem_table = Table(
    'storage_curriculumitem',
    Base.metadata,
    Column('storage_id', Integer, ForeignKey('storage.id')),
    Column('curriculumitem_id', Integer, ForeignKey('curriculumitems.itemid'))
)

# intermediate table for many-to-many relationship between Storage and SubCurriculumItems
storage_subcurriculumitem_table = Table(
    'storage_subcurriculumitem',
    Base.metadata,
    Column('storage_id', Integer, ForeignKey('storage.id')),
    Column('subcurriculumitem_id', Integer, ForeignKey('subcurriculumitems.subitemid'))
)


class Storage(Base,SerializerMixin):
    __tablename__ = 'storage'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    resource_url = Column(String(255))

    user = relationship('User', backref='storage')
    curriculum_items = relationship('CurriculumItems', secondary=storage_curriculumitem_table)
    subcurriculum_items = relationship('SubCurriculumItems', secondary=storage_subcurriculumitem_table)


class User(Base,SerializerMixin):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    grade = Column(String)
    _password_hash = Column(String)

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self._password_hash = password_hash

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

