import axios from 'axios';
import NotFound from '../errors/NotFoundError';
import { User } from '../interfaces/users';
import { BattleResult } from '../interfaces/battleResult';
import * as fighterRepository from '../repositories/fighterRepository';

export async function findOneInGitByName(name: String) {
  try {
    const user = await axios.get(`https://api.github.com/users/${name}/repos`);
    return user.data;
  } catch (error) {
    throw new NotFound(`User ${name} not found`);
  }
}

function countStar(userRepos: Array<any>): number {
  return userRepos.reduce(
    (prev: number, curr: any) => prev + curr.stargazers_count,
    0
  );
}

async function saveBattleResult(fighters: User[], result: BattleResult) {
  const isFirstFighter = await fighterRepository.findOneByName(
    fighters[0].name
  );
  const isSecondFighter = await fighterRepository.findOneByName(
    fighters[1].name
  );
  if (!isFirstFighter) {
    await fighterRepository.insertFigther(fighters[0].name);
  }
  if (!isSecondFighter) {
    await fighterRepository.insertFigther(fighters[1].name);
  }
  if (result.draw) {
    await fighterRepository.insertNewFigthResult(fighters[0].name, 'draws');
    await fighterRepository.insertNewFigthResult(fighters[1].name, 'draws');
  } else {
    await fighterRepository.insertNewFigthResult(result.winner, 'wins');
    await fighterRepository.insertNewFigthResult(result.loser, 'losses');
  }
  return true;
}

export async function compareUsersScores(
  firstUser: User,
  secondUser: User
): Promise<BattleResult> {
  const firstUserScore = countStar(firstUser.data);
  const secondUserScore = countStar(secondUser.data);
  const result: BattleResult = { winner: null, loser: null, draw: false };
  if (firstUserScore === secondUserScore) {
    result.draw = true;
  } else if (firstUserScore > secondUserScore) {
    result.winner = firstUser.name;
    result.loser = secondUser.name;
  } else {
    result.winner = secondUser.name;
    result.loser = firstUser.name;
  }
  await saveBattleResult([firstUser, secondUser], result);
  return result;
}

export async function getRanking() {
  const result = await fighterRepository.getRanking();
  if (!result) throw new NotFound('Não há batalhas para rankear');
  return result;
}
