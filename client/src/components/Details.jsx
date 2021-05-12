import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidUpdate() {
        this.myChart.data.labels = this.props.data.time.map((x) => new Date(x));
        this.myChart.data.datasets[0].data = this.props.data.rating;
        // this.myChart.update();
    }

    componentDidMount() {
        console.log(typeof this.props.data.time.map((x) => new Date(x)));
        this.myChart = new Chart(this.chartRef.current, {
            type: 'line',
            options: {
                scales: {
                    xAxes: [
                        {
                            type: 'time',
                            unit: 'day',
                            time: {
                                stepSize: 1,
                                minUnit: 'day',
                            },

                            ticks: {
                                source: 'auto',
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: false,
                            },
                        },
                    ],
                },
                plugins: {
                    legend: {
                        display: false,
                        title: false,
                        position: 'bottom',
                    },
                },
            },
            data: {
                labels: this.props.data.time.map((x) => new Date(x)),
                datasets: [
                    {
                        label: this.props.title,
                        data: this.props.data.rating,
                        fill: 'none',
                        backgroundColor: this.props.color,
                        pointRadius: 2,
                        borderColor: this.props.color,
                        borderWidth: 1,
                        lineTension: 0.2,
                    },
                ],
            },
        });
    }

    render() {
        return <canvas ref={this.chartRef} />;
    }
}

function GraphCard(props) {
    const [isOpen, setIsOpen] = useState(false);

    function toggle(event) {
        event.preventDefault();
        setIsOpen(!isOpen);
    }

    console.log(props.teamData);
    var teamGamesInfo = [];
    for (var i = 0; i < props.brawlTeamsData.length; i++) {
        if (props.brawlTeamsData[i].teamname === props.teamData.brawl2v2TeamName) {
            teamGamesInfo = props.brawlTeamsData[i];
            break;
        }
    }

    return (
        <div class="container">
            <section class="mx-auto my-2">
                <div class="card chart-card">
                    <div class="card-body pb-0">
                        <h5 class="card-title font-weight-bold ">{props.teamData.brawl2v2TeamName}</h5>
                        <p class="card-text mb-4">
                            {teamGamesInfo.tier} • {teamGamesInfo.wins}/{teamGamesInfo.games} wins
                        </p>
                        <div class="d-flex justify-content-between">
                            <p class="display-4 align-self-end mb-0 text-warning">{teamGamesInfo.rating}</p>
                            <p class="align-self-end mb-0 text-success">{teamGamesInfo.peak_rating}</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="align-self-end mt-0 text-black-50">Current Rating</p>
                            <p class="align-self-end mt-0 text-black-50">Peak Rating</p>
                        </div>
                    </div>
                    <ul class="nav nav-tabs nav-fill mb-3" id="ex1" role="tablist">
                        <li class="nav-item ms-0" role="presentation" id={'list_' + props.teamData.brawl2v2TeamName}>
                            <button
                                class="nav-link active"
                                id={'ex1-tab-1-' + props.teamData.brawl2v2TeamName}
                                onClick={toggle}
                            >
                                Elo Graph {!isOpen && <i class="fas fa-angle-double-down"></i>}{' '}
                                {isOpen && <i class="fas fa-angle-double-up"></i>}
                            </button>
                        </li>
                    </ul>
                    {isOpen && (
                        <div class="card-body">
                            <div class="tab-content" id="ex1-content">
                                <div id={props.teamData.brawl2v2TeamName}>
                                    <LineChart
                                        data={props.teamData}
                                        title={props.teamData.brawl2v2TeamName}
                                        color="#005372"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function Details(props) {
    const [brawlTeamRatingsData, setbrawlTeamRatingsData] = useState([]);
    const [brawlTeamsData, setbrawlTeamsData] = useState([]);
    const [isRatingsLoaded, setIsRatingsLoaded] = useState(false);
    const [isTeamInfoLoaded, setIsTeamInfoLoaded] = useState(false);


    useEffect(() => {
        fetch(`https://brawlhalla-elo-tracker.herokuapp.com/trackers/${props.location.tracker.playerBrawlId}`)
            .then((res) => res.json())
            .then((result) => {
                setbrawlTeamRatingsData(result);
                // console.log(result);
                setIsRatingsLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });

        fetch(`https://brawlhalla-elo-tracker.herokuapp.com/teamdata/${props.location.tracker.playerBrawlId}`)
            .then((res) => res.json())
            .then((result) => {
                setbrawlTeamsData(result);
                console.log(result);
                setIsTeamInfoLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [setbrawlTeamRatingsData, setbrawlTeamsData]);

    function handleDelete() {
        const brawlId = brawlTeamRatingsData.playerStats[0].brawlId;
        console.log(brawlId);
        fetch(`https://brawlhalla-elo-tracker.herokuapp.com/trackers/${props.location.tracker.playerBrawlId}`, { method: 'DELETE' })
            .then((res) => res.json())
            .then((data) => (window.location.href = data.redirect));
    }

    if (!isRatingsLoaded || !isTeamInfoLoaded) return <div>Loading...</div>;
    else {
        return (
            <div className="details">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col">
                            <div class="row align-items-center my-4">
                                <div class="col-lg-10">
                                    <h1 class="font-weight-light">{brawlTeamRatingsData.ratings1v1.name}</h1>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-black" onClick={handleDelete}>
                                        <i class="far fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="row align-items-center my-4">
                                <LineChart
                                    data={brawlTeamRatingsData.ratings1v1}
                                    title={brawlTeamRatingsData.ratings1v1.name}
                                    color="#005372"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="row row-cols-1 row-cols-md-2 g-4 mb-5">
                        {brawlTeamRatingsData.teamsRatings.map((team) => (
                            <GraphCard teamData={team} brawlTeamsData={brawlTeamsData} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Details;
