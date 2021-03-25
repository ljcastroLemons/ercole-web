import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import * as config from './modules/config'
import * as loading from './modules/loading'
import * as errors from './modules/errors'
import * as auth from './modules/auth'
import * as dashboard from './modules/dashboard/dashboard'
import * as hosts from './modules/hosts/hosts'
import * as hostnames from './modules/hostnames'
import * as hostDetails from './modules/hosts/hostDetails'
import * as alerts from './modules/alerts/alerts'
import * as licenses from './modules/licenses/licenses'
import * as licensesAgreement from './modules/licenses/licenses-agreement'
import * as licensesCompliance from './modules/licenses/licenses-compliance'
import * as clusters from './modules/hypervisors/clusters'
import * as technologies from './modules/technologies'
import * as databases from './modules/databases/databases'
import * as oracle from './modules/databases/oracle/oracle'
import * as oracleSegmentAdvisor from './modules/databases/oracle/oracle-segment-advisor'
import * as oraclePatchAdvisor from './modules/databases/oracle/oracle-patch-advisor'
import * as oracleAddm from './modules/databases/oracle/oracle-addm'
import * as mysql from './modules/databases/mysql/mysql'
import * as globalFilters from './modules/global-filters'
import * as localFilters from './modules/local-filters'
import * as engineeredSystems from './modules/engineered-systems/engineered-systems'
import * as agreementParts from './modules/agreement-parts'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    config,
    loading,
    errors,
    auth,
    dashboard,
    hosts,
    hostnames,
    hostDetails,
    alerts,
    licenses,
    licensesAgreement,
    licensesCompliance,
    clusters,
    technologies,
    databases,
    oracle,
    oracleSegmentAdvisor,
    oraclePatchAdvisor,
    oracleAddm,
    mysql,
    globalFilters,
    localFilters,
    engineeredSystems,
    agreementParts
  },
  plugins: [
    createPersistedState({
      key: 'persisted-data',
      paths: ['auth', 'alerts', 'technologies', 'hostnames', 'globalFilters']
    })
  ]
})
