import logger from '#config/logger.js';
import { getUserById } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { jwtToken } from '#utils/jwt.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwtToken.verify(token);
    const user = await getUserById(decoded.id);
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication middleware failed', error);
    
    if (error.message.includes('jwt expired')) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    if (error.message.includes('invalid token') || error.message === 'Failed to verify JWT token') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.message === 'User not found') {
      return res.status(401).json({ error: 'User not found' });
    }
    
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};