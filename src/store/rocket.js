import _ from 'lodash'
import { WebClient } from '@slack/web-api'

const state = () => {
    return {employeeHeadshots: null, 
      employeesMissingFromSite: null
    }
  };
  
  const mutations = {
    setEmployeeHeadshots(state, employeeHeadshots) {
        state.employeeHeadshots = employeeHeadshots;
      },
    setEmployeesMissingFromSite(state, payload) {
        const uniqueEmployees = _.differenceBy(payload, state.employeeHeadshots, 'name')
        state.employeesMissingFromSite = uniqueEmployees;
      }
  };
  
  const actions = {
    async getContentfulEmployees ({ commit }) {
        try{
            const employees = await this.$http.$get(this.$config.contentfulApiUrl)
            const itemsFields = ['fields.name', 'fields.position', 'fields.profilePic.sys.id','sys.id']
            const itemsFilteredEmployees = _.map(employees.items, e => _.pick(e, itemsFields))
            const includesFields = ['fields.file.fileName', 'fields.file.url', 'sys.id']
            const includesFilteredEmployees = _.map(employees.includes.Asset, e => _.pick(e, includesFields))
            const mergedFilteredEmployees = _.values(_.merge(_.keyBy(includesFilteredEmployees,'sys.id'), _.keyBy(itemsFilteredEmployees,'fields.profilePic.sys.id' ) ))
            const formattedFinalFilteredEmployees = _.map(mergedFilteredEmployees, item => {
            return {
                        id:item.sys.id, 
                        name:item.fields.name, 
                        position:item.fields.position, 
                        imageId:item.fields.profilePic.sys.id,
                        imageName:item.fields.file.fileName, 
                        imageUrl:item.fields.file.url
                    }
            }
            )
            commit('setEmployeeHeadshots', formattedFinalFilteredEmployees)
        } catch(error) {
            console.error(error.message)
        }
        
  }, 
    async getSlackEmployees ({ commit }) {
      try{
          const web = new WebClient(this.$config.slackBearerToken)
          const slackEmployees = await web.users.list({team_id:'T03TAQHEU'})
          console.log("not filtered by is_bot", slackEmployees)
          const notBotEmployees = _.filter(slackEmployees.members, e => !e.is_bot)
          console.log("filtered by is_bot",notBotEmployees)
          const formattedNotBotEmployees = _.map(notBotEmployees , item => {
            return {
                        name:item.profile.real_name, 
                    }
            }
            )
          commit('setEmployeesMissingFromSite', formattedNotBotEmployees)
      } catch (error) {
          console.error(error.message)
      }
    }

  }
  
  const getters = {
    missingFromSite (state) {
      return state.employeesMissingFromSite
    }
  };
  
  export default { state, mutations, actions, getters };
  