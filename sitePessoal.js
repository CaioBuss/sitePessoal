function toggleDarkMode() {
    document.body.classList.toggle("light");
    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
}
window.onload =() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light");
    }

    revealOnScroll();
    startGame();
}
function revealOnScroll() {
    const elements = document.querySelectorAll(".fade-in");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });

    elements.forEach((el) => observer.observe(el));
}
const size = 8;
const bombsCount = 10;
let board =[];
let firstClick = true;

function startGame() {
    const game = document.getElementById("game");
    const status = document.getElementById("status");

    game.innerHTML = "";
    if (status) status.innerText = "";

    board = [];
    firstClick = true;

    for (let i = 0; i < size * size; i++) {
        board.push({
            bomb: false,
            revealed: false,
            flagged: false
        });
    }

    board.forEach((cell, i) => {
        const div = document.createElement("div");
        div.classList.add("cell");

        div.onclick = () => handleClick(i, div);

        div.oncontextmenu = (e) => {
            e.preventDefault();
            toggleFlag(i, div);
        };

        game.appendChild(div);
    });
}
function placeBombs(excludeIndex) {
    board.forEach(cell => cell.bomb = false);

    let bombsPlaced = 0;

    while (bombsPlaced < bombsCount) {
        let index = Math.floor(Math.random() * board.length);

        if (!board[index].bomb && index !== excludeIndex) {
            board[index].bomb = true;
            bombsPlaced++;
        }
    }
}
function handleClick(index, element) {
    if (board[index].revealed || board[index].flagged) return;

    if (firstClick) {
        placeBombs(index);
        firstClick = false;
    }

    revealCell(index);

    checkWin();
}
function toggleFlag(index, element) {
    if (board[index].revealed) return;
    board[index].flagged = !board[index].flagged;

    if (board[index].flagged) {
        element.classList.add("flag");
        element.innerText = "🚩";
        } else {
        element.classList.remove("flag");
        element.innerText = "";
        }
}
function revealCell(index) {
    const cells = document.querySelectorAll(".cell");
    const element = cells[index];

    if (!element) return; // 👈 evita crash
    if (board[index].revealed || board[index].flagged) return;

    board[index].revealed = true;
    element.classList.add("revealed");

    if (board[index].bomb) {
        element.classList.add("bomb");
        element.innerText = "💣";
        gameOver();
        return;
    }

    const count = countBombs(index);
    element.innerText = count > 0 ? count : "";

    if (count === 0) {
        getNeighbors(index).forEach(revealCell);
    }
}
function gameOver() {
    const status = document.getElementById("status");
    status.textContent = "Game Over!";

    const cells = document.querySelectorAll(".cell");
    board.forEach((cell, i) => {
        if (cell.bomb) {
            if (cells[i]) {
                cells[i].classList.add("bomb");
                cells[i].innerText = "💣";
            }
        }
    });
}
function checkWin() {
    const status = document.getElementById("status");

    if (!board.some(cell => cell.bomb)) return;

    const won = board.every(cell =>
        cell.bomb || cell.revealed
    );

    if (won) {
        status.innerText = "🎉 Você venceu!";
    }
}
function countBombs(index) {
    return getNeighbors(index).filter(i => board[i].bomb).length;
}
function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / size);
    const col = index % size;

    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (
                newRow >= 0 &&
                newRow < size &&
                newCol >= 0 &&
                newCol < size &&
                !(r === 0 && c === 0)
            ) {
                neighbors.push(newRow * size + newCol);
            }   
        }
    }
    return neighbors;
}   