const containerMensagem = document.querySelector('.conteudo');
let nameUser = prompt("Qual o seu nome?")
let enviarPara='Todos';
let visibilidade='message';

document.querySelector('footer input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      enviarMensagem();
    }
});

setInterval(tratarSucessoLogin,3000);
setInterval(atualizarStatus,5000);
setInterval(verificarParticipantes,10000);

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

function tratarSucessoMensagem(resposta){
    containerMensagem.innerHTML='';
    const tamanhoArray = resposta.data.length;
    for(let i=0;i<tamanhoArray; i++){
        const tipoMensagem=resposta.data[i].type;
        if(tipoMensagem==='message'){
            containerMensagem.innerHTML +=` <div class="${resposta.data[i].type}" data-identifier="message"><span class="time">(${resposta.data[i].time})</span>  <span class="origin">${resposta.data[i].from}</span>  <span class='para'>para</span> <span class='destine'>${resposta.data[i].to}: </span> <span class="texto">${resposta.data[i].text}</span></div>`
        }else if(tipoMensagem==='status'){
            containerMensagem.innerHTML +=` <div class="${resposta.data[i].type}"><span class="time">(${resposta.data[i].time})</span>  <span class="origin">${resposta.data[i].from}</span>  ${resposta.data[i].text}</div>`
        }else if(resposta.data[i].from===nameUser || resposta.data[i].to == enviarPara || resposta.data[i].to ==='Todos'){
            containerMensagem.innerHTML +=` <div class="${resposta.data[i].type}" data-identifier="message"><span class="time">(${resposta.data[i].time})</span>  <span class="origin">${resposta.data[i].from}</span>  <span class='para'>reservadamente para</span> <span class='destine'>${resposta.data[i].to}: </span> <span class="texto">${resposta.data[i].text}</div>`
    }
     const lastMessage=containerMensagem.lastChild;
     lastMessage.scrollIntoView({behavior:"smooth"});
    
}
}
function tratarErroMensagem(resposta){
console.log(resposta);
}

function atualizarStatus(){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/status',userName);
}


function enviarMensagem(){
    let input = document.querySelector('input');
    const message= {
	from: nameUser,
	to: enviarPara,
	text: input.value,
	type: visibilidade 
}
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', message);
    promessa.then(tratarSucessoLogin);
    promessa.catch(erroEnvioMensagem);
    input.value='';
}
function erroEnvioMensagem(){
    window.location.reload();
}

function verificarParticipantes(){
    const participantes = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');

    participantes.then(tratarSucessoParticipantes);
    participantes.catch(tratarErroParticipantes);
}
verificarParticipantes();
function tratarSucessoParticipantes(resposta){
const opcoesEnvio = document.querySelector('.opcoes-envio');
opcoesEnvio.innerHTML='';
opcoesEnvio.innerHTML=`<div class="todos" onclick="opcaoTodos(this)">
<img src="assets/people 2.svg" alt="">
<div class="text-envio">Todos</div>
<img src="assets/Vector.svg" class="display-none check" alt="">
</div>`
for(let i=0; i<resposta.data.length; i++){
    opcoesEnvio.innerHTML +=`<div class="pessoa" onclick="opcaoPessoa(this)">
    <img src="assets/person-circle 1.svg" alt="">
    <div class="text-envio">${resposta.data[i].name}</div>
    <img src="assets/Vector.svg" class="display-none check" alt="">
</div>`
}
}
function tratarErroParticipantes(resposta){
console.log(resposta);
}

function opcoesEnvio(){
    const verOpcoes=document.querySelector('.opcoes');
    verOpcoes.classList.remove('display-none');
}

function sairOpcoes(){
    const sairOpcoes = document.querySelector('.esquerda');
    const verOpcoes=document.querySelector('.opcoes');
    
    verOpcoes.classList.add('display-none')
}
function opcaoTodos(Todos){
    const check = Todos.querySelector('.check');
    check.classList.toggle('display-none');
    enviarPara='Todos'
}
function opcaoPessoa(Pessoa){
    const check = Pessoa.querySelector('.check');
    check.classList.toggle('display-none');
    enviarPara=Pessoa.innerText;
}   
function visivelPublico(publico){
    const check = publico.querySelector('.check');
    check.classList.toggle('display-none');
    visibilidade='message';
}
function visivelReservado(privado){
    const check = privado.querySelector('.check');
    check.classList.toggle('display-none');
    visibilidade='private_message';
    }
    
