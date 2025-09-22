const play = require("./iniciarBusca");

module.exports = {
  queueCount: function (mensagem, queue) {
    const botQueue = queue.get(mensagem.guild.id);
    if (botQueue.songs.length == 0)
      return mensagem.reply("Não há músicas na fila!");
    if (!botQueue.vChannel)
      return mensagem.reply("Você precisa estar um  voice chat primeiro!");
    mensagem.reply('Tamanho da fila: ' + botQueue.songs.length);
  },

  skip: function (mensagem, botQueue) {
    if (!mensagem.member.voice.channel) {
      return mensagem.reply("Você precisa estar um voice chat primeiro!")
    }
    if (!botQueue) {
      return mensagem.reply("Não há nada para skippar agora!");
    }
    botQueue.connection.dispatcher.end();
  },

  clearQueue: function (mensagem, botQueue) {
    if (botQueue.songs.length == 0)
      return mensagem.reply("Não há músicas na fila!");
    if (!botQueue.vChannel)
      return mensagem.reply("Você precisa estar um voice chat primeiro!");
    while (botQueue.songs.length) {
      botQueue.songs.pop();
    }
    mensagem.reply("Fila Limpa!");
  }
}