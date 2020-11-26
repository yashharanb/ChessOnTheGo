import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

export function PlayerMainMenu() {

    return <div className="container">
        <div className="row">
            <div className="col">
                <div className="jumbotron brown-border content-container">
                    <p className="lead">Games played: {4}</p>
                    <p className="lead">Games won: {4}</p>
                    <p className="lead">Games lost: {4}</p>
                    <p className="lead">Games tied: {4}</p>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <Link to="/about">About</Link>
            </div>
            <div className="col">
                testing2
            </div>
        </div>
    </div>

    // <div className={"card border-primary mb-3"}>
    //             <div className={"card-header"}>Header</div>
    //     <div className={"card-body"}>
    //                     <h4 className={"card-title"}>Primary card title</h4>
    //         <p className={"card-text"}>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    //     </div>
    // </div>

    //load the whole page

    //if user click new game, load new game page
    // else if user click stats, go to stats page



}