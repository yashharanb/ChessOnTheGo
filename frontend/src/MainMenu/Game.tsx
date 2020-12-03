import React from 'react';
import ChessBoard from 'chessboardjsx';
import { useWindowResize } from "beautiful-react-hooks";
const { useState } = React;


export function Game() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useWindowResize((event: React.SyntheticEvent) => {
    setWindowWidth(window.innerWidth);
  });

  let calcWidth=({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  });

// Display the chess board
  return(
    <div className="container">
      <div className="row">
        <div className="col">
          <ChessBoard position="start"/>
          {windowWidth}
        </div>
      </div>
    </div>
  );

}
