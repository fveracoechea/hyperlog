export async function tryCatch<T, E = Error>(promise: T | Promise<T>) {
  try {
    const data = await promise;
    return [null, data] as const;
  } catch (error) {
    return [error as E, null] as const;
  }
}

/**
 * Type guard, ensures that the given value is NonNullable
 */
export function isNonNullable<T>(item: T | null | undefined): item is T {
  return Boolean(item);
}
