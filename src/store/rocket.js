import _ from 'lodash'
const state = () => {
    return {employees: null}
  };
  
  const mutations = {
    setEmployees(state, employees) {
        state.employees = employees;
      }
  };
  
  const actions = {
    async getEmployees ({ commit }) {
        try{
            const employees = await this.$http.$get("https://cdn.contentful.com/spaces/"+this.$config.spacesId+"/entries?access_token="+this.$config.contentfulAccessToken+"&content_type=team")
            const itemsFields = ['fields.name', 'fields.position', 'fields.profilePic.sys.id','sys.id']
            const itemsFilteredEmployees = _.map(employees.items, e => _.pick(e, itemsFields))
            const includesFields = ['fields.file.fileName', 'fields.file.url', 'sys.id']
            const includesFilteredEmployees = _.map(employees.includes.Asset, e => _.pick(e, includesFields))
            const mergedFilteredEmployees = _.values(_.merge(_.keyBy(includesFilteredEmployees,'sys.id'), _.keyBy(itemsFilteredEmployees,'fields.profilePic.sys.id' ) ))
            const formattedFinalFilteredEmployees = mergedFilteredEmployees.map(function(item){
                return {id:item.sys.id, 
                        name:item.fields.name, 
                        position:item.fields.position, 
                        imageId:item.fields.profilePic.sys.id,
                        imageName:item.fields.file.fileName, 
                        imageUrl:"http:"+ (item.fields.file.url)
                    }
            }
            )
            commit('setEmployees', formattedFinalFilteredEmployees)
        } catch(error) {
            console.error(error.message)
        }
        
  }}
  
  const getters = {
  };
  
  export default { state, mutations, actions, getters };
  