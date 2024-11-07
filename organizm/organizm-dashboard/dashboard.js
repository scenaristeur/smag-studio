import React from 'react'
import blessed from 'neo-blessed'
import { createBlessedRenderer } from 'react-blessed'

const render = createBlessedRenderer(blessed)

// Rendering a simple centered box
const App = () => {
  const [count, setCount] = React.useState(0)
  const timer = React.useRef()

  React.useEffect(() => {
    timer.current = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => {
      clearInterval(timer.current)
    }
  }, [count])
  const dateTime = new Date().toLocaleString('fr-FR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
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
      {`Date: ${dateTime}

      Count: ${count}`}
    </box>
  )
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed hello world',
})

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

// Rendering the React app using our screen
const component = render(<App />, screen)
