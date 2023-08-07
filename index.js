const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");

dotenv.config();

const { TOKEN } = process.env;

const token = TOKEN;
const webAppUrl = "https://tg-bot-test-solik.netlify.app/";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появиться кнопка заполни форму", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Заполнить форму",
              web_app: { url: webAppUrl + "form" },
            },
          ],
        ],
      },
    });

    await bot.sendMessage(chatId, "Заходи к нам в магазин", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
});
