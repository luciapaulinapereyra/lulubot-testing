import axios from "axios";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";

class MemeService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async onMessage(message: WAWebJS.Message) {
    try {
      const regex = /https:\/\/i\.imgflip\.com\/.*/;

      const memeUrl = message.body.match(regex)?.[0];

      if (!memeUrl)
        this.client.sendMessage(
          message.from,
          "No se ha encontrado un meme en el mensaje"
        );

      const media = await MessageMedia.fromUrl(memeUrl);

      await this.client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: "lulu bot :)",
      });
      return true;
    } catch (error) {
      await this.client.sendMessage(message.from, error.message);
      return false;
    }
  }
}

export default MemeService;
