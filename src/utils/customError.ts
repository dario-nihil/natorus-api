class CustomError extends Error {
  private _status?: string | undefined;
  private _statusCode?: number | undefined;
  private _path?: string | undefined;
  private _value?: string | undefined;
  private _code?: number | undefined;
  private _errors?: [any] | undefined;
  private readonly _isOperational = true;

  constructor(message: string) {
    super(message);

    // Set prototype explicitly.
    Object.setPrototypeOf(this, CustomError.prototype);

    Error.captureStackTrace(this, this.constructor);
  }

  public set status(status: string | undefined) {
    this._status = status;
  }

  public get status(): string | undefined {
    return this._status;
  }

  public set statusCode(statusCode: number | undefined) {
    this._statusCode = statusCode;

    this._status = statusCode?.toString().startsWith('4') ? 'fail' : 'error';
  }

  public get statusCode(): number | undefined {
    return this._statusCode;
  }

  public set path(path: string | undefined) {
    this._path = path;
  }

  public get path() {
    return this._path;
  }

  public set value(value: string | undefined) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public set code(code: number | undefined) {
    this._code = code;
  }

  public get code() {
    return this._code;
  }

  public set errors(errors: [any] | undefined) {
    this._errors = errors;
  }

  public get errors() {
    return this._errors;
  }

  public get isOperational() {
    return this._isOperational;
  }
}

export default CustomError;
