// Memory Game Studenti


const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

let cardImages = [];
let cards = [];


// creo l'array delle immagini
function createImagesArray() {
    cardImages = [];
    let i = 0;

    while (i < studentsInfo.length) {
        cardImages.push(studentsInfo[i].image);
        i++;
    }
}