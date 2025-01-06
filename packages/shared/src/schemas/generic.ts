import { z } from 'zod';

export const zPrimaryKeyId = z.string().uuid();
