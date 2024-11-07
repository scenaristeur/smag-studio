import React, { Component } from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import { hexToRGB } from 'neo-blessed/lib/colors'

class App extends Component {
  render() {
    return (
      <box
        label="Organizm dashboard"
        border={{ type: 'line' }}
        style={{ border: { fg: 'cyan' } }}
      >
        <InnerBox position="left" />
        <InnerBox position="right" />
        <ProgressBar />
        {/* Random text here... */}
        <Form />
      </box>
    )
  }
}

class InnerBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hey: true,
    }

    setInterval(() => {
      this.setState({ hey: !this.state.hey })
    }, 1000)
  }

  render() {
    const position = this.props.position

    const left = position === 'left' ? '2%' : '53%'

    const stylesheet = {
      bordered: {
        height: '50%',
        border: {
          type: 'line',
        },
        style: {
          border: {
            fg: 'blue',
          },
        },
      },
    }

    return (
      <box
        label={this.state.hey ? 'First step' : 'Second step'}
        left={left}
        width="45%"
        height="50%"
        top="20%"
        border={{ type: 'line' }}
        style={{ border: { fg: 'green' } }}
      >
        {this.state.hey ? 'Hey...' : 'Ho...'}

        <box class={stylesheet.bordered}>First box.</box>
        {/* <box class={stylesheet.bordered}>Second box.</box> */}
      </box>
    )
  }
}

class ProgressBar extends Component {
  constructor(props) {
    super(props)

    this.state = { completion: 0 }

    const interval = setInterval(() => {
      if (this.state.completion >= 100) return clearInterval(interval)

      this.setState({ completion: this.state.completion + 10 })
    }, 1000)
  }

  render() {
    return (
      <progressbar
        orientation="horizontal"
        filled={this.state.completion}
        top="80%"
        left="center"
        height="15%"
        width="80%"
        label="progress"
        border={{ type: 'line' }}
        style={{ border: { fg: 'red' }, bar: { bg: 'red' } }}
      />
    )
  }
}

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
    }

    this.submit = data => this.setState(state => ({ name: data }))
    this.cancel = _ => console.log('Form canceled')
  }

  render() {
    return (
      <form
        keys
        vi
        focused
        label="Enter your name:"
        onSubmit={this.submit}
        onReset={this.cancel}
        left="2%"
        top="0"
        width="45%"
        height="20%"
        border={{ type: 'line' }}
        style={{ bg: 'cyan', border: { fg: 'blue' } }}
      >
        <box width={8} height={3}>
          -Name:{' '}
        </box>
        <textbox
          onSubmit={this.submit}
          left={6}
          height={3}
          keys
          mouse
          inputOnFocus
        />
        <box top={3} height={3}>
          {`Result: ${this.state.name}`}
        </box>
      </form>
    )
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed demo app',
})

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

const component = render(<App />, screen)
