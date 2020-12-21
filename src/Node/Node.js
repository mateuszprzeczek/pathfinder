import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
  render() {

    const dragStart = e => {
      const target = e.target;
      e.dataTransfer.setData('node_id', target.id);

      setTimeout(() => {
        target.style.display = 'none';
      }, 0)

    }

    const dragOver = e => {
      e.stopPropagation();
    }
    const {
      col,
      isFinish,
      isStart,
      isWall,
      draggable,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
        ? 'node-start'
        : isWall
          ? 'node-wall'
          : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        draggable={draggable}
        onDragStart={dragStart}
        onDragOver={dragOver}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}>{this.props.children}</div>
    );
  }
}
