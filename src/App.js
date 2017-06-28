import React, { Component } from 'react'
import mori from 'mori'

class MoriComponent extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !mori.equals(this.props.imdata, nextProps.imdata)
  }
}

function clickSquare (rowIdx, colIdx) {
  const currentBoard = mori.get(window.CURRENT_STATE, 'board')
  const newBoard = mori.updateIn(currentBoard, [rowIdx, colIdx], function (isActive) {
    return !isActive
  })
  const newState = mori.assoc(window.CURRENT_STATE, 'board', newBoard)
  window.NEXT_STATE = newState
}

function Square (rowIdx, colIdx, isOn) {
  let className = 'square '
  if (isOn) className += 'on'

  const clickFn = mori.partial(clickSquare, rowIdx, colIdx)
  const key = rowIdx + '-' + colIdx

  return (
    <div key={key} className={className} onClick={clickFn}></div>
  )
}

function App (props) {
  const board = mori.get(props.imdata, 'board')
  const numRows = mori.count(board)
  const firstRow = mori.get(board, 0)
  const numCols = mori.count(firstRow)

  let squareComponents = []
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      let square = mori.getIn(board, [rowIdx, colIdx])
      squareComponents.push(Square(rowIdx, colIdx, square))
    }
  }

  return (
    <div>
      <h1>Immutable Etch-a-Sketch</h1>
      <button>Reset Board</button>
      <div className="board">{squareComponents}</div>
    </div>
  )
}

export default App
