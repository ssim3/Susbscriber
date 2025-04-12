import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions)

subscriptionRouter.post('/', authorize , createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

export default subscriptionRouter;