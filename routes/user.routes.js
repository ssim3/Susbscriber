import { Router } from "express";

const userRouter = Router();

userRouter.get('/users', (req, res) => {
  res.send({ title: "GET all users"});
});

userRouter.get('/:id', (req, res) => {
  res.send({ title: `GET user details`});
});

userRouter.post('/', (req, res) => {
  res.send({ title: "POST new user"});
});

userRouter.put('/:id', (req, res) => {
  res.send({ title: "Update user by ID"});
});

userRouter.delete('/:id', (req, res) => {
  res.send({ title: "Delete user by ID"});
});

export default userRouter;