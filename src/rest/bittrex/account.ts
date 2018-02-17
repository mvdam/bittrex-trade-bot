import { Observable } from 'rxjs/Rx'
import { IBittrexAccountBalance } from '../../interfaces/bittrex'
import { signedFetchBittrexObservable } from './markets'

export const fetchAccountBalances = (): Observable<IBittrexAccountBalance[]> =>
  signedFetchBittrexObservable('https://bittrex.com/api/v1.1/account/getbalances')
    .mergeMap((balances: IBittrexAccountBalance[]) => Observable.from(balances))
    .filter((balance: IBittrexAccountBalance) => balance.Available > 0)
    .toArray()
