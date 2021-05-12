const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerStatsSchema = new Schema(
    {
        brawlId: {
            type: Number,
            required: true,
        },
        brawlName: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        peakRating: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const playerIdSchema = new Schema(
    {
        playerBrawlId: {
            type: Number,
            required: true,
        },
        playerName: {
            type: String,
            required: true,
        },
        playerTeams: [{
            type: String,
            required: true,
        }],
    },
    { timestamps: true },
);

const player2v2StatsSchema = new Schema(
    {
        brawl2v2Id: {
            type: String,
            required: true,
        },
        brawl2v2TeamName: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        peakRating: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const PlayerStats = mongoose.model('brawlstats', playerStatsSchema);
const Player2v2Stats = mongoose.model('brawl2v2stats', player2v2StatsSchema);
const PlayerIds = mongoose.model('playerids', playerIdSchema);

module.exports = { PlayerStats, PlayerIds,Player2v2Stats };
