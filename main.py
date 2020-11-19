from flask import Flask, request, render_template ,redirect
import mysql.connector
import json

def addDb(id,container,classlist,title,description,cursor):
    id = str(id)
    id = '"'+id+'"'
    container = '"'+container+'"'
    classlist = '"'+classlist+'"'
    if title is not None:
        title = '"'+title+'"'
    if description is not None:
        description = '"'+description+'"'
    cursor.execute("INSERT INTO tasks (ID,CONTAINER,CLASSLIST,TITLE,DESCRIPTION) VALUES ("+id+","+container+","+classlist+","+title+","+description+")")
    db.commit()
    return 0

def modifyDb(id,container,classlist,cursor):
    id = str(id)
    id = '"'+id+'"'
    container = '"'+container+'"'
    classlist = '"'+classlist+'"'
    cursor.execute("UPDATE tasks SET CONTAINER = "+container+", CLASSLIST = "+classlist+" WHERE ID ="+id+"")
    db.commit()
    return 0

def deleteDb(id,cursor):
    id = str(id)
    id = '"'+id+'"'
    cursor.execute("DELETE FROM tasks WHERE ID = "+id+"")
    db.commit()
    return 0 

def clearDb(cursor):
    cursor.execute("DROP TABLE tasks")
    cursor.execute("DROP TABLE project")
    db.commit()
    createTasksTable(cursor)
    createProjectTable(cursor)
    return 0

def createTasksTable(cursor):
    cursor.execute("SHOW TABLES LIKE '%tasks%'")
    temp = cursor.fetchall()
    tables = []
    for i in range(0,len(temp)):
        tables.append(temp[i][0])
    if  "tasks" not in tables:
        cursor.execute('CREATE TABLE tasks (ID INT,CONTAINER VARCHAR(10),CLASSLIST VARCHAR(100), TITLE VARCHAR(50), DESCRIPTION VARCHAR(1000))')
        db.commit()

def addProject(id,title,classlist,cursor):
    id = str(id)
    id = '"'+id+'"'
    title = '"'+title+'"'
    classlist = '"'+classlist+'"'

    cursor.execute("SELECT * FROM project")
    project = cursor.fetchall()
    if len(project) == 0:
        cursor.execute("INSERT INTO project (ID,TITLE,CLASSLIST) VALUES ("+id+","+title+","+classlist+")")
        db.commit()
    else:
        cursor.execute("UPDATE project SET TITLE = "+title+", CLASSLIST = "+classlist+" WHERE ID ="+id+"")
        db.commit()

def createProjectTable(cursor):
    cursor.execute("SHOW TABLES LIKE '%project%'")
    temp = cursor.fetchall()
    tables = []
    for i in range(0,len(temp)):
        tables.append(temp[i][0])
    if  "project" not in tables:
        cursor.execute('CREATE TABLE project (ID INT,TITLE VARCHAR(50),CLASSLIST VARCHAR(15))')
        db.commit()


db = mysql.connector.connect(
    host="localhost",
    user="change me",
    passwd="change me",
    database="Tasks"
)
cursor = db.cursor()

createTasksTable(cursor)
createProjectTable(cursor)

cursor.execute("SELECT * FROM tasks")
tasks = cursor.fetchall()

cursor.execute("SELECT * FROM project")
project = cursor.fetchall()

if len(project) == 0:
    project =[]
else:
    project = project[0]
todo = []
doing = []
done = []

for task in tasks:
    if task[1] == "todo":
        todo.append(task)
    if task[1] == "doing":
        doing.append(task)
    if task[1] == "done":
        done.append(task)

app = Flask(__name__)

@app.route('/',methods=['POST','GET'])


def index():
    if request.method == "POST":
        temp = request.data
        data = json.loads(temp)
        dataId = data["id"]
        dataType = data["type"]
        dataContainer = data["container"]
        dataClasslist = data["classlist"]
        dataTitle = data["title"]
        dataDescription = data["description"]
        
        if dataType == "add":
            addDb(dataId,dataContainer,dataClasslist,dataTitle,dataDescription,cursor)
        elif dataType == "modify":
            modifyDb(dataId,dataContainer,dataClasslist,cursor)
        elif dataType == "delete":
            deleteDb(dataId,cursor)
        elif dataType == "clear":
            clearDb(cursor)
        elif dataType == "project":
            addProject(0,dataTitle,dataClasslist,cursor)

        return "0"
    else:
        return render_template('index.html',project=project,todo=todo,doing=doing,done=done)

app.run()
