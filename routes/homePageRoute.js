const express = require("express");
const homeRouter = express.Router();

const { sequelize } = require("../config/sequelize");
const visitors = require("../models/visitors.model");

homeRouter.get("/", (req, res) => {
    sequelize.sync().then(() => {
        console.log('visitors table created successfully!');
        visitors.increment('VisitorCount', { by: 1, where: { id: 1 } }
        ).then(resp => {
            res.render("landingPage");
        }).catch((error) => {
            console.error('Failed to update a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
})

homeRouter.get("/cenflix", (req, res) => {
    sequelize.sync().then(() => {
        console.log('visitors table created successfully!');
        visitors.increment('VisitorCount', { by: 1, where: { id: 1 } }
        ).then(resp => {
            res.render("landingPage");
        }).catch((error) => {
            console.error('Failed to update a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
})

homeRouter.get("/whosThere", (req, res) => {
    res.render("whosThere");
})

module.exports = homeRouter;