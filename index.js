const fs = require("fs");
const { syncBuiltinESMExports } = require("module");
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia , LocalAuth } = require("whatsapp-web.js");
const country_code = "549";
const number = "1154215012";
const msg = "holasss";
const sticker = MessageMedia.fromFilePath("./cars.jpg");

const client = new Client({
  authStrategy: new LocalAuth(),
  executablePath: "./ffmpeg.exe",
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});


client.on("ready", () => {
  console.log("el cliente está listo");

  let chatId = country_code + number + "@c.us";

  client.sendMessage(chatId, msg).then((response) => {
    if (response.id.fromMe) {
      console.log("El mensaje fue enviado");
    }
  });

  client
    .sendMessage(chatId, sticker, { sendMediaAsSticker: true })
    .then((response) => {
      if (response.id.fromMe) {
        console.log("El sticker fue enviado");
      }
    });
});

client.on("message", (msg) => {
  if (msg.body === "chimuelo") {
    client.sendMessage(msg.from, "El mejor dragoncito <3");
  } else if (msg.body === "cars") {
    client.sendMessage(msg.from, sticker, { sendMediaAsSticker: true });
  } else if (msg.body === "lulu") {
    client.sendMessage(msg.from, "La mas bella del condado");
    console.log(msg.from);
  }
});

client.on("message", async (foto) => {
 console.log(foto.from);
  if(foto.from === "5492964459936@c.us") {
    if (foto.hasMedia) {
      const media = await foto.downloadMedia();
      // do something with the media data here
        console.log("me llego una fotooo");
        client
        .sendMessage(foto.from, media, { sendMediaAsSticker: true })
        .then((response) => {
          if (response.id.fromMe) {
            console.log("El sticker fue enviado");
          }
        });
      return;
    }
  }


});
