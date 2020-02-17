import Http from 'axios'
import { DEFAULT_PORT } from './cache'

/**
 * @typedef {object} PingResponse
 * @prop {boolean} success
 * @prop {string} sessionId
 */

/**
 * Checks that a given node ip is up and that it corresponds to a ShockAPI
 * server.
 * @param {string} urlOrIp
 * @returns {Promise<PingResponse>}
 */
export const pingURL = async urlOrIp => {
  let url = urlOrIp
  if (url.indexOf(':') === -1) {
    url += ':' + DEFAULT_PORT
  }
  try {
    /**
     * @type {ReturnType<typeof fetch>}
     */
    console.log('URL:', `http://${url}/healthz`)
    Http.defaults.baseURL = `http://${url}`
    console.log('Base URL:', Http.defaults.baseURL)
    const { data: body, headers } = await Http.get(`http://${url}/healthz`)

    console.log('Fetch Body:', body)
    return {
      success: typeof body.APIStatus === 'object',
      sessionId: headers['x-session-id'],
    }
  } catch (e) {
    console.warn(`Connection.pingURL: ${e.message}`)
    if (e.response && e.response.headers) {
      return { success: false, sessionId: e.response.headers['x-session-id'] }
    }

    return { success: false, sessionId: '' }
  }
}
