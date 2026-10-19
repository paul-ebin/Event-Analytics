
import bcrypt from "bcrypt";
import type { RegisterInput , LoginInput } from "./auth.schema.js";
import {
  findUserByEmail,
  createUser,
  findUserByEmailForLogin,
  findUserById
} from "./auth.repostitory.js"
import { generateAccessToken } from "../../utils/jwt.js";
export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase();

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await createUser(email, passwordHash);

  return user;
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase();

  const user = await findUserByEmailForLogin(email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    accessToken,
  };
}


export async function getUserProfile(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}
