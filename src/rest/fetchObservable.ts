// libs
import { Observable } from 'rxjs'
import fetch from 'node-fetch'

export interface IFetchConfig {
  api: string
  headers?: Record<string, string>
  method?: 'GET' | 'POST'
}

export const fetchObservable = (config: IFetchConfig): Observable<any> => {
  const fetchConfig = {
    headers: config.headers || [],
    method: config.method || 'GET'
  }

  return Observable.create(observer =>
    fetch(config.api, fetchConfig)
      .then(res => res.json())
      .then(json => {
        observer.next(json)
        observer.complete()
      })
      .catch(e => {
        observer.error(`ERROR while fetching "${config.api}"! Message: "${e.message}"`)
      })
  )
}
