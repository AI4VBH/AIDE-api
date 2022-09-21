import Axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { Observable } from 'rxjs';

export function createObservableResponse<T>(
  axios: (...args: any[]) => AxiosPromise<T>,
  ...args: any[]
) {
  return new Observable<AxiosResponse<T>>((subscriber) => {
    const config: AxiosRequestConfig = { ...(args[args.length - 1] || {}) };

    let cancelSource: CancelTokenSource;

    if (!config.cancelToken) {
      cancelSource = Axios.CancelToken.source();
      config.cancelToken = cancelSource.token;
    }

    axios(...args)
      .then((res) => {
        subscriber.next(res);
        subscriber.complete();
      })
      .catch((err) => {
        subscriber.error(err);
      });
    return () => {
      if (config.responseType === 'stream') {
        return;
      }

      if (cancelSource) {
        cancelSource.cancel();
      }
    };
  });
}
