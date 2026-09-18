import {Router} from 'express';
import {questions,recommendations,status,submit} from '../controllers/placementController.js';
import {allow,auth} from '../middleware.js';
export const placementRoutes=Router();
placementRoutes.use(auth,allow('STUDENT'));
placementRoutes.get('/status',status);
placementRoutes.get('/questions',questions);
placementRoutes.post('/submit',submit);
placementRoutes.get('/recommendations',recommendations);
