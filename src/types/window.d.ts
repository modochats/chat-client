import {ModoChatClient} from "../app.js";

declare global {
  interface Window {
    getMChat?: () => ModoChatClient;
  }
}

// This is needed to make this file a module
export {};
