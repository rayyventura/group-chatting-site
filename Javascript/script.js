let nameUser = prompt("Qual o seu nome?")

const userName ={
    name:nameUser
}
function logarUsuario(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',userName);
    promessa.then(tratarSucessoLogin);
    promessa.catch(tratarErroLogin);
}
logarUsuario();

function tratarSucessoLogin(resposta){
   const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
   promessa.then(tratarSucessoMensagem);
   promessa.catch(tratarErroMensagem);
}
function tratarErroLogin(resposta){
nameUser = prompt('Digite outro nome, pois esse já está em uso!');
console.log(resposta.data.response);
logarUsuario();
}

let containerMensagem = document.querySelector('.conteudo');
function tratarSucessoMensagem(resposta){
    containerMensagem.innerHTML='';
for(let i=0;resposta.data.length; i++){
    const tipoMensagem=resposta.data[i].type;
    if(tipoMensagem==='message'){
        containerMensagem.innerHTML +=` <div class="${resposta.data[i].type}"><span class="time">(${resposta.data[i].time})</span>  <span class="origin">${resposta.data[i].from}</span>  <span class='para'>para</span> <span class='destine'>${resposta.data[i].to}: </span> <span class="texto">${resposta.data[i].text}</span></div>`
    }else if(tipoMensagem==='status'){
        containerMensagem.innerHTML +=` <div class="${resposta.data[i].type}"><span class="time">(${resposta.data[i].time})</span>  <span class="origin">${resposta.data[i].from}</span>  ${resposta.data[i].text}</div>`
    }else if(tipoMensagem==='private_message'){
        containerMensagem.innerHTML +=` <div class="${resposta.data[i].type}"><span class="time">(${resposta.data[i].time})</span>  <span class="origin">${resposta.data[i].from}</span>  <span class='para'>reservadamente para</span> <span class='destine'>${resposta.data[i].to}: </span> <span class="texto">${resposta.data[i].text}</div>`
    }
    const lastMessage=containerMensagem.lastElementChild;
    lastMessage.scrollIntoView({behavior:"smooth"});
}
}

function tratarErroMensagem(resposta){
console.log(resposta.data);
}
setInterval(tratarSucessoLogin,3000);