// libs
import * as Rx from 'rxjs/Rx'
import fetch from 'node-fetch'

export const fetchObservable = api =>
    Rx.Observable.create(observer =>
        fetch(api)
            .then(res => res.json())
            .then(json => {
                observer.next(json)
                observer.complete()
            })
            .catch(e => {
                observer.error(`ERROR while fetching "${api}"! Message: "${e.message}"`)
            })
    )
