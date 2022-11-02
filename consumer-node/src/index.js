import url from "node:url";
import { getKafkaTopicAndItsListeners } from "./lib/readYaml.js";

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  const gracefulShutdown = () => {
    console.warn("Stopping the consumer program !!!");
    process.exit(1);
  };

  // handling termination signals

  process.on("SIGTERM", () => {
    // user presses ctrl + C
    console.error("user presses ctrl + c");
    gracefulShutdown();
  });

  process.on("SIGINT", () => {
    // user presses ctrl + D
    console.error("user presses ctrl + d");
    gracefulShutdown();
  });

  // prevent promise rejection exits
  process.on("unhandledRejection", (reason, promise) => {
    console.error("unhandledRejection", reason);
    throw reason;
  });

  // prevent dirty exit on code-fault crashes
  process.on("uncaughtException", (error) => {
    console.error(`Application Crashed  ${error?.stack?.split("\n")}`);
    gracefulShutdown();
  });

  try {
    getKafkaTopicAndItsListeners();
  } catch (err) {
    console.log("ERROR: ", err);
    gracefulShutdown();
  }
}
