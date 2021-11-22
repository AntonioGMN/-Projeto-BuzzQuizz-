let idEscolhido;
let pontuação = 0;

function puxarQuizzes(){
  const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promessa.then((resposta) =>{
    for(let i=0; i< resposta.data.length; i++){
      const quizzes = document.querySelector(".todosQuizzes .quizzes");
      quizzes.innerHTML += `
      <article class="quizz" onclick="escolherQuizz(this)">
      <img src=${resposta.data[i].image}>
      <p>${resposta.data[i].title}</p>
      <div class="gradiente"></div>
      <div class="id invisivel">${resposta.data[i].id}</div>
      </article>`;
    }
  });
}

puxarQuizzes();

function escolherQuizz(sele){
  const telaInicial = document.querySelector(".telaInicial");
  const jogandoQuiz = document.querySelector(".jogandoQuizz");
  telaInicial.classList.add("invisivel");
  jogandoQuiz.classList.remove("invisivel");
  idEscolhido = sele.querySelector(".id").innerHTML;
  pegarQuizzEscolhido();
}

function pegarQuizzEscolhido(){
  const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idEscolhido}`);
  promessa.then((resposta) =>{
    const dados = resposta.data;
  
    const perguntas = document.querySelector(".jogandoQuizz .perguntas");
    const header = document.querySelector(".jogandoQuizz header")

    header.innerHTML = `
      <img src="${dados.image}">
      <p>"${dados.title}"</p>
      <div class="gradiente"><div>
    `;
    
    for(let i=0; i<dados.questions.length; i++){
      let n = [];
      let num = Math.floor(Math.random() * 4);
      n.push(num);  
      for(let i=0; i< dados.questions[0].answers.length - 1; i++){
        do{
          num = Math.floor(Math.random() * 4);
        }while(n.includes(num));
        n.push(num);
      }
    
      perguntas.innerHTML += `
      <section class="pergunta nãoRespondida">
        <h1 style="background:${dados.questions[i].color};" >${dados.questions[i].title}</h1>
        <section class="respostas">
          <article class="resposta" onclick="verificarResposta(this)">
            <img src=${dados.questions[i].answers[n[0]].image}>
            <p>${dados.questions[i].answers[n[0]].text}</p>
            <div class="invisivel">${dados.questions[i].answers[n[0]].isCorrectAnswer}</div>
          </article>
          <article class="resposta" onclick="verificarResposta(this)">
            <img src=${dados.questions[i].answers[n[1]].image}>
            <p>${dados.questions[i].answers[n[1]].text}</p>
            <div class="invisivel">${dados.questions[i].answers[n[1]].isCorrectAnswer}</div>
          </article>
          <article class="resposta" onclick="verificarResposta(this)">
            <img src=${dados.questions[i].answers[n[2]].image}>
            <p>${dados.questions[i].answers[n[2]].text}</p>
            <div class="invisivel">${dados.questions[i].answers[n[2]].isCorrectAnswer}</div>
          </article>
          <article class="resposta" onclick="verificarResposta(this)">
            <img src=${dados.questions[i].answers[n[3]].image}>
            <p>${dados.questions[i].answers[n[3]].text}</p>
            <div class="invisivel">${dados.questions[i].answers[n[3]].isCorrectAnswer}</div>
          </article>
        </section>
      </section>`
    }

    const levels = document.querySelector(".jogandoQuizz .levels");
    for(let i=0; i<dados.levels.length;i++){
      if(pontuação >= dados.levels[i].minValue){
        levels.innerHTML = `
          <header>${dados.levels[i].title}</header>
          <div>
              <img src="${dados.levels[i].image}">;
              <p>${dados.levels[i].text}</p>
          </div>`
      }
    }
  });
}


puxarQuizzes();

function verificarResposta(sele){
  const respostas = sele.parentElement.querySelectorAll(".resposta");
  for(let i=0; i<4; i++){
    if(respostas[i].querySelector(".invisivel").innerHTML == "false"){
      respostas[i].classList.add("erro");
    }else{
      respostas[i].classList.add("acerto");
    }
    if(respostas[i] != sele){
      respostas[i].classList.add("coberta");
    }
  }

  const perguntas = document.querySelectorAll(".pergunta");
  if(sele.querySelector("div").innerHTML == "true"){
    pontuação += (100/perguntas.length);
  }

  const proximaPergunta = document.querySelector(".pergunta.nãoRespondida");
  proximaPergunta.classList.remove("nãoRespondida");
  proximaPergunta.classList.add("Respondida");
  setTimeout(() => {
    const proximaPergunta = document.querySelector(".pergunta.nãoRespondida");
    if(proximaPergunta != null){
      proximaPergunta.scrollIntoView();
    }else{
      carregarPontuação();
    }
  },2000);

}

function carregarPontuação(){
  const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idEscolhido}`);
  const levels = document.querySelector(".jogandoQuizz .levels");
  promessa.then((resposta) =>{
    const dados = resposta.data;
    for(let i=0; i<dados.levels.length;i++){
      if(pontuação >= dados.levels[i].minValue){
        levels.innerHTML = `
          <header>${pontuação.toFixed(0)}% de acertos: ${dados.levels[i].title}</header>
          <div>
              <img src="${dados.levels[i].image}">
              <p>${dados.levels[i].text}</p>
          </div>`
      }
    }
  });
  levels.parentElement.classList.remove("invisivel");
  levels.scrollIntoView();
}

