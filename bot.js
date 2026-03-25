const tmi = require("tmi.js");
const fs = require("fs");

//carregar comandos do JSON
const commandsData = JSON.parse(fs.readFileSync("./commands.json", "utf8"));

const client = new tmi.Client({
  identity: {
    username: "BOT NAME",
    password: "oauth: PASSWORD",
  },
  channels: ["voipp_"],
});

client.connect();

client.on("connected", (address, port) => {
  console.log(`Bot conectado em ${address}:${port}`);
});

//mensagem automática
setInterval(() => {
  client.say("#voipp_", "🔥 Siga o canal para não perder as lives!");
}, 500000);

//cooldown global
let cooldown = false;

client.on("message", async (channel, tags, message, self) => {
  if (self) return;

  const command = message.toLowerCase().trim();

  //procurar comando no JSON
  const cmd = commandsData.comandos.find((c) => c.nome === command);

  if (cmd) {
    let resposta = cmd.resposta;

    //variáveis dinâmicas
    resposta = resposta.replace("{user}", tags.username);

    client.say(channel, resposta);
    return;
  }

  //cooldown global
  if (cooldown) return;

  cooldown = true;

  setTimeout(() => {
    cooldown = false;
  }, 3000);
});
