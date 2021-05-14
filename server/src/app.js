const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const moment = require('moment');
const _ = require('lodash');
const cors = require('cors');
const { PlayerStats } = require('./models/brawlStats');
const { PlayerIds } = require('./models/brawlStats');
const { Player2v2Stats } = require('./models/brawlStats');
const axios = require('axios');
const app = express();

var dbURI = process.env.MONGODB_URI;
var tracker1v1interval = process.env.TRACKER_1v1_INTERVAL;
var tracker2v2interval = process.env.TRACKER_2v2_INTERVAL;
var api_key = process.env.BRAWLHALLA_API_KEY;

mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', '../../client/build');

// middleware and static files.
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(
    express.json({
        type: ['application/json', 'text/plain'],
    }),
);
app.use(cors());

// schedule brawlhalla players elo update
const scheduler = new ToadScheduler();
const task_tracker1v1 = new Task('brawl_elo_1v1_update', () => {
    PlayerIds.find()
        .sort({ createdAt: -1 })
        .then((players) => {
            if (players.length > 0) {
                players.forEach((player) => {
                    const url =
                        'https://api.brawlhalla.com/player/' + player.playerBrawlId + '/ranked?api_key=' + api_key;
                    axios.get(url).then((resp) => {
                        const stats = resp.data;
                        const playerStats = new PlayerStats({
                            brawlId: stats.brawlhalla_id,
                            brawlName: stats.name,
                            rating: stats.rating,
                            peakRating: stats.peak_rating,
                        });
                        playerStats
                            .save()
                            .then(() => {
                                console.log(stats.name + ' : Player elo updated!');
                            })
                            .catch((err) => {
                                console.log(stats.name + ' : Error thrown : ' + err);
                            });
                        updateTeamsfromId(stats.brawlhalla_id);
                    });
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

const task_tracker2v2 = new Task('brawl_elo_2v2_update', () => {
    PlayerIds.find()
        .sort({ createdAt: -1 })
        .then((players) => {
            if (players.length > 0) {
                players.forEach((player) => {
                    const url =
                        'https://api.brawlhalla.com/player/' + player.playerBrawlId + '/ranked?api_key=' + api_key;
                    axios
                        .get(url)
                        .then((resp) => {
                            const teams = resp.data['2v2'];
                            const teamUpdateDict = {};

                            teams.forEach((team) => {
                                const brawlTeamId =
                                    team.brawlhalla_id_one < team.brawhalla_id_two
                                        ? team.brawlhalla_id_one + '`' + team.brawlhalla_id_two
                                        : team.brawlhalla_id_two + '`' + team.brawlhalla_id_one;

                                teamUpdateDict[team.teamname] = {
                                    brawl2v2Id: brawlTeamId,
                                    brawl2v2TeamName: team.teamname,
                                    rating: team.rating,
                                    peakRating: team.peak_rating,
                                };
                            });

                            for (let k in teamUpdateDict) {
                                console.log(teamUpdateDict[k]);
                                const player2v2Stats = new Player2v2Stats(teamUpdateDict[k]);
                                player2v2Stats
                                    .save()
                                    .then(() => {
                                        console.log(
                                            teamUpdateDict[k].brawl2v2TeamName +
                                                ' : ' +
                                                teamUpdateDict[k].brawl2v2Id +
                                                ' : Team elo updated!',
                                        );
                                    })
                                    .catch((err) => {
                                        console.log(
                                            teamUpdateDict[k].brawl2v2TeamName +
                                                ' : ' +
                                                teamUpdateDict[k].brawl2v2Id +
                                                ' : Error thrown : ' +
                                                err,
                                        );
                                    });
                            }
                        })
                        .catch((err) => console.log('No 2v2 endpoint found!'));
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
const job_tracker1v1 = new SimpleIntervalJob({ minutes: tracker1v1interval }, task_tracker1v1);
const job_tracker2v2 = new SimpleIntervalJob({ minutes: tracker2v2interval }, task_tracker2v2);
scheduler.addSimpleIntervalJob(job_tracker1v1);
scheduler.addSimpleIntervalJob(job_tracker2v2);

// routes
app.get('/', (req, res) => {
    res.redirect('trackers');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// trackers routes
app.get('/trackers/create', (req, res) => {
    res.render('create', { title: 'Create a new tracker' });
});

app.get('/trackers', (req, res) => {
    PlayerIds.find()
        .sort({ createdAt: -1 })
        .then((result) => {
            res.send({ trackers: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/trackers', (req, res) => {
    console.log(req.body);
    // res.send(req.body)
    const url = 'https://api.brawlhalla.com/rankings/1v1/all/1?name=' + req.body.brawlUserName + '&api_key=' + api_key;

    axios.get(url).then((resp) => {
        const stats = resp.data[0];

        if (resp.data.length === 0) {
            res.send(stats);
            return;
        }

        const playerId = new PlayerIds({ playerBrawlId: stats.brawlhalla_id, playerName: stats.name, playerTeams: [] });
        playerId
            .save()
            .then((result) => {
                res.send(stats);
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

app.get('/trackers/:id', (req, res) => {
    const id = req.params.id;
    PlayerStats.find({ brawlId: id })
        .then((result) => {
            var ratings1v1 = {
                name: result[0].brawlName,
                time: result.map((x) => moment(x.createdAt).format('YYYY-MM-DD HH:mm:ss')),
                rating: result.map((x) => x.rating),
            };

            var teamsRatings = [];
            PlayerIds.find({ playerBrawlId: id }).then((player) => {
                Player2v2Stats.find({ brawl2v2Id: { $regex: '.*' + id + '.*' } }).then((teamstats) => {
                    var teamsRatings = _(teamstats)
                        .groupBy('brawl2v2TeamName')
                        .map(function (items, teamName) {
                            return {
                                brawl2v2TeamName: teamName,
                                rating: _.map(items, 'rating'),
                                time: _.map(items, 'createdAt'),
                            };
                        })
                        .value();
                    // console.log(teamsRatings);
                    res.send({
                        playerStats: result,
                        ratings1v1: ratings1v1,
                        teamsRatings: teamsRatings,
                        title: 'Elo Tracking Details',
                    });
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete('/trackers/:id', (req, res) => {
    console.log(req.params.id);
    PlayerStats.deleteOne({ brawlId: req.params.id }).then(() => {
        PlayerIds.deleteOne({ playerBrawlId: req.params.id }).then(() => {
            console.log(`Sucesfully deleted Brawl user id: ${req.params.id}`);
            res.json({ redirect: '/' });
        });
    });
});

// get brawlhalla team data.
app.get('/teamdata/:id', (req, res) => {
    const id = req.params.id;
    const url = 'https://api.brawlhalla.com/player/' + id + '/ranked?api_key=' + api_key;
    axios.get(url).then((resp) => {
        const teams = resp.data['2v2'];
        res.send(teams);
    });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

// utility functions
function updateTeamsfromId(id) {
    const url = 'https://api.brawlhalla.com/player/' + id + '/ranked?api_key=' + api_key;
    axios
        .get(url)
        .then((resp) => {
            const teams = resp.data['2v2'];
            const teamNames = teams.map((x) => x.teamname);

            var myquery = { playerBrawlId: id };
            var newvalues = { $set: { playerTeams: teamNames } };
            PlayerIds.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log(resp.data.name + ' : Teams updated');
            });
        })
        .catch((err) => console.log(err));
}

app.listen(process.env.PORT || 5000, () => console.log('server has started'));