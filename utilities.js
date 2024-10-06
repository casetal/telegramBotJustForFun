const https = require('https');
const fs = require("fs");

const getJoyreactor = (bot, chatId, messageId, text) => {
    try {
        https.get(text, function (res) {
            res.setEncoding('utf8');
            res.on('data', (data) => {
                const result = data.match(/}, "headline": "(.*?)"(.*?)"url": "\/\/(.*?)"/);
                if (result) {
                    const image = `https://${result[3]}`;
                    const title = `${result[1]}\n\n🔗 Оригинальный пост: ${text}`;

                    console.log(image)
                    bot.sendPhoto(chatId, image, {
                        caption: title
                    });
                    bot.deleteMessage(chatId, messageId);
                }
            });
        }).on('error', function (err) {
            console.log(err);
        });
    }
    catch (err) { console.log(err) }
}

const getRandomMovie = (bot, chatId) => {
    const randomMovie = getMovie();

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
}

const getMovie = () => {
    const json = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));
    return json[random(0, json.length)];
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = {
    joyreactor: getJoyreactor,
    randomMovie: getRandomMovie
};