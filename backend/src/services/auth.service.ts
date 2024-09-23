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

    const emailExists: User[] = await this.prisma.User.findUnique({
      where: {
        email: logins.email,
        isDeleted: false
      }
    });

    if (lodash.isEmpty(emailExists)) {
      return {
        error: 'Email not found. Sign Up Instead.'
      }
    }
    
    const passwordsMatch = bcrypt.compareSync(logins.password, emailExists[0].password);

    if (!passwordsMatch) {
      return {
        error: 'Incorrect Password.'
      }
    } else {
      const token = jwt.sign(emailExists[0], process.env.SECRET_KEY as string, {
        expiresIn: '30m'
      });

      return {
        message: 'Logged In Successfully.',
        role: emailExists[0].role,
        token: token
      }
    }
  }
}