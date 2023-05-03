"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Jimp = require("jimp");
const path_1 = __importDefault(require("path"));
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const CallService_1 = __importDefault(require("./CallService"));
const country_code = "549";
const number = "1154215012";
const msg = "holasss";
const sticker = whatsapp_web_js_1.MessageMedia.fromFilePath("./cars.jpg");
const SESSION_FILE_PATH = path_1.default.join(__dirname + "/data/sessions.json");
const client = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth(),
    ffmpegPath: path_1.default.join(__dirname + "/ffmpeg.exe"),
});
const callService = new CallService_1.default(client);
let jsonLoveWords = fs.readFileSync(path_1.default.join(__dirname + "/data/loveWords.json"), "utf-8");
let loveWords = JSON.parse(jsonLoveWords);
let jsonThanksWords = fs.readFileSync(path_1.default.join(__dirname + "/data/thanksWords.json"), "utf-8");
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
    }
    catch (error) {
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
    }
    catch (error) {
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
        if (msg.body.toLowerCase().includes("/on") && !isNumberActive(msg)) {
            createSession(msg);
            client.sendMessage(msg.from, "Holaa, soy un bot :) Ahora que estoy encendido, podes enviarme imagenes y las convertiré en stickers. No olvides escribir /off cuando quieras desactivarme! (por favor desactivame cuando termines porque mi creadora es pobre y no tiene mucho almacenamiento de sesiones)");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error, intentalo más tarde :P");
        console.log(error);
        throw error;
    }
});
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase().includes("/off")) {
            deleteSession(msg);
            client.sendMessage(msg.from, "Nos vemos! :)");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error al cerrar la sesión, intentalo mas tarde :/");
        throw error;
    }
});
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase().includes("hola") ||
            msg.body.toLowerCase() === "ola" ||
            msg.body.toLowerCase().includes("holi") ||
            msg.body.toLowerCase().includes("holis")) {
            client.sendMessage(msg.from, "Hola <3 me alegra que me saludes! recuerda escribir /on para la creación de stickers! \n Para ver el menú podés escribir /menu");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        throw error;
    }
});
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase().includes("gracias") ||
            msg.body.toLowerCase().includes("grax")) {
            const res = getRandomWords(thanksWords);
            client.sendMessage(msg.from, res);
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        throw error;
    }
});
function getRandomWords(file) {
    return file.words[Math.floor(Math.random() * file.words.length)];
}
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase().includes("tkm") ||
            msg.body.toLowerCase().includes("te quiero") ||
            msg.body.toLowerCase().includes("te amo") ||
            msg.body.toLowerCase().includes("t amo")) {
            const res = getRandomWords(loveWords);
            client.sendMessage(msg.from, res);
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        console.log(error);
        throw error;
    }
});
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase().includes("lali") ||
            msg.body.toLowerCase().includes("cantante fav") ||
            msg.body.toLowerCase().includes("dillom")) {
            client.sendMessage(msg.from, "Mis dos cantantes favoritos del momento son lali y dillom, te recomiendo escucharlos :)");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        console.log(error);
        throw error;
    }
});
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase() === "on" ||
            msg.body.toLowerCase() === "on/" ||
            msg.body.toLowerCase() === "!sticker" ||
            msg.body.toLowerCase() === "on /" ||
            msg.body.toLowerCase() === ".sticker" ||
            msg.body.toLowerCase() === "st" ||
            msg.body.toLowerCase() === "sticker" ||
            msg.body.toLowerCase() === "/ on") {
            client.sendMessage(msg.from, "Ups, comando equivocado! recuerda que para encenderme debes escribir /on");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        throw error;
    }
});
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase() === "of" ||
            msg.body.toLowerCase() === "off/" ||
            msg.body.toLowerCase() === "off" ||
            msg.body.toLowerCase() === "/of") {
            client.sendMessage(msg.from, "Ups, comando equivocado! recuerda que para apagarme debes escribir /off");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        throw error;
    }
});
function createTextSticker(txt, media) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileExtension = media.mimetype.split("/")[1];
        const tempFilePath = `temp-${Date.now()}.${fileExtension}`;
        yield fs.promises.writeFile(tempFilePath, Buffer.from(media.data, "base64").toString("binary"), "binary");
        // Cargar la imagen descargada
        const image = yield Jimp.read(tempFilePath);
        // Cargar la fuente de texto
        const font = yield Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        // Imprimir el texto encima de la
        image.print(font, image.getWidth() / 2, image.getHeight() / 3, txt, image.getWidth());
        // Obtener un buffer de la imagen resultante en formato PNG
        const buffer = yield image.getBufferAsync(Jimp.AUTO);
        yield fs.promises.writeFile("result-" + tempFilePath, buffer.toString("binary"), "binary");
        return "result-" + tempFilePath;
    });
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
client.on("message", (pic) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(pic.from);
    if (pic.hasMedia && isNumberActive(pic)) {
        const media = yield pic.downloadMedia();
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
    else if (pic.body.length === 0 && !isNumberActive(pic)) {
        client.sendMessage(pic.from, "Ups! no estas activo, para activarme debes escribir /on \nPara ver el menú escribe /menu");
    }
}));
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase().includes("/menu")) {
            client.sendMessage(msg.from, "Bienvenido al menú de lulu bot! \n\n/on - activar bot \n/off - desactivar bot \n/menu - menú \n/info - información");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        throw error;
    }
});
client.on("message", (msg) => {
    try {
        if (msg.body.toLowerCase().includes("/info")) {
            client.sendMessage(msg.from, "Hola! soy lulu bot, un bot creado por lulu (si, nos llamamos igual porque 0 imaginación) \nmi función es enviarte stickers de las imagenes que quieras, espero que te gusten :) \nRecuerda que por mas de que sea un bot, lulu monitorea la cuenta para que nadie suba cosas asquerosas, asi que porfa no lo hagas, gracias! \nSi te gustaria colaborar conmigo, puedes responder una encuesta que hice para poder mejorar! Link: https://n9.cl/rx5ls \n\nY también no olvides que podes compartirme con tus amigos/familiares o en twitter, eso me ayudaría mucho! \n\n Gracias por usar lulu bot! <3");
        }
    }
    catch (error) {
        client.sendMessage(msg.from, "Ups! hubo un error,intentalo mas tarde :/");
        throw error;
    }
});
//llamadas
client.on("call", (call) => {
    callService.onCall(call);
});
