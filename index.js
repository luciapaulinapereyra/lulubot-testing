const fs = require("fs");
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia } = require("whatsapp-web.js");
const SESSION_FILE_PATH = "./session.json";

const country_code = "549";
const number = process.env.CELLPHONE;
console.log(number);
console.log(process.env);
const msg = "hola";
const sticker = MessageMedia.fromFilePath("./cars.jpg");
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, "utf-8"));
}

const client = new Client({
  session: sessionData,
  executablePath: "./ffmpeg.exe",
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", (msg) => {
  console.error("Hubo un problema", msg);
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
  } else if (msg.body === "flor") {
    client.sendMessage(msg.from, "Flor? tremenda diosa uf uf");
  } else if (msg.body === "tharken") {
    client.sendMessage(msg.from, "Tharken? se la re come");
  } else if (msg.body === "cars") {
    client.sendMessage(msg.from, sticker, { sendMediaAsSticker: true });
  } else if (msg.body === "lulu") {
    client.sendMessage(msg.from, "La mas bella del condado");
    console.log(msg.from);
  } else if (msg.body === "silvia") {
    client.sendMessage(msg.from, "Silvia? La mejor mamá <3");
  }
});

//esto todavía esta mal.
client.on("message", (msg) => {
  if (msg.body === "lulubot") {
    client.sendMessage(
      msg.from,
      "Hola! soy el bot de lulu. Manda una imagen y te la enviare rapidamente en sticker :) "
    );
    client.on("message", async (foto) => {
      if (foto.hasMedia) {
        const media = await foto.downloadMedia();
        // do something with the media data here
        client
          .sendMessage(foto.from, media, { sendMediaAsSticker: true })
          .then((response) => {
            if (response.id.fromMe) {
              console.log("El sticker fue enviado");
            }
          });
        return;
      }
    });
    return;
  }
  return;
});
