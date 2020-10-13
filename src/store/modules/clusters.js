import axiosDefault from '../../axios/axios-default.js'
import _ from 'lodash'

export const state = () => ({
  clusters: [],
  currentCluster: {},
  currentClusterVms: [],
  hasFilters: false,
  filters: []
})

export const getters = {
  getHypervisors: state => {
    return state.clusters
  },
  getCurrentCluster: state => {
    return state.currentCluster
  },
  getCurrentClusterVms: state => {
    if (state.hasFilters) {
      return state.currentClusterVms.filterByKeys(state.filters)
    } else {
      return state.currentClusterVms
    }
  },
  getErcoleClusterCount: state => {
    const ercoleClusterCount = {
      withErcole: 0,
      withoutErcole: 0
    }
    _.map(state.clusters, item => {
      const { vmsErcoleAgentCount } = item
      if (vmsErcoleAgentCount > 0) {
        ercoleClusterCount.withErcole += 1
      } else {
        ercoleClusterCount.withoutErcole += 1
      }
    })
    return ercoleClusterCount
  },
  getClusterChartData: state => {
    const allVms = state.currentCluster.virtualizationNodesStats
    const withErcole = []
    const withoutErcole = []
    const finalData = []

    _.map(allVms, item => {
      withErcole.push([
        item.virtualizationNode,
        item.totalVMsWithErcoleAgentCount
      ])
      withoutErcole.push([
        item.virtualizationNode,
        item.totalVMsWithoutErcoleAgentCount
      ])
    })

    finalData.push(
      {
        name: 'With Ercole',
        data: withErcole
      },
      {
        name: 'Without Ercole',
        data: withoutErcole
      }
    )

    return finalData
  },
  getVirtualizationChartData: (state, getters) => {
    const data = _.groupBy(state.clusters, 'type')
    const finalData = []
    const colors = []

    _.map(data, (value, key) => {
      _.find(getters.getAllTechnologies, prod => {
        if (prod.product === key) {
          finalData.push({
            name: prod.prettyName,
            data: [['', value.length]]
          })
          colors.push(prod.color)
        }
      })
    })

    return { finalData, colors }
  },
  clusterFiltersAutocomplete: state => toFilter => {
    let filteredValues = []

    _.map(state.currentClusterVms, val => {
      filteredValues.push(val[toFilter])
    })

    filteredValues = _.uniqBy(filteredValues)
    filteredValues = _.orderBy(filteredValues, [], ['asc'])

    return filteredValues
  }
}

export const mutations = {
  SET_CLUSTERS: (state, payload) => {
    state.clusters = payload
  },
  SET_CURRENT_CLUSTER: (state, payload) => {
    state.currentCluster = payload
    state.currentClusterVms = payload.vms
  },
  SET_CLUSTER_FILTERS: (state, payload) => {
    state.hasFilters = payload.status
    state.filters = payload.filters
  }
}

export const actions = {
  async getClusters({ commit }) {
    const loc = JSON.parse(localStorage.getItem('globalFilters')).location
    const env = JSON.parse(localStorage.getItem('globalFilters')).environment
    const date = JSON.parse(localStorage.getItem('globalFilters')).date

    const clustersData = await axiosDefault.get('/hosts/clusters', {
      params: {
        'older-than': date,
        environment: env,
        location: loc
      }
    })
    const response = await clustersData.data
    commit('SET_CLUSTERS', response)
  },
  async getClusterByName({ commit }, clustername) {
    const date = JSON.parse(localStorage.getItem('globalFilters')).date

    const clusterByName = await axiosDefault.get(
      `/hosts/clusters/${clustername}`,
      {
        params: {
          'older-than': date
        }
      }
    )

    const response = await clusterByName.data
    commit('SET_CURRENT_CLUSTER', response)
  }
}
