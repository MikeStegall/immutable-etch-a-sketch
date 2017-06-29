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

function booleanNot (x) {
  return !x
}

function clickSquare (rowIdx, colIdx) {
  const currentState = window.CURRENT_STATE
  const newState = mori.updateIn(currentState, ['board', rowIdx, colIdx], booleanNot)
  window.NEXT_STATE = newState
}

class Square extends MoriComponent {
  render () {
    const isOn = mori.get(this.props.imdata, 'isOn')
    const rowIdx = mori.get(this.props.imdata, 'rowIdx')
    const colIdx = mori.get(this.props.imdata, 'colIdx')

    let className = 'square'
    if (isOn) className += ' on'

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

// attempt to set an invalid state
// this should be caught by the isValidState function in the render loop
function clickSetInvalidStateBtn () {
  window.NEXT_STATE = 'foo'
}

function clickInvertBoardBtn () {
  const currentBoard = mori.get(window.CURRENT_STATE, 'board')
  const emptyVector = mori.vector()
  const newBoardList = mori.map(function (row) {
    const invertedRowList = mori.map(booleanNot, row)
    return mori.into(emptyVector, invertedRowList)
  }, currentBoard)
  const newBoardVector = mori.into(emptyVector, newBoardList)

  window.NEXT_STATE = mori.assoc(window.CURRENT_STATE, 'board', newBoardVector)
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
      <button onClick={clickSetInvalidStateBtn}>Set Invalid State</button>
      <button onClick={clickInvertBoardBtn}>Invert Board</button>
      <div className='board'>{rows}</div>
    </div>
  )
}

export default App
