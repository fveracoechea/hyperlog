export * from "./namedActions.ts";

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

/**
 * Search params to JS Object
 * Object.fromEntries does not account for params with multiple values
 */
export function searchParamsToJson(params: URLSearchParams) {
  const data: Record<string, string[] | string> = {};

  for (const key of params.keys()) {
    const value = params.getAll(key).filter((v) => v !== "undefined" && v !== "null");
    if (value.length > 1) data[key] = value;
    else data[key] = value[0];
  }

  return data;
}
