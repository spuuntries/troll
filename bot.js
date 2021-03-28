const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const token = config.token;
const ssnce = config.url.split("/webhooks/").pop();

client.login(token);

client.on("ready", () => {
  console.log(new Date() + ": Troll's thing is ready!");
});

client.on("message", async (message) => {
  if (message.author.id == config.bind) {
    client
      .fetchWebhook(ssnce.split("/")[0], ssnce.split("/")[1])
      .then((wb) => {
        wb.edit({
          name: message.guild.member(message.author).displayName,
          avatar: message.author.displayAvatarURL(),
        }).then((wb) => {
          wb.send(message.content).then(() => {
            if (message.deleted == false) {
              message.delete();
            }
          });
        });
      })
      .catch((er) => {
        console.log(new Date() + ": failed to fetch webhuk!", er);
      });
  }
});
