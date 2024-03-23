import { User } from '../entities/User';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { IPayload } from '../validations/tokens/verifyToken';

dotenv.config();

export const CheckOutUserOwner = async (
  tokenHeader: string,
  userRol: string,
): Promise<User | null> => {
  const token = tokenHeader;

  // Si no existe, no permite el acceso...
  if (!token) {
    return null;
  }

  // El usuario debe tener rol 'owner' para poder realizar
  // la operación a continuación...
  if (userRol !== 'owner') {
    return null;
  }

  let payload: unknown;
  try {
    payload = jwt.verify(
      token,
      process.env.SECRET_KEY_TOKEN || 'ExtToks112244',
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }

  if (
    payload === null ||
    typeof payload !== 'object' ||
    !('_id' in payload) ||
    !('rol' in payload)
  ) {
    return null;
  }

  const verifiedPayload = payload as IPayload;
  const user = await User.findOne({
    where: { id: parseInt(verifiedPayload._id) },
  });

  if (!user) {
    return null;
  }

  return user;
};
