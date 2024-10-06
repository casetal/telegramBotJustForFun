const TelegramBot = require("node-telegram-bot-api");
const token = "6536424421:AAE9WZzSyu5tkUSoG4MiJM9csYJBOy1b0aY";
const bot = new TelegramBot(token, { polling: true });

const utilites = require('./utilities.js');

bot.onText("/start", (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "<b>Welcome to the Movie Recommendation Bot! 🎬</b>\n\nAre you looking for your next favorite film? This bot is here to help! Whether you're in the mood for action, romance, comedy, or something else entirely, you'll find the perfect movie suggestion right here.\n\n<code>/movie</code> - random movies with description and casts.",
    { parse_mode: "html" }
  );
});

bot.onText("/movie", (msg) => {
  const chatId = msg.chat.id;
  utilites.randomMovie(bot, chatId);
});

bot.on('message', (msg) => {
    if(msg.text.includes('joyreactor')) {
        utilites.joyreactor(bot, msg.chat.id, msg.message_id, msg.text);
    }
});