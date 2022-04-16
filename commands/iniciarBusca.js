const config = require('../config/dev');
const ytdl = require('ytdl-core');
var { google } = require("googleapis");
var youtubeV3 = google.youtube({ version: 'v3', auth: config.googleAPIKey });

var generalQueue = new Map();

module.exports = {
    iniciarBusca: async function (mensagem, botQueue, queue) {
        const voiceChannel = mensagem.member.voice.channel;
        const comandoPlay = `${config.prefix}play `;
        const comandoPause = `${config.prefix}pause `;
        const comandoResume = `${config.prefix}resume `;
        var mensagemCortada = '';

        generalQueue = queue;

        if (mensagem.content.startsWith(comandoPlay)) {
            mensagemCortada = mensagem.content.slice(comandoPlay.length).split(' ');
        }
        if (mensagem.content.startsWith(comandoPause)) {
            mensagemCortada = mensagem.content.slice(comandoPause.length).split(' ');
        }
        if (mensagem.content.startsWith(comandoResume)) {
            mensagemCortada = mensagem.content.slice(comandoResume.length).split(' ');
        }
        if (!this.isEmUmCanalDeVoz(mensagem)) {
            return mensagem.reply('please join a voice channel first!');
        }
        let song;
        if (this.verificaSeEPlaylist(mensagem.content)) {
            let urlPlaylist;
            urlPlaylist = await this.searchYouTubeAsync(mensagemCortada.join(' '), true);
            song = await this.searchYoutubeAsyncPlaylist(urlPlaylist.url);
        }
        else {
            song = await this.searchYouTubeAsync(mensagemCortada.join(' '), false);
        }

        if (song.length === 0) {
            return mensagem.reply("Musica não encontrada");
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

            generalQueue.set(mensagem.guild.id, queueConstructor);

            if (this.verificaSeEPlaylist(mensagem.content)) {
                for (var i = 0; i <= song.length; i++) {
                    queueConstructor.songs.push(song[i]);
                }
            } else {
                queueConstructor.songs.push(song);
            }

            try {
                let connection = await voiceChannel.join();
                queueConstructor.connection = connection;
                await this.play(mensagem.guild, queueConstructor.songs[0]);
            } catch (err) {
                console.error(err);
                generalQueue.delete(mensagem.guild.id);
                return mensagem.reply(`Unable to join the voice chat ${err}`)
            }
        } else {
            botQueue.songs.push(song);
            return mensagem.reply(`The song has been added ${song.url}`);
        }

        return botQueue;
    },

    searchYouTubeAsync: function (args, isPlaylist) {
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
                    var song = [];
                    if (response.data.items.length != 0) {
                        song = {
                            title: response.data.items[0].snippet.title,
                            url: 'https://www.youtube.com/watch?v=' + response.data.items[0].id.videoId,
                            canal: response.data.items[0].snippet.channelTitle
                        }
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
    },

    searchYoutubeAsyncPlaylist: async function (urlPlaylist) {
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
    },

    isEmUmCanalDeVoz: function (mensagem) {
        return mensagem.member.voice.channelID != null
    },

    verificaSeEPlaylist: function (mensagem) {
        const comando = `${config.prefix}play`;
        var mensagemCortada = mensagem.slice(comando.length).split('/');
        for (var i = 0; i < mensagemCortada.length; i++) {
            if (mensagemCortada[i].startsWith('playlist')) {
                return true;
            }
        }
    },

    play: function (guild, song) {
        var botQueue = generalQueue.get(guild.id)
        if (!song) {
            botQueue.vChannel.leave();
            generalQueue.delete(guild.id);
            return;
        }
        const dispatcher = botQueue.connection.play(ytdl(song.url))
            .on('finish', () => {
                botQueue.songs.shift();;
                this.play(guild, botQueue.songs[0]);
            });
        botQueue.txtChannel.send(`Now playing ${song.url}`);
    },

    queueCount: function (mensagem, botQueue) {
        if (botQueue.songs.length == 0)
            return mensagem.reply("Não há músicas na fila!");
        if (!botQueue.vChannel)
            return mensagem.reply("Você precisa estar um voice chat primeiro!");
        mensagem.reply('Tamanho da fila: ' + botQueue.songs.length);
    }
}
