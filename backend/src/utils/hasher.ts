import { compare, genSalt, hash } from 'bcrypt-ts/node';

import { env } from '../env.ts';

export async function createHasher(password: string) {
  const salt = await genSalt(env.SALT_ROUNDS);
  return hash(password, salt);
}

export function validatePassword(password: string, hash: string) {
  return compare(password, hash);
}
