import { PrismaClient } from "@prisma/client"
import { IndividualDetails, User } from "../interfaces/interfaces";
import { v4 } from 'uuid';

export class IndividualPersonDetails {
  prisma = new PrismaClient({
    log: ['error']
  })

  async createDetails(person_id: string, details: IndividualDetails) {
    let user = await this.prisma.user.findUnique({
      where: {
        user_id: person_id,
        isDeleted: false
      }
    }) as User;

    if (!user) {
      return { 
        error: 'User not found'
      }
    }

    let exists = await this.prisma.individualDetails.findUnique({
      where: {
        user_id: person_id
      }
    });

    const { individual_id, user_id, ...rest } = details;

    if (!exists) {
      let create = await this.prisma.individualDetails.create({
        data: {
          user_id: person_id,
          individual_id: v4(),
          ...rest
        }
      }) as IndividualDetails;

      if (!create) {
        return {
          error: 'Unable to create job details'
        }
      } else {
        return {
          message: 'Job details created successfully'
        }
      }
    } else {
      let update = await this.prisma.individualDetails.update({
        where: {
          user_id: person_id
        },
        data: {
          ...rest
        }
      }) as IndividualDetails;

      if (!update) {
        return {
          error: 'Unable to update job details'
        }
      } else {
        return {
          message: 'Job details updated successfully'
        }
      }
    }
  }

  async deleteDetails(person_id: string) {
    let user = await this.prisma.individualDetails.findUnique({
      where: {
        user_id: person_id
      }
    });

    if (!user) {
      return {
        error: 'User details not found'
      }
    }
    
    let deleteUser = await this.prisma.individualDetails.delete({
      where: {
        user_id: person_id
      }
    });
    
    if (!deleteUser) {
      return {
        error: 'Unable to delete user details'
      }
    } else {
      return {
        message: 'User details deleted successfully'
      }
    }
  }
}