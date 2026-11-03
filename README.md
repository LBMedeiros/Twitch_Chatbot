# 🤖 Twitch Chatbot (VoippBot)

A small Twitch chat bot built with Node.js and [tmi.js](https://github.com/tmijs/tmi.js). It answers chat commands defined in a JSON file and posts a recurring message in the chat.

I built it while learning backend development and automation.

## Features

- **Configurable commands**: every command lives in `commands.json`. You can add or change one without touching the code.
- **Per-command cooldown**: each command has its own cooldown, so nobody can spam it.
- **Permissions**: a command can be open to everyone (`"todos"`) or restricted to moderators and the broadcaster (`"mods"`).
- **Placeholders** in responses:
  - `{user}` is replaced by the name of the person who used the command.
  - `{comandos}` is replaced by the list of all commands, so `!comandos` never goes out of date.
- **Timed message**: posts a message every few minutes, but only when the chat has had activity since the last one. That keeps it quiet while the stream is offline.

## Getting started

Requires **Node.js 20.12 or newer**.

```bash
git clone https://github.com/LBMedeiros/Twitch_Chatbot.git
cd Twitch_Chatbot
npm install
cp .env.example .env
```

Fill in `.env`:

```env
TWITCH_USERNAME=your_bot_username
TWITCH_OAUTH_TOKEN=your_token_here
TWITCH_CHANNEL=your_channel
```

Then start the bot:

```bash
npm start
```

> ⚠️ `.env` is in `.gitignore`. Never commit your OAuth token. If one leaks, revoke it and generate a new one.

You can get a chat token for the bot account with a tool such as [Twitch Token Generator](https://twitchtokengenerator.com/).

## Configuring commands

Edit `commands.json`:

```json
{
  "nome": "!ping",
  "resposta": "{user} Pong! 🏓",
  "descricao": "Testa se o bot está respondendo.",
  "permissao": "todos",
  "cooldownSegundos": 5
}
```

| Field              | Meaning                                                |
| ------------------ | ------------------------------------------------------ |
| `nome`             | The command people type in chat                         |
| `resposta`         | What the bot replies (supports `{user}` and `{comandos}`) |
| `descricao`        | A note for you about what the command does              |
| `permissao`        | `"todos"` (everyone) or `"mods"` (mods and broadcaster) |
| `cooldownSegundos` | Seconds before the command can be used again            |

The timed message is set in the `mensagemAutomatica` block of the same file: its text, how often it is sent (`intervaloMinutos`), and how many chat messages must have been sent since the last one (`minimoMensagensNoChat`).

Restart the bot after changing `commands.json`.

## Ideas for the future

- Web dashboard to manage commands
- Twitch API integration (for example, real live/offline detection)
- Commands that store data, such as counters

## Author

Developed by Lucas Medeiros.
