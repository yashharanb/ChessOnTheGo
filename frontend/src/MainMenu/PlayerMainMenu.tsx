import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { PlayerStatistics } from "../PlayerStatistics";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";



// This page displays the player's general game stats, and allows users to play a new game or view detailed stats.
// TODO: replace the 4s with actual data from the db
export function PlayerMainMenu() {
// Use a use effect and get request
    return (
        <div className="container player_menu">
            <div className="row">
                <div className="col">
                    <div className="jumbotron brown-border content-container">
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"  style={{marginLeft: 15}}/>
                            Games played: {4}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            Games won: {4}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            Games lost: {4}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            Games tied: {4}
                        </p>
                        <p className="lead">
                            <FontAwesomeIcon icon="chess-king" className="chess-king fa-3x"/>
                            ELO Score: {4}
                        </p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Link className="btn btn-secondary" to="../Game">New Game</Link>
                </div>
                <div className="col">
                    <Link className="btn btn-secondary" to="../playerstats">Player Stats</Link>
                </div>
            </div>
        </div>
    )
}
