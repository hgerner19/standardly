import PyPDF2
import re
import pandas as pd
import numpy as np
import os
import sys
import time
import datetime
import glob
import csv
import json

kindergarten = []
firstgrade = []
secondgrade = []
thirdgrade = []
fourthgrade = []
fifthgrade = []
sixthgrade = []

def read_txt_file(file_path):
    # Declare the grade lists as global variables
    global kindergarten, firstgrade, secondgrade, thirdgrade, fourthgrade, fifthgrade, sixthgrade
    with open(file_path, 'r') as file:
        # Flag variables for each grade section
        in_kindergarten = False
        in_firstgrade = False
        in_secondgrade = False
        in_thirdgrade = False
        in_fourthgrade = False
        in_fifthgrade = False
        in_sixthgrade = False

        # Read each line in the file
        for line in file:
            # entering the kindergarten section
            if line.strip() == "kindergartens:":
                in_kindergarten = True
                continue
            # Check if we're entering the first grade section
            if line.strip() == "firstgrade:":
                in_kindergarten = False
                in_firstgrade = True
                continue
            # entering the second grade section
            if line.strip() == "secondgrade:":
                in_firstgrade = False
                in_secondgrade = True
                continue
            # entering the third grade section
            if line.strip() == "thirdgrade:":
                in_secondgrade = False
                in_thirdgrade = True
                continue
            # entering the fourth grade section
            if line.strip() == "fourthgrade:":
                in_thirdgrade = False
                in_fourthgrade = True
                continue
            # entering the fifth grade section
            if line.strip() == "fifthgrade:":
                in_fourthgrade = False
                in_fifthgrade = True
                continue
            # entering the sixth grade section
            if line.strip() == "sixthgrade:":
                in_fifthgrade = False
                in_sixthgrade = True
                continue
            # Add the line to the respective grade list if we're inside the section
            if in_kindergarten:
                kindergarten.append(line.strip())
            elif in_firstgrade:
                firstgrade.append(line.strip())
            elif in_secondgrade:
                secondgrade.append(line.strip())
            elif in_thirdgrade:
                thirdgrade.append(line.strip())
            elif in_fourthgrade:
                fourthgrade.append(line.strip())
            elif in_fifthgrade:
                fifthgrade.append(line.strip())
            elif in_sixthgrade:
                sixthgrade.append(line.strip())

def collect_data_between_markers(data, start_marker, end_marker):
    collected_data = []
    is_collecting = False

    for line in data:
        if line.strip() == start_marker:
            is_collecting = True
            continue
        elif line.strip() == end_marker:
            is_collecting = False
            break

        if is_collecting:
            collected_data.append(line.strip())

    return collected_data

read_txt_file('../data/1-raw/coloStandards.txt')

# Collect Math for each grade
kindergarten_math_data = collect_data_between_markers(kindergarten, "Math:", "Literacy:")
firstgrade_math_data = collect_data_between_markers(firstgrade, "Math:", "Literacy:")
secondgrade_math_data = collect_data_between_markers(secondgrade, "Math:", "Literacy:")
thirdgrade_math_data = collect_data_between_markers(thirdgrade, "Math:", "Literacy:")
fourthgrade_math_data = collect_data_between_markers(fourthgrade, "Math:", "Literacy:")
fifthgrade_math_data = collect_data_between_markers(fifthgrade, "Math:", "Literacy:")
sixthgrade_math_data = collect_data_between_markers(sixthgrade, "Math:", "Literacy:")

# Collect Literacy data for each grade
kindergarten_literacy_data = collect_data_between_markers(kindergarten, "Literacy:", "Science:")
firstgrade_literacy_data = collect_data_between_markers(firstgrade, "Literacy:", "Science:")
secondgrade_literacy_data = collect_data_between_markers(secondgrade, "Literacy:", "Science:")
thirdgrade_literacy_data = collect_data_between_markers(thirdgrade, "Literacy:", "Science:")
fourthgrade_literacy_data = collect_data_between_markers(fourthgrade, "Literacy:", "Science:")
fifthgrade_literacy_data = collect_data_between_markers(fifthgrade, "Literacy:", "Science:")
sixthgrade_literacy_data = collect_data_between_markers(sixthgrade, "Literacy:", "Science:")

# Collect Science data for each grade
kindergarten_science_data = collect_data_between_markers(kindergarten, "Science:", "")
firstgrade_science_data = collect_data_between_markers(firstgrade, "Science:", "")
secondgrade_science_data = collect_data_between_markers(secondgrade, "Science:", "")
thirdgrade_science_data = collect_data_between_markers(thirdgrade, "Science:", "")
fourthgrade_science_data = collect_data_between_markers(fourthgrade, "Science:", "")
fifthgrade_science_data = collect_data_between_markers(fifthgrade, "Science:", "")
sixthgrade_science_data = collect_data_between_markers(sixthgrade, "Science:", "")

