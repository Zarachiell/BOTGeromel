
/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

var bot = new Discord.Client();

/**
 * Inicia o Bot e deixa em "Ready" como um listener e mostra no log que está funcionando.
 */

bot.on("ready", function () {
    console.log("A Funcionar");
});

/**
 * Quando o bot "escutar" uma mensagem vai cair nessa função
 * Funcionamento: O Bot vai escutar uma mensagem, se for relacionada a um comando programado ele vai dividir a mensagem e salvar em cada posição do vetor e depois mostrar a mensagem.
 */
bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return; //Retorna pra fora da função caso a mensagem seja do proprio bot.
    if (message.content.startsWith(`${prefix}addgs`) && gs[1].startsWith('<@')) {
            const gs = message.content.slice(prefix.lenght).split(' '); //Pega o conteudo da mensagem do usuario e vai dividir em virgulas e salvar dentro de um vetor. Precisa por dentro das condições a baixo.
            message.channel.send(`GS e Classe ${gs[1]} ${gs[2]} ${gs[3]} ${gs[4]} ${gs[5]} ${gs[6]}`); //O Discord reconhece menções como @Fulano com base a id dele, é utlizada uma tag especial para mencionar via codigo; Ex @Fulano = <@123456>
    }
    if(message.content.startsWith(`${prefix}addgs`) && !gs[1].startsWith('<@')){
        const gs = message.content.slice(prefix.lenght).split(' ');
        message.channel.send(`GS e Classe <@` + message.author + `> ${gs[1]} ${gs[2]} ${gs[3]} ${gs[4]}`) //Mostrando a mensagem que foi dividia em partes com espaços entre.
    }
});

bot.login(token);