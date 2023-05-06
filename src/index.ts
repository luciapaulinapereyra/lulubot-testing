const fs = require("fs");
const Jimp = require("jimp");

import path from "path";

require("dotenv").config();
const qrcode = require("qrcode-terminal");
import { Client, MessageMedia, LocalAuth } from "whatsapp-web.js";
import CallService from "./CallService";
import CatService from "./CatService";
import SessionService from "./SessionService";
import DogService from "./DogService";
const country_code = "549";
const number = "02215014468";
const msg = "holasss";
const sticker = MessageMedia.fromFilePath("./cars.jpg");
const SESSION_FILE_PATH = path.join(__dirname + "/data/sessions.json");
const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: path.join(__dirname + "/ffmpeg.exe"),
});

const callService = new CallService(client);
const catService = new CatService(client);
const sessionService = new SessionService(client);
const dogService = new DogService(client);

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
client.setMaxListeners(20); // Establece el límite máximo de oyentes en 20

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

// function createSession(msg) {
//   try {
//     console.log("creando sesion..");
//     readFile();
//     let session = {};
//     session = {
//       number: msg.from,
//     };

//     sessionData.push(session);

//     writeFile();
//     readFile();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// function deleteSession(msg) {
//   try {
//     console.log("borrando sesion..");
//     readFile();
//     const data = sessionData.filter((session) => {
//       return session.number !== msg.from;
//     });
//     sessionData = data;
//     writeFile();
//     readFile();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// function isNumberActive(msg) {
//   console.log("buscando sesión...");
//   readFile();
//   const data = sessionData.findIndex((session) => {
//     return session.number === msg.from;
//   });

//   return data !== -1;
// }

// inicializacion
client.on("message", async (msg) => {
  try {
    const session = await sessionService.getSessionByNumber(msg.from);

    if (msg.body.toLowerCase().includes("/on") && !session.isActive) {
      client.sendMessage(
        msg.from,
        "Holaa, soy un bot :) Ahora que estoy encendido, podes enviarme imagenes y las convertiré en stickers. No olvides escribir /off cuando quieras desactivarme! (por favor desactivame cuando termines porque mi creadora es pobre y no tiene mucho almacenamiento de sesiones)"
      );
      session.isActive = true;
      await sessionService.updateSession(session);
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error, intentalo más tarde :P");
    console.log(error);
    throw error;
  }
});

// despedida
client.on("message", async (msg) => {
  try {
    const session = await sessionService.getSessionByNumber(msg.from);
    if (msg.body.toLowerCase().includes("/off")) {
      client.sendMessage(msg.from, "Nos vemos! :)");

      session.isActive = false;
      await sessionService.updateSession(session);
    }
  } catch (error) {
    client.sendMessage(
      msg.from,
      "Ups! hubo un error al cerrar la sesión, intentalo mas tarde :/"
    );
    throw error;
  }
});

// saludo
client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase().includes("hola") ||
      msg.body.toLowerCase() === "ola" ||
      msg.body.toLowerCase().includes("holi") ||
      msg.body.toLowerCase().includes("holis")
    ) {
      client.sendMessage(
        msg.from,
        "Hola 🙋🏻‍♀️ me alegra que me saludes! recuerda escribir /on para la creación de stickers! \n Para ver el menú podés escribir /menu"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

// MISC
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

// MISC
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

// MISC
client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase().includes("lali") ||
      msg.body.toLowerCase().includes("cantante fav") ||
      msg.body.toLowerCase().includes("dillom")
    ) {
      client.sendMessage(
        msg.from,
        "Mis dos cantantes favoritos del momento son lali y dillom, te recomiendo escucharlos :)"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    console.log(error);
    throw error;
  }
});