# Create dictionaries for each grade
grades_dict = {
    "kindergarten": {
        "math": kindergarten_math_data,
        "literacy": kindergarten_literacy_data,
        "science": kindergarten_science_data
    },
    "firstgrade": {
        "math": firstgrade_math_data,
        "literacy": firstgrade_literacy_data,
        "science": firstgrade_science_data
    },
    "secondgrade": {
        "math": secondgrade_math_data,
        "literacy": secondgrade_literacy_data,
        "science": secondgrade_science_data
    },
    "thirdgrade": {
        "math": thirdgrade_math_data,
        "literacy": thirdgrade_literacy_data,
        "science": thirdgrade_literacy_data
    },
    "fourthgrade": {
        "math": fourthgrade_math_data,
        "literacy": fourthgrade_literacy_data,
        "science": fourthgrade_science_data
    },
    "fifthgrade": {
        "math": fifthgrade_math_data,
        "literacy": fifthgrade_literacy_data,
        "science": fifthgrade_science_data
    },
    "sixthgrade": {
        "math": sixthgrade_math_data,
        "literacy": sixthgrade_literacy_data,
        "science": sixthgrade_science_data
    }
}
def check_topic_nums(data):
    i = 1
    j = 0
    for line in data:
        if line.strip().startswith(f"{i}."):
            j += 1
            i += 1
    k = 1
    topics = []
    while k <= j:
        topics_data = collect_numbered_lines(data, k)
        if topics_data:
            topics.append(topics_data)
        k += 1
    return topics
    
def collect_numbered_lines(data, k):
    collected_lines = []
    is_collecting = False
    
    for line in data:
        if line.strip().startswith(f"{k}."):
            is_collecting = True
            collected_lines.append(line.strip())
        elif line.strip().startswith(f"{k+1}."):
            is_collecting = False
        elif is_collecting:
            collected_lines.append(line.strip())

    return collected_lines

def collect_subtopics(data):
    subtopics = {}
    current_subtopic = None
    subtopic_count = 1
    curriculum_item_count = 0

    for line in data:
        line = line.strip()
        if re.match(r'^[A-Z]\.', line):
            if current_subtopic:
                if current_subtopic['curriculum_items']:
                    subtopics[f"Subtopic{subtopic_count}"] = current_subtopic
                    subtopic_count += 1
                curriculum_item_count = 0
            current_subtopic = {'content': line, 'curriculum_items': {}}
        elif current_subtopic is not None:
            if re.match(r'^[a-hj-wyz]\.', line):  # Exclude 'i' and 'x' from matching
                curriculum_item_count += 1
                item_key = f"curriculum_item{curriculum_item_count}"
                current_subtopic['curriculum_items'][item_key] = {'content': line}
            elif re.match(r'^[ivxlcdm]+\.', line, re.IGNORECASE) or re.match(r'^([0-9]+[ivxlcdm]+|[ivxlcdm]+[0-9]+)\.', line, re.IGNORECASE) :  # Include Roman numerals inside curriculum items
                if curriculum_item_count > 0:
                    item_key = f"curriculum_item{curriculum_item_count}"
                    roman_numeral, content = line.split('.', 1)
                    subcurriculum_items_key = 'subcurriculum_items'
                    if subcurriculum_items_key not in current_subtopic['curriculum_items'][item_key]:
                        current_subtopic['curriculum_items'][item_key][subcurriculum_items_key] = {}
                    subcurriculum_items = current_subtopic['curriculum_items'][item_key][subcurriculum_items_key]
                    subcurriculum_items[f"subcurriculum_item{len(subcurriculum_items) + 1}"] = content.strip()
            else:
                current_subtopic['content'] += '\n' + line

    if current_subtopic and current_subtopic['curriculum_items']:
        subtopics[f"Subtopic{subtopic_count}"] = current_subtopic
    

    return subtopics


def iterate_grades(grades_dict):
    for grade, subjects in grades_dict.items():
        for subject, data in subjects.items():
            topics = check_topic_nums(data)
            subjects[subject] = {}  # Initialize an empty dictionary for each subject
            for i, topic in enumerate(topics):
                topic_key = f"Topic{i+1}"
                subtopics = collect_subtopics(topic)
                subjects[subject][topic_key] = subtopics

    return grades_dict

def iterate_topics(grades_dict):
    for grade, subjects in grades_dict.items():
        
        for subject, topics in subjects.items():
            for topic, subtopics in topics.items():
                for subtopic, content in subtopics.items():
                    print(f"  {subtopic}:")
                    print(f"    {content['content']}")
                    print(f"    Curriculum Items:")
                    for item in content['curriculum_items']:
                        for key, value in item.items():
                            print(f"      {key}: {value}")

# Example usage
updated_grades_dict = iterate_grades(grades_dict)

# Print the updated grades dictionary

json_data = json.dumps(updated_grades_dict, indent=4)
with open('standards', 'w') as file:
    file.write(json_data)

print("JSON file created!")


