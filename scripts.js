let idEscolhido;
let pontuação = 0;
let arrayIds = [];
let inicio =  localStorage.getItem("ids");


function puxarQuizzes(){
  const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promessa.then((resposta) =>{
    console.log(resposta);
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
  promessa.catch((resposta)=>{consolelog("erro puxarQuizz")});
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
    console.log(resposta);
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

function criarQuizz(){
  const telaInicial = document.querySelector(".telaInicial");
  telaInicial.classList.add("invisivel");
  const tela31 = document.querySelector(".tela31");
  tela31.classList.remove("invisivel");
}
 


 
///////////////////////////////////Tela 31//////////////////////////////////////////

let tituloQuizz = "";
let imagemQuizz = "";
let quantasPerguntas = 0;
let quantosNiveis = 0;

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
            <input class="caixa-imput" id= "imgCorretaPerg${i}" type="url" placeholder="URL da imagem">
            <p class="secoes">Respostas incorretas</p>
            <input class="caixa-imput" id="errada1Perg${i}" type="text" placeholder="Resposta incorreta 1">
            <input class="caixa-imput" id= "imgIncorreta1Perg${i}" type="url" placeholder="URL da imagem 1">
            <div style="height: 20px;"></div>
            <input class="caixa-imput" id="errada2Perg${i}" type="text" placeholder="Resposta incorreta 2">
            <input class="caixa-imput" id= "imgIncorreta2Perg${i}" type="url" placeholder="URL da imagem 2">
            <div style="height: 20px;"></div>
            <input class="caixa-imput" id="errada3Perg${i}" type="text" placeholder="Resposta incorreta 3">
            <input class="caixa-imput" id= "imgIncorreta3Perg${i}" type="url" placeholder="URL da imagem 3">
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

///////////////////////////////////// Tela 32 /////////////////

let textoPerg = [];
let corPerg = [];
let corretaPerg = [];
let imgCorretaPerg=[];
let errada1Perg=[];
let imgIncorreta1Perg=[];
let errada2Perg=[];
let imgIncorreta2Perg=[];
let errada3Perg=[];
let imgIncorreta3Perg=[];

function validaTela32() {
  let quantasPerguntas = document.getElementById("quantasPerguntas").value;

  for (let i = 1; i <= quantasPerguntas; i++) {
    textoPerg[i - 1] = document.getElementById("textoPerg" + i).value;
  }
  let textoPergOk = [];
  for (let j = 0; j < quantasPerguntas; j++) {
    textoPergOk[j] = textoPerg[j].length >= 20;
  }

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

  for (let i = 1; i <= quantasPerguntas; i++) {
    imgCorretaPerg[i - 1] = document.getElementById("imgCorretaPerg" + i).value;
  }

  for (let i = 1; i <= quantasPerguntas; i++) {
    corretaPerg[i - 1] = document.getElementById("corretaPerg" + i).value;
  }
  let corretaPergOk = [];
  for (let j = 0; j < quantasPerguntas; j++) {
    corretaPergOk[j] = corretaPerg[j] != "";
  }

  for (let i = 1; i <= quantasPerguntas; i++) {
    errada1Perg[i - 1] = document.getElementById("errada1Perg" + i).value;
  }
  let errada1PergOk = [];
  for (let j = 0; j < quantasPerguntas; j++) {
    errada1PergOk[j] = errada1Perg[j] != "";
  }
  for (let i = 1; i <= quantasPerguntas; i++) {
    imgIncorreta1Perg[i - 1] = document.getElementById("imgIncorreta1Perg" + i).value;
  }
  for (let i = 1; i <= quantasPerguntas; i++) {
    errada2Perg[i - 1] = document.getElementById("errada2Perg" + i).value;
  }
  for (let i = 1; i <= quantasPerguntas; i++) {
    imgIncorreta2Perg[i - 1] = document.getElementById("imgIncorreta2Perg" + i).value;
  }
  for (let i = 1; i <= quantasPerguntas; i++) {
    errada3Perg[i - 1] = document.getElementById("errada3Perg" + i).value;
  }
  for (let i = 1; i <= quantasPerguntas; i++) {
    imgIncorreta3Perg[i - 1] = document.getElementById("imgIncorreta3Perg" + i).value;
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
            <input class="caixa-imput" id="porcentNivel${i}" type="number" placeholder="% de acerto mínima"/>
            <input class="caixa-imput" id="imgNivel${i}" type="url" placeholder="URL da imagem do nível"/>
            <input class="caixa-imput" id="descNivel${i}" type="url" placeholder="Descrição do nível"/>
          </div>
        </div>
        `;
    }
  }
}


////////////////////////////////////////////////////////////////////////////////////// Tela 33
let tituloNivel = [];
let imgNivel=[];
let descNivel = [];
let porcentNivel = [];

function validaTela33(){

  for (let i = 1; i <= quantosNiveis; i++) {
    tituloNivel[i - 1] = document.getElementById("tituloNivel" + i).value;
  }
  let tituloNivelOk = [];
  for (let j = 0; j < quantosNiveis; j++) {
    tituloNivelOk[j] = tituloNivel[j].length >= 10;
  }
  for (let i = 1; i <= quantosNiveis; i++) {
    imgNivel[i - 1] = document.getElementById("imgNivel" + i).value;
  }


  for (let i = 1; i <= quantosNiveis; i++) {
    porcentNivel[i - 1] = document.getElementById("porcentNivel" + i).value;
  }
  let porcentNivelOk = [];
  for (let j = 0; j < quantosNiveis; j++) {
    porcentNivelOk[j] = (0<=porcentNivel[j])&&(porcentNivel[j]<=100);
  }


  for (let i = 1; i <= quantosNiveis; i++) {
    descNivel[i - 1] = document.getElementById("descNivel" + i).value;
  }
  let descNivelOk = [];
  for (let j = 0; j < quantosNiveis; j++) {
    descNivelOk[j] = descNivel[j].length >= 30;
  }

  if (tituloNivelOk.includes(false)||porcentNivelOk.includes(false)||descNivelOk.includes(false)||!porcentNivel.includes("0")){alert("Preencha os dados corretamente");}
  else{
          const divInformacoes3 = document.querySelector(".quizz-criado");
      divInformacoes3.innerHTML =

        `
        <div class="imagem">
          <img src="${imagemQuizz}"/>
          <div class="legenda"><p>${tituloQuizz}</p></div>
        </div>
        `;
    const elemento1 = document.querySelector(".tela33");
    const elemento2 = document.querySelector(".tela34");
    elemento1.classList.add("invisivel");
    elemento2.classList.remove("invisivel");
    enviarParaServidor();
  }
}

function enviarParaServidor(){
  let questions=[];
  for(let i=0;i<quantasPerguntas;i++){
    questions[i]=
      {
        title: textoPerg[i],
        color: corPerg[i],
        answers: [
          {
            text: corretaPerg[i],
            image: imgCorretaPerg[i],
            isCorrectAnswer: true
          },
          {
            text: errada1Perg[i],
            image:  imgIncorreta1Perg[i],
            isCorrectAnswer: false
          },
          {
            text:errada2Perg[i],
            image:imgIncorreta2Perg[i],
            isCorrectAnswer: false
          },
          {
            text:errada3Perg[i],
            image:imgIncorreta3Perg[i],
            isCorrectAnswer: false
          }
        ]
      }
  }

  let levels=[];
  for(let i=0;i<quantosNiveis;i++){
    levels[i]=
    {
      title: tituloNivel[i],
      image: imgNivel[i],
      text: descNivel[i],
      minValue: porcentNivel[i]
    }
  }

  const dados = {
    title: tituloQuizz,
    image: imagemQuizz,
    questions: questions,
    levels: levels
  };
  const requisicao = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', dados);
  
  requisicao.then((resposta)=>{
    let stringIds;
    console.log("Id é:" + resposta.data.id);
    arrayIds.push(resposta.data.id);

    stringIds = JSON.stringify(arrayIds);
    localStorage.setItem("ids",stringIds);

    const arraysArmazendos = localStorage.getItem("ids");
    arrayIds =  JSON.parse(arraysArmazendos);
    console.log(arrayIds);
    pegarMeusQuizzes();
  });

  requisicao.catch((resposta)=>{
    console.log("resposta do erro do post:");
    console.log(resposta);
  });
}

function pegarMeusQuizzes(){
  document.querySelector(".meusQuizz .vazio").classList.add("invisivel");
  const meuQuizz = document.querySelector(".meusQuizz .quizzProprio");
  meuQuizz.classList.remove("invisivel");
  // for(let i=0; i<arrayIds.length; i++){
  //   const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${arrayIds[i]}`);
  //   promessa.then((resposta)=>{
  //     document.querySelector(".meusQuizz .quizzProprio .quizzes").innerHTML += ` 
  //     <article class="quizz" onclick="escolherQuizz(this)">
  //     <img src=${resposta.data[i].image}>
  //     <p>${resposta.data[i].title}</p>
  //     <div class="gradiente"></div>
  //     <div class="id invisivel">${resposta.data[i].id}</div>
  //     </article>`;
  //   });
  // }
}

////////////////////////////////////////////////////////////////////////////////////// Tela 34


function voltarDa34(){
  const jogando = document.querySelector(".tela34");
  jogando.classList.add("invisivel");
  const inicio = document.querySelector(".telaInicial");
  inicio.classList.remove("invisivel");
}

