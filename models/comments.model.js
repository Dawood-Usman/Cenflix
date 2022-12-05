const { sequelize, DataTypes } = require("../config/sequelize");

const comments = sequelize.define("comments", {
    
    MovieID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Time: {
        type: DataTypes.STRING,
        allowNull: false
    }
 });
 
 sequelize.sync().then(() => {
    console.log('comments table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });
 
 module.exports = comments;