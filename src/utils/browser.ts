export let getDocumentHead = () => {
  return document.getElementsByTagName("HEAD")[0];
};
export const getEnvironment = () => {
  // Check for browser global variable
  if (typeof window !== "undefined" && (window as any).ENVIRONMENT) {
    return (window as any).ENVIRONMENT;
  }

  // Check for NODE_ENV in build process
  if (typeof process !== "undefined" && process.env?.NODE_ENV) {
    return process.env.NODE_ENV.toUpperCase();
  }

  return "PROD"; // Default to production
};
