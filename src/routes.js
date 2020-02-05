import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryPersonController from './app/controllers/DeliveryPersonController';
import DeliveryController from './app/controllers/DeliveryController';
import AssignedDeliveryController from './app/controllers/AssignedDeliveryController';
import DeliveredController from './app/controllers/DeliveredController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryEndController from './app/controllers/DeliverEndController';
import ProblemsByDeliveryController from './app/controllers/ProblemsByDeliveryController';
import DeliveriesByProblemController from './app/controllers/DeliveriesByProblemController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/delivery_person/:id/deliveries', AssignedDeliveryController.index);

routes.get('/delivery_person/:id/delivered', DeliveredController.index);

routes.put('/delivery/:id/start', DeliveryStartController.update);
routes.put('/delivery/:id/end', DeliveryEndController.update);

routes.get('/delivery/:id/problems', ProblemsByDeliveryController.index);
routes.post('/delivery/:id/problems', ProblemsByDeliveryController.store);

routes.get('/deliveries_with_problems', DeliveriesByProblemController.index);
routes.delete(
  '/problem/:id/cancel-delivery',
  DeliveriesByProblemController.delete
);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/delivery_people', DeliveryPersonController.index);
routes.post('/delivery_people', DeliveryPersonController.store);
routes.put('/delivery_person/:id', DeliveryPersonController.update);
routes.delete('/delivery_person/:id', DeliveryPersonController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

export default routes;
