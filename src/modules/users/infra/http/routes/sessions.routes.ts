import { Router } from 'express';
import SessionsControler from '@modules/users/infra/http/controllers/SessionsController';
import { celebrate, Segments, Joi } from 'celebrate';

const sessionsRouter = Router();
const sessionsControler = new SessionsControler();
sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsControler.auth,
);

export default sessionsRouter;
