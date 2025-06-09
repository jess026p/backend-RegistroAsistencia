import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ServiceUnavailableException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environments } from '../environments';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseHttpInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if (environments.serviceUnavailable) {
      throw new ServiceUnavailableException();
    }

    if (url.includes('auth/login')) {
      return next.handle();
    }

    return next.handle().pipe(
      map(response => ({
        data: response?.data ?? response,
        pagination: response?.pagination,
        message: response?.message,
        title: response?.title,
        version: environments.appVersion,
      })),
    );
  }
}
