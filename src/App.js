import React, { Component } from 'react'
import mori from 'mori'

// -----------------------------------------------------------------------------
// Mori Component
// -----------------------------------------------------------------------------

// a MoriComponent receives a JavaScript Object with one key: imdata
// imdata should be a mori structure that supports mori.equals() comparisons
class MoriComponent extends Component {
  // only update the component if the mori data structure is not equal
  shouldComponentUpdate (nextProps, _nextState) {
    return !mori.equals(this.props.imdata, nextProps.imdata)
  }
}

// -----------------------------------------------------------------------------
// Square
// -----------------------------------------------------------------------------

function clickSquare (rowIdx, colIdx) {
  const currentBoard = mori.get(window.CURRENT_STATE, 'board')
  const newBoard = mori.updateIn(currentBoard, [rowIdx, colIdx], function (isOn) {
    return !isOn
  })
  const newState = mori.assoc(window.CURRENT_STATE, 'board', newBoard)
  window.NEXT_STATE = newState
}

class Square extends MoriComponent {
  render () {
    const isOn = mori.get(this.props.imdata, 'isOn')
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')
    const colIdx = mori.get(this.props.imdata, 'colIdx')

    let className = 'square '
    if (isOn) className += 'on'

    const clickFn = mori.partial(clickSquare, rowIdx, colIdx)
    const key = 'square-' + rowIdx + '-' + colIdx

    return (
      <div key={key} className={className} onClick={clickFn} />
    )
  }
}

// -----------------------------------------------------------------------------
// Board
// -----------------------------------------------------------------------------

class Row extends MoriComponent {
  render () {
    const rowVec = mori.get(this.props.imdata, 'rows')
    const numCols = mori.count(rowVec)
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')

    let squares = []
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      let isOn = mori.get(rowVec, colIdx)
      let squareData = mori.hashMap('rowIdx', rowIdx, 'colIdx', colIdx, 'isOn', isOn)
      let key = 'square-' + rowIdx + '-' + colIdx

      squares.push(<Square imdata={squareData} key={key} />)
    }

    return (
      <div className='row'>{squares}</div>
    )
  }
}

function clickResetBtn () {
  window.NEXT_STATE = mori.hashMap('board', window.EMPTY_BOARD)
}

function App (props) {
  const board = mori.get(props.imdata, 'board')
  const numRows = mori.count(board)

  let rows = []
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let rowVec = mori.get(board, rowIdx)
    let rowData = mori.hashMap('rows', rowVec, 'rowIdx', rowIdx)
    let key = 'row-' + rowIdx

    rows.push(<Row imdata={rowData} key={key} />)
  }

  return (
    <div className='app-container'>
      <h1>Immutable Etch-a-Sketch</h1>
      <button onClick={clickResetBtn}>Reset Board</button>
      <div className='board'>{rows}</div>
    </div>
  )
}

export default App
