const https = require('https');
const json = require('./movies.json');

/*
    Парсим пост с joyreactor и отправляем в чат с удалением сообщения отправителя.
*/
const getJoyreactor = (bot, chatId, messageId, text) => {
    try {
        https.get(text, (res) => {
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
        }).on('error', (err) => {
            console.log(err);
        });
    }
    catch (err) { console.log(err) }
}

/*
    Отправляем рандомный фильм
*/
const getRandomMovie = (bot, chatId) => {
    const randomMovie = json[random(0, json.length)];
    
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

/*
    Отправляем рандомное изображение с поискового запроса
    
    TODO:
    - Переделать под duckduckgo
    - Обработать если ничего не нашло или кривая ссылка изображения.
*/
const getResultImages = (bot, chatId, text) => {
    text = text.replace('/search ', '').replace('/search@alexey_mr_bot ', '');

    console.log(`https://yandex.ru/images/search?from=tabbar&text=${text}`);
    let html = "";

    https.get(`https://www.yandex.ru/images/search?from=tabbar&text=${encodeURI(text)}`, (res) => {
        console.log(res.statusCode);

        if(res.statusCode == 302) {
            console.log(res.headers.location);
        }
        
        res.setEncoding('utf8');
        res.on('data', (data) => {
            html += data;
        })
        res.on('end', () => {
            const result = html.match(/https?:\/\/(.*?)(?:png|jpg)/g);
            
            if(result) {
                bot.sendPhoto(chatId, result[random(0, result.length)].replace(';', ''), {
                    caption: `Результат по запросу: ${text}`
                });
            } else {
                console.log(html);
            }
        })
    })

}

/*
    Отправляем рандомный анекдот
*/
const getAneks = (bot, chatId) => {
    let html = "";
    let url = `https://baneks.ru/${random(1, 1200)}`;
    https.get(url, (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
            html += data;
        })
        res.on('end', () => {
            const result = html.match(/<article>(.*?)<p>(.*?)<\/p>(.*?)<\/article>/gs);
            console.log(url, result);
            if(result) {
                bot.sendMessage(chatId, result.join('').replace(/<h2>(.*?)<\/h2>/, '').replace(/<(.*?)>/g, ''));
            }
        })
    })
}

/*
    Функция рандома чисел
*/
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = {
    joyreactor: getJoyreactor,
    randomMovie: getRandomMovie,
    imageResult: getResultImages,
    anek: getAneks
};