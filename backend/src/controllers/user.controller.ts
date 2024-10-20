import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { userSchema } from "../validators/input.vaalidators";
import { ExtendedRequest, getIdFromToken } from "../middlewares/verify.token";

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

  async updateUser(req: ExtendedRequest, res: Response) {
    try {

      let { error } = userSchema.validate(req.body);

      if (error) {
        return res.status(401).json({
          error: error.message
        });
      }

      let response = await userService.updateUser(getIdFromToken(req), req.body);

      return res.status(201).json(response);
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async fetchSingleUser(req: ExtendedRequest, res: Response) {

    try {

      return res.status(201).json((await userService.fetchSingleUser(getIdFromToken(req))))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async fetchAllUsers(res: Response) {
    try {

      return res.status(201).json((await userService.fetchAllUsers()))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async softDeleteSingleUser(req: ExtendedRequest, res: Response) {
    try {

      return res.status(201).json((userService.softDeleteSingleUser(req.params.user_id)))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async softDeleteAllUsers(req: Request, res: Response) {
    try {

      return res.status(201).json((userService.softDeleteAllUsers()));
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async softDeleteMultipleUsers(req: Request, res: Response) {
    try {

      return res.status(201).json((userService.softDeleteMultipleUsers(req.body)))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async fetchAllSoftDeletedUsers(req: Request, res: Response) {
    try {

      return res.status(201).json((userService.fetchAllSoftDeletedUsers()));
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async unSoftDeletedUser(req: Request, res: Response) {
    try {

      return res.status(201).json((userService.unSoftDeletedUser(req.params.user_id)))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async unSoftDeleteAllUsers(req: Request, res: Response) {
    try {

      return res.status(201).json((userService.unSoftDeleteAllUsers()));
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async restoreMultipleUsers(req: Request, res: Response) {
    try {

      return res.status(201).json((userService.restoreMultipleUsers(req.body)))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async hardDeleteSingleUser(req: Request, res: Response) {
    try {

      return res.status(201).json((userService.hardDeleteSingleUser(req.params.user_id)))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }

  async changeUserRole(req: Request, res: Response) {
    try {
      return res.status(201).json((userService.changeUserRole(req.params.user_id)))
      
    } catch (error) {
      return res.status(501).json({
        error
      })
    }
  }
}