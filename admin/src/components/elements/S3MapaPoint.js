import _ from 'lodash'
import React, { PropTypes } from 'react'
import * as ui from 'semantic-ui-react'

const S3Input = (props) => (
    <ui.Form.Field>
      <label>First Name</label>
      <ui.Input placeholder='First Name' />
    </ui.Form.Field>
 )


export { S3Input as Input}

