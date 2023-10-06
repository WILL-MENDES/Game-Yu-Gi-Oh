//Estado com todos objetos utilizado
const state ={
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox: document.getElementById("scoore_points"),
         
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides : {
        player1: "player-cards",
        computer: "computer-cards",
        player1BOX: document.querySelector("#player-cards"),
        computerBOX: document.querySelector("#computer-cards")
    },
    actions:{
        button: document.getElementById("next-duel"),
    }

};
//player e Computer
const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};
//Cartas e todas as suas informações 
const cardData = [
    {
        id: 0,
        name: "Dragão Branco de Olhos Azuis",
        type: "papel",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Mago Negro",
        type: "pedra",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "tesoura",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseOf: [1],
    },

];
//Gera um valor aleatório utilizando o ID das cartas
async function getRamdomCardId(){
    //Pega um valor random e multiplica pela posição das cartas depois converte o valor 
    const ramdomIndex = Math.floor(Math.random() * cardData.length);
    //retorna o valor gerado para escolher o id da carta
    return cardData[ramdomIndex].id;
};
//Cria as cartas de seleção
async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");


    if(fieldSide === playerSides.player1){
        //Exibe toda estrutura da carta quando o mouse estiver em cima
        cardImage.addEventListener("mouseover", () => { drawSelectCard(IdCard);})
        //Põem a carta em campo ao clicar
        cardImage.addEventListener("click", () => {setCardsField(cardImage.getAttribute("data-id"));})
    }
    

    return cardImage;
};
//exibe as cartas no campo de batalha
async function setCardsField(cardId){
    //remove todas as cartas após a escolha da carta ser feita
    await removeAllCardsImages();
   //sorteia uma carta aleatória pro computador 
    let computerCardId = await getRamdomCardId();
   //deixa as cartas com display preso
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
   //coloca as imagens das cartas no campo
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
    // compara o valor do id das cartas para dar o resultado do duelo
   let duelResults = await checkDuelResults(cardId, computerCardId);
    //Pontua os pontos do player e Computer
   await upDateScore();
   //exibe o botão após a escolha dos cards, ao ser clicado reseta os cards
    await drawButton(duelResults);
};
 //Pontua os pontos do player e Computer
async function upDateScore(){
  state.score.scoreBox.innerText = `Vitoria: ${state.score.playerScore} | Perdeu: ${state.score.computerScore}`;
};
//exibe o botão e adiciona um texto de acordo com o paramento que pode ser ganhou,perdeu ou empate
async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
};
//Confere qual carta venceu e adiciona +1 na pontuação dependedo do resultado
async function checkDuelResults(playerCardId, computerCardId){
    //valor padrão
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou";
        await playAudio(duelResults);
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        await playAudio(duelResults);
        state.score.computerScore++;
    }
    //retorna um desses valores " ganhou,perdeu ou empate"
    return duelResults;
};
//remove todas as cartas 
async function removeAllCardsImages(){
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
        
    };
//Cria toda estrutura da carta
async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atributo: " + cardData[index].type
    };
//distribui 5 cartas pra cada jogador
async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0;i < cardNumbers; i++){
        const ramdomIdCard = await getRamdomCardId();
        const cardImage = await createCardImage(ramdomIdCard, fieldSide);

        console.log(fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage);
    }
};
//Reseta o duelo
async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
};
//Adiciona o audio de vitoria ou derrota
async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play();
};
//inicia o game
function init(){
state.fieldCards.player.style.display ="none";
state.fieldCards.computer.style.display ="none";

    drawCards(5,playerSides.player1);
    drawCards(5,playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
};

init();