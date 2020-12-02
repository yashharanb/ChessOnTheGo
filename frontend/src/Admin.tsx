import React from "react";
import './App.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { User } from "./ServerHooks";

export function Admin() {
  const users = [
    {username:"theadminlol",elo:1223,email:"admin@admin.com",isAdmin:true,state:"none",_id:1},
    {username:"kevin",elo:2390,email:"kevin@kevin.com",isAdmin:false,state:"game",_id:2},
    {username:"nicole",elo:876,email:"nicole@gmail.com",isAdmin:false,state:"game",_id:3},
    {username:"yesha",elo:987,email:"nicole@gmail.com",isAdmin:false,state:"none",_id:4},
    {username:"yashhhhharan",elo:790,email:"yashhhhhhhhharan@gmail.com",isAdmin:false,state:"queued",_id:5},
    {username:"krl",elo:888,email:"krl@gmail.com",isAdmin:false,state:"none",_id:6}
  ];

  return (
    <div className="admin">
      <div className ="table_heading">Delete Accounts</div>

      <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
        <AgGridReact defaultColDef={{ resizable: true }} rowData={users}>
          <AgGridColumn field="delete" headerName=""></AgGridColumn>
          <AgGridColumn field="username"></AgGridColumn>
          <AgGridColumn field="email" flex={1}></AgGridColumn>
        </AgGridReact>
      </div>

    </div>
  );
}