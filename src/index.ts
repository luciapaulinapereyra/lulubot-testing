const fs = require("fs");
const Jimp = require("jimp");

import path from "path";
import json1 from "./data/callNumbers.json";
import json2 from "./data/loveWords.json";
import json3 from "./data/sessions.json";
import json4 from "./data/thanksWords.json";

require("dotenv").config();
const qrcode = require("qrcode-terminal");
import { Client, MessageMedia, LocalAuth } from "whatsapp-web.js";
import CallService from "./CallService";

const country_code = "549";
const number = "1154215012";
const msg = "holasss";
const sticker = MessageMedia.fromFilePath("./cars.jpg");
const SESSION_FILE_PATH = path.join(__dirname + "/data/sessions.json");
const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: path.join(__dirname + "/ffmpeg.exe"),
});

const callService = new CallService(client);

let jsonLoveWords = fs.readFileSync(
  path.join(__dirname + "/data/loveWords.json"),
  "utf-8"
);
let loveWords = JSON.parse(jsonLoveWords);
let jsonThanksWords = fs.readFileSync(
  path.join(__dirname + "/data/thanksWords.json"),
  "utf-8"
);
let jsonSessions = fs.readFileSync(SESSION_FILE_PATH, "utf-8");
let thanksWords = JSON.parse(jsonThanksWords);

let sessionData = [];

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

function readFile() {
  jsonSessions = fs.readFileSync(SESSION_FILE_PATH, "utf-8"); //read json
  sessionData = JSON.parse(jsonSessions); //conver json to array
}

function writeFile() {
  let data = JSON.stringify(sessionData, null, 1); //convert array to JSON
  fs.writeFileSync(SESSION_FILE_PATH, data); //write
}

function createSession(msg) {
  try {
    console.log("creando sesion..");
    readFile();
    let session = {};
    session = {
      number: msg.from,
    };

    sessionData.push(session);

    writeFile();
    readFile();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function deleteSession(msg) {
  try {
    console.log("borrando sesion..");
    readFile();
    const data = sessionData.filter((session) => {
      return session.number !== msg.from;
    });
    sessionData = data;
    writeFile();
    readFile();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function isNumberActive(msg) {
  console.log("buscando sesión...");
  readFile();
  const data = sessionData.findIndex((session) => {
    return session.number === msg.from;
  });

  return data !== -1;
}

client.on("message", (msg) => {
  try {
    if (msg.body === "/on") {
      createSession(msg);
      client.sendMessage(
        msg.from,
        "Holaa, soy un bot :) Ahora que estoy encendido, podes enviarme imagenes y las convertiré en stickers. No olvides escribir /off cuando quieras desactivarme! (por favor desactivame cuando termines porque mi creadora es pobre y no tiene mucho almacenamiento de sesiones). Es probable que a la madrugada no funcione :("
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error, intentalo más tarde :P");
    console.log(error);
    throw error;
  }
});

client.on("message", (msg) => {
  try {
    if (msg.body === "/off") {
      deleteSession(msg);
      client.sendMessage(msg.from, "Nos vemos! :)");
    }
  } catch (error) {
    client.sendMessage(
      msg.from,
      "Ups! hubo un error al cerrar la sesión, intentalo mas tarde :/"
    );
    throw error;
  }
});

client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase().includes("hola") ||
      msg.body.toLowerCase().includes("ola")
    ) {
      client.sendMessage(
        msg.from,
        "Hola <3 me alegra que me saludes! recuerda escribir /on para la creación de stickers"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase().includes("gracias") ||
      msg.body.toLowerCase().includes("grax")
    ) {
      const res = getRandomWords(thanksWords);
      client.sendMessage(msg.from, res);
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

function getRandomWords(file) {
  return file.words[Math.floor(Math.random() * file.words.length)];
}

client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase().includes("tkm") ||
      msg.body.toLowerCase().includes("te quiero") ||
      msg.body.toLowerCase().includes("te amo") ||
      msg.body.toLowerCase().includes("t amo")
    ) {
      const res = getRandomWords(loveWords);
      client.sendMessage(msg.from, res);
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    console.log(error);
    throw error;
  }
});

client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase() === "on" ||
      msg.body.toLowerCase() === "on/" ||
      msg.body.toLowerCase() === "!sticker" ||
      msg.body.toLowerCase() === "on /" ||
      msg.body.toLowerCase() === ".sticker" ||
      msg.body.toLowerCase() === "st"
    ) {
      client.sendMessage(
        msg.from,
        "Ups, comando equivocado! recuerda que para encenderme debes escribir /on :)"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase() === "of" ||
      msg.body.toLowerCase() === "off/" ||
      msg.body.toLowerCase() === "off" ||
      msg.body.toLowerCase() === "/of"
    ) {
      client.sendMessage(
        msg.from,
        "Ups, comando equivocado! recuerda que para apagarme debes escribir /off :)"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

async function createTextSticker(txt, media) {
  const fileExtension = media.mimetype.split("/")[1];
  const tempFilePath = `temp-${Date.now()}.${fileExtension}`;
  await fs.promises.writeFile(
    tempFilePath,
    Buffer.from(media.data, "base64").toString("binary"),
    "binary"
  );

  // Cargar la imagen descargada
  const image = await Jimp.read(tempFilePath);

  // Cargar la fuente de texto
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  // Imprimir el texto encima de la

  image.print(
    font,
    image.getWidth() / 2,
    image.getHeight() / 3,
    txt,
    image.getWidth()
  );
  // Obtener un buffer de la imagen resultante en formato PNG
  const buffer = await image.getBufferAsync(Jimp.AUTO);
  await fs.promises.writeFile(
    "result-" + tempFilePath,
    buffer.toString("binary"),
    "binary"
  );
  return "result-" + tempFilePath;
}

// client.on("message", async (pic) => {
//   console.log(pic.from);
//   const Jimp = require("jimp");

//   if (pic.hasMedia && isNumberActive(pic)) {
//     const media = await pic.downloadMedia();

//     const pathResult = await createTextSticker(pic.body, media);
//     // Enviar el sticker creado al chat
//     const mediaResponse = MessageMedia.fromFilePath(pathResult);
//     await client.sendMessage(pic.from, mediaResponse, {
//       sendMediaAsSticker: true,
//       stickerAuthor: "lulu bot :)",
//     });
//   }
// });

client.on("message", async (pic) => {
  console.log(pic.from);

  if (pic.hasMedia && isNumberActive(pic)) {
    const media = await pic.downloadMedia();
    client
      .sendMessage(pic.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: "lulu bot :)",
      })
      .then((response) => {
        if (response.id.fromMe) {
          console.log("El sticker fue enviado :)");
        }
      });
  }
});

//llamadas
client.on("call", (call) => {
  callService.onCall(call);
});
