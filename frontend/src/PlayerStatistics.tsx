import React, {useEffect, useState} from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import banner from './images/playerStats.png';
import { useChessPlayerState,HistoricalGame, getPlayerStats} from "./ServerHooks";

export function PlayerStatistics() {
    const [gridApi, setGridApi] = useState(Object);
    const [gridColumnApi, setGridColumnApi] = useState(Object);

    function onGridReady(params: { api: any; columnApi: any; }) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    }

    const {gameState,thisUser,makeMove,queueForGame} = useChessPlayerState(console.log);
    const [stats,setStats]=useState<null|HistoricalGame[]>(null);
    // Display the user login screen
    useEffect(()=>{
      const func=async()=>{
        const playerStats=await getPlayerStats();
        setStats(playerStats);
      }
      func()
    },[])

    let opponent = "";
    let status = "";
    let timestamp = "";
    let duration;
    let elo;
    let durationTimeInSeconds;
    let durationTimeDateFormat;
    let array:Array<any>=[];
    let opponentElo;
    if(stats){
      for( let i = 0; i<stats.length; i++){
        if(thisUser?.username === stats[i].blackPlayer.username){
          opponent = stats[i].whitePlayer.username;
          if(stats[i].winner === "black"){
            status = "Won";
          }
          else if(stats[i].winner == "white"){
            status = "Lost";
          }
          else{
            status = "Draw";
          }
          timestamp = stats[i].startTime;
          durationTimeInSeconds = Date.parse(stats[i].endTime) - Date.parse(stats[i].startTime);
          durationTimeDateFormat = new Date(durationTimeInSeconds);
          duration = durationTimeDateFormat.getUTCMinutes() + ':' + durationTimeDateFormat.getUTCSeconds();
          elo = Math.round(stats[i].blackPlayerEloBefore);
          opponentElo = Math.round(stats[i].whitePlayerEloBefore);
        }else{
          opponent = stats[i].blackPlayer.username;
          if(stats[i].winner === "white"){
            status = "Won";
          }
          else if(stats[i].winner == "black"){
            status = "Lost";
          }
          else{
            status = "Draw";
          }
          timestamp = stats[i].startTime;
          // @ts-ignore
          durationTimeInSeconds = Date.parse(stats[i].endTime) - Date.parse(stats[i].startTime);
          durationTimeDateFormat = new Date(durationTimeInSeconds);
          duration = durationTimeDateFormat.getUTCMinutes() + ':' + durationTimeDateFormat.getUTCSeconds();
          elo = Math.round(stats[i].whitePlayerEloBefore);
          opponentElo = Math.round(stats[i].blackPlayerEloBefore);
        }
        array.push({opponent: opponent, status: status, timestamp: timestamp, duration: duration, elo : elo, opponentElo: opponentElo});
      }
    }

    return (
        <div className="stats">
            <img src={banner} className="img-fluid banner" alt="Statistics" />
            <div className="total_games"><FontAwesomeIcon icon="chess-king" className="chess-king fa-3x" />Games Played: {array.length}</div>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="stats_grid ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
                            <AgGridReact onGridReady={onGridReady} domLayout={'autoHeight'} defaultColDef={{ resizable: true }} rowData={array}>
                                <AgGridColumn field="opponent"></AgGridColumn>
                                <AgGridColumn field="status"></AgGridColumn>
                                <AgGridColumn field="timestamp"></AgGridColumn>
                                <AgGridColumn field="duration"></AgGridColumn>
                                <AgGridColumn field="elo"></AgGridColumn>
                                <AgGridColumn field="opponentElo"></AgGridColumn>
                            </AgGridReact>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col">
                        <Link className="btn btn-secondary" to="./menu">Main Menu</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
