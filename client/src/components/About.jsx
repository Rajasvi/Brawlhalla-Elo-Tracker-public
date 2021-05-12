import React from 'react';

function About() {
    return (
        <div className="about">
            <div class="container">
                <div class="row align-items-center my-5">
                    <div class="col-lg-3">
                        <img
                            class="img-fluid rounded mb-4 mb-lg-0"
                            src="https://www.gifservice.fr/img/gif-vignette-small/9a6fa84a540e078db95db668a913898f/160441-video-games-brawlhalla-logo.gif"
                            alt=""
                        />
                    </div>
                    <div class="col-lg-5">
                        <h1 class="font-weight-light">About</h1>
                        <hr />
                        <p>
                            Welcome to a Gold Pleb's hobby to track the ever-bouncing elo between Gold and Platinum!
                            Feel free to add tracker by adding your Brawlhalla username which will be periodically
                            tracked (1v1: ever 15min, 2v2: every 5min default interval); You can view the elo rating
                            graph for the tracked username by clickng the added username from homepage. Please send out
                            your reviews/suggestions for features to: rajasvivinayak@gmail.com
                            <br />
                            <br />
                            <a
                                href="https://github.com/Rajasvi/Brawlhalla-Elo-Tracker-public"
                                class="text-black display-6"
                            >
                                <i class="fab fa-github"></i>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;