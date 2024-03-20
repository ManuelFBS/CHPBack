import bcrypt from 'bcryptjs';

export const decryptPassword = async (
  signinPassword: string,
  encryptedPassword: string,
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(
      signinPassword,
      encryptedPassword,
    );

    return match;
  } catch (error) {
    console.error('Error comparing passwords', error);
    return false;
  }
};
