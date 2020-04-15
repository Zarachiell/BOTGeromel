/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
const { prefix,prefix2 , token } = require('./config.json');
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
    var day = getDayOfTheWeek();
    var gsTotal;

    if (message.content.startsWith(`${prefix}addgs`) && gs[1].startsWith('<@')) {
        var ap = parseInt(gs[4]);
        var apw = parseInt(gs[5]);
        var dp = parseInt(gs[6]);
        if (gs[4] > gs[5]) gsTotal = ap + dp;
        if (gs[5] > gs[4]) gsTotal = apw + dp;
        if (gs[4] == gs[5]) gsTotal = apw + dp;
        con.query('INSERT INTO gearscore values(' + message.mentions.users.first().id + ",'" + gs[2] + "'," + gs[3] + ', ' + gs[4] + ', ' + gs[5] + ', ' + gs[6] + ',' + gsTotal + ')', function (err, rows) {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    message.channel.send('GS já cadastrado!');
                }
                else if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Erro no Formato do comando.');
                }
                else {
                    throw err;
                }
            } else {
                message.channel.send(`GS e Classe ${gs[1]} ${gs[2]} ${gs[3]} ${gs[4]} ${gs[5]} ${gs[6]}`);
            }
        });
    }
    if (message.content.startsWith(`${prefix}addgs`) && !gs[1].startsWith('<@')) {
        var ap = parseInt(gs[3]);
        var apw = parseInt(gs[4]);
        var dp = parseInt(gs[5]);
        if (gs[3] > gs[4]) gsTotal = ap + dp;
        if (gs[4] > gs[3]) gsTotal = apw + dp;
        if (gs[4] == gs[3]) gsTotal = apw + dp;
        con.query('INSERT INTO gearscore values(' + message.author + ",'" + gs[1] + "'," + gs[2] + ', ' + gs[3] + ', ' + gs[4] + ', ' + gs[5] + ', ' + gsTotal + ')', function (err, rows) {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    message.channel.send('GS já cadastrado!');
                }
                else if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Erro no Formato do comando.');
                }
                else {
                    message.channel.send('Erro Desconhecido.');
                }
            } else {
                message.channel.send(`GS e Classe <@` + message.author + `> ${gs[1]} ${gs[2]} ${gs[3]} ${gs[4]}`);
            }
        });
    }

    if (message.content.startsWith(`${prefix}gs`) && message.content.endsWith('>')) {
        con.query('SELECT id, classe, nivel, ap, apw, dp from gearscore where id = ' + message.mentions.users.first().id, function (err, gs) {
            if (err) {
                if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Comando Não Reconhecido!');
                }
                else {
                    message.channel.send('Erro Desconhecido.');
                }

            } else {
                message.channel.send('Seu GS <@' + gs[0].id + '> ' + gs[0].classe + ' ' + gs[0].nivel + ' ' + gs[0].ap + ' ' + gs[0].apw + ' ' + gs[0].dp) + ' ';
            }
        });
    }
    if (message.content.startsWith(`${prefix}gs`) && !message.content.endsWith('>')) {
        con.query('SELECT id, classe, nivel, ap, apw, dp from gearscore where id = ' + message.author, function (err, gs) {
            if (err) {

                if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Comando Não Reconhecido!');
                }
                else {
                    console.log('Erro Desconhecido.');
                }

            } else {
                message.channel.send('Seu Gs <@' + gs[0].id + '> ' + gs[0].classe + ' ' + gs[0].nivel + ' ' + gs[0].ap + ' ' + gs[0].apw + ' ' + gs[0].dp);
            }
        });
    }

    if (message.content.startsWith(`${prefix}rank`)) {
        var aux = 0;
        con.query('SELECT id, classe, nivel, ap, apw, dp, gs from gearscore order by gs desc', function (err, gs) {
            if (err) {
                if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Comando Não Reconhecido!');
                }
                else {
                    console.log('Erro Desconhecido.');
                }

            } else {
                //Método não corno, só que não tão bunitinho
                for (var i = 0; i < 5; i++) {
                    message.channel.send('Seu Gs <@' + gs[i].id + '> ' + gs[i].classe + ' ' + gs[i].nivel + ' ' + gs[i].ap + ' ' + gs[i].apw + ' ' + gs[i].dp + ' ' + gs[i].gs);
                }
                //Método Corno mas bunitinho
                /*message.channel.send('Seu Gs <@' + gs[0].id + '> ' + gs[0].classe + ' ' + gs[0].nivel + ' ' + gs[0].ap + ' ' + gs[0].apw + ' ' + gs[0].dp + ' ' + gs[0].gs + '\n' +
                    'Seu Gs <@' + gs[1].id + '> ' + gs[1].classe + ' ' + gs[1].nivel + ' ' + gs[1].ap + ' ' + gs[1].apw + ' ' + gs[1].dp + ' ' + gs[1].gs + '\n' +
                    'Seu Gs <@' + gs[2].id + '> ' + gs[2].classe + ' ' + gs[2].nivel + ' ' + gs[2].ap + ' ' + gs[2].apw + ' ' + gs[2].dp + ' ' + gs[2].gs + '\n' +
                    'Seu Gs <@' + gs[3].id + '> ' + gs[3].classe + ' ' + gs[3].nivel + ' ' + gs[3].ap + ' ' + gs[3].apw + ' ' + gs[3].dp + ' ' + gs[3].gs + '\n' +
                    'Seu Gs <@' + gs[4].id + '> ' + gs[4].classe + ' ' + gs[4].nivel + ' ' + gs[4].ap + ' ' + gs[4].apw + ' ' + gs[4].dp + ' ' + gs[4].gs + '\n'
                    'Seu Gs <@' + gs[5].id + '> ' + gs[5].classe + ' ' + gs[5].nivel + ' ' + gs[5].ap + ' ' + gs[5].apw + ' ' + gs[5].dp + ' ' + gs[5].gs + '\n' +
                    'Seu Gs <@' + gs[6].id + '> ' + gs[6].classe + ' ' + gs[6].nivel + ' ' + gs[6].ap + ' ' + gs[6].apw + ' ' + gs[6].dp + ' ' + gs[6].gs + '\n' +
                    'Seu Gs <@' + gs[7].id + '> ' + gs[7].classe + ' ' + gs[7].nivel + ' ' + gs[7].ap + ' ' + gs[7].apw + ' ' + gs[7].dp + ' ' + gs[7].gs + '\n' +
                    'Seu Gs <@' + gs[8].id + '> ' + gs[8].classe + ' ' + gs[8].nivel + ' ' + gs[8].ap + ' ' + gs[8].apw + ' ' + gs[8].dp + ' ' + gs[8].gs + '\n' +
                    'Seu Gs <@' + gs[9].id + '> ' + gs[9].classe + ' ' + gs[9].nivel + ' ' + gs[9].ap + ' ' + gs[9].apw + ' ' + gs[9].dp + ' ' + gs[9].gs + '\n' +
                    'Seu Gs <@' + gs[10].id + '> ' + gs[10].classe + ' ' + gs[10].nivel + ' ' + gs[10].ap + ' ' + gs[10].apw + ' ' + gs[10].dp + ' ' + gs[10].gs + '\n' +
                    'Seu Gs <@' + gs[11].id + '> ' + gs[11].classe + ' ' + gs[11].nivel + ' ' + gs[11].ap + ' ' + gs[11].apw + ' ' + gs[11].dp + ' ' + gs[11].gs + '\n' +
                    'Seu Gs <@' + gs[12].id + '> ' + gs[12].classe + ' ' + gs[12].nivel + ' ' + gs[12].ap + ' ' + gs[12].apw + ' ' + gs[12].dp + ' ' + gs[12].gs + '\n' +
                    'Seu Gs <@' + gs[13].id + '> ' + gs[13].classe + ' ' + gs[13].nivel + ' ' + gs[13].ap + ' ' + gs[13].apw + ' ' + gs[13].dp + ' ' + gs[13].gs + '\n' +
                    'Seu Gs <@' + gs[14].id + '> ' + gs[14].classe + ' ' + gs[14].nivel + ' ' + gs[14].ap + ' ' + gs[14].apw + ' ' + gs[14].dp + ' ' + gs[14].gs );*/

            }
        });
    }

    if (message.content.startsWith(`${prefix}brackets`)) message.channel.send("AP/DP Brackets", { files: ["https://cdn.discordapp.com/attachments/278999893903802369/694004818326323260/unknown.png"] });
    if (message.content.startsWith(`${prefix}comandos`)) message.channel.send('Lista de Comandos Disponíveis: !addgs; !gs; !brackets; !comandos');
    if (message.content.startsWith(`${prefix}DALE`)) message.channel.send('DALE', { tts: true });

    if(message.content.startsWith(`${prefix2}`)) {
        const mensagem = message.content.slice(prefix2.lenght).split(' ');
        for(var msgs = 0; msgs < mensagem.lenght; msgs++){
            message.channel.send(mensagen[msgs], {tts:true});
        }
    }


    function getDayOfTheWeek() {
        var date = new Date();
        var day = date.getDay();
        return day;
    }
});

bot.login(token);