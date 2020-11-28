//SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA
const { MessageEmbed } = require("discord.js");
// module.exports.onLoad = (client) => {}
module.exports.run = (client, message, args) => {
  
  if(!['778951397453987861'].some(role => message.member.roles.cache.get(role)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new MessageEmbed().setColor('RED').setAuthor(`Başarısız !`).setDescription(`Bu Komutu Kullanmak İçin Yetkiniz Bulunmamakta <a:no:776484326215909427> \n \`u!ban @Etiket Sebep\` `))


  let tag = "✱";
  const kızüye = message.guild.roles.cache.get("778951416655380510").members.size
  const erkeküye = message.guild.roles.cache.get("778951419529134101").members.size
  const booster = message.guild.roles.cache.get("780672314417086464").members.size
  const online = message.guild.members.cache.filter(u => u.presence.status != "offline").size
  const ttag = message.guild.members.cache.filter(m => m.user.username.includes(tag)).size
  const toplam = message.guild.memberCount
  const ses = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b) 

  const embed = new MessageEmbed()
  .setTimestamp()
  .setColor('BLACK')
  .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
  message.channel.send(embed.setDescription(` <a:desttik:778388678472368130> **Toplam Üye   ・ ${toplam}
  <a:seytan:780725731348578314> Erkek Üye  ・ ${erkeküye}
  <a:siyahgul:780725836558237756> Bayan Üye  ・ ${kızüye}
  <a:uyuyakald:781167399830552586> Aktif Üye  ・ ${online}
  <a:sonsuzluk:780726079940722689>    Taglı Üye  ・ ${ttag}
  <a:booster:781169197291405343> Booster Üye  ・${booster}
  <a:kulaklk:780725807370076180> Sesteki Üye  ・${ses}**`));
};

  exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["say"],
  permLvl: 0,
}

  exports.help = {
  name: 'say'
}

//SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA SAD X MAMY SAD X STRIGA