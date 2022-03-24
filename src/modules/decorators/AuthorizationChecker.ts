import { Action } from 'routing-controllers';

export const authorizationChecker  = async (action: Action, roles: string[]) => {

    const token = action.request;
    console.info(token)

    return false;
}