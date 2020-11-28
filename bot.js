const Discord = require('discord.js');//
const client = new Discord.Client();//
const ayarlar = require('./ayarlar.json');//
const chalk = require('chalk');//
const moment = require('moment');//
var Jimp = require('jimp');//
const { Client, Util } = require('discord.js');//
const fs = require('fs');//
const db = require('quick.db');//
const express = require('express');//
require('./util/eventLoader.js')(client);//
const path = require('path');//
const snekfetch = require('snekfetch');//
const ms = require('ms');//
//

var prefix = ayarlar.prefix;//
//
const log = message => {//
    console.log(`${message}`);//
};

client.commands = new Discord.Collection();//
client.aliases = new Discord.Collection();//
fs.readdir('./komutlar/', (err, files) => {//
    if (err) console.error(err);//
    log(`${files.length} komut yüklenecek.`);//
    files.forEach(f => {//
        let props = require(`./komutlar/${f}`);//
        log(`Yüklenen komut: ${props.help.name}.`);//
        client.commands.set(props.help.name, props);//
        props.conf.aliases.forEach(alias => {//
            client.aliases.set(alias, props.help.name);//
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};



client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }

    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//--------------------------------------------------------------------------------------\\





//--------------------------------------------------------------------------------------\\



client.on("message" , async msg => {
  
  if(!msg.guild) return;
  if(msg.content.startsWith(ayarlar.prefix+"afk")) return; 
  
  let afk = msg.mentions.users.first()
  
  const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`)
  
  const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`)
 if(afk){
   const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`)
   const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`)
   if(msg.content.includes(kisi3)){

       msg.reply(`Etiketlediğiniz Kişi Afk \nSebep : ${sebep}`)
   }
 }
  if(msg.author.id === kisi){

       msg.reply(`Afk'lıktan Çıktınız`)
   db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkid_${msg.author.id}_${msg.guild.id}`)
   db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`)
    msg.member.setNickname(isim)
    
  }
  
});


//--------------------------------------------------------------------------------------\\

client.on('guildMemberAdd', async(member) => {
let rol = member.guild.roles.cache.find(r => r.name === "🔥 Karantina");
let cezalımı = db.fetch(`cezali_${member.guild.id + member.id}`)
let sürejail = db.fetch(`süreJail_${member.id + member.guild.id}`)
if (!cezalımı) return;
if (cezalımı == "cezali") {
member.roles.add(ayarlar.JailCezalıRol)
 
member.send("Cezalıyken Sunucudan Çıktığın için Yeniden Cezalı Rolü Verildi!")
 setTimeout(function(){
    // msg.channel.send(`<@${user.id}> Muten açıldı.`)
db.delete(`cezali_${member.guild.id + member.id}`)
    member.send(`<@${member.id}> Cezan açıldı.`)
    member.roles.remove(ayarlar.JailCezalıRol);
  }, ms(sürejail));
}
})

//--------------------------------------------------------------------------------------\\

client.on('guildMemberAdd', async(member) => {
let mute = member.guild.roles.cache.find(r => r.name === "🔥 Chat Muted");
let mutelimi = db.fetch(`muteli_${member.guild.id + member.id}`)
let süre = db.fetch(`süre_${member.id + member.guild.id}`)
if (!mutelimi) return;
if (mutelimi == "muteli") {
member.roles.add(ayarlar.MuteliRol)
 
member.send("Muteliyken Sunucudan Çıktığın için Yeniden Mutelendin!")
 setTimeout(function(){
    // msg.channel.send(`<@${user.id}> Muten açıldı.`)
db.delete(`muteli_${member.guild.id + member.id}`)
    member.send(`<@${member.id}> Muten açıldı.`)
    member.roles.remove(ayarlar.MuteliRol);
  }, ms(süre));
}
})

//--------------------------------------------------------------------------------------\\


client.on('guildMemberAdd', async member => {
const data = require('quick.db')
const asd = data.fetch(`${member.guild.id}.jail.${member.id}`)
if(asd) {
let data2 = await data.fetch(`jailrol_${member.guild.id}`)
let rol = member.guild.roles.cache.get(data2)
if(!rol) return;
let kişi = member.guild.members.cache.get(member.id)
kişi.roles.add(rol.id);
kişi.roles.cache.forEach(r => {
kişi.roles.remove(r.id)
data.set(`${member.guild.id}.jail.${kişi.id}.roles.${r.id}`, r.id )})
    data.set(`${member.guild.id}.jail.${kişi.id}`)
  const wasted = new Discord.MessageEmbed()
  .setAuthor(member.user.tag, member.user.avatarURL({ dynamic : true }))
  .setColor(`#f3c7e1`)
  .setDescription(`Jaildan Kaçamazsın!`)
  .setTimestamp()
    member.send(wasted)
} 
  
  
})

//--------------------------------------------------------------------------------------\\

///////////////// Oto Cevap

client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "tag") {
    msg.channel.sendMessage("**✱**");
  }
});
//////////////////////////////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "!tag") {
    msg.channel.sendMessage("**✱**");
  }
});
/////////////////////////////////////

