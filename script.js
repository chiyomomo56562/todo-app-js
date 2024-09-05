const list=document.getElementById('list');
const createBtn=document.getElementById('create-btn');

class Todo{
    constructor(id, text, complete=false){
        this.text=text;
        this.id=id;
        this.complete=complete;
    }
}

let todos = [];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo(){
    // create new todo item
    const todo = new Todo(new Date().getTime(), '');

    //unshift todo item to todos
    todos.unshift(todo);

    //create element for todo item
    const {itemEl, inputEl, editBtnEl, removeBtnEl} =  createTodoElement(todo);

    //input element for list
    list.prepend(itemEl);

    inputEl.removeAttribute('disabled');

    inputEl.focus();
    saveToLocalStorage();
}

function createTodoElement(item){
    const itemEl = document.createElement('div');
    // .classList.add('item'); 
    // <div class="item">을 만들라는 뜻이다.
    // 하나의 요소에 여러 class를 추가할 수 있다, 그래서 classList라고 쓰는 거 같다.
    itemEl.classList.add('item');

    const checkboxEl = document.createElement('input');
    checkboxEl.checked = item.complete;
    checkboxEl.type = 'checkbox';

    if(item.complete){
        //???????
        itemEl.classList.add('completed');
    }

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.text;
    inputEl.setAttribute('disabled', '');

    const actionEl = document.createElement('div');
    actionEl.classList.add('action');

    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';

    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons', 'remove-btn');
    removeBtnEl.innerText = 'remove_circle';

    //리스너를 여기에 넣어도 제대로 작동이 되나?
    checkboxEl.addEventListener('change', () => {
        item.complete = checkboxEl.checked;

        if(item.complete){
            itemEl.classList.add('completed');
        }else {
            itemEl.classList.remove('completed');
        }

        saveToLocalStorage()
    })

    inputEl.addEventListener('blur', () => {
        inputEl.setAttribute('disabled', '');

        saveToLocalStorage()
    })

    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    })

    inputEl.addEventListener('change', () => {
        item.text = inputEl.value;

        saveToLocalStorage()
    })

    removeBtnEl.addEventListener('click', () => {
        todos = todos.filter(todo => todo.id!== item.id);

        itemEl.remove();

        saveToLocalStorage()
    })

    //action div에 edit, remove button 추가
    actionEl.append(editBtnEl);
    actionEl.append(removeBtnEl);

    //item div에 checkbox, input, action div 추가
    itemEl.append(checkboxEl);
    itemEl.append(inputEl);
    itemEl.append(actionEl);

    return {itemEl, inputEl, editBtnEl, removeBtnEl};
}

function saveToLocalStorage(){
    const data = JSON.stringify(todos);

    // window객체는 생략 가능하다.
    window.localStorage.setItem('todos', data);
}

function loadFromLocalStorage(){
    // 데이터를 가져옴
    const data = localStorage.getItem('todos');

    // JSON.parse()를 이용해 data string을 object로 변환
    if(data){
        let todo_set = JSON.parse(data);
        for (let item of todo_set){
            const newTodo = new Todo(item.id, item.text, item.complete);
            todos.unshift(newTodo);
        }
    }
}

function displayTodos(){
    loadFromLocalStorage();

    for(let i=0;i<todos.length;i++){
        const todo = todos[i];
        const {itemEl} = createTodoElement(todo);

        list.append(itemEl);
    }
}

displayTodos();