let idEscolhido;

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
}

function escolherQuizz(sele){
  const telaInicial = document.querySelector(".telaInicial");
  const jogandoQuiz = document.querySelector(".jogandoQuizz");
  telaInicial.classList.add("invisivel");
  jogandoQuiz.classList.remove("invisivel");
  idEscolhido = sele.querySelector(".id").innerHTML;
  console.log("idEscolhido: "+ idEscolhido);
  pegarQuizzEscolhido();
}

function pegarQuizzEscolhido(){
  const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idEscolhido}`);
  promessa.then((reposta) =>{
    console.log(reposta);
  });
}

puxarQuizzes();
 
////////////////////////////////////////////////////////////////////////////////////// Tela 31

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
  let quantasPerguntas = document.getElementById("quantasPerguntas").value;

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
