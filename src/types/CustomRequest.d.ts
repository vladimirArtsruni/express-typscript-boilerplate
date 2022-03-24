import 'express'
import { UserService } from '../services/UserService'
import { AuthService } from '../services/AuthService'
import { TokenService } from '../services/TokenService'
import { User } from '../entities/users/User'

export interface RequestServices {
    userService: UserService,
    authService: AuthService,
    tokenService: TokenService
}

declare global {
    namespace Express {
        interface Request {
            services: RequestServices
        }
    }
}
