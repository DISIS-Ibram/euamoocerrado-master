import React from 'react';
import Sidebar from '../components/Sidebar';
import PageInterna from './PageInterna';
import * as S3 from '../components/elements';
import RelatoList from 'components/form/RelatoList';

const Ui = S3.UI; 
/**
 * Home page component
 */
export default class Registros extends React.Component
{
    componentDidMount() {
    document.title = "SI3RC :: Registros";
  }
    render()
    {
        return(
            <PageInterna nome="Registros" icon='registros' icontipo='svg'>
                
                <div className='ui grid' >
                  <div className="row">
        
             
                    <div className='fourteen wide column'>
                          
                          <RelatoList titulo="pessoas" descricao="pessoas" myid="pessoas" key="pessoas" model="relatos" />
                    </div>
            

                  </div>
                </div>

            </PageInterna>
        );
    }
}
