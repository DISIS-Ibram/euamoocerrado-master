import React, { PropTypes } from 'react'
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import { Menu, Icon, Dropdown } from 'semantic-ui-react'


class S3MenuItem extends Menu.Item{   
    render(){
      return(
        <Menu.Item  as={Link} {...this.props}></Menu.Item>
      )
    }
}

export { S3MenuItem as MenuItem }