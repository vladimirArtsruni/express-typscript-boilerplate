import * as  bcrypt from 'bcryptjs';
import { RegisterDto } from '../dto/auth/RegisterDto';
import { LoginDto } from '../dto/auth/LoginDto';
import { Service } from 'typedi';
import { Exception } from '../modules/exception/Exception';
import { ErrorCode } from '../modules/exception/ErrorCode';
import { ErrorMessages } from '../modules/exception/ErrorMessages';
import { Environment } from '../config/Environment';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../repositories/UserRepository';
import { TokenRepository } from '../repositories/TokenRepository';

@Service()
export class AuthService {

    constructor(
        @InjectRepository() private readonly userRepository: UserRepository,
        @InjectRepository() private readonly tokenRepository: TokenRepository
    )
    {}

    /**
     * @param data
     */
    async register(data: RegisterDto) {

        const checkEmail = await this.userRepository.getByEmail(data.email);
        if (checkEmail) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.EmailAlreadyExist });

        const checkUsername = await this.userRepository.getByUsername(data.username);
        if (checkUsername) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.UsernameAlreadyExist });

        const salt = bcrypt.genSaltSync(Environment.BcryptGenSaltRountds);
        const hashedPassword = bcrypt.hashSync(data.password, salt);
        data.password = hashedPassword;

        const user = await this.userRepository.save({...data, salt });

        return user;
    }

    /**
     * @param data
     */
    async login(data: LoginDto) {

        const user = await this.userRepository.getByEmail(data.email);
        if (!user) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.InvalidCredentials });

        const check = await user.checkPassword(data.password);
        if (!check) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.InvalidCredentials });

        const token  = user.generateToken();
        return { token }
    }
}