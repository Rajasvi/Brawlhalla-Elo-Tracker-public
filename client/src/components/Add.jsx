import React, { useEffect, useState } from 'react';

function BrawlhallaUserInfo({ brawlUserName }) {
    const [status, setStatus] = useState('idle');
    const [brawlUserInfo, setBrawlUserInfo] = useState(null);

    useEffect(() => {
        if (!brawlUserName) return;

        setStatus('pending');
        var req_options = {
            method: 'POST',
            body: JSON.stringify({ brawlUserName: brawlUserName }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        fetch('https://brawlhalla-elo-tracker.herokuapp.com/trackers', req_options)
            .then((res) => res.json())
            .then(
                (data) => {
                    console.log(data);
                    alert(`Successfully added tracker for: ${brawlUserName}. Please check the graph for tracked username AFTER 10 minutes! `);

                    setBrawlUserInfo(data);
                    setStatus('resolved');
                },
                (errorData) => {
                    setStatus('rejected');
                },
            );
    }, [brawlUserName]);

    if (status === 'idle') return 'Please enter a username...';

    if (status === 'rejected')
        return 'Oh no.....there is some error in fetching data (Psst... maybe verify the username again?)';

    if (status === 'pending')
        return (
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        );

    if (status === 'resolved') return <pre>{JSON.stringify(brawlUserInfo, null, 2)}</pre>;
}

function Add() {
    const [username, setUsername] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        setUsername(event.target.elements.usernameInput.value);
    }

    return (
        <div className="contact">
            <div class="container">
                <div class="row align-items-center my-5">
                    <div class="col-lg-7">
                        <img
                            class="img-fluid rounded mb-4 mb-lg-0"
                            src="https://sm.ign.com/t/ign_ap/screenshot/default/ubisoft-to-bring-epic-platform-fighter-brawlhalla-to-android_5f8q.2560.jpg"
                            alt=""
                        />
                    </div>
                    <div class="col-lg-5">
                        <h1 class="font-weight-light">Add a new tracker</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="usernameInput">
                                <p>Brawlhalla username:</p>
                                <input id="usernameInput" name="name" type="text" />
                            </label>
                            <br/><br/> 
                            <button type="submit" class="btn btn-primary">
                                Submit
                            </button>
                            <hr />
                            <BrawlhallaUserInfo brawlUserName={username} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Add;