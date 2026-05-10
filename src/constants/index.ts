import {getEnvironment} from "../utils/browser";

let DEBUG = getEnvironment() === "DEV";

let BASE_API_URL = "";
let BASE_WEBSOCKET_URL = "";

const VERSION = "0.51";
const BASE_STORAGE_URL = "https://modochats.s3.ir-thr-at1.arvanstorage.ir";
const NEW_MESSAGE_AUDIO_URL = `${BASE_STORAGE_URL}/new-message.mp3`;
const MAX_SOCKET_RECONNECT_COUNT = 20;

export const setDebugMode = (debug: boolean) => {
  DEBUG = debug;
  setUrls();
};

export const setUrls = () => {
  BASE_API_URL = DEBUG ? "https://dev-api.modochats.com" : "https://api.modochats.com";
  BASE_WEBSOCKET_URL = DEBUG ? "wss://dev-api.modochats.com/ws" : "wss://api.modochats.com/ws";
};

// Initialize URLs based on the environment
setUrls();

export {BASE_API_URL, BASE_WEBSOCKET_URL, VERSION, DEBUG, getEnvironment, NEW_MESSAGE_AUDIO_URL, BASE_STORAGE_URL, MAX_SOCKET_RECONNECT_COUNT};
