// ------ REG --------

// match 不包含 AB 的字符
export const matchStr = (str: string, left: string, right: string) => {
  const pattern = new RegExp(`(?<=${left}).*?(?=${right})`);
  return str.match(pattern);
};