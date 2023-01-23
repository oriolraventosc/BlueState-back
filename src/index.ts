import enviroment from "./loadEnviroment.js";
import connectToDataBase from "./database/index.js";
import startServer from "./server/index.js";

const { url, port } = enviroment;

await startServer(port);
await connectToDataBase(url);
