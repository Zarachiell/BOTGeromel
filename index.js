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
let dispatcher;

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
  if (mensagem.content.startsWith(`${prefix}pause`)) pause(mensagem);
  if (mensagem.content.startsWith(`${prefix}resume`)) resume(mensagem);
  if (mensagem.content.startsWith(`${prefix}teste`)) teste(mensagem);
}

async function iniciarBusca(mensagem) {
  const voiceChannel = mensagem.member.voice.channel;
  const play = `${prefix}play `;
  const pause = `${prefix}pause `;
  const resume = `${prefix}resume `;
  var mensagemCortada = '';

  if (mensagem.content.startsWith(play)) {
    mensagemCortada = mensagem.content.slice(play.length).split(' ');
  }
  if (mensagem.content.startsWith(pause)) {
    mensagemCortada = mensagem.content.slice(pause.length).split(' ');
  }
  if (mensagem.content.startsWith(resume)) {
    mensagemCortada = mensagem.content.slice(resume.length).split(' ');
  }
  if (!isEmUmCanalDeVoz(mensagem)) {
    return mensagem.reply('please join a voice channel first!');
  }
  voiceChannel.join().then(async connection => {
    let song;
    if (verificaSeEPlaylist(mensagem.content)) {
      let urlPlaylist;
      urlPlaylist = await searchYouTubeAsync(mensagemCortada.join(' '), true);
      song = await searchYoutubeAsyncPlaylist(urlPlaylist.url);
      console.log(song);
      mensagem.reply("Now Playing: " + song[0].title);
      mensagem.channel.send("Canal: " + song[0].canal);
      mensagem.channel.send(song[0].url);
      mensagem.channel.send(song[0].length)
      let stream = ytdl(song[0].url, { filter: 'audioonly' });
      dispatcher = connection.play(stream);
    }
    else {
      song = await searchYouTubeAsync(mensagemCortada.join(' '), false);
      console.log(song);
      mensagem.reply("Now Playing: " + song.title);
      mensagem.channel.send("Canal: " + song.canal);
      mensagem.channel.send(song.url);
    }
    let stream = ytdl(song.url, { filter: 'audioonly' });
    dispatcher = connection.play(stream);
    dispatcher.on('end', () => voiceChannel.leave());
    isReady = true;
  }).catch(e => { console.log(e) })
}

function pause(mensagem) {
  if (!dispatcher.paused) {
    dispatcher.pause(false);
    mensagem.reply("Vídeo Pausado!");
  }
}

function resume(mensagem) {
  if (dispatcher.paused) {
    dispatcher.resume();
    mensagem.reply("Vídeo Resumido!");
    console.log(dispatcher);
  }
}

function verificaSeEPlaylist(mensagem) {
  const comando = `${prefix}play`;
  var mensagemCortada = mensagem.slice(comando.length).split('/');
  for (var i = 0; i < mensagemCortada.length; i++) {
    if (mensagemCortada[i].startsWith('playlist')) {
      console.log('Deu Certo1');
      return true;
    }
  }
}

function isEmUmCanalDeVoz(mensagem) {
  return mensagem.member.voice.channelID != null
}

function teste(mensagem) {
  const comando = `${prefix}teste`;
  const mensagemCortada = mensagem.content.slice(comando.length).split('/');
  console.log(mensagemCortada);

  for (var i = 0; i < mensagemCortada.length; i++) {
    if (mensagemCortada[i].startsWith('playlist')) {
      console.log('Deu Certo');
      break
    }
  }
  console.log(mensagemCortada);
}

function searchYouTubeAsync(args, isPlaylist) {
  if (!isPlaylist) {
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
  } else {
    return new Promise((resolve, reject) => {
      youtubeV3.search.list({
        part: 'snippet',
        type: 'playlist',
        q: args,
        maxResults: 1,
      }, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        const song = {
          title: response.data.items[0].snippet.title,
          url: response.data.items[0].id.playlistId,
          canal: response.data.items[0].snippet.channelTitle
        }

        resolve(response ? song : null);
      })
    });
  }
}

async function searchYoutubeAsyncPlaylist(urlPlaylist) {
  return new Promise((resolve, reject) => {
    youtubeV3.playlistItems.list({
      part: 'snippet',
      playlistId: urlPlaylist,
      maxResults: 100,
    }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(response);
      const playlist = [];
      for (var i = 0; i < response.data.items.length; i++) {
        const song = {
          title: response.data.items[i].snippet.title,
          url: 'https://www.youtube.com/watch?v=' + response.data.items[i].snippet.resourceId.videoId,
          canal: response.data.items[i].snippet.channelTitle
        }
        playlist.push(song);
      }
      resolve(response ? playlist : null);
    })
  });
}

bot.login(token);