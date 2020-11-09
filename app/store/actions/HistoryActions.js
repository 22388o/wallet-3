import Logger from 'react-native-file-log'

import * as Wallet from '../../services/wallet'
import * as Cache from '../../services/cache'

export const ACTIONS = {
  LOAD_CHANNELS: 'channels/load',
  LOAD_PENDING_CHANNELS: 'channels/pending/load',
  LOAD_INVOICES: 'invoices/load',
  LOAD_MORE_INVOICES: 'invoices/loadMore',
  LOAD_PEERS: 'peers/load',
  LOAD_PAYMENTS: 'payments/load',
  LOAD_MORE_PAYMENTS: 'payments/loadMore',
  LOAD_TRANSACTIONS: 'transactions/load',
  LOAD_MORE_TRANSACTIONS: 'transactions/loadMore',
  LOAD_NEW_RECENT_TRANSACTION: 'transactions/new',
  LOAD_RECENT_TRANSACTIONS: 'recentTransactions/load',
  LOAD_RECENT_PAYMENTS: 'recentPayments/load',
  LOAD_RECENT_INVOICES: 'recentInvoices/load',
  LOAD_NEW_RECENT_INVOICE: 'recentInvoices/new',
  UNIFY_TRANSACTIONS: 'unifiedTransactions/unify',
}
/**
 * Fetches the Node's info
 * @returns {import('redux-thunk').ThunkAction<Promise<Wallet.Channel[]>, {}, {}, import('redux').AnyAction>}
 */
export const fetchChannels = () => async dispatch => {
  try {
    const data = await Wallet.listChannels()
    dispatch({
      type: ACTIONS.LOAD_CHANNELS,
      data,
    })

    return data
  } catch (e) {
    Logger.log(`Error inside fetchChannels thunk: ${e.message}`)
    return []
  }
}
/**
 * Fetches the Node's info
 * @returns {import('redux-thunk').ThunkAction<Promise<Wallet.PendingChannel[]>, {}, {}, import('redux').AnyAction>}
 */
export const fetchPendingChannels = () => async dispatch => {
  try {
    const data = await Wallet.pendingChannels()
    dispatch({
      type: ACTIONS.LOAD_PENDING_CHANNELS,
      data,
    })

    return data
  } catch (e) {
    Logger.log(`Error inside fetchPendingChannels thunk: ${e.message}`)
    return []
  }
}

/**
 * Fetches the Node's info
 * @returns {import('redux-thunk').ThunkAction<Promise<Wallet.PaginatedListInvoicesResponse>, {}, {}, import('redux').AnyAction>}
 */
export const fetchInvoices = ({
  page = 1,
  itemsPerPage = 10,
  reset = false,
}) => async dispatch => {
  try {
    const data = await Wallet.listInvoices({ page, itemsPerPage })

    if (reset) {
      dispatch({
        type: ACTIONS.LOAD_INVOICES,
        data,
      })
      return data
    }

    dispatch({
      type: ACTIONS.LOAD_MORE_INVOICES,
      data,
    })

    return data
  } catch (e) {
    Logger.log(`Error inside fetchInvoices thunk: ${e.message}`)
    return {
      content: [],
      page: 1,
      totalPages: 1,
    }
  }
}

/**
 * Fetches the Node's info
 * @returns {import('redux-thunk').ThunkAction<Promise<Wallet.Peer[]>, {}, {}, import('redux').AnyAction>}
 */
export const fetchPeers = () => async dispatch => {
  try {
    const data = await Wallet.listPeers()

    dispatch({
      type: ACTIONS.LOAD_PEERS,
      data,
    })

    return data
  } catch (e) {
    Logger.log(`Error inside fetchPeers thunk: ${e.message}`)
    return []
  }
}

/**
 * Fetches the Node's info
 * @returns {import('redux-thunk').ThunkAction<Promise<Wallet.PaginatedListPaymentsResponse>, {}, {}, import('redux').AnyAction>}
 */
export const fetchPayments = ({
  page = 1,
  itemsPerPage = 10,
  reset = false,
}) => async dispatch => {
  try {
    const data = await Wallet.listPayments({
      page,
      itemsPerPage,
      paginate: true,
      include_incomplete: false,
    })

    if (reset) {
      dispatch({
        type: ACTIONS.LOAD_PAYMENTS,
        data,
      })
      return data
    }

    dispatch({
      type: ACTIONS.LOAD_MORE_PAYMENTS,
      data,
    })

    return data
  } catch (e) {
    return {
      content: [],
      page: 1,
      totalItems: 0,
      totalPages: 1,
    }
  }
}

/**
 * Fetches the Node's info
 * @returns {import('redux-thunk').ThunkAction<Promise<Wallet.PaginatedTransactionsResponse>, {}, {}, import('redux').AnyAction>}
 */
