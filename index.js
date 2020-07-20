/**
 * Arquivo do Bot do discord GEROMEL
 * Author @Uganda
 */
const Discord = require('discord.js');
const { prefix, prefix2, token } = require('./config.json');
var mysql = require('mysql');
var db = require('./connectiondb');
var bot = new Discord.Client();

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
    const day = getDayOfTheWeek();
    var gsTotal;
    var mentions = new Boolean(false);

    if (message.content.startsWith(`${prefix}addgs`) && gs[1].startsWith('<@')) {
        if (!message.member.roles.cache.get('672193236500217876')) return;
        mentions = true;
        gsTotal = insertGsUser(gs, mentions);
        db.query("INSERT INTO gearscore values('" + message.mentions.users.first().id + "','" + gs[2] + "'," + gs[3] + ', ' + gs[4] + ', ' + gs[5] + ', ' + gs[6] + ',' + gsTotal + ",'" + day + "'" + ')', function (err, rows) {
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
                message.channel.send('Gearscore adicionado!');
            }
        });
    }
    if (message.content.startsWith(`${prefix}addgs`) && !gs[1].startsWith('<@')) {
        mentions = false;
        gsTotal = insertGsUser(gs, mentions);
        db.query('INSERT INTO gearscore values(' + message.author + ",'" + gs[1] + "', " + gs[2] + ', ' + gs[3] + ', ' + gs[4] + ', ' + gs[5] + ', ' + gsTotal + ",'" + day + "'" + ')', function (err, rows) {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    message.channel.send('GS já cadastrado!');
                }
                else if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Erro no Formato do comando.');
                }
                else {
                    message.channel.send('Erro Desconhecido.');
                    console.log(err.code + 'INSERT INTO gearscore values(' + message.author + "','" + gs[1] + "', " + gs[2] + ', ' + gs[3] + ', ' + gs[4] + ', ' + gs[5] + ', ' + gsTotal + ",'" + day + "'" + ')');
                }
            } else {
                message.channel.send('Gearscore adicionado!');
            }
        });
    }
    if (message.content.startsWith(`${prefix}gs`) && message.content.endsWith('>')) {
        db.query('SELECT id, classe, nivel, ap, apw, dp, gs from gearscore where id = ' + message.mentions.users.first().id, function (err, gs) {
            if (err) {
                if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Comando Não Reconhecido!');
                }
                if (err) {
                    message.channel.send('Erro Desconhecido.');
                }
            } if (gs.length > 0) {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Gearscore",
                        description: "Gearscore do membro <@" + gs[0].id + ">",
                        fields: [
                            { name: "Classe", value: gs[0].classe, inline: true },
                            { name: "Nível", value: gs[0].nivel, inline: true },
                            { name: "Poder de Ataque: ", value: gs[0].ap, inline: true },
                            //{ name: '\u200B', value: '\u200B', inline: true },
                            { name: "AP Awakening", value: gs[0].apw, inline: true },
                            //{ name: '\u200B', value: '\u200B', inline: true },
                            { name: "Defesa", value: gs[0].dp, inline: true },
                            { name: "Gearscore Total", value: gs[0].gs, inline: true }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: "GeromelBOT"
                        }
                    }
                });
            } else {
                message.channel.send('Usuário não cadastrado');
            }
        });
    }
    if (message.content.startsWith(`${prefix}gs`) && !message.content.endsWith('>')) {
        db.query('SELECT id, classe, nivel, ap, apw, dp, gs, log from gearscore where id = ' + message.author, function (err, gs) {
            if (err) {
                if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Comando Não Reconhecido!');
                }
                else {
                    console.log('Erro Desconhecido.');
                }
            } if (gs.length > 0) {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Gearscore",
                        description: "Gearscore do membro <@" + gs[0].id + ">",
                        fields: [
                            { name: "Classe", value: gs[0].classe, inline: true },
                            { name: "Nível", value: gs[0].nivel, inline: true },
                            { name: "Poder de Ataque: ", value: gs[0].ap, inline: true },
                            //{ name: '\u200B', value: '\u200B', inline: true },
                            { name: "AP Awakening", value: gs[0].apw, inline: true },
                            //{ name: '\u200B', value: '\u200B', inline: true },
                            { name: "Defesa", value: gs[0].dp, inline: true },
                            { name: "Gearscore Total", value: gs[0].gs, inline: true }
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: "GeromelBOT"
                        }
                    }
                });
                var check = checkDate(gs[0].log);
                if (check > 30) {
                    console.log('Apenas!');
                } else {
                    console.log('treta');
                }
                console.log(check);
            } else {
                message.channel.send('Usuario não cadastrado');
            }

        });

    }
    if (message.content.startsWith(`${prefix}fixgs`) && gs[1].startsWith('<@')) {
        if (!message.member.roles.cache.get('672193236500217876')) return;
        mentions = true;
        var gsTotal = insertGsUser(gs, mentions);
        //  classe, nivel, ap, apw, dp, gs
        //fixgs @[ARCHER]GoldGoldGold Valkyrie 63 301 303 100
        db.query("UPDATE gearscore SET classe = '" + gs[2] + "', nivel = " + gs[3] + ', ap = ' + gs[4] + ', apw = ' + gs[5] + ', dp = ' + gs[6] + ', gs = ' + gsTotal + " where id = '" + message.mentions.users.first().id + "'", function (err) {
            if (err) {
                if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) message.channel.send('Erro no comando!');

                console.log(err.code + err.errno);
            } else {
                message.channel.send("Gearscore Atualizado!");
            }
        });
    }
    if (message.content.startsWith(`${prefix}fixgs`) && !gs[1].startsWith('<@')) {
        mentions = false;
        gsTotal = insertGsUser(gs, mentions);
        //  classe, nivel, ap, apw, dp, gs
        //!fixgs Musah 62 270 273 316
        db.query("UPDATE gearscore SET classe = '" + gs[1] + "', nivel = " + gs[2] + ', ap = ' + gs[3] + ', apw = ' + gs[4] + ', dp = ' + gs[5] + ', gs = ' + gsTotal + ' where id = ' + message.author, function (err) {
            if (err) {
                console.log(err.code + err.errno);
                console.log(gs[1] + ' ' + gs[2] + ' ' + gs[3] + ' ' + gs[4] + ' ' + gs[5] + ' ' + gsTotal + ' ' + message.author);
                message.channel.send(gsTotal);
            } else {
                message.channel.send("Gearscore Atualizado!");
            }
        });
    }
    if (message.content.startsWith(`${prefix}rank`)) {
        var aux = 0;
        db.query('SELECT id, classe, nivel, ap, apw, dp, gs from gearscore order by gs desc limit 15', function (err, gs) {
            if (err) {
                if (err.code == 'ER_BAD_FIELD_ERROR' || err.errno == 1054) {
                    message.channel.send('Comando Não Reconhecido!');
                }
                else {
                    console.log('Erro Desconhecido.');
                }

            } if (gs.length > 0) {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Gearscore",
                        description: "Rank da Guilda",
                        fields: [
                            { name: "Nome:", value: "<@" + gs[0].id + ">", inline: true },
                            { name: "Classe", value: gs[0].classe, inline: true },
                            { name: "GS: ", value: gs[0].gs, inline: true },

                            { name: "Nome:", value: "<@" + gs[1].id + ">", inline: true },
                            { name: "Classe", value: gs[1].classe, inline: true },
                            { name: "GS: ", value: gs[1].gs, inline: true },

                            { name: "Nome:", value: "<@" + gs[2].id + ">", inline: true },
                            { name: "Classe", value: gs[2].classe, inline: true },
                            { name: "GS: ", value: gs[2].gs, inline: true },

                            { name: "Nome:", value: "<@" + gs[3].id + ">", inline: true },
                            { name: "Classe", value: gs[3].classe, inline: true },
                            { name: "GS: ", value: gs[3].gs, inline: true },

                            /*{ name: "Nome:", value: "<@" + gs[4].id + ">", inline: true },
                            { name: "Classe", value: gs[4].classe, inline: true},
                            { name: "GS: ", value: gs[4].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[5].id + ">", inline: true },
                            { name: "Classe", value: gs[5].classe, inline: true},
                            { name: "GS: ", value: gs[5].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[6].id + ">", inline: true },
                            { name: "Classe", value: gs[6].classe, inline: true},
                            { name: "GS: ", value: gs[6].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[7].id + ">", inline: true },
                            { name: "Classe", value: gs[7].classe, inline: true},
                            { name: "GS: ", value: gs[7].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[8].id + ">", inline: true },
                            { name: "Classe", value: gs[8].classe, inline: true},
                            { name: "GS: ", value: gs[8].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[9].id + ">", inline: true },
                            { name: "Classe", value: gs[9].classe, inline: true},
                            { name: "GS: ", value: gs[9].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[10].id + ">", inline: true },
                            { name: "Classe", value: gs[10].classe, inline: true},
                            { name: "GS: ", value: gs[10].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[11].id + ">", inline: true },
                            { name: "Classe", value: gs[11].classe, inline: true},
                            { name: "GS: ", value: gs[11].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[12].id + ">", inline: true },
                            { name: "Classe", value: gs[12].classe, inline: true},
                            { name: "GS: ", value: gs[12].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[13].id + ">", inline: true },
                            { name: "Classe", value: gs[13].classe, inline: true},
                            { name: "GS: ", value: gs[13].gs, inline: true},

                            { name: "Nome:", value: "<@" + gs[14].id + ">", inline: true },
                            { name: "Classe", value: gs[14].classe, inline: true},
                            { name: "GS: ", value: gs[14].gs, inline: true},*/
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: "GeromelBOT"
                        }
                    }
                });
            } else {
                message.channel.send('TETAS');
            }
        });
    }

    if (message.content.startsWith(`${prefix}brackets`)) message.channel.send("AP/DP Brackets", { files: ["https://cdn.discordapp.com/attachments/278999893903802369/694004818326323260/unknown.png"] });
    if (message.content.startsWith(`${prefix}comandos`)) message.channel.send('Lista de Comandos Disponíveis: !addgs; !gs; !brackets; !comandos');
    if (message.content.startsWith(`${prefix}DALE`)) message.channel.send('DALE', { tts: true });

    if (message.content.startsWith(`${prefix2}`)) {
        message.channel.send(message.content.split("*"), { tts: true });
    }


    function getDayOfTheWeek() {
        var date = new Date();
        var data = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        return data;
    }
});


function checkDate(day) {
    const now = new Date();
    const past = new Date(day);
    const diff = Math.abs(now.getTime() - past.getTime()); 
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); 

    return days;
}
function insertGsUser(gs, mentions) {

    if (mentions) {
        var gsTotal;
        var ap = parseInt(gs[4]);
        var apw = parseInt(gs[5]);
        var dp = parseInt(gs[6]);
        if (gs[4] > gs[5]) gsTotal = ap + dp;
        if (gs[5] > gs[4]) gsTotal = apw + dp;
        if (gs[5] == gs[4]) gsTotal = apw + dp;
    } else {
        var gsTotal;
        var ap = parseInt(gs[3]);
        var apw = parseInt(gs[4]);
        var dp = parseInt(gs[5]);
        if (gs[3] > gs[4]) gsTotal = ap + dp;
        if (gs[4] > gs[3]) gsTotal = apw + dp;
        if (gs[4] == gs[3]) gsTotal = apw + dp;
    }

    return gsTotal;
}

bot.login(token);