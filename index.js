
/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
var mysql = require('mysql');

var bot = new Discord.Client();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "dbgearscore"
});

con.connect(function (error) {
    if (!!error) {
        console.log('Erro')
    } else {
        console.log('Conectado')
    }
})

/*con.connect(function (err) {
    con.query("SELECT * FROM gearscore", function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  });*/

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
    const gs = message.content.slice(prefix.lenght).split(' ');

    if (message.content.startsWith(`${prefix}addgs`) && gs[1].startsWith('<@')) {
        con.query('INSERT INTO gearscore values(' + message.mentions.users.first().id + ",'" + gs[2] + "'," + gs[3] + ', ' + gs[4] + ', ' + gs[5] + ', ' + gs[6] + ')');
        message.channel.send(`GS e Classe ${gs[1]} ${gs[2]} ${gs[3]} ${gs[4]} ${gs[5]} ${gs[6]}`);
    }
    if (message.content.startsWith(`${prefix}addgs`) && !gs[1].startsWith('<@')) {
        con.query('INSERT INTO gearscore values(' + message.author + ",'" + gs[1] + "'," + gs[2] + ', ' + gs[3] + ', ' + gs[4] + ', ' + gs[5] + ')');
        message.channel.send(`GS e Classe <@` + message.author + `> ${gs[1]} ${gs[2]} ${gs[3]} ${gs[4]}`)
    }

    if (message.content.startsWith(`${prefix}gs`) && gs[1].startsWith('<@')) {
        con.query('SELECT id, classe, nivel, ap, apw, dp from gearscore where id = ' + message.mentions.users.first().id, function (err, gs) {
            if (err) throw err;
            message.channel.send('Seu GS <@' + gs[0].id + '> ' + gs[0].classe + ' ' + gs[0].nivel + ' ' + gs[0].ap + ' ' + gs[0].apw + ' ' + gs[0].dp);
        })
    }
    if (message.content.startsWith(`${prefix}gs`) && !gs[1].startsWith('<@')) {
        con.query('SELECT id, classe, nivel, ap, apw, dp from gearscore where id = ' + message.author, function (err, gs) {
            if (err) throw err;
            message.channel.send('Seu GS <@' + gs[0].id + '> ' + gs[0].classe + ' ' + gs[0].nivel + ' ' + gs[0].ap + ' ' + gs[0].apw + ' ' + gs[0].dp);
        })

    }
});

bot.login(token);