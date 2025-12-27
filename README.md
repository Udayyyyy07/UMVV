<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TicTac Pro+</title>

<style>
*{box-sizing:border-box;font-family:Arial}

body{
  margin:0;
  min-height:100vh;
  background:linear-gradient(135deg,#141e30,#243b55);
  color:white;
  text-align:center;
  overflow:hidden;
}

/* FLOATING X O */
.bg span{
  position:absolute;
  font-size:70px;
  opacity:0.15;
  animation:float 12s linear infinite;
}
@keyframes float{
  from{transform:translateY(110vh) rotate(0deg)}
  to{transform:translateY(-130vh) rotate(360deg)}
}

/* COMMON BOX */
.box{
  width:330px;
  margin:80px auto;
  background:rgba(255,255,255,0.15);
  padding:25px;
  border-radius:18px;
  backdrop-filter:blur(10px);
  animation:pop .6s ease;
}
@keyframes pop{
  from{transform:scale(.6);opacity:0}
  to{transform:scale(1);opacity:1}
}

/* INPUT ANIMATION */
.inputBox{position:relative;margin:18px 0}
.inputBox input{
  width:100%;
  padding:12px;
  background:transparent;
  border:none;
  border-bottom:2px solid white;
  color:white;
  outline:none;
}
.inputBox label{
  position:absolute;
  left:0;
  top:12px;
  transition:.3s;
  opacity:.7;
}
.inputBox input:focus+label,
.inputBox input:not(:placeholder-shown)+label{
  top:-10px;
  font-size:12px;
  color:#00ffcc;
}

button{
  padding:12px 20px;
  border:none;
  border-radius:12px;
  background:#00c6ff;
  cursor:pointer;
  transition:.3s;
}
button:hover{background:#00ffcc;transform:scale(1.05)}
a{color:#00ffcc;cursor:pointer;text-decoration:none}

/* GAME */
#game{display:none}
.board{
  position:relative;
  display:grid;
  grid-template-columns:repeat(3,100px);
  gap:10px;
  justify-content:center;
  margin:20px auto;
}
.cell{
  height:100px;
  background:rgba(255,255,255,0.15);
  font-size:42px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:14px;
  cursor:pointer;
}
.cell:hover{background:rgba(255,255,255,.3)}
.win{background:#00ffcc;color:black}

/* STRIKE */
#line{
  position:absolute;
  background:red;
  border-radius:6px;
}

/* POPUP */
#popup{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.7);
  display:none;
  align-items:center;
  justify-content:center;
}
.popupBox{
  background:white;
  color:black;
  padding:30px;
  border-radius:16px;
}
</style>
</head>

<body>

<!-- BACKGROUND -->
<div class="bg">
  <span style="left:10%">X</span>
  <span style="left:30%;animation-delay:2s">O</span>
  <span style="left:50%;animation-delay:4s">X</span>
  <span style="left:70%;animation-delay:6s">O</span>
</div>

<!-- LOGIN -->
<div id="loginBox" class="box">
  <h2>🎮 Login</h2>
  <div class="inputBox">
    <input id="luser" placeholder=" " oninput="typeSound()">
    <label>Username</label>
  </div>
  <div class="inputBox">
    <input id="lpass" type="password" placeholder=" " oninput="typeSound()">
    <label>Password</label>
  </div>
  <button onclick="login()">Login</button>
  <p><a onclick="showRegister()">Create Account</a></p>
</div>

<!-- REGISTER -->
<div id="registerBox" class="box" style="display:none">
  <h2>❌ ⭕ Register</h2>
  <div class="inputBox">
    <input id="ruser" placeholder=" ">
    <label>Username</label>
  </div>
  <div class="inputBox">
    <input id="rpass" type="password" placeholder=" ">
    <label>Password</label>
  </div>
  <button onclick="register()">Register</button>
  <p><a onclick="showLogin()">Back to Login</a></p>
</div>

<!-- GAME -->
<div id="game">
  <h1>TicTac Pro+</h1>
  <p id="welcome"></p>
  <p id="turn">Player X Turn</p>

  <div class="board" id="board">
    <div id="line"></div>
  </div>

  X Wins: <span id="xScore">0</span> |
  O Wins: <span id="oScore">0</span><br><br>

  <button onclick="logout()">Logout</button>
</div>

<!-- POPUP -->
<div id="popup">
  <div class="popupBox">
    <h2 id="winnerText"></h2>
    <button onclick="nextGame()">Next Game</button>
  </div>
</div>

<!-- SOUNDS -->
<audio id="type" src="sounds/type.mp3"></audio>
<audio id="click" src="sounds/click.mp3"></audio>
<audio id="success" src="sounds/success.mp3"></audio>

<script>
/* USERS */
let users=JSON.parse(localStorage.getItem("users")||"[]");
let currentUser=JSON.parse(localStorage.getItem("currentUser"));

const loginBox=document.getElementById("loginBox");
const registerBox=document.getElementById("registerBox");
const gameBox=document.getElementById("game");

if(currentUser) openGame();

function typeSound(){type.currentTime=0;type.play()}

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
  let u=users.find(x=>x.user===luser.value&&x.pass===lpass.value);
  if(!u) return alert("Invalid Login");
  currentUser=u;
  localStorage.setItem("currentUser",JSON.stringify(u));
  success.play();
  openGame();
}

function logout(){
  localStorage.removeItem("currentUser");
  location.reload();
}

function openGame(){
  loginBox.style.display=registerBox.style.display="none";
  gameBox.style.display="block";
  welcome.innerText="Welcome "+currentUser.user;
  xScore.innerText=currentUser.x;
  oScore.innerText=currentUser.o;
}

/* GAME */
const boardDiv=document.getElementById("board");
let board=Array(9).fill("");
let player="X",gameOver=false;

boardDiv.innerHTML+=[...Array(9)]
.map((_,i)=>`<div class="cell" onclick="play(${i})"></div>`).join("");

const wins=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

function play(i){
  if(board[i]||gameOver)return;
  board[i]=player;
  update();
  if(wins.some(w=>w.every(x=>board[x]===player))){
    gameOver=true;
    if(player==="X")currentUser.x++;else currentUser.o++;
    save();
    winnerText.innerText="🎉 Player "+player+" Wins!";
    popup.style.display="flex";
  }
  player=player==="X"?"O":"X";
  turn.innerText="Player "+player+" Turn";
}

function update(){
  [...document.getElementsByClassName("cell")]
  .forEach((c,i)=>c.innerText=board[i]);
}

function nextGame(){
  popup.style.display="none";
  board.fill("");
  gameOver=false;
  player="X";
  update();
}

function save(){
  users[users.findIndex(u=>u.user===currentUser.user)]=currentUser;
  localStorage.setItem("users",JSON.stringify(users));
  xScore.innerText=currentUser.x;
  oScore.innerText=currentUser.o;
}
</script>

</body>
</html>
