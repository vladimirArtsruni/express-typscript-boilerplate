import 'express'
import { UserService } from '../services/UserService'
import { AuthService } from '../services/AuthService'

export interface RequestServices {
    userService: UserService,
    authService: AuthService,
}

declare global {
    namespace Express {
        interface Request {
            services: RequestServices
        }
    }
}
