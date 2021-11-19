let idEscolhido;

function puxarQuizzes(){
  const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promessa.then((resposta) =>{
    //console.log(resposta);
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
  console.log("idEscolhido: "+ idEscolhido);
  pegarQuizzEscolhido();
}

function pegarQuizzEscolhido(){
  const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idEscolhido}`);
  promessa.then((resposta) =>{
    const dados = resposta.data;
    console.log(dados);
  
    const perguntas = document.querySelector(".jogandoQuizz .perguntas");
    const header = document.querySelector(".jogandoQuizz header")

    header.innerHTML = `
      <img src="${dados.image}">
      <p>"${dados.title}"</p>
      <div class="gradiente"><div>
    `;
    
    
    for(let i=0; i<dados.questions.length; i++){
      let n = [];
      for(let i=0; i< dados.questions[0].answers.length; i++){
        n.push(i);
      }
      console.log(n);
      perguntas.innerHTML += `
      <section class="pergunta">
        <h1 style="background:${dados.questions[i].color};" >${dados.questions[i].title}</h1>
        <section class="respostas">
          <article class="resposta" onclick="verificarResposta()">
            <img src=${dados.questions[i].answers[0].image}>
            <p>${dados.questions[i].answers[0].text}</p>
            <div class="invisivel">${dados.questions[i].answers[0].isCorrectAnswer}<div>
          </article>
          <article class="resposta" onclick="verificarResposta()">
            <img src=${dados.questions[i].answers[1].image}>
            <p>${dados.questions[i].answers[1].text}</p>
            <div class="invisivel">${dados.questions[i].answers[1].isCorrectAnswer}<div>
          </article>
          <article class="resposta" onclick="verificarResposta()">
            <img src=${dados.questions[i].answers[2].image}>
            <p>${dados.questions[i].answers[2].text}</p>
            <div class="invisivel">${dados.questions[i].answers[2].isCorrectAnswer}<div>
          </article>
          <article class="resposta" onclick="verificarResposta()">
            <img src=${dados.questions[i].answers[3].image}>
            <p>${dados.questions[i].answers[3].text}</p>
            div class="invisivel">${dados.questions[i].answers[3].isCorrectAnswer}<div>
          </article>
        </section>
      </section>`
    }
  });
}

function verificarResposta(){
  const respostas = document.querySelectorAll(".resposta");
  console.log(respostas.length);
  console.log("toto")
}








