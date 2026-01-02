import {ChatClient} from "../app.js";

declare global {
  interface Window {
    getMChat?: () => ChatClient;
  }
}

// This is needed to make this file a module
export {};
