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
    firstUser.data = await userService.findOneInGitByName(firstUser.name);
    secondUser.data = await userService.findOneInGitByName(secondUser.name);
    const result = await userService.compareUsersScores(firstUser, secondUser);
    return res.send(result);
  } catch (error) {
    return next(error);
  }
}

export async function getRanking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ranking = await userService.getRanking();
    return res.send(ranking);
  } catch (error) {
    return next(error);
  }
}
