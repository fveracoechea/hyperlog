/**
 * Checks if the input string is vulnerable to CSV Formula Injection.
 *
 * CSV Formula Injection occurs when an attacker injects a formula
 * into a CSV file that, when opened in a spreadsheet application,
 * can execute unintended actions.
 *
 * This function validates the input string by checking if the first
 * character is one of the formula-initiating characters (`=`, `-`, `+`, `@`).
 *
 * @param {string} value - The input string to be validated.
 * @returns {boolean} - Returns `true` if the input is vulnerable, otherwise `false`.
 */
export function hasForumulaInjection(value: string) {
  return Boolean(value) && '=-+@'.indexOf(value.charAt(0)) >= 0;
}

/**
 * Sanitizes the input string to prevent CSV Formula Injection by removing
 * any leading characters that could trigger a formula in spreadsheet applications.
 *
 * This function specifically targets the characters `=`, `+`, `-`, and `@`
 * at the start of the input string, which are commonly used to initiate formulas
 * in CSV files. By removing these characters, the input is made safer for
 * inclusion in CSV files.
 *
 * @param {string} value - The input string to be sanitized.
 * @returns {string} - Returns the sanitized string
 * */
export function sanitizeInput(value: string): string {
  return value.trim().replace(/^[=+\-@]/, '');
}

export function sanitizeInputValidation(value: string, fieldLabel: string) {
  const originalValue = value.trim();
  const sanitizedValue = sanitizeInput(originalValue);
  if (originalValue !== sanitizedValue) {
    return `${fieldLabel} cannot start with special characters like =, +, -, or @.`;
  }
  return true;
}

export const tagsValidate = (value: string | undefined) => {
  const tags = value?.split(',').map(tag => tag.trim());
  const invalidTags = tags?.filter(tag => tag.length > 50) ?? [];

  if (invalidTags.length > 0) {
    return `The following tags exceed 50 characters: ${invalidTags.join(', ')}`;
  }

  return true;
};
