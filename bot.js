const Discord = require("discord.js");
const client = new Discord.Client();
const inquirer = require("inquirer");

inquirer
  .prompt([
    {
      type: "input",
      name: "url",
      message:
        "What's the webhook's URL? (https://ptb.discord.com/api/webhooks/...)",
      validate: function (val) {
        if (val.split("/").length == 7 && val.includes("/webhooks/")) {
          return true;
        }
        return "Enter a valid webhook URL!";
      },
    },
    {
      type: "input",
      name: "token",
      message: "What's the bot's token?",
    },
    {
      type: "input",
      name: "bind",
      message: "What's the bound user's ID?",
    },
  ])
  .then((answers) => {
    const config = answers;
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
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log(
        new Date() + ": couldn't render prompt! \nWhat OS are you using?"
      );
    } else {
      console.log(new Date() + ": unknown error! \nContact kek >.>");
    }
  });
