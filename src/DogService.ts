import axios from "axios";
import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";

class DogService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public async getDogImage(): Promise<string> {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    if (!response.data || !response.data.message)
      throw new Error(
        "Ahora mismo estamos sobre cargados de peticiones, intenta en unos minutos :("
      );

    return response.data.message;
  }

  public async onMessage(message: WAWebJS.Message) {
    try {
      const dogUrl = await this.getDogImage();

      const media = await MessageMedia.fromUrl(dogUrl);

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

export default DogService;
