/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
var config = require('./config/config');
const bot = new Discord.Client();
const busca = require("./commands/iniciarBusca");
const fila = require("./commands/fila");

const queue = new Map();

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
  if (message.author.equals(bot.user)) return;
  const mensagem = message;
  execucaoComandos(mensagem);
});


function execucaoComandos(mensagem) {
  var botQueue = queue.get(mensagem.guild.id);
  if (mensagem.content.startsWith(`${config.prefix}brackets`)) mensagem.channel.send("AP/DP Brackets", { files: ["https://cdn.discordapp.com/attachments/278999893903802369/694004818326323260/unknown.png"] });
  if (mensagem.content.startsWith(`${config.prefix}comandos`)) mensagem.channel.send('Lista de Comandos Disponíveis: !play; !pausar; !resumir; !pular; !fila; !limparFila; !brackets; !comandos');
  if (mensagem.content.startsWith(`${config.prefix}DALE`)) mensagem.channel.send('DALE', { tts: true });
  if (mensagem.content.startsWith(`${config.prefix2}`)) mensagem.channel.send(mensagem.content.split("*"), { tts: true });
  if (mensagem.content.startsWith(`${config.prefix}play`)) botQueue = busca.iniciarBusca(mensagem, botQueue, queue);
 //if (mensagem.content.startsWith(`${config.prefix}pausar`)) pause(mensagem, botQueue);
 //if (mensagem.content.startsWith(`${config.prefix}resumir`)) resume(mensagem, botQueue);
  if (mensagem.content.startsWith(`${config.prefix}pular`)) fila.skip(mensagem, botQueue);
  if (mensagem.content.startsWith(`${config.prefix}fila`)) fila.queueCount(mensagem, queue);
  if (mensagem.content.startsWith(`${config.prefix}limparFila`)) fila.clearQueue(mensagem, botQueue);
  if (mensagem.content.startsWith(`${config.prefix}teste`)) teste(mensagem);
}


function pause(mensagem, botQueue) {
  if (!botQueue.connection)
    return mensagem.reply("Não há musica tocando agora!");
  if (!botQueue.vChannel)
    return mensagem.reply("Você precisa estar um voice chat primeiro!");
  if (botQueue.connection.dispatcher.paused)
    return mensagem.reply("A música já está pausada");
  botQueue.connection.dispatcher.pause();
  mensagem.reply("Música Pausada!");
}

function resume(mensagem, botQueue) {
  if (!botQueue.connection)
    return mensagem.reply("Não há musica tocando agora!");
  if (!botQueue.vChannel)
    return mensagem.reply("Você precisa estar um voice chat primeiro!");
  if (botQueue.connection.dispatcher.resumed)
    return mensagem.reply("A música já está tocando");
  botQueue.connection.dispatcher.player.dispatcher.resume();
  mensagem.reply("Música Retomada!");
}

bot.login(config.botKey);