function reiniciar(){
  const respondidos = document.querySelectorAll(".jogandoQuizz .perguntas .Respondida");
  const erros = document.querySelectorAll(".jogandoQuizz .perguntas .erro");
  const coberto = document.querySelectorAll(".jogandoQuizz .perguntas .coberta");
  const acerto = document.querySelectorAll(".jogandoQuizz .perguntas .acerto");
  const header = document.querySelector(".jogandoQuizz header");
  const quadro = document.querySelector(".jogandoQuizz .quadro");
  for(let i=0; i< erros.length; i++){
    erros[i].classList.remove("erro");
  }
  for(let i=0; i< coberto.length; i++){
    coberto[i].classList.remove("coberta");
  }
  for(let i=0; i< acerto.length; i++){
    acerto[i].classList.remove("acerto");
  }
  for(let i=0; i< respondidos.length; i++){
    respondidos[i].classList.remove("Respondida");
    respondidos[i].classList.add("nãoRespondida");
  }
  header.scrollIntoView();
  quadro.classList.add("invisivel");
}

function voltar(){
  const jogando = document.querySelector(".jogandoQuizz");
  jogando.classList.add("invisivel");
  const inicio = document.querySelector(".telaInicial");
  inicio.classList.remove("invisivel");
}

// let ultimaMensagem;
// let nomeDeUsuario;

// function scrollarAteUltimaMensagem() {
//     const ulMensagens = document.querySelector(".mensagens-container");
//     const liUltimaMensagem = ulMensagens.lastElementChild;

//     if (ultimaMensagem !== liUltimaMensagem) {
//         liUltimaMensagem.scrollIntoView();
//         ultimaMensagem = liUltimaMensagem;
//     }
// }

// function Mensagem(dados) {
//     let classeMensagem = '';
//     let destinatario = '';

//     if (dados.type === 'status') {
//         classeMensagem = 'entrada-saida';
//     }

//     if (dados.type === 'private_message') {
//         if (dados.to !== nomeDeUsuario &&
//             dados.to !== "Todos" &&
//             dados.from !== nomeDeUsuario) {
//             return "";
//         }

//         classeMensagem = 'conversa-privada';
//         destinatario = `<span> para </span>
//         <strong>${dados.to}: </strong>`;
//     }

//     if (dados.type === 'message') {
//         classeMensagem = 'conversa-publica';
//         destinatario = `<span> para </span>
//         <strong>${dados.to}: </strong>`;
//     }

//     return `
//         <li class="${classeMensagem}" data-identifier="message">
//             <span class="horario">(${dados.time})</span>
//             <strong>${dados.from}</strong>
//             ${destinatario}
//             <span>${dados.text}</span>
//         </li>
//     `;
// }

// function carregarMensagens() {
//     const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

//     promessa.then((resposta) => {
//         const mensagens = resposta.data;

//         const ulMensagens = document.querySelector(".mensagens-container");
//         ulMensagens.innerHTML = '';

//         for (let i = 0; i < mensagens.length; i++) {
//             ulMensagens.innerHTML += Mensagem(mensagens[i]);
//         }

