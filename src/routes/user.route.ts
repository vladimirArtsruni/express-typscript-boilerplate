import { Router, Request, Response, NextFunction  } from 'express';
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) =>{
    res.json({ a: 2 });
});

export default router;