import React from 'react';
import ChessBoard from 'chessboardjsx';
import { useWindowResize } from "beautiful-react-hooks";
const { useState } = React;

export function Game() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useWindowResize((event: React.SyntheticEvent) => {
    setWindowWidth(window.innerWidth);
  });

  return(
    <div className="container">
      <ChessBoard position="start"/>
      {windowWidth}
    </div>
  );

}
