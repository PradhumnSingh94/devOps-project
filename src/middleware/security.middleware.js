import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';
import aj from '#config/arcjet.js';

export const securityMiddleware = async (req, res, next) => {
  try {
    const role = res.user?.role || 'guest';
    let limit;
    let message;
    switch (role) {
      case 'admin':
        limit = 20;
        message =
          'Admin request limit exceeded (20 requests per minute), Slow down...';
        break;
      case 'user':
        limit = 10;
        message =
          'User request limit exceeded (10 requests per minute), Slow down...';
        break;
      case 'guest':
        limit = 5;
        message =
          'Guest request limit exceeded (5 requests per minute), Slow down...';
        break;
    }
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );
    const decision = await client.protect(req);
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked requests', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      res.status(403).json({
        error: 'Forbidden',
        message: 'Shield blocked requests',
      });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Request blocked as too many requests', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked as too many requests',
      });
    }
    next();
  } catch (error) {
    logger.error('Error in Security Middleware', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error in Security Middleware',
    });
  }
};
