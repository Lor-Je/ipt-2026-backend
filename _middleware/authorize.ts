import { expressjwt } from 'express-jwt'; // ← named import
import config from '../config.json';
import db from '../_helpers/db';

const { secret } = config;

export default function authorize(roles: any = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    expressjwt({ secret, algorithms: ['HS256'] }), // ← expressjwt() instead of jwt()
    async (req: any, res: any, next: any) => {
      const account = await db.Account.findByPk(req.auth.id); // ← req.auth instead of req.user
      
      if (!account || (roles.length && !roles.includes(account.role))) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.auth.role = account.role; // ← req.auth instead of req.user
      const refreshTokens = await account.getRefreshTokens();
      req.auth.ownsToken = (token: any) => !!refreshTokens.find((x: any) => x.token === token);
      next();
    }
  ];
}