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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const CALLS_FILE_PATH = path_1.default.join(__dirname + "/data/callNumbers.json");
class CallService {
    constructor(client) {
        this.client = client;
    }
    createFirstCallRegister(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const callRegister = {
                number,
                lastCall: new Date(),
                calls: 0,
            };
            const fileContent = yield fs_1.default.promises.readFile(CALLS_FILE_PATH, "utf-8");
            const callRegisters = JSON.parse(fileContent);
            callRegisters.push(callRegister);
            yield fs_1.default.promises.writeFile(CALLS_FILE_PATH, JSON.stringify(callRegisters));
            return callRegister;
        });
    }
    getCallRegisterByNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = yield fs_1.default.promises.readFile(CALLS_FILE_PATH, "utf-8");
            const callRegisters = JSON.parse(fileContent);
            const callRegister = callRegisters.find((callRegister) => callRegister.number === number);
            if (!callRegister) {
                return this.createFirstCallRegister(number);
            }
            return callRegister;
        });
    }
    updateCallRegister(callRegister) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileContent = yield fs_1.default.promises.readFile(CALLS_FILE_PATH, "utf-8");
            const callRegisters = JSON.parse(fileContent);
            const callRegisterIndex = callRegisters.findIndex((callRegister) => callRegister.number === callRegister.number);
            callRegisters[callRegisterIndex] = callRegister;
            if (callRegisterIndex === -1) {
                this.createFirstCallRegister(callRegister.number);
                this.updateCallRegister(callRegister);
            }
            yield fs_1.default.promises.writeFile(CALLS_FILE_PATH, JSON.stringify(callRegisters));
            return callRegister;
        });
    }
    registerCall(call) {
        return __awaiter(this, void 0, void 0, function* () {
            const callRegister = yield this.getCallRegisterByNumber(call.from);
            callRegister.calls++;
            callRegister.lastCall = new Date();
            return this.updateCallRegister(callRegister);
        });
    }
    onCall(call) {
        return __awaiter(this, void 0, void 0, function* () {
            call.reject();
            const callRegister = yield this.registerCall(call);
            if (callRegister.calls === 1) {
                this.client.sendMessage(call.from, "Las llamadas son consideradas spam. Si seguimos recibiendo llamadas tu número será bloqueado");
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
            this.client.sendMessage(call.from, `Tenemos registradas ${callRegister.calls} llamadas de este numero. Si seguimos recibiendo llamadas tu número será bloqueado`);
        });
    }
}
exports.default = CallService;
