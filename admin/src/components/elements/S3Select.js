import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'

const options = [
  { text: 'teste 1', value: 'English' },
  { text: 'teste 2', value: 'French' },
  { text: 'teste 3', value: 'Spanish' },
  { text: 'teste 4', value: 'German' },
  { text: 'teste 5', value: 'Chinese' },
]

class S3Select extends Component {
  state = { options }

  handleAddition = (e, { value }) => {
    this.setState({
      options: [{ text: value, value }, ...this.state.options],
    })
  }

  handleChange = (e, { value }) => this.setState({ currentValue: value })

  render() {
    const { currentValue } = this.state

    return (
      <Dropdown
        options={this.state.options}
        placeholder={this.props.placeholder}
        search
        selection
        fluid
        allowAdditions
        additionLabel="Adicionar:"
        value={currentValue}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    )
  }
}

export { S3Select as Select }