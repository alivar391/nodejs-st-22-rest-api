import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { logger } from 'src/logger/logger';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: errorMessage,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    if (!(exception instanceof HttpException)) {
      // logger.error(responseBody);
      throw exception;
    } else {
      // logger.error({
      //   controller_method: `[${req.url} ${req.method}]`,
      //   arguments: {
      //     req,
      //     res,
      //   },
      //   errorMessage,
      // });
    }
  }
}
