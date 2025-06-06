import { isKeyOf } from "./object.ts";

type ActionRecord = Record<string, () => unknown>;

/**
 * Matches the given action name with the actions object.
 * @throws {ReferenceError} Action `name` not found
 */
export function match<A extends ActionRecord>(
  name: unknown,
  actions: A,
) {
  if (name && isKeyOf(actions, name)) {
    const actionFn = actions[name];
    return actionFn() as ReturnType<A[keyof A]>;
  }

  if (isKeyOf(actions, "default")) {
    return actions.default() as ReturnType<A[keyof A]>;
  }

  if (!name) {
    throw new ReferenceError(`Action name not found, try providing a "default" action.`);
  }

  throw new ReferenceError(`Action "${name}" not found, try providing a "default" action.`);
}
