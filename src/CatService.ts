import axios from "axios";
import * as dotenv from "dotenv";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import sharp from "sharp";
dotenv.config();

class CatService {
  private client: Client;
  private lastRequestTime: number;
  constructor(client: Client) {
    this.client = client;
    this.lastRequestTime = 0;
  }

  public async getCatImage(): Promise<string> {
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - this.lastRequestTime;
    const minTimeBetweenRequests = 5000; // Esperar al menos 5 segundos entre solicitudes

    // if (timeSinceLastRequest < minTimeBetweenRequests) {
    //   await new Promise((resolve) =>
    //     setTimeout(resolve, minTimeBetweenRequests - timeSinceLastRequest)
    //   );
    // }
    const response = await axios.get(
      "https://api.thecatapi.com/v1/images/search",
      {
        headers: {
          "x-api-key": process.env.CAT_API_KEY,
        },
      }
    );
    const catImageUrl = response.data[0].url;
    this.lastRequestTime = Date.now();

    return catImageUrl;
  }

  public async onMessage(message: WAWebJS.Message) {
    try {
      const catUrl = await this.getCatImage();

      const media = await MessageMedia.fromUrl(catUrl);

      await this.client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: "lulu bot :)",
      });
      return true;
    } catch (error) {
      await this.client.sendMessage(
        message.from,
        "Ahora estamos saturados de fotos de gatitos, intenta en unos minutos :("
      );
      return false;
    }
  }
}

export default CatService;
