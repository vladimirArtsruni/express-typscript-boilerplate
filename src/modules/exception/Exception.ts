import { ErrorCode } from "./ErrorCode";

export class Exception extends Error {
  public httpCode: number;
  public errors: any | null;

  constructor(code: string = ErrorCode.UnknownError, errors: any = null) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
    this.httpCode = 500;
    this.errors = errors;
    switch (code) {
      case ErrorCode.ValidationError:
        this.httpCode = 400;
        break;
      case ErrorCode.BadRequestError:
        this.httpCode = 400;
        break;
      case ErrorCode.Unauthenticated:
        this.httpCode = 401;
        break;
      case ErrorCode.AccessDenied:
        this.httpCode = 403;
        break;
      case ErrorCode.NotFound:
        this.httpCode = 404;
        break;
      default:
        this.httpCode = 500;
        break;
    }
  }
}
