import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export const hashPassword = async pass => {
  try {
    return await bcrypt.hash(pass, 10);
  } catch (error) {
    logger.error(`Hashing of password failed: ${error} `);
    throw new Error({
      message: error,
    });
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with email already exists');
    }

    const hashPass = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashPass, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User created successfully with email: ${email}`);
    return user;
  } catch (error) {
    logger.error(`User creation in DB failed: ${error.message}`);
    throw error;
  }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    logger.error(`Password comparison failed: ${error.message}`);
    throw new Error('Password verification failed');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Email does not exist');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Return user without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
    logger.info(`User authenticated successfully: ${email}`);
    return userData;
  } catch (error) {
    logger.error(`User authentication failed: ${error.message}`);
    throw error;
  }
};

export const getUserById = async userId => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    logger.error(`Get user by ID failed: ${error.message}`);
    throw error;
  }
};
