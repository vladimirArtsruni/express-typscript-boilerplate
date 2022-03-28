import { RegisterDto } from "../dto/auth/RegisterDto";
import { LoginDto } from "../dto/auth/LoginDto";
import { Service } from "typedi";
import { Exception } from "../modules/exception/Exception";
import { ErrorCode } from "../modules/exception/ErrorCode";
import { ErrorMessages } from "../modules/exception/ErrorMessages";

import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repositories/UserRepository";
import { TokenRepository } from "../repositories/TokenRepository";
import { Types } from "../entities/tokens/types";

import { Helpers } from "../modules/helpers";

@Service()
export class AuthService {

  constructor(
    @InjectRepository() private readonly userRepository: UserRepository,
    @InjectRepository() private readonly tokenRepository: TokenRepository
  ) {
  }

  /**
   * @param data
   */
  async register(data: RegisterDto) {

    const checkEmail = await this.userRepository.getByEmail(data.email);
    if (checkEmail) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.EmailAlreadyExist });

    const checkUsername = await this.userRepository.getByUsername(data.username);
    if (checkUsername)
      throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.UsernameAlreadyExist });

    const hashedPasswordAndSalt = Helpers.getnerateHash(data.password);
    data.password = hashedPasswordAndSalt.password;

    return this.userRepository.save({ ...data, salt: hashedPasswordAndSalt.salt });
  }

  /**
   * @param data
   * @param ip
   */
  async login(data: LoginDto, ip: string) {

    const user = await this.userRepository.getByEmail(data.email);
    if (!user) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.InvalidCredentials });

    const check = await user.checkPassword(data.password);
    if (!check) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.InvalidCredentials });

    const accessToken = Helpers.generateToken({ id: user.id });
    const refreshToken = Helpers.generateToken({ id: user.id }, false);
    await this.tokenRepository.delete({ userId: user.id, type: Types.REFRESH });
    await this.tokenRepository.save({ userId: user.id, token: refreshToken, ip, type: Types.REFRESH });
    return { accessToken, refreshToken };
  }

  /**
   * @param tokenStr
   * @param ip
   */
  async refreshToken(tokenStr: string, ip: string) {
    return Helpers.verifyJwt(tokenStr, async (err: any, decoded: any) => {
      if (err) return new Exception(ErrorCode.BadRequestError, { message: ErrorMessages.InvalidToken });

      const token = await this.tokenRepository.findOne({
        userId: decoded.data.id,
        type: Types.REFRESH,
        token: tokenStr
      });
      if (!token) return new Exception(ErrorCode.NotFound, { message: ErrorMessages.TokenNotFound });

      const user = await this.userRepository.findOne(decoded.data.id);
      if (!user) return new Exception(ErrorCode.NotFound, { message: ErrorMessages.UserNotFoud });

      const accessToken = Helpers.generateToken({ id: user.id });
      const refreshToken = Helpers.generateToken({ id: user.id }, false);

      await this.tokenRepository.update({ id: token.id }, { token: refreshToken, ip });

      return { accessToken, refreshToken };
    }, false);
  }
}
