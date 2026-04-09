// Memory Game Studenti


const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

let cardImages = [];
let cards = [];



// creo l'array delle immagini
function createImagesArray() {
    cardImages = [];

    for (const student of studentsInfo) {
        cardImages.push(student.image);
    }
}