const usuario = {name: ""}; //objeto usuario
let mensagens = []; //array vazio que recebera as mensagens

setInterval(obterMensagens, 5000);
enterEnvia();

//funcoes para obter e imprimir as mensagens via API axios
function obterMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(exibirMensagens);
    promessa.catch(tratarErro);
}
function exibirMensagens(resposta){
    mensagens = resposta.data;
    let caixaDeEntrada = document.querySelector('main');
    caixaDeEntrada.innerHTML = '';
    for(i = 0; i < mensagens.length; i++){
        if(mensagens[i].type === 'status'){
            imprimirStatus(mensagens[i], caixaDeEntrada);
        }
        if(mensagens[i].type === 'private_message' && mensagens[i].to === usuario.name){
            imprimirMensagemReservadamente(mensagens[i], caixaDeEntrada);
        }
        if(mensagens[i].type === 'message'){
            imprimirMensagem(mensagens[i], caixaDeEntrada)
        }
        let fixa = document.querySelector('.fixa-scroll');
        fixa.scrollIntoView({block: "end"});
    }
}
function imprimirStatus(mensagem, div){
    div.innerHTML += `<div data-test="message" class="mensagem status">
    <p class="hora">(${mensagem.time})</p>
    <p><span class="negrito">${mensagem.from}</span> ${mensagem.text}</p>
    </div>`;
}
function imprimirMensagem(mensagem, div){
    div.innerHTML += `<div data-test="message" class="mensagem padrao">
        <p class="hora">(${mensagem.time})</p>
        <p><span class="negrito">${mensagem.from}</span> para 
            <span class="negrito">${mensagem.to}</span>: ${mensagem.text}</p>
        </div>`;
    }
function imprimirMensagemReservadamente(mensagem, div){
    div.innerHTML += `<div data-test="message" class="mensagem reservadamente">
        <p class="hora">(${mensagem.time})</p>
        <p><span class="negrito">${mensagem.from}</span> reservadamente para 
            <span class="negrito">${mensagem.to}</span>: ${mensagem.text}</p>
        </div>`;
}
//fim

//funcoes para definicao do nome do usuario
function definirUsuario(){
    let inputNome = document.querySelector('.input-nome');
    usuario.name = inputNome.value;
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    promessa.then(tratarSucesso);
    promessa.catch(tratarErro);
}

function tratarSucesso(){
    trocarTela();
    setInterval(manterUsuario, 4500);
}
function trocarTela(){
    let telaInicial = document.querySelector('.tela-inicial');
    telaInicial.classList.remove('flex');
    telaInicial.classList.add('none');
    let telaChat = document.querySelector('.tela-chat');
    telaChat.classList.remove('none');
    telaChat.classList.add('flex');
}
function tratarErro(){
    alert('Este nome já está em uso');
}
// fim

//funcoes para manutencao do usuario
function manterUsuario(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);

}

//funcoes para mandar mensagem
function enviarMensagem(){
    let novaMensagem = {
        from: "",
        to: "Todos",
        text: "",
        type: "message"
    }
    novaMensagem.from = `${usuario.name}`;
    let inputMensagem = document.querySelector('.input-mensagem');
    novaMensagem.text = inputMensagem.value;
    console.log(novaMensagem);
    let promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', novaMensagem);
    promessa.then(obterMensagens);
    promessa.catch(deuErrado);
    inputMensagem.value = '';
    console.log(inputMensagem.value);
}
function deuErrado(){
    console.log('deuerrado');
}
function enterEnvia(){
const inputMensagem = document.querySelector(".input-mensagem");
inputMensagem.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        enviarMensagem()
        console.log("Ativou o Enter!")
    }
})
}