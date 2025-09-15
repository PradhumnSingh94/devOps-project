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
    console.log(existingUser);
    if (existingUser.length > 0) throw new Error('User already exists');
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
    logger.info(`user created successfully with email: ${users.email}`);
    return user;
  } catch (error) {
    logger.error(`User creation in DB failed: ${error}`);
    throw new Error(error);
  }
};
