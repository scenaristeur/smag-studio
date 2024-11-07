import React, { Component } from 'react'
import blessed from 'neo-blessed'
import { createBlessedRenderer } from 'react-blessed'

const render = createBlessedRenderer(blessed)
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
        border: {
          type: 'line',
        },
        style: {
          border: {
            fg: 'blue',
          },
        },
      },
      magentaBackground: {
        style: {
          bg: 'magenta',
        },
      },
    }
    const backgroundForSecondBox = this.props.backgroundForSecondBox
    let items = []
    for (let i = 0; i < 100; i++) {
      items.push(`Item ${i}`)
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

        <box class={[stylesheet.bordered, stylesheet.magentaBackground]}>
          First box.
        </box>
        <box
          class={[
            stylesheet.bordered,
            backgroundForSecondBox && stylesheet.magentaBackground,
          ]}
        >
          Second box.
          <list
            // https://github.com/Yomguithereal/react-blessed/issues/62
            label="List"
            mouse={true}
            keys={true}
            class={{
              border: { type: 'line' },
              style: { border: { fg: 'blue' } },
            }}
            width="50%"
            height="50%"
            left="25%"
            top="25%"
            style={{
              item: { fg: 'black' },
              selected: { fg: 'white', bg: 'black' },
            }}
            items={items}
            onSelect={item => console.error('selected', item.content)}
            // onSelect={() => this.addItem('tr')}
          />
        </box>
      </box>
    )
  }
}

class ProgressBar extends Component {
  constructor(props) {
    super(props)

    this.state = { progress: 0, color: 'blue' }

    const interval = setInterval(() => {
      if (this.state.progress >= 100) return clearInterval(interval)

      this.setState({ progress: this.state.progress + 1 })
    }, 50)
  }

  render() {
    const { progress } = this.state,
      label = `Progress - ${progress}%`
    return (
      <progressbar
        orientation="horizontal"
        filled={progress}
        top="80%"
        left="center"
        height="10%"
        width="40%"
        label={label}
        onComplete={() => this.setState({ color: 'green' })}
        border={{ type: 'line' }}
        style={{ border: { fg: 'red' }, bar: { bg: this.state.color } }}
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
        autoFocus
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
