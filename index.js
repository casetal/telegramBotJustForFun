const { log } = require("console");
const fs = require("fs");
const https = require('https');

const TelegramBot = require("node-telegram-bot-api");
const token = "6536424421:AAE9WZzSyu5tkUSoG4MiJM9csYJBOy1b0aY";
const bot = new TelegramBot(token, { polling: true });

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
  const randomMovie = getMovie();

  console.log(`Username: @${msg.chat.username}, movie: ${randomMovie.title}`);

  if (randomMovie.thumbnail) {
    bot.sendPhoto(chatId, randomMovie.thumbnail, {
      caption:
        "📺 " + randomMovie.title +
        (randomMovie.year ? ` (${randomMovie.year})` : "") +
        (randomMovie.extract ? `\n\n<i>${randomMovie.extract}</i>` : "") +
        (randomMovie.cast
          ? `\n\n👥 <b>Cast:</b> ${randomMovie.cast.join(", ")}`
          : "") +
        (randomMovie.genres
          ? `\n❓ <b>Genres:</b> ${randomMovie.genres.join(", ")}`
          : "") +
        (randomMovie.href
          ? `\n🔗 <b>Wiki:</b> https://en.wikipedia.org/wiki/${randomMovie.href}`
          : ""),
      parse_mode: "html",
    });
  } else {
    bot.sendMessage(chatId, randomMovie.title);
  }
});

const getMovie = () => {
  const json = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));
  return json[random(0, json.length)];
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
