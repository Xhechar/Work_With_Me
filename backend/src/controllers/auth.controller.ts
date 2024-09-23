import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import loginSchema from "../validators/input.vaalidators";

let authService = new AuthService();

export class AuthController {

  async loginUser(req: Request, res: Response) {
    
    try {
      let { error } = loginSchema.validate(req.body);

      if (error) {
        return res.json({
          error: error.message
        });
      }

      let response = await authService.loginUser(req.body);

      return res.status(201).json(response);
    } catch (error) {
      return res.status(501).json({
        error: error
      })
    }
  }
}