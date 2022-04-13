import connection from '../database/connection';

export async function findOneByName(name: String) {
  const result = await connection.query(
    `
        SELECT * FROM fighters WHERE username = $1`,
    [name]
  );
  if (!result.rowCount) return null;
  return result.rows[0];
}

export async function insertFigther(name: String) {
  const result = await connection.query(
    `
    INSERT INTO fighters (username, wins, losses,draws)
    VALUES ($1, 0, 0, 0);
    `,
    [name]
  );
  if (!result.rowCount) return null;
  return true;
}

export async function insertNewFigthResult(name: String, fightResult: String) {
  const result = await connection.query(
    `
    UPDATE fighters SET ${fightResult} = ${fightResult} + 1 WHERE username = $1;
    `,
    [name]
  );
  if (!result.rowCount) return null;
  return true;
}

export async function getRanking() {
  const result = await connection.query(`
  SELECT * FROM fighters ORDER BY wins DESC, draws DESC, losses DESC;
  `);
  if (!result.rowCount) return null;
  return result.rows;
}