client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "Tag") {
    msg.channel.sendMessage("**✱**");
  }
});

/////////////////Sa-As
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "sa") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});

////////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "sea") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180>"
    );
  }
});
////////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "Sea") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});
//////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "selam") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});
////////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "Selam") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});
///////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "Selamun Aleyküm") {
    msg.reply(
      "**Aleyküm Selam Hoşgeldin  <a:kulaklk:780725807370076180> ** "
    );
  }
});

////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "selamlar") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});
//////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "selamunaleyküm") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});
/////////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "SelamunAleyküm") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});

//////////////
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "Selamun Aleyküm") {
    msg.reply(
      "Aleyküm Selam Hoşgeldin <a:kulaklk:780725807370076180> "
    );
  }
});
//////////https://discord.gg/NP7Ar2j
client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "link") {
    msg.reply(
      "https://discord.gg/g6ru7rs8Mn"
    );
  }
});

client.on("message", async (msg, member, guild) => {
  if (msg.content.toLowerCase() === "!link") {
    msg.reply(
      "https://discord.gg/g6ru7rs8Mn"
    );
  }
});






client.on('userUpdate', async user => {
  let sunucu = client.guilds.cache.get('sunucu id'); //Buraya sunucunuzun IDsini yazın
  let tag = "tag"; //Buraya tagınızı yazın
  let rol = "tag alınca verilecek rol id"; //Buraya tag alındığı zaman verilecek rolün IDsini yazın
  let channel = sunucu.channels.cache.find(x => x.id == 'tag alınca atacağı log kanal id'); //tagrol-log yerine kendi log kanalınızın ismini yazabilirsiniz
  if (!tag) return;
  if (!rol) return;
  if (!channel) return;
  let member = sunucu.members.cache.get(user.id);
  if (!member) return;
  if (!member.roles.cache.has(rol)) {
    if (member.user.username.includes(tag)) {
      member.roles.add(rol)
      const rademoon = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setDescription(`<@${user.id}> Adlı kişi, ${tag} tagımızı aldığından dolayı <@&${rol}> ailemize katıldı!`)
      .setFooter(`CodeArius`)
      channel.send(rademoon)
    }
  }else{
    if (!member.user.username.includes(tag)) {
      member.roles.remove(rol)
      const rademoon = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setDescription(`<@${user.id}> Adlı kişi, ${tag} tagımızı çıkarttığından dolayı <@&${rol}> ailemizden ayrıldı!`)
      .setFooter(`CodeArius`)
      channel.send(rademoon)
    }
  }
});

/////////////////////////////////

client.on('guildMemberAdd', member => {  
 member.setNickname('İsim • Yaş')////YENI GELENLERE VERILCEK ISIM
})