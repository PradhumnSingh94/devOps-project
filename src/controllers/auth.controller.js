import logger from '#config/logger.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { validationFormatErrors } from '#utils/format.js';
import { jwtToken } from '#utils/jwt.js';
import { signupSchema, signinSchema } from '#validation/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validateUserDetails = signupSchema.safeParse(req.body);
    if (!validateUserDetails.success) {
      return res.status(400).json({
        error: 'User data validation failed',
        details: validationFormatErrors(validateUserDetails.error),
      });
    }
    
    const { name, email, role, password } = validateUserDetails.data;
    const user = await createUser({ name, email, password, role });
    
    const token = jwtToken.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    
    cookies.set(res, 'token', token);
    logger.info(`User registered successfully with ${email}`);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Sign up failed', error);
    if (error.message === 'User with email already exists') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validateUserDetails = signinSchema.safeParse(req.body);
    if (!validateUserDetails.success) {
      return res.status(400).json({
        error: 'Login data validation failed',
        details: validationFormatErrors(validateUserDetails.error),
      });
    }
    
    const { email, password } = validateUserDetails.data;
    const user = await authenticateUser({ email, password });
    
    const token = jwtToken.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    
    cookies.set(res, 'token', token);
    logger.info(`User signed in successfully: ${email}`);
    
    res.status(200).json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Sign in failed', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    const token = cookies.get(req, 'token');
    
    if (!token) {
      return res.status(400).json({ error: 'No active session found' });
    }
    
    cookies.clear(res, 'token');
    logger.info('User signed out successfully');
    
    res.status(200).json({
      message: 'Sign out successful',
    });
  } catch (error) {
    logger.error('Sign out failed', error);
    next(error);
  }
};
