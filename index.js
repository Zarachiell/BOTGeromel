/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
const { prefix, prefix2, token } = require('./config.json');
var bot = new Discord.Client();
const YouTube = require("discord-youtube-api");
const youtube = new YouTube("google api key");
const ytdl = require('ytdl-core');
const yts = require("yt-search");
var { google } = require("googleapis");
var youtubeV3 = google.youtube({ version: 'v3', auth: 'AIzaSyCyYXonS1F2g50nBXiPlBZXSZB9xLT_X2o' });

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


function execucaoComandos(messagem) {
  if (messagem.content.startsWith(`${prefix}brackets`)) messagem.channel.send("AP/DP Brackets", { files: ["https://cdn.discordapp.com/attachments/278999893903802369/694004818326323260/unknown.png"] });
  if (messagem.content.startsWith(`${prefix}comandos`)) messagem.channel.send('Lista de Comandos Disponíveis: !addgs; !gs; !brackets; !comandos');
  if (messagem.content.startsWith(`${prefix}DALE`)) messagem.channel.send('DALE', { tts: true });
  if (messagem.content.startsWith(`${prefix2}`)) messagem.channel.send(messagem.content.split("*"), { tts: true });
  if (messagem.content.startsWith(`${prefix}play`)) iniciarBusca(messagem);
  if (messagem.content.startsWith(`${prefix}teste`)) teste(messagem);
}

async function iniciarBusca(mensagem) {
  const voiceChannel = mensagem.member.voice.channel;
  const comando = `${prefix}play `;
  const mensagemCortada = mensagem.content.slice(comando.length).split(' ');

  if (!isEmUmCanalDeVoz(mensagem)) {
    return mensagem.reply('please join a voice channel first!');
  }
  voiceChannel.join().then(async connection => {
    let url = searchYouTubeAsync(mensagemCortada.join(' '));
    //let url2 = search(mensagemCortada.join(' '));
    console.log(url);
    let stream = ytdl(url, { filter: 'audioonly' });
    let dispatcher = connection.play(stream);
    console.log('teste');
    dispatcher.on('end', () => voiceChannel.leave());
    isReady = true;
  }).catch(e => { console.log(e) })
}

function isEmUmCanalDeVoz(mensagem) {
  const teste = mensagem.member.voice;
  //console.log(teste);
  return mensagem.member.voice.channelID != null
}

function teste(mensagem) {
  const comando = '!teste ';
  const mensagemCortada = mensagem.content.slice(comando.length).split(' ');
  const mensagemConcatenada = mensagemCortada.join(' ');
  console.log(mensagemConcatenada);
}

async function searchYouTubeAsync(args) {
  youtubeV3.search.list({
    part: 'snippet',
    type: 'video',
    q: args,
    maxResults: 1,
  }, (err, response) => {
    const videoUrl = 'https://www.youtube.com/watch?v=' + response.data.items[0].id.videoId;
    console.log(videoUrl);
    return videoUrl
  });
}

function search(args) {
  var q = args;
  var request = youtubeV3.search.list({
    q: 'cat',
    part: 'snippet',
    type: 'video'
  });
  for (var i in request.items) {
    var item = request.data.items[i].id.videoId;
    console.log(item);
  }
}

bot.login(token);