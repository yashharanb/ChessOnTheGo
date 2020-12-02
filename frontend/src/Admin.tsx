import React, { useState } from "react";
import './App.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AdminHookReturn } from "./ServerHooks";

export function Admin() {
    const [gridApi, setGridApi] = useState(Object);
    const [gridColumnApi, setGridColumnApi] = useState(Object);

    function onGridReady(params: { api: any; columnApi: any; }) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    }

    const onButtonClick = (e: any) => {
        const selectedNodes = gridApi.getSelectedNodes();
        if (selectedNodes.length === 0) {
            alert("Please select a user to delete.");
        }
        else {
            const selectedData = selectedNodes.map((node: { data: any; }) => node.data);
            const selectedDataStringPresentation = selectedData.map((node: { username: string; email: string; }) => node.username + ' ' + node.email).join(', ');
            alert(`Selected nodes: ${selectedDataStringPresentation}`);
        }

    }

    const users = [
        { username: "theadminlol", elo: 1223, email: "admin@admin.com", isAdmin: true, state: "none", _id: 1 },
        { username: "kevin", elo: 2390, email: "kevin@kevin.com", isAdmin: false, state: "game", _id: 2 },
        { username: "nicole", elo: 876, email: "nicole@gmail.com", isAdmin: false, state: "game", _id: 3 },
        { username: "yesha", elo: 987, email: "nicole@gmail.com", isAdmin: false, state: "none", _id: 4 },
        { username: "yashhhhharan", elo: 790, email: "yashhhhhhhhharan@gmail.com", isAdmin: false, state: "queued", _id: 5 },
        { username: "krl", elo: 888, email: "krl@gmail.com", isAdmin: false, state: "none", _id: 6 }
    ];

    return (
        <div className="admin">
            <div className="table_heading">Delete Accounts</div>

            <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
                <AgGridReact onGridReady={onGridReady} domLayout={'autoHeight'} defaultColDef={{ resizable: true }} rowData={users} rowSelection="multiple">
                    <AgGridColumn field="delete" checkboxSelection={true}></AgGridColumn>
                    <AgGridColumn field="username"></AgGridColumn>
                    <AgGridColumn field="email" flex={1}></AgGridColumn>
                </AgGridReact>
            </div>

            <div className="user_count">Total Users: {users.length}</div>
            <button className="btn btn-secondary delete_button" onClick={onButtonClick}>Delete</button>

        </div>
    );
}