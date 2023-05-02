import path from "path";
import WAWebJS, { Client } from "whatsapp-web.js";
import fs from "fs";

const CALLS_FILE_PATH = path.join(__dirname + "/data/callNumbers.json");

interface CallRegister {
  number: string;
  lastCall: Date;
  calls: number;
}

class CallService {
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  public async createFirstCallRegister(number: string) {
    const callRegister: CallRegister = {
      number,
      lastCall: new Date(),
      calls: 0,
    };
    const fileContent = await fs.promises.readFile(CALLS_FILE_PATH, "utf-8");
    const callRegisters = JSON.parse(fileContent) as CallRegister[];
    callRegisters.push(callRegister);
    await fs.promises.writeFile(CALLS_FILE_PATH, JSON.stringify(callRegisters));
    return callRegister;
  }

  public async getCallRegisterByNumber(number: string) {
    const fileContent = await fs.promises.readFile(CALLS_FILE_PATH, "utf-8");
    const callRegisters = JSON.parse(fileContent) as CallRegister[];
    const callRegister = callRegisters.find(
      (callRegister: CallRegister) => callRegister.number === number
    ) as CallRegister | undefined;

    if (!callRegister) {
      return this.createFirstCallRegister(number);
    }

    return callRegister;
  }

  public async updateCallRegister(callRegister: CallRegister) {
    const fileContent = await fs.promises.readFile(CALLS_FILE_PATH, "utf-8");
    const callRegisters = JSON.parse(fileContent) as CallRegister[];
    const callRegisterIndex = callRegisters.findIndex(
      (callRegister: CallRegister) =>
        callRegister.number === callRegister.number
    );

    callRegisters[callRegisterIndex] = callRegister;

    if (callRegisterIndex === -1) {
      this.createFirstCallRegister(callRegister.number);
      this.updateCallRegister(callRegister);
    }

    await fs.promises.writeFile(CALLS_FILE_PATH, JSON.stringify(callRegisters));
    return callRegister;
  }

  public async registerCall(call: WAWebJS.Call) {
    const callRegister = await this.getCallRegisterByNumber(call.from);
    callRegister.calls++;
    callRegister.lastCall = new Date();
    return this.updateCallRegister(callRegister);
  }

  public async onCall(call: WAWebJS.Call) {
    call.reject();

    const callRegister = await this.registerCall(call);

    if (callRegister.calls === 1) {
      this.client.sendMessage(
        call.from,
        "Las llamadas son consideradas spam. Si seguimos recibiendo llamadas tu número será bloqueado"
      );
      return;
    }

    // if (callRegister.calls >= 3) {
    //   this.client.sendMessage(
    //     call.from,
    //     "Tu número ha sido bloqueado por realizar llamadas spam"
    //   );
    //   //@ts-ignore
    //   const chat = window.Store.Chat.get(phone + "@c.us");

    //   // Bloqueamos el número de teléfono
    //   chat.contact.block();

    //   return;
    // }

    this.client.sendMessage(
      call.from,
      `Tenemos registradas ${callRegister.calls} llamadas de este numero. Si seguimos recibiendo llamadas tu número será bloqueado`
    );
  }
}

export default CallService;
