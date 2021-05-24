/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
const { prefix, prefix2, token } = require('./config.json');
const bot = new Discord.Client();
const YouTube = require("discord-youtube-api");
const youtube = new YouTube("google api key");
const ytdl = require('ytdl-core');
var { google } = require("googleapis");
var youtubeV3 = google.youtube({ version: 'v3', auth: 'AIzaSyCyYXonS1F2g50nBXiPlBZXSZB9xLT_X2o' });

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
  const botQueue = queue.get(mensagem.guild.id);
  if (mensagem.content.startsWith(`${prefix}brackets`)) mensagem.channel.send("AP/DP Brackets", { files: ["https://cdn.discordapp.com/attachments/278999893903802369/694004818326323260/unknown.png"] });
  if (mensagem.content.startsWith(`${prefix}comandos`)) mensagem.channel.send('Lista de Comandos Disponíveis: !play; !pausar; !resumir; !pular; !fila; !limparFila; !brackets; !comandos');
  if (mensagem.content.startsWith(`${prefix}DALE`)) mensagem.channel.send('DALE', { tts: true });
  if (mensagem.content.startsWith(`${prefix2}`)) mensagem.channel.send(mensagem.content.split("*"), { tts: true });
  if (mensagem.content.startsWith(`${prefix}play`)) iniciarBusca(mensagem, botQueue);
  if (mensagem.content.startsWith(`${prefix}pausar`)) pause(mensagem, botQueue);
  if (mensagem.content.startsWith(`${prefix}resumir`)) resume(mensagem, botQueue);
  if (mensagem.content.startsWith(`${prefix}pular`)) skip(mensagem, botQueue);
  if (mensagem.content.startsWith(`${prefix}fila`)) queueCount(mensagem, botQueue);
  if (mensagem.content.startsWith(`${prefix}limparFila`)) clearQueue(mensagem, botQueue);
  if (mensagem.content.startsWith(`${prefix}teste`)) teste(mensagem);
}

async function iniciarBusca(mensagem, botQueue) {
  const voiceChannel = mensagem.member.voice.channel;
  const comandoPlay = `${prefix}play `;
  const comandoPause = `${prefix}pause `;
  const comandoResume = `${prefix}resume `;
  var mensagemCortada = '';

  if (mensagem.content.startsWith(comandoPlay)) {
    mensagemCortada = mensagem.content.slice(comandoPlay.length).split(' ');
  }
  if (mensagem.content.startsWith(comandoPause)) {
    mensagemCortada = mensagem.content.slice(comandoPause.length).split(' ');
  }
  if (mensagem.content.startsWith(comandoResume)) {
    mensagemCortada = mensagem.content.slice(comandoResume.length).split(' ');
  }
  if (!isEmUmCanalDeVoz(mensagem)) {
    return mensagem.reply('please join a voice channel first!');
  }
  let song;
  if (verificaSeEPlaylist(mensagem.content)) {
    let urlPlaylist;
    urlPlaylist = await searchYouTubeAsync(mensagemCortada.join(' '), true);
    song = await searchYoutubeAsyncPlaylist(urlPlaylist.url);
  }
  else {
    song = await searchYouTubeAsync(mensagemCortada.join(' '), false);
  }

  if (!botQueue) {
    const queueConstructor = {
      txtChannel: mensagem.channel,
      vChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 10,
      playing: true
    };

    queue.set(mensagem.guild.id, queueConstructor);

    if (verificaSeEPlaylist(mensagem.content)) {
      for (var i = 0; i <= song.length; i++) {
        queueConstructor.songs.push(song[i]);
      }
    } else {
      queueConstructor.songs.push(song);
    }




    try {
      let connection = await voiceChannel.join();
      queueConstructor.connection = connection;
      play(mensagem.guild, queueConstructor.songs[0]);
    } catch (err) {
      console.error(err);
      queue.delete(mensagem.guild.id);
      return mensagem.reply(`Unable to join the voice chat ${err}`)
    }
  } else {
    botQueue.songs.push(song);
    return mensagem.reply(`The song has been added ${song.url}`);
  }
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
  botQueue.connection.dispatcher.resume();
  mensagem.reply("Música Retomada!");
}

function skip(mensagem, botQueue) {
  if (!mensagem.member.voice.channel) {
    return mensagem.reply("Você precisa estar um voice chat primeiro!")
  }
  if (!botQueue) {
    return mensagem.reply("Não há nada para skippar agora!");
  }
  botQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const botQueue = queue.get(guild.id)
  if (!song) {
    botQueue.vChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const dispatcher = botQueue.connection.play(ytdl(song.url))
    .on('finish', () => {
      botQueue.songs.shift();;
      play(guild, botQueue.songs[0]);
    });
  botQueue.txtChannel.send(`Now playing ${song.url}`);
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

function queueCount(mensagem, botQueue) {
  if (botQueue.songs.length == 0)
    return mensagem.reply("Não há músicas na fila!");
  if (!botQueue.vChannel)
    return mensagem.reply("Você precisa estar um voice chat primeiro!");
  mensagem.reply('Tamanho da fila: ' + botQueue.songs.length);
}

function clearQueue(mensagem, botQueue){
  if (botQueue.songs.length == 0)
    return mensagem.reply("Não há músicas na fila!");
  if (!botQueue.vChannel)
    return mensagem.reply("Você precisa estar um voice chat primeiro!");
    while (botQueue.songs.length) {
      botQueue.songs.pop();
    }
  mensagem.reply("Fila Limpa!");
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