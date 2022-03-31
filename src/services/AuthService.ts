import { RegisterDto } from "../dto/auth/RegisterDto";
import { LoginDto } from "../dto/auth/LoginDto";
import { ForgotPassword } from "../dto/auth/ForgotPassword";
import { Service } from "typedi";
import { Exception } from "../modules/exception/Exception";
import { ErrorCode } from "../modules/exception/ErrorCode";
import { ErrorMessages } from "../modules/exception/ErrorMessages";

import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repositories/UserRepository";
import { TokenRepository } from "../repositories/TokenRepository";
import { Types } from "../entities/tokens/types";

import { Helpers } from "../modules/helpers";
import { RessetPassword } from "../dto/auth/RessetPassword";

@Service()
export class AuthService {

  constructor(
    @InjectRepository() private readonly userRepository: UserRepository,
    @InjectRepository() private readonly tokenRepository: TokenRepository
  ) {}

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


  /**
   * @param data
   * @param ip
   */
  async forgotPassword(data: ForgotPassword, ip: string) {
    const user = await this.userRepository.getByEmail(data.email);
    if (!user) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.InvalidEmail });
    const tokenStr = Helpers.generateToken({ email: user.email, type: Types.FORGOT_PASSWORD, ip });


    let token = await this.tokenRepository.findOne({ userId: user.id, type: Types.FORGOT_PASSWORD });

    if (token) {
      await this.tokenRepository.update({ id: token.id }, { token: tokenStr, ip });
    }else {
      token =  await this.tokenRepository.save({ userId: user.id, type: Types.FORGOT_PASSWORD, token: tokenStr, ip });
    }
  }


  /**
   * @param data
   * @param ip
   */
  async ressetPassword(data: RessetPassword, ip: string) {
    if (data.password !== data.confirmPassword) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.PasswordNotMatched });

    return Helpers.verifyJwt(data.token, async (err: any, decoded: any) => {
      if (err) return new Exception(ErrorCode.BadRequestError, { message: ErrorMessages.InvalidToken });

      if (!decoded.data.type || decoded.data.type !== Types.FORGOT_PASSWORD)
        return new Exception(ErrorCode.BadRequestError, { message: ErrorMessages.InvalidToken });

      const user = await this.userRepository.findOne({ email: decoded.data.email });
      if (!user) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.UserNotFoud });

      const token = await this.tokenRepository.findOne({ token: data.token, type: Types.FORGOT_PASSWORD, userId: user.id });
      if (!token) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.TokenNotFound });

      const hashedPasswordAndSalt = Helpers.getnerateHash(data.password);
      await this.userRepository.update({ id: user.id }, hashedPasswordAndSalt );
      await this.tokenRepository.delete(token.id);

      return true;
    });
  }

}
