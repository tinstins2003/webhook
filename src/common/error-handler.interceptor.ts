import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          const status = err.getStatus();
          const response = err.getResponse();
          const body: ErrorResponse = {
            statusCode: status,
            message:
              typeof response === 'object' && response !== null && 'message' in response
                ? (response as { message?: string | string[] }).message ?? err.message
                : err.message,
            error: err.name,
          };
          return throwError(() => new HttpException(body, status));
        }
        const body: ErrorResponse = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
          error: 'Internal Server Error',
        };
        return throwError(() => new HttpException(body, HttpStatus.INTERNAL_SERVER_ERROR));
      }),
    );
  }
}
