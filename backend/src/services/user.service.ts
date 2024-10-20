import { PrismaClient } from "@prisma/client";
import { IndividualDetails, User } from "../interfaces/interfaces";
import { v4 } from "uuid";
import lodash from 'lodash';
import bcrypt from 'bcrypt';
import { IndividualPersonDetails } from "./user.individual.details";

export class UserService {
  individualPersonDetails = new IndividualPersonDetails();

  prisma = new PrismaClient({
    log: ["error"]
  });

  async createUser(user: User) {

    const emailExists = await this.prisma.user.findUnique({
      where: {
        email: user.email
      }
    }) as User;

    if (emailExists) {
      return {
        error: 'Email exists, Login Instead.'
      }
    }

    const phoneExists = await this.prisma.user.findUnique({
      where: {
        phone_number: user.phone_number
      }
    }) as User;

    if (phoneExists) {
      return {
        error: 'Phone number already exists.'
      }
    }

    let idExists = await this.prisma.user.findUnique({
      where: {
        id_number: user.id_number
      }
    }) as User;

    if (idExists) {
      return {
        error: 'The Id Number provided exists'
      }
    }

    const newUser = await this.prisma.user.create({
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
        profile_image: user.profile_image,
        password: bcrypt.hashSync(user.password, 10)
      }
    });

    if (!newUser) {
      return {
        error: 'Registration Incomplete'
      }
    } else {
      return {
        message: `Welcome ${user.fullname.split(' ')[0]}, registration successfull.`
      }
    }
  }

  async updateUser(user_id: string, user: User) {

    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    }) as User;

    if (!userExists) {
      return {
        error: 'Login to update profile.'
      }
    }

    let passwordsMatch = bcrypt.compareSync(user.password, userExists.password);

    if (!passwordsMatch) {
      return {
        error: 'Incorrect password provided.'
      }
    }

    const updateUser = await this.prisma.user.update({
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
    }) as User
    if (!updateUser) {
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
    const user = await this.prisma.user.findFirst({
      where: {
        user_id: user_id,
        isDeleted: false
      },
      include: {
        individualDetails: true
      }
    }) as (User & { individualDetails: IndividualDetails | null });

    if (!user) {
      return {
        error: 'User not found.'
      }
    } else {
      return {
        message: 'User retrieved successfully',
        user: user
      }
    }
  }

  async fetchAllUsers() {
    const users = await this.prisma.user.findMany({
      where: {
        isDeleted: false
      },
      include: {
        individualDetails: true
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
    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    }) as User;

    if (!userExists) {
      return {
        error: 'User not found.'
      }
    } else {
      const deleteUser = await this.prisma.user.update({
        data: {
          isDeleted: true
        },
        where: {
          user_id: user_id
        }
      });

      if (!deleteUser) {
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
    const users = await this.prisma.user.findMany({
      where: {
        isDeleted: false
      }
    }) as User[];

    if (lodash.isEmpty(users)) {
      return {
        error: 'No users found to delete.'
      }
    }

    const deleteUsers = await this.prisma.user.updateMany({
      data: {
        isDeleted: true
      },
      where: {
        isDeleted: false
      }
    });

    if (deleteUsers.count < 1) {
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
    const users = await this.prisma.user.findMany({
      where: {
        user_id: { in: user_ids },
        isDeleted: false
      }
    }) as User[];

    if (lodash.isEmpty(users)) {
      return {
        error: 'No users found to delete.'
      }
    }

    const deleteUsers = await this.prisma.user.updateMany({
      data: {
        isDeleted: true
      },
      where: {
        user_id: { in: user_ids },
        isDeleted: false
      }
    });

    if (deleteUsers.count < 1) {
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
    const users = await this.prisma.user.findMany({
      where: {
        isDeleted: true
      },
      include: {
        individualDetails: true
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
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: user_id,
        isDeleted: true
      }
    })as User;

    if (!user) {
      return {
        error: 'User not found.'
      }
    } else {
      
      const unDelete = await this.prisma.user.update({
        data: {
          isDeleted: false
        },
        where: {
          user_id: user_id
        }
      });

      if (!unDelete) {
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
    const users = await this.prisma.user.findMany({
      where: {
        isDeleted: true
      }
    }) as User[];

    if (lodash.isEmpty(users)) {
      return {
        error: 'No soft deleted users found to retrieve.'
      }
    }

    const unDeleteUsers = await this.prisma.user.updateMany({
      data: {
        isDeleted: false
      },
      where: {
        isDeleted: true
      }
    });

    if (unDeleteUsers.count < 1) {
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
    const users = await this.prisma.user.findMany({
      where: {
        user_id: { in: user_ids },
        isDeleted: true
      }
    }) as User[];

    if (lodash.isEmpty(users)) {
      return {
        error: 'No soft deleted users found to restore.'
      }
    }

    const restoreUsers = await this.prisma.user.updateMany({
      data: {
        isDeleted: false
      },
      where: {
        user_id: { in: user_ids },
        isDeleted: true
      }
    });

    if (restoreUsers.count < 1) {
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
    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    }) as User;

    if (!userExists) {
      return {
        error: 'User not found.'
      }
    } else {
      const deleteUser = await this.prisma.user.delete({
        where: {
          user_id: user_id
        }
      });

      if (!deleteUser) {
        return {
          error: 'User hard deletion failed.'
        }
      } else {
        return {
          message: `User deleted successfully. ${
            (await this.individualPersonDetails.deleteDetails(user_id)).message as string}`
        }
      }
    }
  }

  async changeUserRole(user_id: string) {
    let previousRole: string;

    let userExists = await this.prisma.user.findUnique({
      where: {
        user_id: user_id
      }
    }) as User;

    if (!userExists) {
      return {
        error: 'User not found'
      }
    }

    previousRole = userExists.role;
    let role = userExists.role;

    if (role != 'admin') {
      
      let change = await this.prisma.user.update({
        where: {
          user_id: user_id
        },
        data: {
          role: 'admin',
          prev_role: userExists.role
        }
      }) as User;

      if (!change) {
        return {
          error: `Unable to grant ${userExists.fullname} admin previledges.`
        }
      } else {
        return {
          message: `admin previlages, successfully granted to ${userExists.fullname}`
        }
      }
      
    } else {
      let change = await this.prisma.user.update({
      where: {
        user_id: user_id
      },
      data: {
        role: previousRole,
        prev_role: userExists.role
      }
    }) as User;

    if (!change) {
      return {
        error: `Unable to reverse ${userExists.fullname.split(' ')[0].toLocaleUpperCase}'s admin previledges.`
      }
    } else {
      return {
        message: `admin previlages, successfully reversed.`
      }
    }
    }

  }
}