// ERROR HANDLER
client.on("message", (msg) => {
  try {
    if (
      msg.body.toLowerCase() === "on" ||
      msg.body.toLowerCase() === "on/" ||
      msg.body.toLowerCase() === "!sticker" ||
      msg.body.toLowerCase() === "on /" ||
      msg.body.toLowerCase() === ".sticker" ||
      msg.body.toLowerCase() === "st" ||
      msg.body.toLowerCase() === "sticker" ||
      msg.body.toLowerCase() === "/ on"
    ) {
      client.sendMessage(
        msg.from,
        "Ups, comando equivocado! recuerda que para encenderme debes escribir /on"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

// SESSION MANAGMENT
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
        "Ups, comando equivocado! recuerda que para apagarme debes escribir /off"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

// async function createTextSticker(txt, media) {
//   const fileExtension = media.mimetype.split("/")[1];
//   const tempFilePath = `temp-${Date.now()}.${fileExtension}`;
//   await fs.promises.writeFile(
//     tempFilePath,
//     Buffer.from(media.data, "base64").toString("binary"),
//     "binary"
//   );

//   // Cargar la imagen descargada
//   const image = await Jimp.read(tempFilePath);

//   // Cargar la fuente de texto
//   const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
//   // Imprimir el texto encima de la

//   image.print(
//     font,
//     image.getWidth() / 2,
//     image.getHeight() / 3,
//     txt,
//     image.getWidth()
//   );
//   // Obtener un buffer de la imagen resultante en formato PNG
//   const buffer = await image.getBufferAsync(Jimp.AUTO);
//   await fs.promises.writeFile(
//     "result-" + tempFilePath,
//     buffer.toString("binary"),
//     "binary"
//   );
//   return "result-" + tempFilePath;
// }

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

// foto a sticker (MAIN)
client.on("message", async (pic) => {
  const session = await sessionService.getSessionByNumber(pic.from);

  if (pic.hasMedia && session.isActive) {
    const media = await pic.downloadMedia();
    await client.sendMessage(pic.from, media, {
      sendMediaAsSticker: true,
      stickerAuthor: "lulu bot :)",
    });
    session.amountOfStickersCreated += 1;
    session.lastStickerCreated = new Date().valueOf();
    await sessionService.updateSession(session);
  }
});

// menu
client.on("message", (msg) => {
  try {
    if (msg.body.toLowerCase().includes("/menu")) {
      client.sendMessage(
        msg.from,
        "Bienvenido al menú de lulu bot!🌺 \n\n/on - activar bot \n/off - desactivar bot \n/menu - menú \n/info - información \n/new - novedades \n/cat - sticker de gatito \n/dog - sticker de perrito"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

// menu novedades
client.on("message", (msg) => {
  try {
    if (msg.body.toLowerCase().includes("/news")) {
      client.sendMessage(
        msg.from,
        "*Novedadess!* \n\nBienvenido al nuevo sector de novedades, acá voy a estar anunciando las cosas nuevas que le vaya poniendo al bot.\n\nEn este caso, tenemos dos nuevas funcionalidades: */cat* que básicamente te devuelve un sticker de un gatito random y */dog* que te devuelve un sticker de un perrito random, la verdad me pareció divertido y espero que les guste tanto como a mi 🤍 \n\n*Nota importante:* Por favor no spamees las funcionalidades /cat y /dog ya que ahora mismo tenemos muchos usuarios conectados y eso va a hacer que todo sea mas lento :/"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

// meun info
client.on("message", (msg) => {
  try {
    if (msg.body.toLowerCase().includes("/info")) {
      client.sendMessage(
        msg.from,
        "Hola! soy lulu bot, un bot creado por lulu (si, nos llamamos igual porque 0 imaginación) \nmi función es enviarte stickers de las imagenes que quieras, espero que te gusten :) \nRecuerda que por mas de que sea un bot, lulu monitorea la cuenta para que nadie suba cosas asquerosas, asi que porfa no lo hagas, gracias! \nSi te gustaria colaborar conmigo, puedes responder una encuesta que hice para poder mejorar! Link: https://n9.cl/rx5ls \n\nY también no olvides que podes compartirme con tus amigos/familiares o en twitter, eso me ayudaría mucho! \n\n Gracias por usar lulu bot! <3"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

//llamadas
client.on("call", (call) => {
  callService.onCall(call);
});

client.on("message", async (msg) => {
  const session = await sessionService.getSessionByNumber(msg.from);

  if (msg.body === "/cat" && session.isActive) {
    const hasSentPussyPic = await catService.onMessage(msg);

    if (!hasSentPussyPic) return;

    session.amountOfStickersCreated += 1;
    session.lastStickerCreated = new Date().valueOf();
    await sessionService.updateSession(session);
  }
});

client.on("message", async (msg) => {
  const session = await sessionService.getSessionByNumber(msg.from);

  if (msg.body === "/dog" && session.isActive) {
    const hasSentPuppyPic = await dogService.onMessage(msg);

    if (!hasSentPuppyPic) return;

    session.amountOfStickersCreated += 1;
    session.lastStickerCreated = new Date().valueOf();
    await sessionService.updateSession(session);
  }
});
