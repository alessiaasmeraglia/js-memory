//Memory Game Studenti


const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

let cardImages = [];
let cards = [];
let flippedCards = [];
let lockBoard = false;
let matchedPairs = 0;

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

//creo le carte del gioco, duplicando le immagini per creare le coppie e mescolandole con l'algoritmo Fisher-Yates
function createCards() {
    //svuoto l'array delle carte prima di ricrearle
    cards = [];

    //duplico le immagini per creare le coppie
    const memoryImages = [];

    //per ogni immagine presente nell'array cardImages, la aggiungo due volte all'array memoryImages
    for (const image of cardImages) {
        memoryImages.push(image);
        memoryImages.push(image);
    }

    //mescolo le carte con l'algoritmo Fisher-Yates
    fisherYatesShuffle(memoryImages);

    //per ogni immagine presente nell'array memoryImages, creo una carta e la aggiungo all'array cards
    for (const image of memoryImages) {
        //creo gli elementi HTML per la carta
        const cardCol = document.createElement('div'); //creo un div per la colonna della carta
        cardCol.classList.add('col', 'card-wrapper'); //aggiungo le classi 'col' e 'card-wrapper' al div della colonna

        const card = document.createElement('div'); //creo un div per la carta
        card.classList.add('card-memory'); //aggiungo la classe 'card-memory' al div della carta
        card.dataset.value = image; //assegno il valore dell'immagine alla proprietà data-value della carta

        const front = document.createElement('div'); //creo un div per il fronte della carta
        front.classList.add('front'); //aggiungo la classe 'front' al div del fronte della carta

        const back = document.createElement('div');//creo un div per il retro della carta
        back.classList.add('back'); //aggiungo la classe 'back' al div del retro della carta

        const img = document.createElement('img'); //creo un elemento img per l'immagine della carta
        img.src = image; //assegno la sorgente dell'immagine alla proprietà src dell'elemento img
        img.alt = 'Studente'; //assegno un testo alternativo all'immagine

        back.appendChild(img); //aggiungo l'elemento img al div del retro della carta
        card.appendChild(front); //aggiungo il div del fronte alla carta
        card.appendChild(back); //aggiungo il div del retro alla carta
        cardCol.appendChild(card); //aggiungo la carta al div della colonna

        //aggiungo un event listener alla carta per gestire il click
        card.addEventListener('click', handleCardClick);

        //aggiungo la carta all'array delle carte
        cards.push(cardCol);
    }
}

//stampo le carte nella board
function renderCards() {
    board.innerHTML = ''; //svuoto la board prima di ristampare le carte

    //per ogni carta presente nell'array cards, la aggiungo alla board
    for (const card of cards) {
        board.appendChild(card);
    }
}

//gestisco il click sulla carta
function handleCardClick(event) {
    const card = event.currentTarget; //assegno la carta cliccata alla variabile card
    const isFlipped = card.classList.contains('flipped'); //controllo se la carta è già girata
    const isMatched = card.classList.contains('matched'); //controllo se la carta è già abbinata
    
    //se la board è bloccata, se la carta è già girata o se la carta è già abbinata, non faccio nulla
    if (lockBoard || isFlipped || isMatched) {
        return;
    }
    //giro la carta e la aggiungo all'array delle carte girate
    card.classList.add('flipped');
    flippedCards.push(card);

    //se ci sono due carte girate, controllo se sono uguali
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// controllo coppia
function checkMatch() {
    lockBoard = true; //blocco la board per evitare che l'utente possa girare altre carte mentre controllo la coppia

    const firstCard = flippedCards[0]; //assegno la prima carta girata alla variabile firstCard
    const secondCard = flippedCards[1]; //assegno la seconda carta girata alla variabile secondCard

    //se le carte sono uguali, le abbino e incremento il contatore delle coppie abbinate
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched'); //aggiungo la classe 'matched' alla prima carta
        secondCard.classList.add('matched'); //aggiungo la classe 'matched' alla seconda carta

        matchedPairs++; //incremento il contatore delle coppie abbinate
        flippedCards = []; //svuoto l'array delle carte girate
        lockBoard = false; //riattivo la board

        //se tutte le coppie sono state trovate, mostro un messaggio di vittoria
        if (matchedPairs === cardImages.length) {
            message.textContent = 'Hai trovato tutte le coppie!';
        }
    } else {
        //se le carte non sono uguali, le giro di nuovo dopo un secondo
        setTimeout(function () {
            firstCard.classList.remove('flipped'); //rimuovo la classe 'flipped' dalla prima carta per girarla di nuovo
            secondCard.classList.remove('flipped'); //rimuovo la classe 'flipped' dalla seconda carta per girarla di nuovo

            flippedCards = []; //svuoto l'array delle carte girate
            lockBoard = false; //riattivo la board per permettere all'utente di girare altre carte
        }, 1000);
    }
}

// reset gioco
function resetGame() {
    flippedCards = []; //svuoto l'array delle carte girate
    lockBoard = false; //riattivo la board
    matchedPairs = 0; //azzero il contatore delle coppie abbinate
    message.textContent = ''; //svuoto il messaggio di vittoria

    createImagesArray(); //ricreo l'array delle immagini delle carte
    createCards(); //ricreo le carte del gioco
    renderCards(); //ristampo le carte nella board
}

restartBtn.addEventListener('click', resetGame); //aggiungo un event listener al pulsante di restart per chiamare la funzione resetGame quando viene cliccato

resetGame(); //chiamo la funzione resetGame per inizializzare il gioco al caricamento della pagina

