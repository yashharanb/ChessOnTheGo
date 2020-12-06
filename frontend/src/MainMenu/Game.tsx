import React from 'react';
import ChessBoard from 'chessboardjsx';
import { useWindowResize } from "beautiful-react-hooks";
import timer from '../images/timer.png';

const { useState } = React;
export function Game() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useWindowResize((event: React.SyntheticEvent) => {
    setWindowWidth(window.innerWidth);
  });




  let calcWidth=({screenWidth,screenHeight}:any)=>{
    if(document && document.getElementById('typehead')){
      // @ts-ignore
      return document.getElementById('typehead').clientWidth;
    }else{
      return 500;
    }

  }




// Display the chess board
  return(
    <div className="container" id="typehead" >
    <div className="row">
    <div className="col">
      <img src={timer} className="img-fluid" alt="timer" />
      21:00
    </div>
    </div>

      <div className="row" >
        <div className="col p-0"  >
          <ChessBoard position="start" calcWidth={calcWidth}/>
        </div>
      </div>

      <div className="row">
      <div className="col">
        <img src={timer} className="img-fluid" alt="timer" />
        11:21
      </div>
    </div>


    </div>
  );

}
