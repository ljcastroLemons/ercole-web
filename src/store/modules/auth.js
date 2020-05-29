import axiosAuth from '../../axios/axios-auth.js'
import router from '../../router/index.js'
import * as helpers from '../../helpers/helpers.js'
import moment from 'moment'

export const state = () => {
  return {
    token: null
  }
}

export const getters = {
  isAuth: state => state.token !== null,
  getToken: state => state.token
}

export const mutations = {
  AUTH_USER: (state, token) => {
    state.token = token
  },
  CLEAR_AUTH: state => {
    state.token = null
  }
}

export const actions = {
  setLogoutTimer({ dispatch }, expirationTime) {
    setTimeout(() => {
      dispatch('logout')
    }, expirationTime * 1000)
  },
  login({ commit, dispatch }, auth) {
    return axiosAuth
      .post('/login', {
        username: auth.username,
        password: auth.password
      })
      .then(res => {
        const token = res.data
        const decodeToken = JSON.parse(atob(token.split('.')[1]))
        const username = decodeToken.aud[0]
        const expiration = decodeToken.exp

        const payload = {
          token: token,
          username: username,
          expiration: expiration
        }

        commit('AUTH_USER', payload.token)
        helpers.setLocalStorageAuth(payload)
        dispatch('setLogoutTimer', payload.expiration)
        dispatch('setErrMsg', null)
        router.replace('/dashboard')
      })
      .then(() => {
        dispatch('getDashboardData')
      })
      .catch(err => {
        const errorMessage = err.response.data.ErrorDescription
        dispatch('setErrMsg', errorMessage)
        dispatch('offLoading')
      })
  },
  tryAutoLogin({ commit, dispatch }) {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch('logout')
    }

    const tokenExp = localStorage.getItem('expiration')
    const expiration = moment(tokenExp).format()
    const now = moment(new Date()).format()

    if (now >= expiration) {
      dispatch('logout')
    }
    commit('AUTH_USER', token)
  },
  logout({ commit, dispatch }) {
    dispatch('offLoading')
    commit('CLEAR_AUTH')
    helpers.clearLocalStorageAuth()
    router.replace('/login')
  }
}
