const tmi = require("tmi.js");
const fs = require("fs");
const path = require("path");

// Carrega as variáveis do arquivo .env, se ele existir.
// (Em hospedagens que definem variáveis de ambiente direto, o .env não é necessário.)
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch {
  // Sem .env: segue usando as variáveis de ambiente do sistema.
}

const { TWITCH_USERNAME, TWITCH_OAUTH_TOKEN, TWITCH_CHANNEL } = process.env;

if (!TWITCH_USERNAME || !TWITCH_OAUTH_TOKEN || !TWITCH_CHANNEL) {
  console.error(
    "Faltam variáveis de ambiente. Copie .env.example para .env e preencha " +
      "TWITCH_USERNAME, TWITCH_OAUTH_TOKEN e TWITCH_CHANNEL."
  );
  process.exit(1);
}

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "commands.json"), "utf8")
);

const commands = new Map(
  config.comandos.map((c) => [c.nome.toLowerCase(), c])
);
const commandList = [...commands.keys()].join(", ");

const client = new tmi.Client({
  identity: {
    username: TWITCH_USERNAME,
    password: TWITCH_OAUTH_TOKEN.startsWith("oauth:")
      ? TWITCH_OAUTH_TOKEN
      : `oauth:${TWITCH_OAUTH_TOKEN}`,
  },
  channels: [TWITCH_CHANNEL],
});

client.connect().catch((err) => {
  console.error("Não foi possível conectar à Twitch:", err);
  process.exit(1);
});

client.on("connected", (address, port) => {
  console.log(`Bot conectado em ${address}:${port} (canal: ${TWITCH_CHANNEL})`);
});

// ---------- Mensagem automática ----------
// Só é enviada se o chat teve atividade desde a última vez. Assim o bot
// não fica falando sozinho quando a live está offline.
const timer = config.mensagemAutomatica;
let messagesSinceTimer = 0;

if (timer && timer.ativa) {
  setInterval(() => {
    if (messagesSinceTimer < timer.minimoMensagensNoChat) return;
    messagesSinceTimer = 0;
    client.say(TWITCH_CHANNEL, timer.texto);
  }, timer.intervaloMinutos * 60 * 1000);
}

// ---------- Comandos ----------
const lastUsed = new Map(); // nome do comando -> horário do último uso

function hasPermission(cmd, tags) {
  if (cmd.permissao !== "mods") return true;
  const isBroadcaster = tags.badges && tags.badges.broadcaster === "1";
  return Boolean(tags.mod || isBroadcaster);
}

function isOnCooldown(cmd) {
  const cooldownMs = (cmd.cooldownSegundos || 0) * 1000;
  const last = lastUsed.get(cmd.nome) || 0;
  return Date.now() - last < cooldownMs;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function currentTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  messagesSinceTimer++;

  // A primeira palavra é o comando; a segunda (se houver) é o "alvo".
  // Ex: "!abraco @fulano" -> comando "!abraco", alvo "fulano".
  const [first, second] = message.trim().split(/\s+/);
  const cmd = commands.get(first.toLowerCase());
  const target = second ? second.replace(/^@/, "") : "";

  if (!cmd) return;
  if (!hasPermission(cmd, tags)) return;
  if (cmd.exigeAlvo && !target) return;
  if (isOnCooldown(cmd)) return;

  lastUsed.set(cmd.nome, Date.now());

  const user = tags["display-name"] || tags.username;
  const response = cmd.resposta
    .replaceAll("{user}", user)
    .replaceAll("{alvo}", target || "todo mundo")
    .replaceAll("{dado}", String(rollDie(6)))
    .replaceAll("{hora}", currentTime())
    .replaceAll("{comandos}", commandList);

  client.say(channel, response);
});
