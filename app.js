import express from "express";
import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/susbscriptions.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
const port = PORT;

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

// Middlewares
app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Subscriber listening on port http://localhost:${port}`)
  await connectToDatabase();
})

export default app;