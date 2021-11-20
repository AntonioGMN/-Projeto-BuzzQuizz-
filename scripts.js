let idEscolhido;

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
      console.log(n)
      perguntas.innerHTML += `
      <section class="pergunta">
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
  });
}

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
}

function numeroAleatorio(){

}








