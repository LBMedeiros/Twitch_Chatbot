🤖 Twitch Chatbot

This project is a chatbot developed using JavaScript and Node.js to automate messages and interactions in a Twitch chat.

It was created as part of my learning journey in backend development and automation.

🚀 Features

Automatic message sending in chat

Custom command responses

Integration with StreamElements (complementary usage)

Custom tag system for extended functionality

🛠️ Technologies Used

JavaScript

Node.js

tmi.js

⚙️ Getting Started

Follow these steps to run the project locally:

1. Clone the repository
git clone https://github.com/LBMedeiros/Twitch_Chatbot.git
2. Install dependencies
npm install
3. Configure your credentials

Open the main file (e.g. index.js) and add your Twitch credentials:

identity: {
  username: 'your_bot_username',
  password: 'oauth:your_token_here'
}

⚠️ Never share your OAuth token publicly.

4. Run the bot
node index.js
🔐 Configuration

To use this bot, you need a Twitch OAuth token.

You can generate one from Twitch or tools like Twitch Token Generator.

For better security, consider using environment variables (.env) instead of hardcoding your credentials.

📸 Demo

Example of the bot running in a Twitch chat:

(You can add a screenshot or GIF here)

📈 Future Improvements

Web dashboard for managing commands

Deeper Twitch API integration

Permission system (mods, subs, etc.)

Database support for dynamic commands

👨‍💻 Author

Developed by Lucas Medeiros.

💡 Notes

This project is continuously evolving as I improve my programming skills and explore new features.
