import React from 'react';
import PageInterna from './PageInterna';

/**
 * Not found page component
 */
export default class NotFound extends React.Component
{
    /**
     * Render
     *
     * @returns {XML}
     */
    render()
    {
        return(
            <PageInterna nome="Opppssss!" icontipo='fa' icon='frown o'>
                <div className="page-relatos">
                   <h5>Página não encontrada</h5>
                </div>
            </PageInterna>
        );
    }
}
