// // /middleware/role.middleware.ts
// import { Request, Response, NextFunction } from 'express';

// export const roleMiddleware = (role: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (req.body.role !== role) { 
//       return res.status(403).json({ message: 'Forbidden' });
//     }
//     next(); 
//   };
// };
