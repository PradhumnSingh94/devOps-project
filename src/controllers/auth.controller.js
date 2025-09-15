import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { validationFormatErrors } from '#utils/format.js';
import { jwtToken } from '#utils/jwt.js';
import { signupSchema } from '#validation/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validateUserDetails = signupSchema.safeParse(req.body);
    if (!validateUserDetails.success)
      return res.status(400).json({
        error: 'User data validation failed',
        details: validationFormatErrors(validateUserDetails.error),
      });
    const { name, email, role, password } = validateUserDetails.data;
    // AUTH SERVICE
    const user = await createUser({ name, email, password, role });
    const token = jwtToken.sign({
      id: user.id,
      name: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);
    logger.info(`User registered successfully with ${email}`);
    res.status(201).json({
      message: 'User registered',
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
