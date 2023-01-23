import enviroment from "../loadEnviroment.js";
import debugCreator from "debug";
import chalk from "chalk";
import app from "./app.js";

const debug = debugCreator(`${enviroment.debug}server`);

const startServer = async (port: string) => {
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server connected on port ${enviroment.port}`));
      resolve(server);
    });
    server.on("error", (error: Error) => {
      debug(chalk.red("Error connecting to the server"));
      reject(error);
    });
  });
};

export default startServer;
