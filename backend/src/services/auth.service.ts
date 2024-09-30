import { PrismaClient } from "@prisma/client";
import { LoginDetails, User } from "../interfaces/interfaces";
import lodash from 'lodash';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

export class AuthService {

  prisma = new PrismaClient({
    log: ['error']
  });

  async loginUser(logins: LoginDetails) {

    const emailExists = await this.prisma.user.findUnique({
      where: {
        email: logins.email,
        isDeleted: false
      }
    }) as User;

    if (!emailExists) {
      return {
        error: 'Email not found. Sign Up Instead.'
      }
    }
    
    const passwordsMatch = bcrypt.compareSync(logins.password, emailExists.password);

    if (!passwordsMatch) {
      return {
        error: 'Incorrect Password.'
      }
    } else {
      const token = jwt.sign(emailExists, process.env.SECRET_KEY as string, {
        expiresIn: '30m'
      });

      return {
        message: 'Logged In Successfully.',
        role: emailExists.role,
        token: token
      }
    }
  }
}