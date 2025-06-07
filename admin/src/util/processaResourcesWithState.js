// import {store} from 'configStore.js'
import {store} from '../configStore.js'

//Resiyrce que comeca com $ serao substituidos
export default function(resources) {
  
    var state = store.getState();

    var resourcesFinal = {...resources};
    // 
    _.each(resourcesFinal, (v, k) => {
        if (_.isString(v)) {

            if (v.indexOf('$') === 0) {
                var path = v.substring(1)
                if (_.has(state, path)) {
                    resourcesFinal[k] = _.get(state, path)
                }
            }
        }


    // return v
    })
    return resourcesFinal;
}