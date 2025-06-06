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

/**
 * Type guard.
 * Determines whether an object has a property with the specified name.
 */
export function isKeyOf<R extends Record<PropertyKey, unknown>>(
  record: R,
  key: unknown,
): key is keyof R {
  return (
    (typeof key === "string" ||
      typeof key === "number" ||
      typeof key === "symbol") &&
    Object.prototype.hasOwnProperty.call(record, key)
  );
}
