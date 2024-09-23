import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { userSchema } from "../validators/input.vaalidators";

const userService = new UserService();

export class UserController {

  async createUser(req: Request, res: Response) {
    try {

      let { error } = userSchema.validate(req.body);

      if (error) {
        return res.status(401).json({
          error: error.message
        });
      }

      let response = await userService.createUser(req.body);

      return res.status(201).json(response);
      
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
}