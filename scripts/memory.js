//Memory Game Studenti


const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

let cardImages = [];
let cards = [];



//creo l'array delle immagini delle carte, prendendo i dati dallo studente
function createImagesArray() {
    cardImages = [];

    for (const student of studentsInfo) {
        cardImages.push(student.image);
    }
}

//creo l'algoritmo Fisher-Yates per mescolare le carte
function fisherYatesShuffle(array) {
    //parto dall'ultimo indice dell'array e scorro a ritroso fino al primo
    for (let i = array.length - 1; i > 0; i--) {
        //genero un indice casuale tra 0 e i e lo assegno a j
        const j = Math.floor(Math.random() * (i + 1));

        //salvo temporaneamente il valore dell'array in posizione i
        //scambio il valore in posizione i con quello in posizione j
        //assegno il valore temporaneo in posizione j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}