import { Router } from 'express';
import SessionsControler from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRouter = Router();
const sessionsControler = new SessionsControler();
sessionsRouter.post('/', sessionsControler.auth);

export default sessionsRouter;
