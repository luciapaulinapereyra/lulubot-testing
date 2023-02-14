const fs = require("fs");
const { syncBuiltinESMExports } = require("module");
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia , LocalAuth } = require("whatsapp-web.js");
const country_code = "549";
const number = "1154215012";
const msg = "holasss";
const sticker = MessageMedia.fromFilePath("./cars.jpg");
const SESSION_FILE_PATH = "./sessions.json";
const client = new Client({
  authStrategy: new LocalAuth(),
  executablePath: "./ffmpeg.exe",
});

let sessionData = {};
var ID = 0;
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
    console.log("creando sesion..")
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

  client.on("message",(msg) => {
    try {
      if(msg.body === "/on") {
        createSession(msg);
        client.sendMessage(msg.from, "Estoy encendido :) envía las imagenes que quieras hacer stickers. No olvides escribir /off cuando quieras desactivarme! (por favor desactivame cuando termines porque mi creadora es pobre y no tiene mucho almacenamiento de sesiones)");
     }
    } catch (error) {
      client.sendMessage(msg.from, "Ups! hubo un error, intentalo más tarde :P");
      console.log(error);
     throw error;
    }

  });

client.on("message", (msg) => {
  try {
    if(msg.body === "/off") {
      deleteSession(msg);
      client.sendMessage(msg.from, "Nos vemos! :)");
    }
  } catch (error) {
    client.sendMessage(msg.from, "Ups! hubo un error al cerrar la sesión, intentalo mas tarde :/")
    throw error;
    
  }

});


client.on("message", async (pic) => {
  console.log(pic.from);

    if (pic.hasMedia  && isNumberActive(pic)) { 
      const media = await pic.downloadMedia();
      client
      .sendMessage(pic.from, media, { sendMediaAsSticker: true })
      .then((response) => {
        if(response.id.fromMe) {
          console.log("El sticker fue enviado :)");
        }
      })
  }

  });