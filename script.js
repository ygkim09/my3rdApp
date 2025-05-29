const gameBoard = document.getElementById('gameBoard');
const movesSpan = document.getElementById('moves');
const matchesSpan = document.getElementById('matches');
const restartButton = document.getElementById('restartButton');

const images = [
    'fruit1', 'fruit2', 'fruit3', 'fruit4',
    'fruit5', 'fruit6', 'fruit7', 'fruit8'
]; // 이미지 파일 이름 (확장자 제외)

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalMoves = 0;
let lockBoard = false; // 카드가 뒤집히는 동안 다른 클릭 방지

function initializeGame() {
    // 게임 변수 초기화
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    totalMoves = 0;
    lockBoard = false;

    movesSpan.textContent = totalMoves;
    matchesSpan.textContent = matchedPairs;
    gameBoard.innerHTML = ''; // 기존 카드 모두 제거

    // 카드 데이터 생성 (각 이미지를 두 번씩 포함)
    const gameImages = [...images, ...images];
    // 카드 섞기
    gameImages.sort(() => 0.5 - Math.random());

    // HTML에 카드 생성
    gameImages.forEach((imageName, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.image = imageName; // 어떤 이미지인지 데이터로 저장

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const img = document.createElement('img');
        img.src = `images/${imageName}.png`; // 이미지 경로 설정
        img.alt = imageName;
        cardBack.appendChild(img);

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);

        cardElement.addEventListener('click', () => flipCard(cardElement));
        gameBoard.appendChild(cardElement);
        cards.push(cardElement);
    });
}

function flipCard(card) {
    if (lockBoard) return; // 보드 잠금 상태면 클릭 무시
    if (card === flippedCards[0]) return; // 같은 카드 두 번 클릭 방지
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return; // 이미 뒤집혔거나 맞춰진 카드 클릭 방지

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        totalMoves++;
        movesSpan.textContent = totalMoves;
        lockBoard = true; // 두 카드 뒤집혔으니 보드 잠금
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.image === card2.dataset.image;

    if (isMatch) {
        matchedPairs++;
        matchesSpan.textContent = matchedPairs;
        disableCards();
        if (matchedPairs === images.length) {
            setTimeout(() => alert('축하합니다! 모든 짝을 찾았습니다!'), 500);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    // 매치된 카드는 더 이상 클릭되지 않도록 'matched' 클래스 추가
    flippedCards.forEach(card => card.classList.add('matched'));
    resetFlippedCards();
}

function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        resetFlippedCards();
    }, 1000); // 1초 후 다시 뒤집기
}

function resetFlippedCards() {
    flippedCards = [];
    lockBoard = false; // 보드 잠금 해제
}

restartButton.addEventListener('click', initializeGame);

// 페이지 로드 시 게임 초기화
initializeGame();