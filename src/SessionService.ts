import path from "path";
import WAWebJS, { Client } from "whatsapp-web.js";
// import fs from "fs";

// SESSIONS_FILE_PATH is the path to the file where the sessions are stored as object where its index are the number property, it is not an array of sessions
// const SESSIONS_FILE_PATH = path.join(__dirname + "/data/sessions.json");

const SESSIONS = {};

interface Session {
  number: string;
  isActive: boolean;
  isGroup: boolean;
  amountOfStickersCreated: number;
  lastStickerCreated: number;
  lastCall: number;
  amountOfCalls: number;
}

class SessionService {
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  public async createFirstSession(number: string, isGroup?: boolean) {
    const session: Session = {
      number,
      isActive: false,
      isGroup: isGroup || false,
      amountOfStickersCreated: 0,
      lastStickerCreated: 0,
      lastCall: 0,
      amountOfCalls: 0,
    };
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };
    // sessions[number] = session;
    // await fs.promises.writeFile(
    //   SESSIONS_FILE_PATH,
    //   JSON.stringify(sessions, null, 2)
    // );
    SESSIONS[number] = session;
    return session;
  }

  public async getSessionByNumber(number: string) {
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };
    // const session = sessions[number];

    const session = SESSIONS[number];

    if (!session) {
      return this.createFirstSession(number);
    }

    return session;
  }

  public async updateSession(session: Session) {
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };

    SESSIONS[session.number] = session;
    // await fs.promises.writeFile(
    //   SESSIONS_FILE_PATH,
    //   JSON.stringify(sessions, null, 2)
    // );

    return session;
  }

  // returns false if the session does not exist
  public async deleteSession(session: Session) {
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };

    if (!SESSIONS[session.number]) {
      return false;
    }

    delete SESSIONS[session.number];

    return true;
  }

  public async getActiveSessions() {
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };
    const activeSessions = Object.values(SESSIONS).filter(
      (session: Session) => session.isActive
    );
    return activeSessions;
  }

  public async getInactiveSessions() {
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };
    const inactiveSessions = Object.values(SESSIONS).filter(
      (session: Session) => !session.isActive
    );
    return inactiveSessions;
  }

  public async getGroupSessions() {
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };
    const groupSessions = Object.values(SESSIONS).filter(
      (session: Session) => session.isGroup
    );
    return groupSessions;
  }

  public async getIndividualSessions() {
    // const fileContent = await fs.promises.readFile(SESSIONS_FILE_PATH, "utf-8");
    // const sessions = JSON.parse(fileContent) as { [key: string]: Session };
    const sessions = SESSIONS;
    const individualSessions = Object.values(sessions).filter(
      (session: Session) => !session.isGroup
    );
    return individualSessions;
  }
}

export default SessionService;
