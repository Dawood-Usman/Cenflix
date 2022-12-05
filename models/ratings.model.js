const { sequelize, DataTypes } = require("../config/sequelize");

const ratings = sequelize.define("ratings", {
    UserName: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    MovieID: {
        type: DataTypes.STRING,
    },
    RatingNo: {
        type: DataTypes.STRING,
    }
 });
 
 sequelize.sync().then(() => {
    console.log('ratings table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });
 
 module.exports = ratings;