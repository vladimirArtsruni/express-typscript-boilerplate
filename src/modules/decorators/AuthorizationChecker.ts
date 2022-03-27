import * as jwt from 'jsonwebtoken';
import { Action } from 'routing-controllers';
import { Environment } from '../../config/Environment';
import { Exception } from '../exception/Exception';
import { ErrorCode } from '../exception/ErrorCode';
import { ErrorMessages } from '../exception/ErrorMessages';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/users/User';
import { getCustomRepository } from 'typeorm';

export const authorizationChecker  = async (action: Action, roles: string[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {

      const token = action.request.headers["authorization"];
      if (!token) return reject(new Exception(ErrorCode.Unauthenticated, { message: ErrorMessages.AuthorizationRequired }));

      const bearerToken = token.split(`${Environment.BearerTokenPrefix} `)[1];
      if (!bearerToken) return reject(new Exception(ErrorCode.Unauthenticated, { message: ErrorMessages.InvalidToken }));

      return jwt.verify(bearerToken, Environment.getAccessTokenSecret(), async(err: any, decoded: any) => {

          if (err) return reject(new Exception(ErrorCode.Unauthenticated, { message: ErrorMessages.InvalidToken }));

          const userRepository = getCustomRepository(UserRepository);
          const user = await userRepository.findOne(decoded.data.id);
          if (!user) return reject(new Exception(ErrorCode.Unauthenticated, { message: ErrorMessages.InvalidUser }));
          
          if (roles && roles.length && !roles.includes(user.role)) return reject(new Exception(ErrorCode.AccessDenied, { message: ErrorMessages.AccessDenied }));

          action.request.user = user;
          resolve(true);
      });
  })
}