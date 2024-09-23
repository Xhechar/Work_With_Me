import { PrismaClient } from "@prisma/client";
import { User } from "../interfaces/interfaces";
import { v4 } from "uuid";
import lodash from 'lodash';
import bcrypt from 'bcrypt';

export class UserService {

  prisma = new PrismaClient({
    log: ["error"]
  });

  async createUser(user: User) {

    const emailExists: User[] = await this.prisma.User.findUnique({
      where: {
        email: user.email
      }
    });

    if (!(lodash.isEmpty(emailExists))) {
      return {
        error: 'Email exists, Login Instead.'
      }
    }

    const phoneExists: User[] = await this.prisma.User.findUnique({
      where: {
        phone_number: user.phone_number
      }
    });

    if (!(lodash.isEmpty(phoneExists))) {
      return {
        error: 'Phone number exists.'
      }
    }

    let idExists: User[] = await this.prisma.User.findUnique({
      where: {
        id_number: user.id_number
      }
    });

    if (!(lodash.isEmpty(idExists))) {
      return {
        error: 'The Id Number provided exists'
      }
    }

    const newUser = await this.prisma.User.create({
      data: {
        user_id: v4(),
        fullname: user.fullname,
        id_number: user.id_number,
        country: user.country,
        county: user.county,
        ward: user.ward,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        profile_image: user.profile_image
      }
    });

    if (newUser[0] < 1) {
      return {
        error: 'Registration Incomplete'
      }
    } else {
      return {
        message: `Welcome ${user.fullname}, registration successfull.`
      }
    }
  }

  async updateUser(user_id: string, user: User) {

    const userExists = await this.prisma.User.findUnique({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    });

    if (lodash.isEmpty(userExists)) {
      return {
        error: 'Login to update profile.'
      }
    }

    let passwordsMatch = bcrypt.compareSync(user.password, userExists[0].password);

    if (!passwordsMatch) {
      return {
        error: 'Incorrect password provided.'
      }
    }

    const updateUser = await this.prisma.User.update({
      data: {
        user_id: v4(),
        fullname: user.fullname,
        id_number: user.id_number,
        country: user.country,
        county: user.county,
        ward: user.ward,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        profile_image: user.profile_image
      },
      where: {
        user_id: user_id
      }
    });

    if (updateUser[0] < 1) {
      return {
        error: 'Update unable to complete'
      }
    } else {
      return {
        message: 'Profile Update Successfull.'
      }
    }
  }

  async fetchSingleUser(user_id: string) {
    const user: User[] = await this.prisma.User.findUnique({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    });

    if (lodash.isEmpty(user)) {
      return {
        error: 'User not found.'
      }
    } else {
      return {
        message: 'User retrieved successfully',
        user: user[0]
      }
    }
  }

  async fetchAllUsers() {
    const users: User[] = await this.prisma.User.findMany({
      where: {
        isDeleted: false
      }
    });

    if (lodash.isEmpty(users)) {
      return {
        error: 'No users found.'
      }
    } else {
      return {
        message: 'Users retrieved successfully',
        users: users
      }
    }
  }

  async softDeleteSingleUser(user_id: string) {
    const userExists = await this.prisma.User.findUnique({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    });

    if (lodash.isEmpty(userExists)) {
      return {
        error: 'User not found.'
      }
    } else {
      const deleteUser = await this.prisma.User.update({
        data: {
          isDeleted: true
        },
        where: {
          user_id: user_id
        }
      });

      if (deleteUser.affectedRows < 1) {
        return {
          error: 'User soft deletion failed.'
        }
      } else {
        return {
          message: 'User soft deleted successfully.'
        }
      }
    }
  }

