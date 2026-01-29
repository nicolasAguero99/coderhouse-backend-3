import { Router } from "express";
import { HEALTH_BASE_URL } from "./routes.js";
import process from 'node:process';

const healthRouter = Router();

healthRouter.route(HEALTH_BASE_URL)
  .get((req, res) => {
    res.status(200).json({
      message: 'Healthy route',
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

export default healthRouter;