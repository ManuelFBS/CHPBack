import { Request, Response } from 'express';
import { User } from '../../entities/User';
import { Roles } from '../../entities/user.roles';
import { UserEntity } from '../../interfaces/userEntity';
import { encrypted } from '../../validations/password/encrypted';
import { decryptPassword } from '../../validations/password/decrypted';
import jwt from 'jsonwebtoken';
import { token } from '../../validations/tokens/token';
import { isEmailType } from '../../libs/vartype';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_AUX: any = process.env.SECRET_KEY_AUX;

export const signUp = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const {
    name,
    lastName,
    age,
    email,
    phoneNumber,
    userName,
    password,
    rol,
    active,
  } = req.body;

  try {
    const emailExists = await User.findOne({
      where: { email: email },
    });
    const phoneNumberExists = await User.findOne({
      where: { phoneNumber: phoneNumber },
    });

    if (emailExists)
      return res
        .status(400)
        .json(['The email already exists...!']);

    if (phoneNumberExists)
      return res
        .status(400)
        .json(['This Phone number already exists...!']);

    const passwordEncrypted: any = await encrypted(
      password,
    );

    const ageString = req.body.age;
    const ageInt: number = parseInt(ageString, 10);

    const user: UserEntity = new User();
    user.name = name;
    user.lastName = lastName;
    user.age = ageInt;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.userName = userName;
    user.password = passwordEncrypted;
    user.rol = rol || Roles.User;
    user.active = active || true;

    const newUser = await user.save();

    // Remove password from newUser object
    const { password: removedPassword, ...userNoPassword } =
      newUser;

    const userToken = await token(newUser);

    res.cookie('auth-token', userToken, {
      sameSite: 'none',
      secure: true,
    });

    // New registered user and token assignment displayed...
    return res.status(201).json(userNoPassword);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const signIn = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const {
    inputValue,
    password,
  }: { inputValue: string; password: string } = req.body;

  try {
    let user: UserEntity | any;

    if (isEmailType(inputValue)) {
      user = await User.findOne({
        where: { email: inputValue },
      });
    } else {
      user = await User.findOne({
        where: { userName: inputValue },
      });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found...!' });
    }

    if (!(await decryptPassword(password, user.password))) {
      return res
        .status(401)
        .json({ message: 'Invalid password...!' });
    }

    const userToken = await token(user);

    res.cookie('auth-token', userToken, {
      sameSite: 'none',
      secure: true,
    });

    return res.status(200).json({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt.toISOString().split('T')[0],
      updatedAt: user.updatedAt.toISOString().split('T')[0],
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const signOut = (req: Request, res: Response) => {
  res.cookie('auth-token', '', {
    expires: new Date(0),
  });

  return res.sendStatus(200);
};

export const profile = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.allUserData._id;
  const userFound = await User.findOne({ where: { id } });

  if (!userFound)
    return res
      .status(400)
      .json({ message: 'User not found...!' });

  return res.json({
    id: userFound.id,
    name: userFound.name,
    lastName: userFound.lastName,
    age: userFound.age,
    email: userFound.email,
    phoneNumber: userFound.phoneNumber,
    username: userFound.userName,
    createdAt: userFound.createdAt
      .toISOString()
      .split('T')[0],
    updatedAt: userFound.updatedAt
      .toISOString()
      .split('T')[0],
  });
};

export const frontVerifyToken = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const authToken = req.cookies['auth-token'];
  const role: boolean = false;

  if (!authToken)
    return res
      .status(401)
      .json({ message: 'Unauthorized' });

  let userVerified: any;
  jwt.verify(
    authToken,
    process.env.SECRET_KEY_TOKEN || SECRET_AUX,
    async (err: any, user: any) => {
      if (err)
        return res
          .status(401)
          .json({ message: 'Unauthorized' });

      const userFound = await User.findOne({
        where: { id: parseInt(user.id) },
      });

      if (!userFound)
        return res
          .status(401)
          .json({ message: 'Unauthorized' });

      userVerified = user;
    },
  );

  return res.json([
    authToken,
    {
      id: userVerified.id,
      name: userVerified.name,
      lastName: userVerified.lastName,
      email: userVerified.email,
      rol: userVerified.rol,
    },
  ]);
};
