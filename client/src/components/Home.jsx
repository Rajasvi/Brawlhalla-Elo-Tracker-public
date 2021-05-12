import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [trackerList, setTrackerList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch('https://brawlhalla-elo-tracker.herokuapp.com/trackers/')
            .then((res) => res.json())
            .then((result) => {
                setTrackerList(result);
                // console.log(result)
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
                        <div class="col-lg-7">
                            <img
                                class="img-fluid rounded mb-4 mb-lg-0"
                                src="https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3fRtFxUJ37SKFvDWXF8mqI/4c08c54fc0136d9033b3680d7b9de7fc/brawlhalla-ubicom-page-meta-logo-960x540.png"
                                alt=""
                            />
                        </div>
                        <div class="col-lg-5">
                            <h1 class="font-weight-light">Current Trackers</h1>
                            <hr />
                            {trackerList.trackers.map((tracker) => (
                                <ul id={tracker.playerId}>
                                    <div class="row">
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
                                    </div>
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
