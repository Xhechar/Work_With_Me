import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenDetails } from "../interfaces/interfaces";

export interface ExtendedRequest extends Request {
  info: TokenDetails
}

export const verifyTokens = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {

    let authHeaders = req.headers['Authorization'] as string;

    if (!authHeaders) {
      return res.status(401).json({
        error: 'This service is not authorised'
      })
    } else {
      const token = authHeaders.split(' ')[0];

      jwt.verify(token, process.env.SECRET_KEY as string, (err, data) => {

        if (err) {
          if (err.name === "JsonWebToken Error") {
            return res.status(401).json({
              error: 'Authorisation is invalid'
            })
          } else if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              error: 'Token has expired'
            })
          } else {
            return res.status(500).json({
              error: 'An error occurred while verifying the token'
            })
          }
        }

        else {
          req.info = data as TokenDetails;
          next();
        }
      })
    }
    
  } catch (error) {
    return res.status(401).json({
      error
    })
  }
}

export const getIdFromToken = (req: ExtendedRequest):string => {

  const data = req.info; 

  if (!data) {
    return ''
  } else {
    return data.user_id;
  }
}

export const verifyAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  const data = req.info;

  if (!data) {
    return res.status(401).json({
      error: 'Admin authorization is required --admin verification!--'
    })
  } else {
    if (data.role != 'admin') {
      return res.status(401).json({
        error: 'You are not authorized to perform this action'
      })
    } else {
      next();
    }
  }
}