const tmi = require("tmi.js");
const fs = require("fs");

const commandsData = JSON.parse(fs.readFileSync("./commands.json", "utf8"));

const client = new tmi.Client({
  identity: {
    username: "voippbot",
    password: "oauth:5zeqf4g6k1szolk29hug94e7daurks",
  },
  channels: ["voipp_"],
});

client.connect();

client.on("connected", (address, port) => {
  console.log(`Bot conectado em ${address}:${port}`);
});

setInterval(() => {
  client.say("#voipp_", "🔥 Siga o canal para não perder as lives!");
}, 500000);

let cooldown = false;

client.on("message", async (channel, tags, message, self) => {
  if (self) return;

  const command = message.toLowerCase().trim();

  const cmd = commandsData.comandos.find((c) => c.nome === command);

  if (cmd) {
    let resposta = cmd.resposta;

    resposta = resposta.replace("{user}", tags.username);

    client.say(channel, resposta);
    return;
  }

  if (cooldown) return;

  cooldown = true;

  setTimeout(() => {
    cooldown = false;
  }, 3000);
});
