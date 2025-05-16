import _ from 'lodash';

// import AutoForm from 'components/form/AutoForm'
import criaconsole from 'util/myconsole';

const _debug = false;
const myconsole = criaconsole(_debug, ' === relato.js | ', 'color:green;font-weight:bold');


// funcao que gera render
export function list(item) {
      myconsole.log('relato item list===  %o', item);
      return {
        text: 'Relato ' + item.id,
        value: item.id,
        children: <div>
          {'Relato ' + item.id} <small className='gray fs07 fw100'>
                   <br /> {_.truncate(item.caracterizacao_local, 50)}
                 </small></div>,
      };
}


// funcaao que renderiza a opcao
export class Item extends React.Component {


}
