
const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
const genBtn = document.getElementById("gen-btn")
const saveBtn = document.getElementById("save-btn")
const farm_ico = document.createElement("img");
const farm_ico_move = document.createElement("img");
const lvl_title = document.getElementById("level-title");
const table_body = document.getElementById("table-body");
const rating_zone = document.getElementById("rating-zone");
farm_ico.src = "farmer-icon.png"
farm_ico_move.src = "farmer-icon-move.png"
farm_ico_move
farm_ico.addEventListener("load", () => {
    gen();
    drawRating();
})

function getRating() {
    const rating = [];
    for(let i = 0; i < localStorage.length; i++) {
        const user = localStorage.key(i);
        const level = localStorage.getItem(user);
        rating.push({user, level});
    }
    rating.sort((p1, p2) => p2.level - p1.level);
    return rating;
}
function drawRating() {
    const rating = getRating();
    if (rating.length === 0) {
        rating_zone.style.display = "none";
    } else {
        for(const pair of rating) {
            console.log(pair);
            const trow = document.createElement("tr");
            const cell1 = document.createElement("td");
            const cell2 = document.createElement("td");
            cell1.classList.add("table-cell");
            cell1.classList.add("user-cell");
            cell2.classList.add("table-cell");
            cell2.classList.add("level-cell");

            cell1.textContent = pair.user;
            cell2.textContent = pair.level;

            trow.appendChild(cell1);
            trow.appendChild(cell2);

            table_body.appendChild(trow);
        }
    }
}

genBtn.addEventListener("click", gen)
saveBtn.addEventListener("click", () => {
    let user = prompt("Укажите ваше имя");
    if(user.length <= 20 && (user != null && user != "")) {
        localStorage.setItem(user, cur_level);
        location.reload();
    }
})
function gen() {
    crtArrAndCanv();
    generateMaze();
    drawMaze();
    resetProp();
    drawFarmer();
}
document.body.addEventListener("keydown", animate)
function animate() {
    clearFarmer();
    setProp();
    drawFarmer();
}

let maze;
let ROWS = 13;
let COLS = 13;
let CELL_SIZE = 45;
const CANV_HEIGHT = 585;
const CANV_WIDTH = 585;
const WALL_COLOR = "black";
const PATH_COLOR = "green";
let cur_level = 1;
let moving = false;



function crtArrAndCanv() {
    lvl_title.innerText = "Уровень: " + cur_level;
    canvas.width = CANV_WIDTH;
    canvas.height = CANV_HEIGHT;
    maze = Array(ROWS).fill().map(() => Array(COLS))
}

let farmer = {}

function resetProp() {
    farmer.x = 1;
    farmer.y = 1;
    farmer.width = CELL_SIZE;
    farmer.height = CELL_SIZE;
}

