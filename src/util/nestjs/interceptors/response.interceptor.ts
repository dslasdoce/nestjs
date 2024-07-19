import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((body) => ({
        success: true,
        statusCode: StatusCodes.OK,
        data: body,
      })),
    );
  }
}