//         scrollarAteUltimaMensagem();
//     });
// }

// function perguntarNome() {
//     nomeDeUsuario = prompt("Qual seu lindo nome?");

//     const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {
//         name: nomeDeUsuario
//     });

//     promessa.then(() => {
//         setInterval(() => {
//             axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {
//                 name: nomeDeUsuario
//             });
//         }, 4800);
//     });

//     promessa.catch(() => {
//         alert("Nome indisponivel");
//         perguntarNome();
//     });
// }

// function iniciarApp() {
//     carregarMensagens();
//     setInterval(carregarMensagens, 3000);

//     perguntarNome();

//     const inputMensagem = document.querySelector('.input-mensagem');
//     inputMensagem.onkeydown = (e) => {
//         if (e.code === 'Enter') {
//             enviarMensagem();
//         }
//     };
// }

// function enviarMensagem() {
//     const inputMensagem = document.querySelector('.input-mensagem');

//     const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
//         from: nomeDeUsuario,
//         to: "Todos",
//         text: inputMensagem.value,
//         type: "message"
//     });

//     inputMensagem.value = '';

//     promessa.then(carregarMensagens);

//     promessa.catch(() => {
//         window.location.reload();
//     });
// }

// function toggleMenu() {
//     const menu = document.querySelector('.menu');
//     const menuFundo = document.querySelector('.menu-fundo');

//     menu.classList.toggle("escondido");
//     menuFundo.classList.toggle("fundo-escondido");
// }

// iniciarApp();

let tituloQuizz = "";
let imagemQuizz = "";
let quantasPerguntas = 0;
let quantosNiveis = 0;

////////////////////////////////////////////////////////////////////////////////////// Tela 31

function validaTela31() {
  tituloQuizz = document.getElementById("tituloQuizz").value;
  imagemQuizz = document.getElementById("imagemQuizz").value;
  quantasPerguntas = document.getElementById("quantasPerguntas").value;
  quantosNiveis = document.getElementById("quantosNiveis").value;

  let tituloOk = 20 <= tituloQuizz.length && tituloQuizz.length <= 65;
  let perguntasOk = quantasPerguntas >= 3;
  let niveisOk = quantosNiveis >= 2;

  if (tituloOk && perguntasOk && niveisOk) {
    const elemento1 = document.querySelector(".tela31");
    const elemento2 = document.querySelector(".tela32");
    elemento1.classList.add("invisivel");
    elemento2.classList.remove("invisivel");

    for (let i = 2; i <= quantasPerguntas; i++) {
      const divInformacoes1 = document.querySelector(".perguntas-criar");
      divInformacoes1.innerHTML =
        divInformacoes1.innerHTML +
        `
    <div class="informacoes">
        <p class="secoes">Pergunta ${i}</p>
        <ion-icon name="create-outline" onclick="expandir('.inputs-pergunta${i}')"></ion-icon>
        <div class="inputs-pergunta inputs-pergunta${i} invisivel">
            <input class="caixa-imput" id="textoPerg${i}" type="text" placeholder="Texto da pergunta">
            <input class="caixa-imput" id="corPerg${i}" type="text" placeholder="Cor de fundo da pergunta">
            <p class="secoes">Resposta correta</p>
            <input class="caixa-imput" id="corretaPerg${i}" type="text" placeholder="Resposta correta">
            <input class="caixa-imput" type="url" placeholder="URL da imagem">
            <p class="secoes">Respostas incorretas</p>
            <input class="caixa-imput" id="errada1Perg${i}" type="text" placeholder="Resposta incorreta 1">
            <input class="caixa-imput" type="url" placeholder="URL da imagem 1">
            <div style="height: 20px;"></div>
            <input class="caixa-imput" id="errada2Perg${i}" type="text" placeholder="Resposta incorreta 2">
            <input class="caixa-imput" type="url" placeholder="URL da imagem 2">
            <div style="height: 20px;"></div>
            <input class="caixa-imput" id="errada3Perg${i}" type="text" placeholder="Resposta incorreta 3">
            <input class="caixa-imput" type="url" placeholder="URL da imagem 3">
        </div>
    </div>
    `;
    }
  }
  else {alert("Preencha os dados corretamente");}
}

function expandir(classeImput) {
  const elemento2 = document.querySelector(classeImput);
  elemento2.classList.toggle("invisivel");
}