export const fetchTransactions = ({
  page = 1,
  itemsPerPage = 500,
  reset = false,
}) => async dispatch => {
  try {
    const data = await Wallet.getTransactions({
      page,
      itemsPerPage,
      paginate: true,
    })
    const revData = {
      ...data,
      content: data.content.reverse(),
    }
    if (reset) {
      dispatch({
        type: ACTIONS.LOAD_TRANSACTIONS,
        revData,
      })
      return revData
    }

    dispatch({
      type: ACTIONS.LOAD_MORE_TRANSACTIONS,
      revData,
    })

    return revData
  } catch (e) {
    return {
      content: [],
      page: 1,
      totalItems: 0,
      totalPages: 1,
    }
  }
}

/**
 * Unifies and sorts all of the currently loaded transactions, payments and invoices
 * @returns {import('redux-thunk').ThunkAction<void, {}, {}, import('redux').AnyAction>}
 */
export const unifyTransactions = () => dispatch => {
  dispatch({
    type: ACTIONS.UNIFY_TRANSACTIONS,
  })
}

/**
 * Fetches the Node's info
 * @returns {import('redux-thunk').ThunkAction<Promise<[
 *   Wallet.PaginatedListInvoicesResponse,
 *   Wallet.Peer[],
 *   Wallet.Channel[],
 *   Wallet.PaginatedListPaymentsResponse,
 *   Wallet.PaginatedTransactionsResponse
 * ]>, {}, {}, import('redux').AnyAction>}
 */
export const fetchHistory = () => async dispatch => {
  try {
    const history = await Promise.all([
      dispatch(fetchInvoices({ reset: true })),
      dispatch(fetchPeers()),
      dispatch(fetchChannels()),
      dispatch(fetchPayments({ reset: true })),
      dispatch(fetchTransactions({ reset: true })),
    ])

    dispatch(unifyTransactions())

    return history
  } catch (e) {
    Logger.log(`Error inside fetchHistory thunk: ${e.message}`)

    return [
      { content: [], totalPages: 1, page: 1 },
      [],
      [],
      { content: [], page: 1, totalItems: 1, totalPages: 1 },
      { content: [], page: 1, totalItems: 1, totalPages: 1 },
    ]
  }
}

/**
 * Fetches the recent transactions
 * @returns {import('redux-thunk').ThunkAction<Promise<void>, {}, {}, import('redux').AnyAction>}
 */
export const fetchRecentInvoices = () => async dispatch => {
  try {
    const invoiceResponse = await Wallet.listInvoices({
      itemsPerPage: 100,
      page: 1,
    })

    dispatch({
      type: ACTIONS.LOAD_RECENT_INVOICES,
      data: invoiceResponse.content,
    })

    dispatch(unifyTransactions())
  } catch (e) {
    Logger.log(`Error inside fetchRecentInvoices -> ${e.message}`)
  }
}

/**
 * Fetches the latest payments
 * @returns {import('redux-thunk').ThunkAction<Promise<void>, {}, {}, import('redux').AnyAction>}
 */
export const fetchRecentPayments = () => async dispatch => {
  try {
    try {
      await Cache.getToken()
      // eslint-disable-next-line no-empty
    } catch (_) {
      return
    }

    const payments = await Wallet.listPayments({
      include_incomplete: false,
      itemsPerPage: 100,
      page: 1,
      paginate: true,
    })

    const decodedRequests = await Promise.all(
      payments.content.map(payment =>
        Wallet.decodeInvoice({ payReq: payment.payment_request }).catch(e => {
          Logger.log(`HistoryActions.fetchRecentPayments() -> ${e.message}`)
        }),
      ),
    )

    const recentPayments = payments.content.map((payment, key) => ({
      ...payment,
      // @ts-expect-error
      decodedPayment: decodedRequests[key]?.decodedRequest ?? null,
    }))

    dispatch({
      type: ACTIONS.LOAD_RECENT_PAYMENTS,
      data: recentPayments,
    })

    dispatch(unifyTransactions())
  } catch (err) {
    Logger.log(`Error inside fetchRecentPayments() -> ${err.message}`)
  }
}

/**
 * Fetches the recent transactions
 * @returns {import('redux-thunk').ThunkAction<Promise<void>, {}, {}, import('redux').AnyAction>}
 */
export const fetchRecentTransactions = () => async dispatch => {
  try {
    const invoiceResponse = await Wallet.getTransactions({
      itemsPerPage: 500,
      page: 1,
      paginate: true,
    })

    dispatch({
      type: ACTIONS.LOAD_RECENT_TRANSACTIONS,
      data: invoiceResponse,
    })

    dispatch(unifyTransactions())
  } catch (e) {
    Logger.log(`Error inside fetchRecentTransactions thunk: ${e.message}`)
  }
}
