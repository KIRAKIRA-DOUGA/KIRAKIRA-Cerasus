/**
 * 将驼峰式字符串转换为连字符式字符串。
 * @param str - 驼峰式字符串。
 * @returns - 连字符式字符串。
 */
export const camelToKebabCase = (str: string) => str.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * 将连字符式字符串转换为驼峰式字符串。
 * @param str - 连字符式字符串。
 * @returns - 驼峰式字符串。
 */
export const kebabToCamelCase = (str: string) => str.toLowerCase().replace(/-(\w)/g, (_, w: string) => w.toUpperCase());
