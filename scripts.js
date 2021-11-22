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

function verificarResposta(sele){
  const respostas = sele.parentElement.querySelectorAll(".resposta");
  const resposta = sele.parentElement.querySelector(".resposta");
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

  const perguntaAtual = document.querySelector(".pergunta.nãoRespondida");
  perguntaAtual.classList.remove("nãoRespondida");
  perguntaAtual.classList.add("Respondida");
  const proximaPergunta = document.querySelector(".pergunta.nãoRespondida");
  //const respondido = document.querySelector(".pergunta.Respondida");
  //console.log(respondido);
  setTimeout(() => {
    if(proximaPergunta != null){
      proximaPergunta.scrollIntoView({block: "center"});
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
  levels.scrollIntoView({block: "center"});
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

function criarQuizz(){
  const telaInicial = document.querySelector(".telaInicial");
  telaInicial.classList.add("invisivel");
  const tela31 = document.querySelector(".tela31");
  tela31.classList.remove("invisivel");
}

let ultimaMensagem;
let nomeDeUsuario;

function scrollarAteUltimaMensagem() {
    const ulMensagens = document.querySelector(".mensagens-container");
    const liUltimaMensagem = ulMensagens.lastElementChild;
    if (ultimaMensagem !== liUltimaMensagem) {
        liUltimaMensagem.scrollIntoView();
        ultimaMensagem = liUltimaMensagem;
    }
}

function Mensagem(dados) {
    let classeMensagem = '';
    let destinatario = '';
    if (dados.type === 'status') {
        classeMensagem = 'entrada-saida';
    }
    if (dados.type === 'private_message') {
        if (dados.to !== nomeDeUsuario &&
            dados.to !== "Todos" &&
            dados.from !== nomeDeUsuario) {
            return "";
        }
        classeMensagem = 'conversa-privada';
        destinatario = `<span> para </span>
        <strong>${dados.to}: </strong>`;
    }
    if (dados.type === 'message') {
        classeMensagem = 'conversa-publica';
        destinatario = `<span> para </span>
        <strong>${dados.to}: </strong>`;
    }
    return `
        <li class="${classeMensagem}" data-identifier="message">
            <span class="horario">(${dados.time})</span>
            <strong>${dados.from}</strong>
            ${destinatario}
            <span>${dados.text}</span>
        </li>
    `;
}

function carregarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then((resposta) => {
        const mensagens = resposta.data;
        const ulMensagens = document.querySelector(".mensagens-container");
        ulMensagens.innerHTML = '';
        for (let i = 0; i < mensagens.length; i++) {
            ulMensagens.innerHTML += Mensagem(mensagens[i]);
        }
        scrollarAteUltimaMensagem();
    });
}

function perguntarNome() {
    nomeDeUsuario = prompt("Qual seu lindo nome?");
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {
        name: nomeDeUsuario
    });
    promessa.then(() => {
        setInterval(() => {
            axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {
                name: nomeDeUsuario
            });
        }, 4800);
    });
    promessa.catch(() => {
        alert("Nome indisponivel");
        perguntarNome();
    });
}

function iniciarApp() {
    carregarMensagens();
    setInterval(carregarMensagens, 3000);
    perguntarNome();
    const inputMensagem = document.querySelector('.input-mensagem');
    inputMensagem.onkeydown = (e) => {
        if (e.code === 'Enter') {
            enviarMensagem();
        }
    };
}

function enviarMensagem() {
    const inputMensagem = document.querySelector('.input-mensagem');
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
        from: nomeDeUsuario,
        to: "Todos",
        text: inputMensagem.value,
        type: "message"
    });
    inputMensagem.value = '';
    promessa.then(carregarMensagens);
    promessa.catch(() => {
        window.location.reload();
    });
}

function toggleMenu() {
    const menu = document.querySelector('.menu');
    const menuFundo = document.querySelector('.menu-fundo');
    menu.classList.toggle("escondido");
    menuFundo.classList.toggle("fundo-escondido");
}

iniciarApp();








