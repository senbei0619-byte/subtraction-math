const number1Element = document.getElementById('number-a');
const number2Element = document.getElementById('number-b');
const answerElement = document.getElementById('answer-mark');
const dotsAElement = document.getElementById('dots-a');
const dotsBElement = document.getElementById('dots-b');
const correctCountElement = document.getElementById('correct-count');
const totalCountElement = document.getElementById('total-count');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const numberButtons = document.querySelectorAll('.number-btn');
const gameArea = document.querySelector('.game-area');

let correctAnswer = null;
let userAnswer = '';
let correctCount = 0;
let totalCount = 0;

function generateProblem() {
    const number1 = Math.floor(Math.random() * 9) + 1; // 1〜9
    const number2 = Math.floor(Math.random() * number1); // 0〜number1-1

    correctAnswer = number1 - number2;

    // 数字のみ表示（りんごは削除）。ドットは下に表示します。
    number1Element.textContent = number1;
    number2Element.textContent = number2;

    dotsAElement.innerHTML = '';
    dotsBElement.innerHTML = '';

    for (let i = 0; i < number1; i++) {
        const dot = document.createElement('div');
        dotsAElement.appendChild(dot);
    }

    for (let i = 0; i < number2; i++) {
        const dot = document.createElement('div');
        dotsBElement.appendChild(dot);
    }

    answerElement.textContent = '?';
    feedbackElement.classList.add('hidden');
    nextButton.classList.add('hidden');
    userAnswer = '';
}

let pendingTimeout = null;
let inputLocked = false;
let autoAdvanceTimeout = null;

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (inputLocked) return; // 判定待ちの間は無視

        const val = button.dataset.number;
        if (!val) return;

        // 数字ボタンが押されたら選択を表示して2秒後に自動判定
        if (val !== 'ok') {
            userAnswer = val;
            answerElement.textContent = userAnswer;
            inputLocked = true;

            // 安全のため既存タイマークリア
            if (pendingTimeout) clearTimeout(pendingTimeout);
            pendingTimeout = setTimeout(() => {
                checkAnswer();
            }, 2000);
        }
    });
});

function checkAnswer() {
    pendingTimeout = null;
    totalCount++;
    totalCountElement.textContent = totalCount;

    // フィードバックのクラスをリセット
    feedbackElement.classList.remove('correct', 'incorrect');
    if (parseInt(userAnswer) === correctAnswer) {
        correctCount++;
        correctCountElement.textContent = correctCount;
        buildFeedbackContent('正解です！', correctAnswer);
        feedbackElement.classList.add('correct');
        feedbackElement.classList.remove('hidden');
        // コンフェッティ演出
        if (gameArea) createConfetti(12);
    } else {
        buildFeedbackContent('不正解です。', correctAnswer);
        feedbackElement.classList.add('incorrect');
        feedbackElement.classList.remove('hidden');
    }

    nextButton.classList.remove('hidden');
    inputLocked = false;

    // 自動で次の問題へ移行（正解・不正解どちらでも）
    if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
    autoAdvanceTimeout = setTimeout(() => {
        feedbackElement.classList.add('hidden');
        nextButton.classList.add('hidden');
        userAnswer = '';
        answerElement.textContent = '?';
        generateProblem();
        autoAdvanceTimeout = null;
    }, 2500);
}

function createConfetti(count) {
    const colors = ['#ff6b6b', '#ffd166', '#6bcB77', '#5ec4ff', '#c792ea'];
    const rect = gameArea.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        el.style.background = colors[i % colors.length];
        // 横位置をランダムに
        const left = Math.random() * (rect.width - 10);
        el.style.left = `${left}px`;
        // 下に少しオフセットして中央付近から上へ飛ばす
        el.style.top = `${rect.height - 40}px`;
        gameArea.appendChild(el);
        // 削除タイマー
        setTimeout(() => {
            el.remove();
        }, 1100);
    }
}

nextButton.addEventListener('click', () => {
    // 手動で次へ押された場合は自動遷移タイマーをクリア
    if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
    }
    userAnswer = '';
    answerElement.textContent = '?';
    feedbackElement.classList.add('hidden');
    nextButton.classList.add('hidden');
    generateProblem();
});

generateProblem();

// 安全なフィードバック構築: innerHTML を使わず DOM 要素を構築する
function buildFeedbackContent(text, dotCount) {
    // 既存内容を安全にクリア
    while (feedbackElement.firstChild) feedbackElement.removeChild(feedbackElement.firstChild);

    const textDiv = document.createElement('div');
    textDiv.className = 'feedback-text';
    textDiv.textContent = text;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'feedback-dots';
    for (let i = 0; i < dotCount; i++) {
        const d = document.createElement('div');
        dotsContainer.appendChild(d);
    }

    feedbackElement.appendChild(textDiv);
    feedbackElement.appendChild(dotsContainer);
}