// function setProp() {
//     switch(event.keyCode) {
//         case 68: farmer.x++; if(getCollision()) {farmer.x--}; break;
//         case 65: farmer.x--; if(getCollision()) {farmer.x++}; break;
//         case 87: farmer.y--; if(getCollision()) {farmer.y++}; break;
//         case 83: farmer.y++; if(getCollision()) {farmer.y--}; break;
//     }
// }
function setProp() {
    switch(event.keyCode) {
        case 39:
        case 68: farmer.x++
            moving = true;
            setTimeout(() => {
                moving = false;
                clearFarmer();
                drawFarmer();
            }, 1000)
            if(getCollision()) {
                setTimeout(() => {
                ROWS = 13;
                COLS = 13;
                CELL_SIZE = 45;
                cur_level = 1;
                gen();
                }, 100);
            }; break;
        case 37:
        case 65: farmer.x--; 
            moving = true;
            setTimeout(() => {
                moving = false;
                clearFarmer();
                drawFarmer();
            }, 1000)
            if(getCollision()) {
                setTimeout(() => {
                ROWS = 13;
                COLS = 13;
                CELL_SIZE = 45;
                cur_level = 1;
                gen();
                }, 100);
            }; break;
        case 38:
        case 87: farmer.y--; 
            moving = true;
            setTimeout(() => {
                moving = false;
                clearFarmer();
                drawFarmer();
            }, 1000)
            if(getCollision()) {
                setTimeout(() => {
                ROWS = 13;
                COLS = 13;
                CELL_SIZE = 45;
                cur_level = 1;
                gen();
                }, 100);
            }; break;
        case 40:
        case 83: farmer.y++; 
            moving = true;
            setTimeout(() => {
                moving = false;
                clearFarmer();
                drawFarmer();
            }, 1000)
            if(getCollision()) {
                setTimeout(() => {
                ROWS = 13;
                COLS = 13;
                CELL_SIZE = 45;
                cur_level = 1;
                gen();
                }, 200);
            }; break;
    }
}
function drawFarmer() {
    context.drawImage(moving ? farm_ico_move : farm_ico, farmer.x*CELL_SIZE, farmer.y*CELL_SIZE, farmer.width, farmer.height);
}
function clearFarmer() {
    context.fillStyle = PATH_COLOR;
    context.fillRect(farmer.x*CELL_SIZE, farmer.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    context.fillStyle = "rgba(15, 112, 0)";
    context.fillRect(farmer.x*CELL_SIZE+CELL_SIZE*0.2, farmer.y*CELL_SIZE+CELL_SIZE*0.2, CELL_SIZE*0.6, CELL_SIZE*0.6);
}
function getCollision() {
    // if((farmer.y === 1 && farmer.x === 3) || (farmer.y === 3 && farmer.x === 1)) {
    //     cur_level++;
    //     ROWS += 2;
    //     COLS += 2;
    //     CELL_SIZE = CANV_HEIGHT / ROWS;
    //     gen();
    // }
    if(farmer.y === ROWS-2 && farmer.x === COLS-2) {
        cur_level++;
        ROWS += 2;
        COLS += 2;
        CELL_SIZE = CANV_HEIGHT / ROWS;
        gen();
    }
    if(maze[farmer.y][farmer.x] == 1) {
        return true;
    } else {
        return false;
    }
}

function carvePassage(row, col) {
    direction = [
        [-2, 0],
        [0, 2],
        [2, 0],
        [0, -2]
    ]
    direction.sort(() => Math.random() - 0.5)
    for(let[drow, dcol] of direction) {
        const newRow = row + drow
        const newCol = col + dcol
        if(newRow > 0 && newRow < ROWS-1 && newCol > 0 && newCol < COLS-1 && maze[newRow][newCol] == 1) {
            maze[newRow][newCol] = 0
            maze[row + drow/2][col + dcol/2] = 0
            carvePassage(newRow, newCol)
        }
    }
}
function generateMaze() {
    for(let row = 0; row < ROWS; row++) {
        for(let col = 0; col < COLS; col++) {
            maze[row][col] = 1
        }
    }
    startRow = 1
    startCol = 1
    maze[startRow][startCol] = 0
    carvePassage(startRow, startCol)
}
function drawMaze() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for(let row = 0; row < ROWS; row++) {
        for(let col = 0; col < COLS; col++) {
            context.fillStyle = maze[row][col] == 1 ? WALL_COLOR : PATH_COLOR
            context.fillRect(col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE)
            context.fillStyle = maze[row][col] == 1 ? "rgb(18, 18, 18)" : "rgb(15, 112, 0)";
            context.fillRect(col*CELL_SIZE+CELL_SIZE*0.2, row*CELL_SIZE+CELL_SIZE*0.2, CELL_SIZE*0.6, CELL_SIZE*0.6);
            context.fillStyle = maze[row][col] == 1 ? "rgb(36, 36, 36)" : "rgb(15, 112, 0)";
            context.fillRect(col*CELL_SIZE+CELL_SIZE*0.35, row*CELL_SIZE+CELL_SIZE*0.35, CELL_SIZE*0.3, CELL_SIZE*0.3);
        }
    }
}