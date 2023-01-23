import routes from "./routes/routes.js";
import morgan from "morgan";
import express from "express";
import cors from "cors";
import usersRouter from "./routers/usersRouter.js";
import { generalError, unknownEndpoint } from "./middlewares/error.js";
import contactsRouter from "./routers/contactsRouter/contactsRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(routes.users, cors(), usersRouter);

app.use(routes.contact, cors(), contactsRouter);

app.use(unknownEndpoint);

app.use(generalError);

export default app;
