// server/src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare namespace Express {
  export interface Request {
    user?: string | JwtPayload;
  }
}
