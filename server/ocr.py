import pytesseract
import PyPDF2
import re

reader = PdfReader("../data/coloStandards.pdf")

with open(pdf_path, 'rb') as pdf_file:
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    num_pages = len(pdf_reader.pages)
    print(num_pages)
    extracted_text = []
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        extracted_text.append(text)

pattern = r'\b[A-Z]+\.\s.*'  # Regex pattern to match lines starting with a number and a period
section_name = "kindergatens"
extracted_data = []

for text in extracted_text:
    lines = text.split('\n')
    is_math_section = False

    for line in lines:
        if section_name in line:
            is_math_section = True
        elif is_math_section and re.match(pattern, line):
            extracted_data.append(line)
    
# Process or store the extracted data as needed
for data in extracted_data:
    print(data)



# from PyPDF2 import PdfReader
# import pandas as pd
# import json

# reader = PdfReader("../data/coloStandards.pdf")

# number = len(reader.pages)
# print(number)

# data = {}

# #def grades(reader):
#     # grade_levels = ["kindergartens", "firstgrade", "secondgrade", "thirdgrade", "fourthgrade", "fifthgrade", "sixthgrade"]
#     # grades = []

#     # for page in reader.pages:
#     #     text = page.extract_text()
#     #     lines = text.split("\n")

#     #     for line in lines:
#     #         line = line.strip()

#     #         for grade_level in grade_levels:
#     #             if line.lower().startswith(grade_level):
#     #                 grades.append(line)
#     #                 break

#     # return grades


# #grade_list = grades(reader)
# #print(grade_list)

# def extract_data_based_on_indentation(reader):
#     lines = text.split('\n')
#     extracted_data = []
#     previous_indentation = -1

#     for line in lines:
#         indentation = len(line) - len(line.lstrip())

#         if indentation > previous_indentation:
#             # Indentation increased, append this line to the previous data
#             extracted_data[-1] += ' ' + line.strip()
#         else:
#             # Indentation decreased or stayed the same, add a new data entry
#             extracted_data.append(line.strip())

#         previous_indentation = indentation

#     return extracted_data


# # Example usage
# text_source = '''
#     Item 1
#         Subitem 1.1
#         Subitem 1.2
#     Item 2
#         Subitem 2.1
#     Item 3
# '''

# extracted_data = extract_data_based_on_indentation(text_source)

# # Output the extracted data
# for data in extracted_data:
#     print(data)



# TODO : Extract relevant data from the page_text and populate grade_data dictionary
# with the desired structure.



# Kindergarten {
    # Math {
        # topic1 {
            # subtopic1 {
                # instructions [........]
            # }
        # }
        # topic2 {
            # subtopic1 {
                # instructions [........]
            # }
        # }
    # }
    # Literacy {
        # topic1 {
            # subtopic1 {
                # instructions [.......]
            # }
        # }
        # topic2 {
            # subtopic1 {
                # instructions [........]
            # }
        # }
    # }
    # Science {
        # topic1{
            # subtopic {
                # instructions [.......]
            # }
        # }
        # topic2 {
            # subtopic1 {
                # instructions [........]
            # }
        # }
    # }
# }