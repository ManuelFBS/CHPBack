import bcrypt from 'bcryptjs';

export const encrypted = async (
  password: string,
): Promise<string> => {
  const encryptedPassword = await bcrypt.hash(password, 10);

  return encryptedPassword;
};
