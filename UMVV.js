/* USERS */
let users = JSON.parse(localStorage.getItem("users") || "[]");
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const gameBox = document.getElementById("game");

if (currentUser) openGame();

function typeSound(){ type.currentTime = 0; type.play(); }

function showRegister(){
  loginBox.style.display="none";
  registerBox.style.display="block";
}
function showLogin(){
  registerBox.style.display="none";
  loginBox.style.display="block";
}

function register(){
  if(users.find(u=>u.user===ruser.value)) return alert("User exists");
  users.push({user:ruser.value,pass:rpass.value,x:0,o:0});
  localStorage.setItem("users",JSON.stringify(users));
  success.play();
  showLogin();
}

function login(){
  click.play();
  let u = users.find(x=>x.user===luser.value && x.pass===lpass.value);
  if(!u) return alert("Invalid Login");
  currentUser = u;
  localStorage.setItem("currentUser",JSON.stringify(u));
  success.play();
  openGame();
}

function logout(){
  localStorage.removeItem("currentUser");
  location.reload();
}

function openGame(){
  loginBox.style.display = registerBox.style.display = "none";
  gameBox.style.display = "block";
  welcome.innerText = "Welcome " + currentUser.user;
  xScore.innerText = currentUser.x;
  oScore.innerText = currentUser.o;
}

/* GAME LOGIC */
const boardDiv = document.getElementById("board");
let board = Array(9).fill("");
let player = "X", gameOver = false;

boardDiv.innerHTML += [...Array(9)]
  .map((_,i)=>`<div class="cell" onclick="play(${i})"></div>`)
  .join("");

const wins=[
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function play(i){
  if(board[i] || gameOver) return;
  board[i] = player;
  update();

  if(wins.some(w=>w.every(x=>board[x]===player))){
    gameOver = true;
    player === "X" ? currentUser.x++ : currentUser.o++;
    save();
    winnerText.innerText = "🎉 Player " + player + " Wins!";
    popup.style.display="flex";
    return;
  }

  player = player==="X" ? "O" : "X";
  turn.innerText = "Player " + player + " Turn";
}

function update(){
  [...document.getElementsByClassName("cell")]
    .forEach((c,i)=>c.innerText = board[i]);
}

function nextGame(){
  popup.style.display="none";
  board.fill("");
  gameOver=false;
  player="X";
  turn.innerText="Player X Turn";
  update();
}

function save(){
  users[users.findIndex(u=>u.user===currentUser.user)] = currentUser;
  localStorage.setItem("users",JSON.stringify(users));
  xScore.innerText=currentUser.x;
  oScore.innerText=currentUser.o;
}