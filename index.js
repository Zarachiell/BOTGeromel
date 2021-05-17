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


function execucaoComandos(mensagem) {
  const comando = mensagem.content;
  if (mensagem.content.startsWith(`${prefix}brackets`)) mensagem.channel.send("AP/DP Brackets", { files: ["https://cdn.discordapp.com/attachments/278999893903802369/694004818326323260/unknown.png"] });
  if (mensagem.content.startsWith(`${prefix}comandos`)) mensagem.channel.send('Lista de Comandos Disponíveis: !addgs; !gs; !brackets; !comandos');
  if (mensagem.content.startsWith(`${prefix}DALE`)) mensagem.channel.send('DALE', { tts: true });
  if (mensagem.content.startsWith(`${prefix2}`)) mensagem.channel.send(mensagem.content.split("*"), { tts: true });
  if (mensagem.content.startsWith(`${prefix}play`)) iniciarBusca(mensagem);
  if (mensagem.content.startsWith(`${prefix}pause`)) iniciarBusca(mensagem);
  if (mensagem.content.startsWith(`${prefix}resume`)) iniciarBusca(mensagem);
  if (mensagem.content.startsWith(`${prefix}teste`)) teste(mensagem);
}

async function iniciarBusca(mensagem) {
  const voiceChannel = mensagem.member.voice.channel;
  var mensagemCortada = '';
  const play = `${prefix}play `;
  const pause = `${prefix}pause `;
  const resume = `${prefix}resume `;

  if(mensagem.content.startsWith(play)) {
    mensagemCortada = mensagem.content.slice(play.length).split(' ');
  }
  if(mensagem.content.startsWith(pause)){
    mensagemCortada = mensagem.content.slice(pause.length).split(' ');
  }
  if(mensagem.content.startsWith(resume)){
    mensagemCortada = mensagem.content.slice(resume.length).split(' ');
  }
  if (!isEmUmCanalDeVoz(mensagem)) {
    return mensagem.reply('please join a voice channel first!');
  }
  voiceChannel.join().then(async connection => {
    if (mensagem.content.startsWith(play)) {
      let song = await searchYouTubeAsync(mensagemCortada.join(' '));
      if (song != null) {
        mensagem.reply("Now Playing: " + song.title);
        mensagem.channel.send("Canal: " + song.canal);
        mensagem.channel.send(song.url);
        let stream = ytdl(song.url, { filter: 'audioonly' });
        let dispatcher = connection.play(stream);
        dispatcher.on('end', () => voiceChannel.leave());
        isReady = true;
      }
    }
    if(mensagem.content.startsWith(pause)){
        dispatcher.pause;
        mensagem.reply("Vídeo Pausado!");
    }
    if(mensagem.content.startsWith(resume)){
      dispatcher.resume;
      mensagem.reply("Vídeo Resumido!");
    }

  }).catch(e => { console.log(e) })
}

function isEmUmCanalDeVoz(mensagem) {
  const teste = mensagem.member.voice;
  //console.log(teste);
  return mensagem.member.voice.channelID != null
}

function teste(mensagem) {
  const comando = mensagem.content;
  const mensagemCortada = mensagem.content.slice(comando.length).split(' ');
  console.log(mensagemCortada);
}

function searchYouTubeAsync(args) {
  return new Promise((resolve, reject) => {
    youtubeV3.search.list({
      part: 'snippet',
      type: 'video',
      q: args,
      maxResults: 1,
    }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      const song = {
        title: response.data.items[0].snippet.title,
        url: 'https://www.youtube.com/watch?v=' + response.data.items[0].id.videoId,
        canal: response.data.items[0].snippet.channelTitle
      }
      resolve(response ? song : null);
    })
  });
}

bot.login(token);