import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.tmdbBaseUrl)) {
    const apiReq = req.clone({
      params: req.params.set('api_key', environment.tmdbApiKey),
    });
    return next(apiReq);
  }
  return next(req);
};
