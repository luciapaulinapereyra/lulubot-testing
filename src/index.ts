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
import MemeService from "./MemeService";
const country_code = "549";
const number = "02215014468";
const msg = "holasss";
const sticker = MessageMedia.fromFilePath("./cars.jpg");

const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: path.join(__dirname + "/ffmpeg.exe"),
});

const callService = new CallService(client);
const catService = new CatService(client);
const sessionService = new SessionService(client);
const dogService = new DogService(client);
const memeService = new MemeService(client);

let jsonLoveWords = fs.readFileSync(
  path.join(__dirname + "/data/loveWords.json"),
  "utf-8"
);
let loveWords = JSON.parse(jsonLoveWords);
let jsonThanksWords = fs.readFileSync(
  path.join(__dirname + "/data/thanksWords.json"),
  "utf-8"
);

let thanksWords = JSON.parse(jsonThanksWords);

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

// inicializacion
client.on("message", async (msg) => {
  try {
    const session = await sessionService.getSessionByNumber(msg.from);

    if (msg.body.toLowerCase().includes("/on") && !session.isActive) {
      client.sendMessage(
        msg.from,
        "Estoy encendido! ahora podes enviarme imagenes y las convertiré en stickers.\nNuestro servidor está con alta demanda, si me tardo en responder es porque hay muchos usuarios conectados, por favor se paciente :)\nSi haces spam de mensaje te vamos a tener que bloquear 😪"
      );
      session.isActive = true;
      await sessionService.updateSession(session);
    } else if (msg.body.toLowerCase().includes("/on") && session.isActive) {
      client.sendMessage(
        msg.from,
        "Ya estoy encendido :) no es necesario que me vuelvas a encender ya que anteriormente no me apagaste. Recuerda que si quieres apagarme debes escribir /off"
      );
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
      "Ups! hubo un error, porfavor intenta más tarde :/"
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

// // ERROR HANDLER
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

  if (
    (pic.hasMedia && session.isActive) ||
    (pic.hasMedia && pic.body.toLowerCase() === "/sticker")
  ) {
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
    if (
      msg.body.toLowerCase().includes("/menu") ||
      msg.body.toLowerCase().includes("/menú") ||
      msg.body.toLowerCase().includes("menu") ||
      msg.body.toLowerCase().includes("menú")
    ) {
      client.sendMessage(
        msg.from,
        "Bienvenido al menú de lulu bot!🌺 \n\n*/on* - activar bot para crear varios stickers al mismo tiempo \n*/off* - desactivar bot\n*/sticker* - mandá una imagen con la leyenda /sticker y te la convierte en sticker \n*/menu* - menú \n*/info* - información \n*/news* - novedades \n*/cat* - sticker de gatito \n*/dog* - sticker de perrito\n*/meme* - crea un sticker de tu propio meme\n*/faq* - preguntas frecuentes"
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
        "*Novedadess!* \n\nBienvenido al nuevo sector de novedades, acá voy a estar anunciando las cosas nuevas que le vaya poniendo al bot.\n\nEn este caso agregamos un nuevo comando: */meme*. Al escribir este comando, te va a responder con un link para que puedas generar tus propios memes y después hacerlos stickers! \n\nSi tenés dudas de como usar esta nueva funcionalidad, podés ver un video demostrativo en mi twitter: @lulucitaa17\n\nPor otro lado *nos hicimos un cafecito!* Si querés colaborar con el proyecto, podés entrar a este link: https://cafecito.app/lulu-bot 💘"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

// menu info
client.on("message", (msg) => {
  try {
    if (msg.body.toLowerCase().includes("/info")) {
      client.sendMessage(
        msg.from,
        "Hola! soy lulu bot, un bot creado por lulu (si, nos llamamos igual porque 0 imaginación) \nmi función es enviarte stickers de las imagenes que quieras, espero que te gusten :) \nRecuerda que por mas de que sea un bot, lulu monitorea la cuenta para que nadie suba cosas asquerosas, asi que porfa no lo hagas, gracias! \nSi te gustaria colaborar conmigo, puedes responder una encuesta que hice para poder mejorar! Link: https://n9.cl/rx5ls \nY obvio si querés/podés te dejo mi cafecito 🤍 https://cafecito.app/lulu-bot  \n\nNo olvides que podes compartirme con tus amigos/familiares o en twitter, eso me ayudaría mucho!\n\nSi tenes alguna duda podés escribirme en mi twitter @lulucitaa17  \n\n Gracias por usar lulu bot! <3"
      );
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
    throw error;
  }
});

// menu faq
client.on("message", (msg) => {
  try {
    if (msg.body.toLowerCase().includes("/faq")) {
      client.sendMessage(
        msg.from,
        "Bienvenido al sector de preguntas frecuentes!📃\n\n*¿Por qué el bot a veces no funciona?*\nEsto es algo que me preguntaron mucho en la encuesta que hice, la realidad es que el servidor que tenemos es muy chico ya que es gratis y no podemos pagar uno mejor, por lo que a veces se satura y no funciona, pero no te preocupes, en cuanto se reinicia vuelve a funcionar :) Si ves que el bot no te responde *no sigas enviando mas mensajes en el momento*, podes esperar un rato y lo volvés a intentar.\n*Cuando el bot este en mantenimiento, va avisar en su descripción y en la foto de perfil!*\n\n*¿Como puedo hacer stickers?*\nPara esto hay dos opciones: el comando /sticker o el comando /on. Los dos sirven para hacer stickers, yo te recomiendo usar el comando /sticker para cuando querés solo un par de stickers rápido ya que este comando es necesario ponerlo en la descripción de la imagen, en cambio el comando /on lo escribís solo una vez y luego podes enviar las imágenes que quieras y el bot te va a devolver todos los stickers. Recordá que al terminar podés escribir /off para desactivar el bot.\n\n*Qué formatos acepta el bot?*\n El bot acepta imagenes en formato .jpg, .jpeg, .png y .webp. También acepta videos de corta duración en formato .mp4, .webm y .gif\n\n*¿Sos un bot o una persona?*\nLa realidad es que esto es un bot que es manejado por una persona, claramente no estoy mirando el bot todo el tiempo pero de vez en cuando sí. Entonces, toda la lógica de hacer los stickers y etc la hace el bot solo, pero de vez en cuando yo persona vengo a monitorear que todo esté funcionando bien y también hago los mantenimientos!\n\n*Tengo una super idea para que el bot sea mejor, como puedo decirtela?*\n Podes escribirme en mi twitter @lulucitaa17 y contarme tu idea, me encantaría escucharla! \n\n*¿Como puedo colaborar con el bot?*\nPodes compartirme con tus amigos/familiares o en twitter, eso me ayudaría mucho! Y también podes colaborar comprandonos un cafecito ☕ en el siguiente link: https://cafecito.app/lulu-bot  \n\nGracias por usar lulu bot! <3"
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

  if (msg.body.toLowerCase() === "/cat") {
    const hasSentCatPic = await catService.onMessage(msg);

    if (!hasSentCatPic) return;

    session.amountOfStickersCreated += 1;
    session.lastStickerCreated = new Date().valueOf();
    await sessionService.updateSession(session);
  }
});

client.on("message", async (msg) => {
  const session = await sessionService.getSessionByNumber(msg.from);

  if (msg.body.toLowerCase() === "/dog") {
    const hasSentPuppyPic = await dogService.onMessage(msg);

    if (!hasSentPuppyPic) return;

    session.amountOfStickersCreated += 1;
    session.lastStickerCreated = new Date().valueOf();
    await sessionService.updateSession(session);
  }
});

client.on("message", async (msg) => {
  const session = await sessionService.getSessionByNumber(msg.from);

  if (msg.body.toLowerCase() === "/meme") {
    //Acá le vamos a mandar esta URL para que genere su propio meme https://lulubot-pi.vercel.app/
    client.sendMessage(
      msg.from,
      "Con este link podes crear tu propio meme y al finalizar vas a tener la opción de hacerlo sticker! https://lulubot-pi.vercel.app/ Recordá mandarme el mensaje tal cual se genera en la página!"
    );
  }
});

client.on("message", async (msg) => {
  const session = await sessionService.getSessionByNumber(msg.from);

  if (msg.body.startsWith("MEMEGENERATOR")) {
    //Acá le vamos a mandar esta URL para que genere su propio meme https://lulubot-pi.vercel.app/
    const hasSentMeme = await memeService.onMessage(msg);
    if (!hasSentMeme) return;

    session.amountOfStickersCreated += 1;
    session.lastStickerCreated = new Date().valueOf();
    await sessionService.updateSession(session);
  }
});