////////////////////////////////////////////////////////////////////////////////////// Tela 32

function validaTela32() {
  let textoPerg = [];
  for (let i = 1; i <= quantasPerguntas; i++) {
    textoPerg[i - 1] = document.getElementById("textoPerg" + i).value;
  }
  let textoPergOk = [];
  for (let j = 0; j < quantasPerguntas; j++) {
    textoPergOk[j] = textoPerg[j].length >= 20;
  }

  let corPerg = [];
  for (let i = 1; i <= quantasPerguntas; i++) {
    corPerg[i - 1] = document.getElementById("corPerg" + i).value;
  }
  let corPergOk = [];
  for (let j = 0; j < quantasPerguntas; j++) {
    corPergOk[j] =
      corPerg[j].length == 7 &&
      corPerg[j].includes("#") &&
      !corPerg[j].includes("g") &&
      !corPerg[j].includes("h") &&
      !corPerg[j].includes("i") &&
      !corPerg[j].includes("j") &&
      !corPerg[j].includes("k") &&
      !corPerg[j].includes("l") &&
      !corPerg[j].includes("m") &&
      !corPerg[j].includes("n") &&
      !corPerg[j].includes("o") &&
      !corPerg[j].includes("p") &&
      !corPerg[j].includes("q") &&
      !corPerg[j].includes("r") &&
      !corPerg[j].includes("s") &&
      !corPerg[j].includes("t") &&
      !corPerg[j].includes("u") &&
      !corPerg[j].includes("v") &&
      !corPerg[j].includes("w") &&
      !corPerg[j].includes("x") &&
      !corPerg[j].includes("y") &&
      !corPerg[j].includes("z");
  }

  let corretaPerg = [];
  for (let i = 1; i <= quantasPerguntas; i++) {
    corretaPerg[i - 1] = document.getElementById("corretaPerg" + i).value;
  }
  let corretaPergOk = [];
  for (let j = 0; j < quantasPerguntas; j++) {
    corretaPergOk[j] = corretaPerg[j] != "";
  }

  let errada1Perg = [];
  for (let i = 1; i <= quantasPerguntas; i++) {
    errada1Perg[i - 1] = document.getElementById("errada1Perg" + i).value;
  }
  let errada1PergOk = [];
  for (let j = 0; j < quantasPerguntas; j++) {
    errada1PergOk[j] = errada1Perg[j] != "";
  }

  if (
    textoPergOk.includes(false) ||
    corPergOk.includes(false) ||
    corretaPergOk.includes(false) ||
    errada1PergOk.includes(false)
  ) {
    alert("Preencha os dados corretamente");
  } else {
    const elemento1 = document.querySelector(".tela32");
    const elemento2 = document.querySelector(".tela33");
    elemento1.classList.add("invisivel");
    elemento2.classList.remove("invisivel");

    for (let i = 2; i <= quantosNiveis; i++) {
      const divInformacoes2 = document.querySelector(".niveis-criar");
      divInformacoes2.innerHTML =
        divInformacoes2.innerHTML +
        `
        <div class="informacoes">
          <p class="secoes">Nível ${i}</p>
          <ion-icon name="create-outline" onclick="expandir('.inputs-nivel${i}')"></ion-icon>
          <div class="inputs-nivel inputs-nivel${i} invisivel">
            <input class="caixa-imput" id="tituloNivel${i}" type="text" placeholder="Título do nível"/>
            <input class="caixa-imput" id="porcentNivel${i}" type="text" placeholder="% de acerto mínima"/>
            <input class="caixa-imput" type="url" placeholder="URL da imagem do nível"/>
            <input class="caixa-imput" type="url" placeholder="Descrição do nível"/>
          </div>
        </div>
        `;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////// Tela 32

function validaTela33(){
  let tituloNivel = [];
  for (let i = 1; i <= quantosNiveis; i++) {
    tituloNivel[i - 1] = document.getElementById("tituloNivel" + i).value;
  }
  let tituloNivelOk = [];
  for (let j = 0; j < quantosNiveis; j++) {
    tituloNivelOk[j] = tituloNivel[j].length >= 10;
  }
  if (tituloNivelOk.includes(false)){alert("Preencha os dados corretamente");}
}