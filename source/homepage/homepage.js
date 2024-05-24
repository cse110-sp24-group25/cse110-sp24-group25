window.addEventListener('DOMContentLoaded', init);

/**
 * Initializes current date heading
 * 
 * @returns {undefined} Nothing
 */
function init() {
    getDate('current-date');
}

/**
 * Displays the current date in a specified HTML container.
 * The date is formatted in a long format with the day of the week, 
 * month name, day, and year.
 * 
 * @param {string} container_id - ID of the HTML container where the date will be displayed
 */
function getDate(container_id) {
    // Get the current date
    let currentDate = new Date();

    // Format the date (e.g., "May 8, 2024")
    let formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Display the date in the designated container
    const dateContainer = document.getElementById(container_id);
    dateContainer.textContent = formattedDate;
}

/**
 * Shows that a given button has been selected by adding the active property to its classname
 * 
 * @param {int} buttonIndex - the index of the button selected.
 * 1-5 for mental health, 6-10 for productivity
 */
function selectWidget(buttonIndex) {
    // Clear active class from all buttons in row and
    // Add active class to selected button
    if (buttonIndex > 5) {
        const buttons = document.querySelectorAll('.productiveness img');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        const selection = document.querySelector(`.rating-widget .productiveness button:nth-child(${buttonIndex - 5}) img`);
        selection.classList.add('active');
        saveProductivity(buttonIndex);
    }
    else {
        const buttons = document.querySelectorAll('.feelings img');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        const selection = document.querySelector(`.rating-widget .feelings button:nth-child(${buttonIndex}) img`);
        selection.classList.add('active');
        saveRating(buttonIndex);
    }
}

/**
 * A function to create a new task and place it in the sidebar
 */
function addTask() {
    // Create the new list item element
    const li = document.createElement('li');

    // Create and append the checkbox input
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.id = 'task' + (document.querySelectorAll('.task-checkbox').length + 1);
    li.appendChild(checkbox);

    // Create and append the strong element with the task name
    const strong = document.createElement('strong');
    strong.contentEditable = true;
    li.appendChild(strong);
    strong.textContent = 'Add Task Name...';

    // Add event listener to hide default text when user starts typing
    strong.addEventListener('click', function() {
        if (strong.textContent === 'Add Task Name...') {
            strong.textContent = ''; // Clear default text when user starts typing
        }
    });

    strong.addEventListener("blur", saveTasks);

    // Create and append the color-buttons div
    const colorButtons = document.createElement('div');
    colorButtons.className = 'color-buttons';
    li.appendChild(colorButtons);

    // List of colors
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];

    // Create and append each color button
    colors.forEach(color => {
        const button = document.createElement('button');
        button.className = 'color-button ' + color;
        colorButtons.appendChild(button);
    });

    // Create and append the trash icon
    const trashIcon = document.createElement('img');
    trashIcon.src = '../icons/trash-icon.svg';
    trashIcon.alt = 'Remove';
    trashIcon.className = 'fas fa-trash-alt';

    trashIcon.addEventListener('click', function() {
        // Find the parent <li> element of the clicked trash icon
        const listItem = trashIcon.closest('li');
            
        // Remove the <li> element from the DOM
        if (listItem) {
            listItem.remove();
        }
    });

    li.appendChild(trashIcon);

    // Append the new list item to the task list
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.appendChild(li);
    saveTasks();

    return li;
}


//------------------------------------------
// Save journal entry
const journal = document.getElementById("textarea");
const date = document.getElementById("current-date");
const tasks = document.getElementById("taskContainer");

window.onload = function() {
    loadJournal()
    loadTasks()
    loadRating()
    loadProductivity()
}

window.onbeforeunload = function() {
    saveJournal()
    saveTasks()
}

// Save every 30 seconds
// var saveInterval = setInterval(function(){
//     saveJournal()
//     console.log("Saved")
// }, 30000)

function saveToStorage(data, dateText, key, value){
    if (!(dateText in data)){
        data[dateText] = {}
    }
    data[dateText][key] = value;
}

function loadFromStorage(data, dateText, key){
    if (!(dateText in data)){
        return;
    }
    return data[dateText][key];
}

function saveJournal() { 
    let data = getJournal()
    let dateText = new Date(date.textContent).toLocaleDateString();
    saveToStorage(data, dateText, "contents", journal.value)
    console.log(data)
    localStorage.setItem("journals", JSON.stringify(data))
}

function getJournal() {
    let data = JSON.parse(localStorage.getItem("journals"))
    if (data == null) {
        data = {}
    }
    return data
}

function loadJournal() {
    let data = getJournal()
    let dateText = new Date(date.textContent).toLocaleDateString();
    journal.value = loadFromStorage(data, dateText, "contents")
    console.log(data)
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#taskContainer li').forEach(task => {
        let checkbox = task.querySelector('input[type="checkbox"]');
        let taskName = task.querySelector('strong').textContent;
        tasks.push({
            text: taskName,
            checked: checkbox.checked  
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function getTasks() {
    let storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
}


function loadTasks() {
    let tasks = getTasks();
    if (tasks.length > 0) {
        tasks.forEach(task => {
            let curLi = addTask();
            curLi.querySelector("strong").textContent = task['text']
            curLi.querySelector('input[type="checkbox"]').checked = task['checked']
        });
    }
}

function saveRating(value){
    let data = getJournal();
    let dateText = new Date(date.textContent).toLocaleDateString();
    saveToStorage(data, dateText, "rating", value);
    console.log(data);
    localStorage.setItem("journals", JSON.stringify(data));
}

function loadRating() {
    let data = getJournal();
    let dateText = new Date(date.textContent).toLocaleDateString();
    let rating = loadFromStorage(data, dateText, "rating");
    if (rating != null){
        selectWidget(rating);
    }
}

function saveProductivity(value){
    let data = getJournal();
    let dateText = new Date(date.textContent).toLocaleDateString();
    saveToStorage(data, dateText, "productivity", value);
    console.log(data);
    localStorage.setItem("journals", JSON.stringify(data));
}

function loadProductivity() {
    let data = getJournal();
    let dateText = new Date(date.textContent).toLocaleDateString();
    let productivity = loadFromStorage(data, dateText, "productivity")
    if (productivity != null) {
        selectWidget(productivity);
    }
}

journal.addEventListener("blur", saveJournal)
tasks.addEventListener("blur", saveTasks)
tasks.addEventListener("change", saveTasks)