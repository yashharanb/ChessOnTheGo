import React, { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import banner from './images/playerStats.png';

export function PlayerStatistics() {
    const [gridApi, setGridApi] = useState(Object);
    const [gridColumnApi, setGridColumnApi] = useState(Object);

    function onGridReady(params: { api: any; columnApi: any; }) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    }

    const stats = [
        { opponent: "Player 1", status: "Won", timestamp: "11/19/2020 18:47", duration: "18:42" },
        { opponent: "Player 2", status: "Lost", timestamp: "11/12/2020 17:26", duration: "11:59" },
        { opponent: "Player 3", status: "Draw", timestamp: "11/09/2020 16:35", duration: "6:34" },
        { opponent: "Player 4", status: "Won", timestamp: "11/08/2020 15:44", duration: "9:27" },
    ];

    return (
        <div className="stats">
            <img src={banner} className="img-fluid" alt="Statistics" />
            <div className="total_games"><FontAwesomeIcon icon="chess-king" className="chess-king fa-3x" />Games Played: {stats.length}</div>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
                            <AgGridReact onGridReady={onGridReady} domLayout={'autoHeight'} defaultColDef={{ resizable: true }} rowData={stats}>
                                <AgGridColumn field="opponent"></AgGridColumn>
                                <AgGridColumn field="status"></AgGridColumn>
                                <AgGridColumn field="timestamp"></AgGridColumn>
                                <AgGridColumn field="duration"></AgGridColumn>
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