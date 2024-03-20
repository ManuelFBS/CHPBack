import { Request, Response } from 'express';
import { Roles, User } from '../../entities/User';
import { isEmailType } from '../../libs/vartype';
import { UserEntity } from 'interfaces/userEntity';
import { encrypted } from '../../validations/password/encrypted';
import { decryptPassword } from '../../validations/password/decrypted';
import { CheckOutUserOwner } from '../../libs/checkOut';
import { AppDataSource } from '../../db/database';

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { orderBy } = req.query;

    let orderOptions: { [key: string]: 'ASC' | 'DESC' } =
      {};

    if (orderBy === 'id' || orderBy === 'lastName') {
      orderOptions[orderBy] = 'ASC';
    } else {
      orderOptions['id'] = 'ASC';
    }

    // Se verifica el rol del usuario para permitir o no el acceso
    // única y exclusivamente a 'owner' y 'admin'...
    if (
      req.userRole !== 'owner' &&
      req.userRole !== 'admin'
    ) {
      return res.status(403).json('Access denied...!');
    }

    const users = await User.find({
      select: [
        'id',
        'name',
        'lastName',
        'age',
        'email',
        'phoneNumber',
        'userName',
        'rol',
        'active',
      ],
      order: orderOptions,
    });

    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const getUserByEmailOrUsername = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { inputValue }: { inputValue: string } = req.body;
  let user: UserEntity | any;

  try {
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
      return res
        .status(404)
        .json({ message: 'User not found...' });

    const { password, ...userWithoutPassword } = user;
    const formattedUser = {
      ...userWithoutPassword,
      createdAt: user.createdAt.toISOString().split('T')[0],
      updatedAt: user.updatedAt.toISOString().split('T')[0],
    };

    return res.status(200).json(formattedUser);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    let {
      name,
      lastName,
      age,
      email,
      phoneNumber,
      userName,
      password,
      rol,
      active,
      newPassword,
    } = req.body;

    if (!(email || userName) || !password) {
      return res.status(401).json({
        message:
          'You must provide email (or Username) and password...',
      });
    }

    let user: User | any;
    let inputQuery: string | any;
    let inputValue: object | any;

    if (email) {
      if (isEmailType(email)) {
        user = await User.findOne({ where: { email } });
        inputQuery = 'email = :email';
        inputValue = { email: email };
      } else {
        return res
          .status(401)
          .json({ message: 'Email not valid...' });
      }
    } else if (userName) {
      user = await User.findOne({ where: { userName } });
      inputQuery = 'userName = :userName';
      inputValue = { userName: userName };
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found.' });
    }

    const isPasswordValid = await decryptPassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: 'Invalid password...' });
    }

    let encryptedPassword: string;

    if (newPassword) {
      encryptedPassword = await encrypted(newPassword);
      newPassword = encryptedPassword;
    }

    const dataSource = AppDataSource;
    const newDataUser: User[] | any = {
      name: name,
      lastName: lastName,
      age: age,
      email: email,
      phoneNumber: phoneNumber,
      userName: userName,
      password: newPassword,
      rol: rol,
      active: active,
    };

    dataSource
      .createQueryBuilder()
      .update(User)
      .set(newDataUser)
      .where(inputQuery, inputValue)
      .execute();
    // || 'userName :userName', { userName: userName },

    return res.status(200).json({
      message: 'User data updated successfully...!',
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params;
  const { email, userName } = req.body;

  try {
    const token: string | any = req.header('auth-token');
    const userRol = req.userRole;
    const authUser: User | null = await CheckOutUserOwner(
      token,
      userRol,
    );

    if (!authUser) {
      return res.status(401).json({
        message: 'Unauthorized or non-existent user...!',
      });
    }

    let user: User | any;
    let query: any;

    if (id) {
      user = await User.findOneBy({ id: parseInt(id) });
      query = { id: parseInt(id) };
    } else if (email) {
      if (isEmailType(email)) {
        user = await User.findOneBy({ email: email });
        query = { email: email };
      }
    } else if (userName) {
      user = await User.findOneBy({ userName: userName });
      query = { userName: userName };
    } else {
      return res.status(400).json({
        message:
          'You must provide Id, Email or Username...',
      });
    }

    if (!user)
      return res
        .status(404)
        .json({ message: 'User not found' });

    await User.delete(query);

    return res.status(200).json({
      message: 'The user was successfully deleted...!',
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};
