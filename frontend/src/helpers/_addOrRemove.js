import {isArray, isObject, isEqual, findIndex} from 'lodash';
//LETOD
export default function(array,item){
    
    if( _.isArray(array) === false){
        array = [];
    }

    var equal = function(a,b){
        return a === b
    }

    if(_.isObject(item) || _.isArray(item)){
        equal = function (a, b) {
            return _.isEqual(a,b)
        }
    }

    var index = _.findIndex(array, elm=> equal(elm,item));
    
    //se nnao tenho na array, adiciono
    if (index === -1) {
        array.push(item);
    //se tenho na array, removo
    } else {

        array.splice(index,1);
    }

    return array;
}