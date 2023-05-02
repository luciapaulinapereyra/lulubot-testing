const fs = require("fs");
const Jimp = require('jimp');

async function createTextSticker(txt, media) {

  const tempFilePath = 'cars.jpg';
// await fs.promises.writeFile(tempFilePath, media.data, { encoding: null });
    const img = await fs.promises.readFile(tempFilePath)
  // Cargar la imagen descargada
  console.log({tempFilePath})
  const image = await Jimp.read(tempFilePath);
  
  // Cargar la fuente de texto
  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  // Imprimir el texto encima de la imagen
  const CHAR_LENGTH = 40;
  const txtWidth = txt.length * CHAR_LENGTH;
  console.log("TXT: " + txtWidth);
image.print(font, (image.getWidth() / 2) - Math.floor(txtWidth), 0, txt, 300);
// // Obtener un buffer de la imagen resultante en formato PNG
const buffer = await image.getBufferAsync(Jimp.AUTO);
await fs.promises.writeFile('result-' + tempFilePath, buffer.toString('binary'), 'binary');
  return buffer;

}

const init = async () => {
    const r = createTextSticker("SARASA");
    console.log({
        r
    })
}

init()
