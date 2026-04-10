//Memory Game Studenti

//seleziono gli elementi HTML
const board = document.querySelector('.board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const timer = document.getElementById('timer');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

//definisco le variabili globali
let cardImages = [];
let cards = [];
let flippedCards = [];
let lockBoard = false;
let matchedPairs = 0;
let countdown = 60;
let timerInterval = null;
let gameEnded = false;

//definisco il numero totale di coppie di carte da trovare
let totalPairs = 8; //imposto il numero totale di coppie da trovare a 8, ma può essere modificato in base alla difficoltà scelta dall'utente


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


//creo l'array delle immagini delle carte
function createImagesArray() {
    cardImages = []; //svuoto l'array delle immagini prima di ricrearlo

    const shuffledStudents = []; //creo un array temporaneo per mescolare gli studenti

    //per ogni studente presente nell'array studentsInfo, lo aggiungo all'array temporaneo shuffledStudents
    for (const student of studentsInfo) {
        shuffledStudents.push(student);
    }

    fisherYatesShuffle(shuffledStudents); //mescolo l'array temporaneo shuffledStudents con l'algoritmo Fisher-Yates

    let count = 0; //creo un contatore per tenere traccia del numero di coppie di carte aggiunte all'array cardImages

    //per ogni studente presente nell'array temporaneo shuffledStudents, se il contatore è minore del numero totale di coppie da trovare 
    for (const student of shuffledStudents) {
        if (count >= totalPairs) {
            break;
        }

        //aggiungo l'immagine dello studente all'array cardImages e incremento il contatore
        cardImages.push(student.image);
        count++;
    }
}

//imposto la griglia della board in base al numero totale di carte da visualizzare
function setBoardGrid() {
    const totalCards = cardImages.length * 2; //calcolo il numero totale di carte da visualizzare come il doppio del numero di immagini presenti nell'array cardImages (perché ogni immagine deve essere duplicata per creare le coppie)
    const columns = Math.sqrt(totalCards);//calcolo il numero di colonne della griglia come la radice quadrata del numero totale di carte

    board.style.gridTemplateColumns = `repeat(${columns}, 100px)`; //imposto la proprietà grid-template-columns della board per creare una griglia con il numero di colonne calcolato e una larghezza fissa di 100px per ogni colonna
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
    
    //se il gioco è terminato, la board è bloccata, la carta è già girata o la carta è già abbinata, non faccio nulla
    if (gameEnded || lockBoard || isFlipped || isMatched) {
        return;
    }
    //giro la carta e la aggiungo all'array delle carte girate
    card.classList.add('flipped');
    flippedCards.push(card);

    //se ci sono due carte girate, controllo se sono uguali
    if (flippedCards.length === 2) {
        checkMatch(); //chiamo la funzione checkMatch per controllare se le due carte girate sono uguali
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

        //se tutte le coppie sono state trovate, termino il gioco
        if (matchedPairs === totalPairs) {
            gameEnded = true; //imposto la variabile gameEnded a true per indicare che il gioco è terminato
            clearInterval(timerInterval); //fermo il timer
            message.textContent = 'Hai trovato tutte le coppie!'; //mostro un messaggio di vittoria all'utente
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

//gestisco il timer del gioco
function startTimer() {
    clearInterval(timerInterval); //fermo eventuali timer precedenti

    //imposto il tempo iniziale in base alla difficoltà scelta dall'utente
    if (totalPairs === 8) {
        countdown = 40; //imposto il tempo iniziale a 40 secondi per la difficoltà facile (8 coppie)
    } else if (totalPairs === 18) {
        countdown = 75; //imposto il tempo iniziale a 75 secondi per la difficoltà media (18 coppie)
    }

    timer.textContent = 'Tempo rimasto: ' + countdown + ' secondi';

    timerInterval = setInterval(function () {
        countdown--;
        timer.textContent = 'Tempo rimasto: ' + countdown + ' secondi';

        if (countdown <= 0) {
            clearInterval(timerInterval);
            gameEnded = true;
            lockBoard = true;
            message.textContent = 'Tempo scaduto! Hai trovato ' + matchedPairs + ' coppie su ' + totalPairs + '.';
        }
    }, 1000);
}

// reset gioco
function resetGame() {
    flippedCards = []; //svuoto l'array delle carte girate
    lockBoard = false; //riattivo la board
    matchedPairs = 0; //azzero il contatore delle coppie abbinate
    message.textContent = ''; //svuoto il messaggio di vittoria
    gameEnded = false; //imposto la variabile gameEnded a false per indicare che il gioco è in corso

    createImagesArray(); //ricreo l'array delle immagini delle carte
    createCards(); //ricreo le carte del gioco
    renderCards(); //ristampo le carte nella board
    setBoardGrid(); //imposto la griglia della board in base al numero totale di carte da visualizzare
    startTimer(); //avvio il timer del gioco
}

//aggiungo un event listener a ciascun pulsante di difficoltà per chiamare la funzione resetGame con il numero di coppie corrispondente quando viene cliccato
for (const button of difficultyButtons) {
    button.addEventListener('click', function () {
        totalPairs = Number(button.dataset.pairs); //assegno il numero di coppie corrispondente al pulsante cliccato alla variabile totalPairs, convertendo il valore da stringa a numero con Number()
        resetGame();
    });
}

restartBtn.addEventListener('click', resetGame); //aggiungo un event listener al pulsante di restart per chiamare la funzione resetGame quando viene cliccato

resetGame(); //chiamo la funzione resetGame per inizializzare il gioco al caricamento della pagina

