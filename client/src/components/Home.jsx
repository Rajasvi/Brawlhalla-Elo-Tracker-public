import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';

function Home() {
    const [trackerList, setTrackerList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch('https://brawlhalla-elo-tracker.herokuapp.com/trackers/')
            .then((res) => res.json())
            .then((result) => {
                setTrackerList(result);
                setIsLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [setTrackerList]);

    if (!isLoaded) return <div>Loading...</div>;
    else {
        return (
            <div className="home">
                <div class="container">
                    <div class="row align-items-center my-5">
                        <div class="d-flex justify-content-center row">
                            <div class="card  ">
                                <img
                                    class="card-img"
                                    src="https://i.redd.it/6fvxi8wl3ts11.jpg"
                                    alt="..."
                                />
                            </div>
                            
                        </div>
                    </div>
                    <div class="row">
                        <h1 class="font-weight-light">Current Trackers</h1>
                        <hr />
                        {trackerList.trackers.map((tracker) => (
                            <div class="col-lg-2">
                                <ul id={tracker.playerId}>
                                    <Link
                                        id={tracker.playerId}
                                        to={{
                                            pathname: '/details',
                                            tracker,
                                        }}
                                        className="btn btn-dark"
                                    >
                                        {tracker.playerName}
                                    </Link>
                                    <p style={{"font-size":"14px"}} class="fw-lighter" >Last added: <Moment date={tracker.createdAt} format="YY-MM-DD hh:mm:ss"/></p>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
