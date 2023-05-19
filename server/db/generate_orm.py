import pg8000

# Specify the connection details
host = 'localhost'
port = 5432
database = 'standards_data'
user = 'postgres'
password = '@Stroudsburg1'

# Establish a connection to the PostgreSQL database
conn = pg8000.connect(
    host=host,
    port=port,
    database=database,
    user=user,
    password=password
)

# Create a cursor to execute SQL queries
cursor = conn.cursor()

# Execute a query
cursor.execute('SELECT * FROM grades')
cursor.execute('SELECT * FROM topics')
cursor.execute('SELECT * FROM subtopics')
cursor.execute('SELECT * FROM subjects')
cursor.execute('SELECT * FROM curriculumitems')
cursor.execute('SELECT * FROM subcurriculumitems')

# Fetch the results
results = cursor.fetchall()

# Process the results
for row in results:
    print(row)

# Close the cursor and connection
cursor.close()
conn.close()
