
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.column'); 
    const form = document.getElementById('task-form');  
    const modal = document.getElementById('task-modal'); 
    const btn = document.getElementById("add-task");
    const span = document.querySelector('.close');   

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }   

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (!draggable) return;
            
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
        container.addEventListener('drop', e => {
            handleDrop(e, container);
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById("task-name").value;
        const description = document.getElementById("task-description").value;
        const category = document.getElementById("task-category").value;
        const datetime = new Date().toLocaleString();
    
        crearTarjeta(name, description, category, datetime);
        
        modal.style.display = "none";
    });

    function crearTarjeta(name, description, category, datetime) {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;   
        card.innerHTML = `<div>
        <p id="algo">${name}</p>
        <p id="descripcion">${description}</p>
        <small class="desc">${category + ", "}</small>
        <small class="desc">${datetime}</small>
        </div>`;

        

        const closeButton = document.createElement('button');
        closeButton.setAttribute('id', 'cerrar');
        closeButton.textContent = 'X';
        
        closeButton.onclick = function() {
            card.remove(); 
        };
        card.appendChild(closeButton);
      
        const porHacerColumn = document.querySelector('#crear'); 
        porHacerColumn.appendChild(card);
        
        inicializarDraggable(card);
    }    

    function inicializarDraggable(card) {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    }

    inicializarDraggables();  
    
});

function inicializarDraggables() {
    document.querySelectorAll('.card').forEach(inicializarDraggable);
}

let countdown;
let pause = false;   
let timerSecond = 0; 
let audio = new Audio('./audio/alarma.mp3');

function putoTimer() {
    const timerDisplay = document.getElementById("timer");
    const timerDropdown = document.getElementById("timer-select"); 
    let timeSelected = parseInt(timerDropdown.value);  

    audio.pause();
    audio.currentTime = 0;
    
    if (!pause && timerSecond == 0) {        
        switch(timeSelected) {
            case 1:
                timerSecond = 25 * 60;
                break;
            case 2:
                timerSecond = 15 * 60;
                break;
            case 3:
                timerSecond = 5 * 60;
                break;
            default:
                timerSecond = 25 * 60;
        }
    }   
   
    if(pause) {
        clearInterval(countdown);
        pause = false;
    } else {
        pause = true;        
        countdown = setInterval(() => {
            document.getElementById("timer-select").style.display = "none"
            timerSecond--;
            const minutes = Math.floor(timerSecond / 60);
            const seconds = timerSecond % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
         

            if (timerSecond <= 0) {
                clearInterval(countdown);
                pause = false;
                timerSecond = 0; 
                timerDisplay.textContent = "Time!";
                document.getElementById("timer-select").style.display = "block"
                audio.play();
            }
        }, 1000);
    }
}


function handleDrop(event, container) {
    const draggable = document.querySelector('.dragging');    

    container.appendChild(draggable);

    if(container.getAttribute('value') == 'Hecho') {
        draggable.classList.add('done');       
        draggable.draggable = false;
        draggable.setAttribute('id', 'borrar');         
                    
    } else {
        draggable.classList.remove('done');
    }

    if(container.getAttribute('value') == 'Pendiente') {
        draggable.classList.add('toDo');    
    } else {
        draggable.classList.remove('toDo');
    }
}

function borrar(card)
{
    card.remove();
}

