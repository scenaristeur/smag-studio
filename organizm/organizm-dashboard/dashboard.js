import React, { Component } from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'

// Rendering a simple centered box
class App extends Component {
  render() {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
      const interval = setInterval(() => {
        setCount(count => count + 1)
      }, 1000)
      return () => clearInterval(interval)
    }, [])

    const dateTime = new Date().toLocaleString('fr-FR', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return (
      <box
        top="center"
        left="center"
        width="50%"
        height="50%"
        border={{ type: 'line' }}
        style={{ border: { fg: 'blue' } }}
      >
        {`Date : ${dateTime}
        Counter is ${count}`}
      </box>
    )
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Organizm Dashboard',
})

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

screen.key(['f1'], function (ch, key) {
  return screen.fullscreen()
})

screen.key(['c'], function (ch, key) {
  console.log('c pressed')
  return screen.render()
})
screen.key(['u'], function (ch, key) {
  console.log('u pressed')
  return screen.render()
})
screen.key(['r'], function (ch, key) {
  console.log('r pressed')
  return screen.render()
})
screen.key(['d'], function (ch, key) {
  console.log('d pressed')
  return screen.render()
})

// Rendering the React app using our screen
const component = render(<App />, screen)
