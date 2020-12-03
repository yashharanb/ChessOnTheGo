import React, { Fragment } from 'react';
import '../App.css';
import 'bootswatch/dist/slate/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Contains the display for the queue page.
// Uses a spinning icon to display that the user is waiting in the queue.
export function Queue() {
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="jumbotron brown-border content-container">
                            <div className="row">
                                <div className="col">
                                    <p className="lead">
                                        Looking for an available opponent<br />
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <FontAwesomeIcon icon="spinner" className="fa-pulse fa-3x" style={{ marginLeft: 15 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}