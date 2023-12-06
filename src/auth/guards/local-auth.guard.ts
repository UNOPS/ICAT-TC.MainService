import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';


@Injectable()
export class LocalAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const apiKeys = process.env.KEY;
    const request = context.switchToHttp().getRequest();
     const headerFieldValue = request.headers;

    return apiKeys.includes(request.headers['api-key']);
  }
}
