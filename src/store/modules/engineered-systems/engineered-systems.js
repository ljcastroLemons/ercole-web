import _ from 'lodash'
import axios from 'axios'
import { axiosRequest } from '@/services/services.js'

const url = 'exadata'

export const state = () => ({
  engSys: {},
})

export const getters = {
  getEngSys: (state) => {
    let exadata = []

    _.map(state.engSys, (val) => {
      let totalRam = Math.floor(Math.random() * 100)
      let freeRam = Math.floor(Math.random() * totalRam)
      let totalVcpu = Math.floor(Math.random() * 100)
      let freeVcpu = Math.floor(Math.random() * totalVcpu)

      exadata.push({
        _id: val.rackID,
        hostname: val.hostname,
        kvmhost: getHostype(val, 'KVM_HOST'),
        ibswitch: getHostype(val, 'IBSWITCH'),
        storagecell: getHostype(val, 'STORAGE_CELL'),
        dom0: getHostype(val, 'DOM0'),
        baremetal: getHostype(val, 'BARE_METAL'),
        progress: {
          totalRam: totalRam,
          freeRam: freeRam,
          totalVcpu: totalVcpu,
          freeVcpu: freeVcpu,
        },
      })
    })

    return exadata
  },
}

export const mutations = {
  SET_ENGINEERED_SYSTEMS: (state, payload) => {
    state.engSys = payload.engSys
  },
}

export const actions = {
  async getEngineeredSystems({ commit, getters, dispatch }, olderThan = null) {
    dispatch('onLoadingTable')

    const endPoints = [url]

    await Promise.all(
      endPoints.map((endpoint) =>
        axiosRequest('baseApi', {
          merthod: 'get',
          url: endpoint,
          params: {
            'older-than': getters.getActiveFilters.date || olderThan,
            environment: getters.getActiveFilters.environment,
            location: getters.getActiveFilters.location,
          },
        })
      )
    ).then(
      axios.spread((...allData) => {
        commit('SET_ENGINEERED_SYSTEMS', {
          engSys: allData[0].data,
        })
        dispatch('offLoadingTable')
      })
    )
  },
}

const getHostype = (val, type) => {
  return _.filter(val.components, (t) => {
    return t.hostType === type
  })
}
