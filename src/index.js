// import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import mori from 'mori'
import './index.css'

// ----------------------------------------------------------------------------
// Immutable Etch-a-Sketch
// ----------------------------------------------------------------------------

const rootEl = document.getElementById('root')

const numRows = 10
const numCols = 10

var initialBoard = []
for (let i = 0; i < numRows; i++) {
  initialBoard[i] = []

  for (let j = 0; j < numCols; j++) {
    initialBoard[i][j] = false
  }
}

const initialState = {
  board: initialBoard
}

window.CURRENT_STATE = null
window.NEXT_STATE = mori.toClj(initialState)

let renderCount = 0

// window.HISTORY = mori.vec()

function render () {
  if (!mori.equals(window.CURRENT_STATE, window.NEXT_STATE)) {
    // next state is now our current state
    window.CURRENT_STATE = window.NEXT_STATE

    // window.HISTORY = mori.conj(window.HISTORY, window.CURRENT_STATE)

    ReactDOM.render(App({imdata: window.CURRENT_STATE}), rootEl)

    renderCount = renderCount + 1
    // console.log('Render #' + renderCount)
  }

  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)
