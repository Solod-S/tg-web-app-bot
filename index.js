const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const { TOKEN, WEB_APP_URL, PORT } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  // слушатель событий сообщения
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появиться кнопка заполни форму", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Заполнить форму",
              web_app: { url: WEB_APP_URL + "form" },
            },
          ],
        ],
      },
    });

    await bot.sendMessage(chatId, "Заходи к нам в магазин", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", web_app: { url: WEB_APP_URL } }],
        ],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    // ловим данные отправленные с веб приложения (c формы)
    try {
      const data = await JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, "Спасибо за ваше сообщение");
      console.log(data);
      await bot.sendMessage(chatId, "Ваша страна: " + data?.country);
      await bot.sendMessage(chatId, "Ваша улица: " + data?.street);
      setTimeout(async () => {
        await bot.sendMessage(chatId, "Всю информацию вы получите в этом чате");
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products = [], totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешная покупка",
      input_message_content: {
        message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products
          .map((item) => item.title)
          .join(", ")}`,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Не удалось приобрести товар",
      input_message_content: {
        message_text: `Не удалось приобретси товар`,
      },
    });
    return res.status(500).json({});
  }
});

app.listen(PORT, () => console.log("server started on PORT " + PORT));
