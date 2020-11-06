import { takeEvery, select, put } from 'redux-saga/effects'
import Logger from 'react-native-file-log'
import SocketIO from 'socket.io-client'
import { Constants } from 'shock-common'

import * as Actions from '../actions'
import * as Selectors from '../selectors'
import { getStore } from '../store'

let socket: ReturnType<typeof SocketIO> | null = null

function* ping() {
  try {
    const {
      auth: { token, host },
      connection: { lastPing },
    } = Selectors.getStateRoot(yield select())

    const socketIsDead = socket && Date.now() - lastPing > 12000

    if (socketIsDead) {
      Logger.log('Socket is dead')
    }

    if ((!token && socket) || socketIsDead) {
      Logger.log(`Will kill ping socket`)
      socket!.off('*')
      socket!.close()
      socket = null

      // force next tick
      yield put({ type: Math.random().toString() })
    }

    if (token && !socket) {
      Logger.log(`Will try to connect ping socket`)
      socket = SocketIO(`http://${host}/shockping`, {
        query: {
          token,
        },
      })

      socket.on('shockping', () => {
        getStore().dispatch(Actions.ping(Date.now()))
      })

      socket.on(Constants.ErrorCode.NOT_AUTH, () => {
        getStore().dispatch(Actions.tokenDidInvalidate())
      })

      socket.on('$error', (e: string) => {
        Logger.log(`Error received by ping socket: ${e}`)
      })
    }
  } catch (err) {
    Logger.log('Error inside ping* ()')
    Logger.log(err.message)
  }
}

function* rootSaga() {
  yield takeEvery('*', ping)
}

export default rootSaga
