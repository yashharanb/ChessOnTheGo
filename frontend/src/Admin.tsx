import React, { useState } from "react";
import './App.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useAdminState } from "./ServerHooks";

export function Admin() {
    const {deleteUsers, allUsers, thisUser} = useAdminState(console.log);

    const [gridApi, setGridApi] = useState(Object);
    const [gridColumnApi, setGridColumnApi] = useState(Object);

    function onGridReady(params: { api: any; columnApi: any; }) {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    }

    // When Delete button is clicked
    const onButtonClick = (e: any) => {
        const selectedNodes = gridApi.getSelectedNodes();
        if (selectedNodes.length === 0) {
            alert("Please select a user to delete.");
        }
        else {
            const selectedData = selectedNodes.map((node: { data: any; }) => node.data);
            const selectedDataEmails = selectedData.map((node: { email: string; }) => node.email);
            try {
                deleteUsers(selectedDataEmails);
            } catch(e){
                alert(e.message);
            }
        }
    }   

    return (
        <div className="admin">
            <div className="table_heading">Delete Accounts</div>

            <div className="ag-theme-alpine" >
                <AgGridReact onGridReady={onGridReady} domLayout={'autoHeight'} defaultColDef={{ resizable: true }} rowData={allUsers} rowSelection="multiple">
                    <AgGridColumn field="delete" maxWidth={150} checkboxSelection={true}></AgGridColumn>
                    <AgGridColumn field="username" maxWidth={300}></AgGridColumn>
                    <AgGridColumn field="email"></AgGridColumn>
                </AgGridReact>
            </div>

            <div className="user_count">Total Users: {allUsers.length}</div>
            <button className="btn btn-secondary" onClick={onButtonClick}>Delete</button>

        </div>
    );
}