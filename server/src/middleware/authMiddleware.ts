import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { _id: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (typeof decoded === 'object' && decoded !== null && '_id' in decoded) {
      req.user = { _id: (decoded as any)._id };
      next();
    } else {
      res.status(400).send('Invalid token payload.');
    }
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};