  async softDeleteAllUsers() {
    const users: User[] = await this.prisma.User.findMany({
      where: {
        isDeleted: false
      }
    });

    if (lodash.isEmpty(users)) {
      return {
        error: 'No users found to delete.'
      }
    }

    const deleteUsers = await this.prisma.User.updateMany({
      data: {
        isDeleted: true
      },
      where: {
        isDeleted: false
      }
    });

    if (deleteUsers.affectedRows < 1) {
      return {
        error: 'Users soft deletion failed.'
      }
    } else {
      return {
        message: 'Users soft deleted successfully.'
      }
    }
  }

  async softDeleteMultipleUsers(user_ids: string[]) {
    const users: User[] = await this.prisma.User.findMany({
      where: {
        user_id: { in: user_ids },
        isDeleted: false
      }
    });

    if (lodash.isEmpty(users)) {
      return {
        error: 'No users found to delete.'
      }
    }

    const deleteUsers = await this.prisma.User.updateMany({
      data: {
        isDeleted: true
      },
      where: {
        user_id: { in: user_ids },
        isDeleted: false
      }
    });

    if (deleteUsers.affectedRows < 1) {
      return {
        error: 'Users soft deletion failed.'
      }
    } else {
      return {
        message: 'Users soft deleted successfully.'
      }
    }
  }

  async fetchAllSoftDeletedUsers() {
    const users: User[] = await this.prisma.User.findMany({
      where: {
        isDeleted: true
      }
    });

    if (lodash.isEmpty(users)) {
      return {
        error: 'No soft deleted users found.'
      }
    } else {
      return {
        message: 'Soft deleted users retrieved successfully',
        users: users
      }
    }
  }

  async unSoftDeletedUser(user_id: string) {
    const user: User[] = await this.prisma.User.findUnique({
      where: {
        user_id: user_id,
        isDeleted: true
      }
    });

    if (lodash.isEmpty(user)) {
      return {
        error: 'Soft deleted user not found.'
      }
    } else {
      
      const unDelete = await this.prisma.User.update({
        data: {
          isDeleted: false
        },
        where: {
          user_id: user_id
        }
      });

      if (unDelete.affectedRows < 1) {
        return {
          error: 'User retrieval failed.'
        }
      } else {
        return {
          message: 'User retrieved deleted successfully.'
        }
      }
    }
  }

  async unSoftDeleteAllUsers() {
    const users: User[] = await this.prisma.User.findMany({
      where: {
        isDeleted: true
      }
    });

    if (lodash.isEmpty(users)) {
      return {
        error: 'No soft deleted users found to retrieve.'
      }
    }

    const unDeleteUsers = await this.prisma.User.updateMany({
      data: {
        isDeleted: false
      },
      where: {
        isDeleted: true
      }
    });

    if (unDeleteUsers.affectedRows < 1) {
      return {
        error: 'Users restoration failed.'
      }
    } else {
      return {
        message: 'Users restored successfully.'
      }
    }
  }

  async restoreMultipleUsers(user_ids: string[]) {
    const users: User[] = await this.prisma.User.findMany({
      where: {
        user_id: { in: user_ids },
        isDeleted: true
      }
    });

    if (lodash.isEmpty(users)) {
      return {
        error: 'No soft deleted users found to restore.'
      }
    }

    const restoreUsers = await this.prisma.User.updateMany({
      data: {
        isDeleted: false
      },
      where: {
        user_id: { in: user_ids },
        isDeleted: true
      }
    });

    if (restoreUsers.affectedRows < 1) {
      return {
        error: 'Users restoration failed.'
      }
    } else {
      return {
        message: 'Users restored successfully.'
      }
    }
  }

  async hardDeleteSingleUser(user_id: string) {
    const userExists = await this.prisma.User.findUnique({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    });

    if (lodash.isEmpty(userExists)) {
      return {
        error: 'User not found.'
      }
    } else {
      const deleteUser = await this.prisma.User.delete({
        where: {
          user_id: user_id
        }
      });

      if (deleteUser.affectedRows < 1) {
        return {
          error: 'User hard deletion failed.'
        }
      } else {
        return {
          message: 'User deleted successfully.'
        }
      }
    }
  }
}