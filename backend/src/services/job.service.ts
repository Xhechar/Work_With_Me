import { PrismaClient } from "@prisma/client";
import { Job, User } from "../interfaces/interfaces";
import { v4 } from "uuid";

export class JobService {

  prisma = new PrismaClient({
    log: ['error']
  });

  async createJob(user_id: string, job: Job) {
    let user = await this.prisma.user.findFirst({
      where: {
        user_id: user_id,
        isDeleted: false
      }
    }) as User;

    if (!user) {
      return {
        error: 'Contact manager to create job'
      }
    }

    let { job_id, user_id, owner, job_positions, ...rest} = job;

    let create = await this.prisma.job.create({
      data: {
        job_id: v4(),
        user_id: user_id,
        ...rest
      }
    })
  }
}