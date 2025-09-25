const number = Number(prompt('참가자는 몇 명인가요?'));
const input = document.querySelector('input');
const button = document.querySelector('button');
const wordEl = document.querySelector('#word');
const orderEl = document.querySelector('#order');

let newWord;
let word;
let inputedWords = [];
let player = [];
let playerindex = 0;

function init(){
    orderEl.textContent = `${player[playerindex]} 유저 ${playerindex + 1}`;
    if (number <= 0 || isNaN(number) || isFinite(number) === false) {
        alert("참가자는 최소 1명 이상이어야 합니다. 새로고침 후 다시 시도해주세요.");
        input.disabled = true;
        button.disabled = true;
    }
    renderPlayerStack();
    renderSolvedList();
}

function Clear(){
    alert(`${player[playerindex]} 유저 ${playerindex + 1}님이 최후의 1인이 되셨습니다! 축하합니다! 이어하실려면 새로고침 해주세요!`);
    input.disabled = true;
    button.disabled = true;
}

function NextUser() {
    const totalPlayers = player.length;
    let attempts = 0;
    do {
        playerindex = (playerindex + 1) % totalPlayers;
        attempts++;
        if (attempts > totalPlayers) {
            console.error("모든 플레이어가 탈락했습니다.");
            return;
        }
    } while (player[playerindex] === null);
    orderEl.textContent = `${player[playerindex]} 유저 ${playerindex + 1}`;
    renderPlayerStack();
}

function userOutAndNextUser(){
    input.value = '';
    player[playerindex] = null;
    if (player.filter(p => p !== null).length === 1) {
        NextUser();
        Clear();
    }
    else{
        NextUser();
    }
}
// --- 아래는 유저 출력과 유저 입력 단어를 위한 함수 ---
function ensurePlayerStack() {
    let stack = document.querySelector('.player-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.className = 'player-stack';
        const firstDiv = document.querySelector('body > div');
        if (firstDiv) document.body.insertBefore(stack, firstDiv);
        else document.body.insertBefore(stack, document.body.firstChild);
    }
    return stack;
}

function renderPlayerStack() {
    const stack = ensurePlayerStack();
    stack.innerHTML = '';
    const alive = [];
    const total = player.length;
    for (let i = 0; i < total; i++) {
        const idx = (playerindex + i) % total;
        if (player[idx] !== null) alive.push({name: player[idx], idx});
    }
    const max = alive.length;
    for (let i = max - 1; i >= 0; i--) {
        const p = alive[i];
        const posFromCurrent = max - 1 - i;
        const alpha = 0.3 + (posFromCurrent / Math.max(1, max - 1)) * 0.9;
        const div = document.createElement('div');
        div.className = 'stack-item';
        div.style.opacity = alpha.toFixed(2);
        div.textContent = `${p.name} 유저`;
        stack.appendChild(div);
    }
}

function ensureSolvedList() {
    let el = document.querySelector('.solved-list');
    if (!el) {
        el = document.createElement('div');
        el.className = 'solved-list';
        const inputEl = document.querySelector('input');
        if (inputEl && inputEl.parentNode) {
            inputEl.parentNode.appendChild(el);
        } else {
            document.body.appendChild(el);
        }
    }
    return el;
}

function renderSolvedList() {
    const el = ensureSolvedList();
    el.innerHTML = '';
    for (let i = 0; i < inputedWords.length; i++) {
        const div = document.createElement('div');
        div.className = 'solved-item';
        div.textContent = inputedWords[i];
        el.appendChild(div);
    }
}

// 
for (let i=0; i<number; i++){
    player[i] = prompt((i+1)+"번째 참여자의 이름을 입력하여 주십시오.");
    if (player[i] === null || player[i].trim() === '' || player[i] === undefined) {
        alert("이름을 정확하게 입력해주십시오.");
        i--;
    }
}
init();
const onInput = function (event) {
    newWord = event.target.value;
};

const onClickButton = () => {
    if (!word || word.at(-1) === newWord[0]) {
        if (newWord.length < 2) {
            alert('두 글자 이상의 단어를 입력해주세요!');
            userOutAndNextUser();
            return;
        }
        if (!inputedWords.includes(newWord)) {
            inputedWords.push(newWord);
            word = newWord;
            wordEl.textContent = word;
            renderSolvedList();
        }
        else {
            alert('이미 입력된 단어입니다!');
            userOutAndNextUser();
            return;
        }
    }
    else {
        alert('틀린 단어입니다!');
        userOutAndNextUser();
        return;
    }

    input.value = '';
    input.focus();
    NextUser();
};

input.addEventListener('input', onInput);
button.addEventListener('click', onClickButton);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        onClickButton();
    }
});