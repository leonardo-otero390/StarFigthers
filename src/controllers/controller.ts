import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';
import { User } from '../interfaces/users';

export async function battleUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const firstUser: User = { name: req.body.firstUser, data: [] };
  const secondUser: User = { name: req.body.secondUser, data: [] };
  try {
    firstUser.data = await userService.findOneByName(firstUser.name);
    secondUser.data = await userService.findOneByName(secondUser.name);
    const result = userService.compareUsersScores(firstUser, secondUser);
    return res.send(result);
  } catch (error) {
    return next(error);
  }
}
