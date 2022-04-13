import axios from 'axios';
import NotFound from '../errors/NotFoundError';
import { User } from '../interfaces/users';
import { BattleResult } from '../interfaces/battleResult';

export async function findOneByName(name: String) {
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

export function compareUsersScores(firstUser: User, secondUser: User): BattleResult {
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
  return result;
}
