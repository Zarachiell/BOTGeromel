/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
const { prefix, prefix2, token } = require('./config.json');
var mysql = require('mysql');
var db = require('./connectiondb');
var bot = new Discord.Client();
const YouTube = require("discord-youtube-api");
const youtube = new YouTube("google api key");

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
    const mensagem = message.content;
    execucaoComandos(mensagem);

});


function execucaoComandos(mensagem) {
    if (mensagem.startsWith(`${prefix}brackets`)) message.channel.send("AP/DP Brackets", { files: ["https://cdn.discordapp.com/attachments/278999893903802369/694004818326323260/unknown.png"] });
    if (mensagem.startsWith(`${prefix}comandos`)) message.channel.send('Lista de Comandos Disponíveis: !addgs; !gs; !brackets; !comandos');
    if (mensagem.startsWith(`${prefix}DALE`)) message.channel.send('DALE', { tts: true });
    if (mensagem.startsWith(`${prefix2}`)) message.channel.send(message.content.split("*"), { tts: true });
    if (mensagem.startsWith(`${prefix}play`)) iniciarBusca(mensagem);
}
function iniciarBusca(mensagem) {
    const { voiceChannel } = mensagem.member;

      if (!voiceChannel) {
        return mensagem.reply('please join a voice channel first!');
      }

      voiceChannel.join().then(connection => {
        const stream = ytdl(searchYouTubeAsync(args), { filter: 'audioonly' });
        const dispatcher = connection.playStream(stream);

        dispatcher.on('end', () => voiceChannel.leave());
        isReady = true;
      })
}

async function searchYouTubeAsync(args) {
  var video = await youtube.searchVideos(args.toString().replace(/,/g,' '));
  console.log(video.url);
  console.log(typeof String(video.url));
  return String(video.url);
}

bot.login(token);