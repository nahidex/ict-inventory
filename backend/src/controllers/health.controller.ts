import { Request, Response } from 'express';

export const getHealthStatus = (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
};
