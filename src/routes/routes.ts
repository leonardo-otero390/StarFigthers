import { Router, Request, Response } from 'express';
import validateSchema from '../middlewares/validateSchema';
import battleSchema from '../schemas/battleSchema';
import * as controller from '../controllers/controller';

const routes = Router();

routes.get('/health', async (req: Request, res: Response) => {
  res.sendStatus(200);
});

routes.post('/battle', validateSchema(battleSchema), controller.battleUsers);

routes.get('/ranking', controller.getRanking);

export default routes;
