const board = document.querySelector('.game-board');
const moveCountEl = document.getElementById('move-count');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restart');
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let intervalId;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  clearInterval(intervalId);
  timer = 0;
  timerEl.textContent = timer;
  intervalId = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function updateMoves() {
  moves++;
  moveCountEl.textContent = moves;
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function handleCardClick(e) {
  const card = e.currentTarget;
  if (lockBoard || card === firstCard) return;
  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  updateMoves();

  const match = firstCard.dataset.value === secondCard.dataset.value;
  match ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', handleCardClick);
  secondCard.removeEventListener('click', handleCardClick);
  matches++;
  if (matches === cards.length / 2) clearInterval(intervalId);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function initGame() {
  board.innerHTML = '';
  cards = [];
  moves = 0;
  matches = 0;
  moveCountEl.textContent = moves;

  // create values 1-8 twice
  const values = [...Array(8).keys()].map(n => n + 1);
  const gameValues = [...values, ...values];
  shuffle(gameValues);

  // Apply the actual card elements to the dom
  gameValues.forEach(val => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = val;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face front"></div>
        <div class="card-face back">${val}</div>
      </div>
    `;
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
    cards.push(card);
  });

  startTimer();
  resetBoard();
}

restartBtn.addEventListener('click', initGame);
window.addEventListener('load', initGame);
