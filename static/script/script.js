ids = 0
container_id = null
items = document.querySelectorAll('.card')
todo = document.getElementById('todo')
doing = document.getElementById('doing')
done = document.getElementById('done')
div = [todo,doing,done]
dragged_element = null

var properties = {
    id: -1,
    type: "type",
    container: "container",
    classlist: "classlist",
    title: "title",
    description: "description"
}

var project = {
    name: "name",
    classlist : "classlist"
}

containerEvent()
addEvent()
projectLock()
getID()

function assignId(id){
    container_id = id
}

function initiateAdd(e){
    title = document.getElementById("title")
    description = document.getElementById("description")
    priority = document.getElementById("priority")
    addElement(container_id,title.value,description.value,priority.value)

}

function lock(){
    button = document.getElementById("lockBtn")
    element = document.getElementById("projectName")

    if (button.classList.contains("locked")){
        button.classList.remove("locked")
        button.classList.add("unlocked")
        element.readOnly = false
    }

    else if (button.classList.contains("unlocked")){
        button.classList.remove("unlocked")
        button.classList.add("locked")
        element.readOnly = true
    }
    sendData(null,"project",null,button.classList.value,element.value,null)
}
function addEvent(){
    items = document.querySelectorAll('.card')

    if (items.length != 0){
        for (i=0;i < items.length;i++){
            const item = items[i]
            item.addEventListener('dragstart',dragStart)
            item.addEventListener('dragend',dragEnd)
        }
    }
}

function containerEvent(){
    for(i=0;i<div.length;i++){
        const container = div[i]
        container.addEventListener('dragover',dragOver)
        container.addEventListener('dragenter',dragEnter)
        container.addEventListener('dragleave',dragLeave)
        container.addEventListener('drop',dragDrop)
    }
}

function getID(){
    tempId = [] 
    items = document.querySelectorAll('.card')
    if (items.length != 0){
        for (i=0;i < items.length;i++){
            const item = items[i]
            tempId.push(parseInt(item.id))
        }
    if (tempId.length == 0){
        ids = 0 
    }
    else {
        ids = max(tempId) +1
    }
    }
}

function max(arr){
    max = arr[0]
    for(i=0;i<arr.length;i++){
        x = arr[i]
        if (x > max){
            max = x
        }
    }
    return parseInt(max)
}
function projectLock(){
    button = document.getElementById("lockBtn")
    element = document.getElementById("projectName")

    if (button.classList.contains("locked")){
        element.readOnly = true
    }
    else if (button.classList.contains("unlocked")){
        element.readOnly = false
    } 
}

function addElement(id,title,description,priority){
    if (document.getElementById(id) != null){
        document.getElementById(id).innerHTML += '<div class ="card '+id+'-data '+priority+'" id="'+ids+'" draggable="true"><h5><button class ="btn delete" onclick=delElement(this)></button><p class ="title">'+title+'</p></h5><p class = "description">'+description+'</p></div>'
        classlist = "card "+id+"-data "+priority
        sendData(ids,"add",id,classlist,title,description)
        ids = ids+1
        addEvent()
    }
}

function clearAll(){
    button = document.getElementById("lockBtn")
    items = document.querySelectorAll('.card')
    if (items.length != 0){
        for(i=0;i<items.length;i++){
            const item = items[i]
            item.remove()
        }
    }
    item = document.getElementById("projectName")
    item.readOnly = false
    item.value =""
    if(button.classList.contains("locked")){
        button.classList.remove("locked")
        button.classList.add("unlocked")
    }
    temp_id = -1
    sendData(temp_id,"clear")
}

function delElement(obj){
    obj = obj.parentNode
    id = obj.parentNode.id
    if(document.getElementById(id) != null){
        temp = document.getElementById(id)
        temp.remove()
        sendData(id,"delete")
    }
    addEvent()
}

function dragStart(e){
    element = document.getElementById(e.target.id)
    setTimeout(function(){ element.style.display = "none" }, 0);
    dragged_element = e.target.id
}

function dragEnd(e) {
    element = document.getElementById(e.target.id)
    element.style.display = "block"
    dragged_element = null
}

function dragOver(e){
    e.preventDefault()
}

function dragEnter(e){
    e.preventDefault()
    container = document.getElementById(e.target.id)
    if (container.classList.contains("shadow") == false){
        container.classList.add("shadow")
    }
}

function dragLeave(e){
    container = document.getElementById(e.target.id)
    if (container.classList.contains("shadow") == true){
        container.classList.remove("shadow")
    }
}

function dragDrop(e){
    container = document.getElementById(e.target.id)
    element = document.getElementById(dragged_element)
    if (element.classList.contains("todo-data")){
        element.classList.remove("todo-data")
    }
    else if (element.classList.contains("doing-data")){
        element.classList.remove("doing-data")
    }
    else if (element.classList.contains("done-data")){
        element.classList.remove("done-data")
    }
    if (container.classList.contains("shadow")){
        container.classList.remove("shadow")
    }
    element.classList.add(container.id+"-data")
    container.appendChild(element)
    sendData(dragged_element,"modify",container.id,element.classList.value)
}

function sendData(id,type,container = null,classlist = null,title = null,description = null){
    var temp = properties
    temp.id = id
    temp.type = type
    temp.container = container
    temp.classlist = classlist
    temp.title = title
    temp.description = description
    const xhr = new XMLHttpRequest()
    data = JSON.stringify(temp)
    xhr.open('post','/')
    xhr.send(data)
}

function sendProjectData(){
    button = document.getElementById("lockBtn")
    element = document.getElementById("projectName")
    sendData(null,"project",null,button.classList.value,element.value,null)
}