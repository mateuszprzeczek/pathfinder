import React, { useEffect, useState } from 'react';
import Node from '../Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../Algorithms/dijkstra';

import './Pathfinder.css';


export default function PathfindingVisualizer() {

  const [initialNodeRow, setInitialNodeRow] = useState(10);
  const [initialNodeCol, setInitialNodeCol] = useState(15);
  const [endNodeRow, setEndNodeRow] = useState(10);
  const [endNodeCol, setEndNodeCol] = useState(35);
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [changeInitialNode, setchangeInitialNode] = useState(false);
  const [changeEndNode, setChangeEndNode] = useState(false);
  const [prevNode, setPrevNode] = useState({ row: 0, col: 0 })


  useEffect(() => {
    setGrid(getInitialGrid)

  }, [])

  const onMouseDownHandler = (row, col) => {
    console.log(grid)
    if (row === initialNodeRow && col === initialNodeCol) {
      console.log('initialrowmousedown', row, '  mousedown initialcol', col);

      setPrevNode({ row: row, col: col });
      setchangeInitialNode(true);
      setMouseIsPressed(true);
    } else if (row === endNodeRow && col === endNodeCol) {
      setPrevNode({ row: row, col: col });
      setChangeEndNode(true);
      setMouseIsPressed(true);
    } else {
      console.log('row', row, '   col', col);
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
      setMouseIsPressed(true);
    }
  }

  const onMouseEnterHandler = (row, col) => {
    if (!mouseIsPressed) {
      if (changeInitialNode) {
        setchangeInitialNode(!changeInitialNode)
      }
      else if (changeEndNode) {
        setChangeEndNode(!changeEndNode)
      }
      return;
    }
    if (changeInitialNode) {
      grid[prevNode.row][prevNode.col].isStart = false;
      grid[row][col].isStart = true;
      console.log('initialrow mouse enter', row, '   initialcol', col);
      const newGrid = changeInitialNodeNode(grid, row, col);
      setGrid(newGrid)
      setPrevNode({ row: row, col: col });
    } else if (changeEndNode) {
      grid[prevNode.row][prevNode.col].isFinish = false;
      grid[row][col].isFinish = true;
      console.log('initialrow mouse enter', row, '   initialcol', col);
      const newGrid = changeEndNodeHandler(grid, row, col);
      setGrid(newGrid)
      setPrevNode({ row: row, col: col });
    } else {
      console.log('else row', row, '  else col', col);
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);

    }
  }

  const onMouseUpHandler = () => {
    setMouseIsPressed(false);
    if (changeInitialNode) {
      grid[initialNodeRow][initialNodeCol].isStart = true;
      setchangeInitialNode(false);
    }
    if (changeEndNode) {
      grid[endNodeRow][endNodeCol].isFinish = true;
      setChangeEndNode(false);
    }
  }

  const changeInitialNodeNode = (grid, row, col) => {
    setInitialNodeRow(row);
    setInitialNodeCol(col);
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isStart: true,
      isDragging: true
    };

    newGrid[row][col] = newNode;
    return newGrid;
  };

  const changeEndNodeHandler = (grid, row, col) => {
    setEndNodeRow(row);
    setEndNodeCol(col);
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isFinish: true,
      isDragging: true
    };

    newGrid[row][col] = newNode;
    return newGrid;
  };

  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === initialNodeRow && col === initialNodeCol,
      isFinish: row === endNodeRow && col === endNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        console.log('node distance from animateDijkstra  ', node.distance)
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  const visualizeDijkstra = () => {
    const startNode = grid[initialNodeRow][initialNodeCol];
    const finishNode = grid[endNodeRow][endNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    console.log('visitedNodesInOrder from visualizeDijkstra  ', visitedNodesInOrder)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log('nodesInShortestPathOrder   ', nodesInShortestPathOrder);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }



  return (
    <>
      <button onClick={() => visualizeDijkstra()}>
        Find Shortest Path
        </button>
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => onMouseDownHandler(row, col)}
                    onMouseEnter={(row, col) =>
                      onMouseEnterHandler(row, col)
                    }
                    onMouseUp={() => onMouseUpHandler()}
                    row={row}></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}






