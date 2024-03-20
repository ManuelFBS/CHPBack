import { Request, Response } from 'express';
import { Roles, User } from '../../entities/User';
import { UserEntity } from '../../interfaces/userEntity';
import { encrypted } from '../../validations/password/encrypted';
import { decryptPassword } from '../../validations/password/decrypted';
import { token } from '../../validations/tokens/token';
import { isEmailType } from '../../libs/vartype';

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
    const passwordEncrypted: any = await encrypted(
      password,
    );

    const user: UserEntity = new User();
    user.name = name;
    user.lastName = lastName;
    user.age = age;
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

    // New registered user and token assignment displayed...
    return res
      .header('auth-token', token(newUser))
      .json(userNoPassword);
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

    if (!user)
      return res.status(404).json('User not found...!');

    if (!(await decryptPassword(password, user.password))) {
      return res
        .status(401)
        .json({ message: 'Invalid password...!' });
    }

    const responseObject = {
      message: 'Successful login',
      id: user.id,
      name: user.name,
      lastname: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      rol: user.rol,
    };

    return res
      .header('auth-token', token(user))
      .json(responseObject);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};
