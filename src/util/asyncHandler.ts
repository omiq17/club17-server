import { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise
      .resolve(fn(req, res, next))
      .catch((error: Error) => {
        res.status(500).json({ message: error.message });
      });
  }
};


export default asyncHandler;