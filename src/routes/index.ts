import { Router } from 'express';
import UserRoute from './user.route';

const router = Router();

router.use('/users', UserRoute);


export default router;