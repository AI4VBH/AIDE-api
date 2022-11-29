/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Axios, {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';
import { Observable } from 'rxjs';

export function makeObservableForTest<T>(
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
