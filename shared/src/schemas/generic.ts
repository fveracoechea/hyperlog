import { z } from 'zod';

export const zPrimaryKeyId = z.number().int().positive();
