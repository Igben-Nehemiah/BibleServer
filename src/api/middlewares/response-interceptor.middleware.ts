/* eslint-disable @typescript-eslint/no-explicit-any */

import * as express from 'express';
import { Response } from '../common/responses';

export const responseInterceptor = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const originalSend = response.send;

  // Remove null value members of response object
  response.send = function (body: any) {
    if (body instanceof Response) {
      for (const key in body) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          if ((body as any)[key] == null) {
            delete (body as any)[key];
          }
        }
      }
    }

    const modifiedBody = body;
    return originalSend.call(this, modifiedBody);
  };
  next();
};
