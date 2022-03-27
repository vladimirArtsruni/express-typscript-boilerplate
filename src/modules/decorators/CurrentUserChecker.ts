import { Action } from 'routing-controllers';
import { Exception } from '../exception/Exception';
import { ErrorCode } from '../exception/ErrorCode';
import { ErrorMessages } from '../exception/ErrorMessages';

export const currentUserChecker  =  (action: Action): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const user = action.request.user;
        if (!user.isVerified)  return reject(new Exception(ErrorCode.Unauthenticated, { message: ErrorMessages.UserIsNotVerifed }));
        resolve(true);
    })
}