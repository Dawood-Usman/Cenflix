const { sequelize } = require("../config/sequelize");
const transporter = require("../config/transporter");
const userCredentials = require("../models/userCredentials.model");
const feedBack = require("../models/feedBack.model");
const slider = require("../models/slider.model");
const movie = require("../models/movie.model");
const bookings = require("../models/bookings.model");
const ratings = require("../models/ratings.model");
const comments = require("../models/comments.model");

const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const options = { height: "4.7in", width: "8in" };

const signIn = (req, res) => {

    const userName = req.body.userName;
    const password = req.body.password;

    sequelize.sync().then(() => {
        userCredentials.findOne({
            where: {
                UserName: userName,
                Password: password
            }
        }).then(resp => {
            if (resp) {
                const user = { username: userName, password: password };
                req.session.user = user;
                res.cookie("CurrentRole", "user");
                res.redirect("/user/homePage");
            }
            else {
                res.send("Invalid Credientials");
            }
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const signUp = (req, res) => {

    const userData = req.session.userData;

    const userName = userData.userName;
    const email = userData.email;
    const password = userData.password;

    sequelize.sync().then(() => {
        console.log('UserCredentials table created successfully!');

        userCredentials.create({
            UserName: userName,
            Email: email,
            Password: password
        }).then(resp => {
            req.session.userData = null;
            res.redirect("/user/signIn");
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

const sendVerificationCode = (req, res) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    const user = { userName: userName, email: email, password: password };
    req.session.userData = user;

    const givenSet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
        let pos = Math.floor(Math.random() * givenSet.length);
        code += givenSet[pos];
    }

    req.session.code = code;

    let mail = transporter.sendMail({
        from: '"Cenflix" <yourscenflix@gmail.com>',
        to: `${email}`,
        subject: "Verification Code",
        text: "Hello world?",
        html: `<h1>Cenflix Verification Code!</h1>
               <p><b>Your Code is : ${code}</b></p>`
    });
    res.render("user/verifyCode", { Email: email });

}

const verifyCode = (req, res) => {
    const Code = req.body.code;
    if (Code == req.session.code) {
        res.redirect(307, "/user/signUpConfirm");
    }
    else {
        req.session.code = null;
        res.send("Wrong Verification Code!\nTry To SignUp Again...");
    }
}

const sendFeedBack = (req, res) => {
    const userName = req.session.user.username;
    const type = req.body.feedBackType;
    const feedBackMsg = req.body.feedBackMsg;

    sequelize.sync().then(() => {
        console.log('feedBack table created successfully!');

        feedBack.create({
            UserName: userName,
            Type: type,
            FeedBackMsg: feedBackMsg
        }).then(resp => {
            res.redirect("/user/homePage");
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

const displayHomePage = (req, res) => {

    sequelize.sync().then(() => {
        slider.findAll().then(slider => {
            movie.findAll({
                where: {
                    MovieStatus: "Running"
                }
            }).then(movie => {
                res.render("user/homePage", { slider: slider, movieData: movie });
            }).catch((error) => {
                console.error('Failed to retrieve data : ', error);
            });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const displayHomePageByMovieIndustry = (req, res) => {

    const movieIndustry = req.query.movieIndustry;

    sequelize.sync().then(() => {
        slider.findAll().then(slider => {
            movie.findAll({
                where: {
                    MovieStatus: "Running",
                    MovieIndustry: movieIndustry
                }
            }).then(movie => {
                res.render("user/homePage", { slider: slider, movieData: movie });
            }).catch((error) => {
                console.error('Failed to retrieve data : ', error);
            });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const displayHomePageByMovieGenre = (req, res) => {

    const movieGenre = req.query.movieGenre;

    sequelize.sync().then(() => {
        slider.findAll().then(slider => {
            movie.findAll({
                where: {
                    MovieStatus: "Running",
                    MovieGenre: movieGenre
                }
            }).then(movie => {
                res.render("user/homePage", { slider: slider, movieData: movie });
            }).catch((error) => {
                console.error('Failed to retrieve data : ', error);
            });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const DisplayBookMovie = (req, res) => {
    const MovieID = req.params.MovieID;

    let seats = "";

    sequelize.sync().then(() => {
        bookings.findAll({
            where: {
                MovieID: MovieID
            },
            attributes: ['BookedSeats'],
        }).then(BookedSeats => {
            if (BookedSeats) {
                seats = BookedSeats;
            }
            else {
                seats = "";
            }
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

    // ========================================================================//

    sequelize.sync().then(() => {
        movie.findOne({
            where: {
                MovieID: MovieID
            }
        }).then(movie => {
            if (movie) {
                res.render("user/bookMovie", { movie: movie, seats: seats });
            }
            else {
                res.send("Invalid Credientials");
            }

        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const BookMovie = (req, res) => {
    const MovieID = req.query.MovieID;
    const Seats = (req.query.seats).split(" ");
    const userName = req.session.user.username;

    sequelize.sync().then(() => {
        movie.findOne({
            where: {
                MovieID: MovieID
            }
        }).then(MovieData => {
            if (MovieData) {
                Seats.forEach(function (seat) {
                    bookings.create({
                        UserName: userName,
                        MovieID: MovieData.MovieID,
                        MovieName: MovieData.MovieName,
                        ShowDate: MovieData.ShowDate,
                        ShowTime: MovieData.ShowTime,
                        BookedSeats: seat,
                        TotalAmount: MovieData.TicketPrice,
                        BookingStatus: "Pending",
                        MovieStatus: "Running"
                    }).then(resp => {
                    }).catch((error) => {
                        console.error('Failed to create a new record : ', error);
                    });
                })
                res.render("user/printTicket", { MovieData: MovieData, userName: userName, seats: req.query.seats });
            }
            else {
                res.send("Invalid Credientials");
            }

        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}


const printTicket = (req, res) => {
    const MovieID = req.query.MovieID;
    const Seats = (req.query.seats).split(" ");
    const userName = req.session.user.username;

    sequelize.sync().then(() => {
        movie.findOne({
            where: {
                MovieID: MovieID
            }
        }).then(MovieData => {
            if (MovieData) {
                res.render(
                    "user/ticketPdf",
                    { MovieData: MovieData, userName: userName, seats: req.query.seats },
                    function (err, html) {
                        pdf
                            .create(html, options)
                            .toFile("CenflixReports/MovieTicket.pdf", function (err, result) {
                                if (err) return console.log("nikal jaa ", err);
                                else {
                                    var MovieTicket = fs.readFileSync("CenflixReports/MovieTicket.pdf");
                                    res.header("content-type", "application/pdf");
                                    res.send(MovieTicket);
                                }
                            });
                    }
                );
            }
            else {
                res.send("Error!");
            }

        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}


const displayMovieRating = (req, res) => {

    //select sum(RatingNo) from ratings where MovieID = "TGM-22" group by RatingNo order by RatingNo asc;

    const MovieID = req.query.id;
    const MoviePoster = req.query.poster;

    sequelize.sync().then(() => {
        ratings.findOne({
            attributes: [[sequelize.fn('count', sequelize.col('RatingNo')), 'RatingNo']],
            where: {
                MovieID: MovieID,
                RatingNo: "1"
            }
        }).then(rating1 => {
            if (rating1) {

                ratings.findOne({
                    attributes: [[sequelize.fn('count', sequelize.col('RatingNo')), 'RatingNo']],
                    where: {
                        MovieID: MovieID,
                        RatingNo: "2"
                    }
                }).then(rating2 => {
                    if (rating2) {
                        ratings.findOne({
                            attributes: [[sequelize.fn('count', sequelize.col('RatingNo')), 'RatingNo']],
                            where: {
                                MovieID: MovieID,
                                RatingNo: "3"
                            }
                        }).then(rating3 => {
                            if (rating3) {
                                ratings.findOne({
                                    attributes: [[sequelize.fn('count', sequelize.col('RatingNo')), 'RatingNo']],
                                    where: {
                                        MovieID: MovieID,
                                        RatingNo: "4"
                                    }
                                }).then(rating4 => {
                                    if (rating4) {
                                        ratings.findOne({
                                            attributes: [[sequelize.fn('count', sequelize.col('RatingNo')), 'RatingNo']],
                                            where: {
                                                MovieID: MovieID,
                                                RatingNo: "5"
                                            }
                                        }).then(rating5 => {
                                            if (rating5) {
                                                ratings.findOne({
                                                    attributes: [[sequelize.fn('count', sequelize.col('RatingNo')), 'RatingNo']],
                                                    where: {
                                                        MovieID: MovieID,
                                                        RatingNo: null
                                                    }
                                                }).then(rating0 => {
                                                    if (rating0) {
                                                        comments.findAll({
                                                            where: {
                                                                MovieID: MovieID
                                                            }
                                                        }).then(comments => {
                                                            if (comments) {
                                                                res.render("user/movieReviews", {
                                                                    MovieID: MovieID, MoviePoster: MoviePoster,
                                                                    rating0: rating0, rating1: rating1, rating2: rating2,
                                                                    rating3: rating3, rating4: rating4, rating5: rating5,
                                                                    comments: comments
                                                                });
                                                            }
                                                            else {
                                                                seats = "";
                                                            }
                                                        }).catch((error) => {
                                                            console.error('Failed to retrieve data : ', error);
                                                        });

                                                    }
                                                    else {
                                                        res.send("Invalid Credientials");
                                                    }

                                                }).catch((error) => {
                                                    console.error('Failed to retrieve data : ', error);
                                                });
                                            }
                                            else {
                                                res.send("Invalid Credientials");
                                            }

                                        }).catch((error) => {
                                            console.error('Failed to retrieve data : ', error);
                                        });
                                    }
                                    else {
                                        res.send("Invalid Credientials");
                                    }

                                }).catch((error) => {
                                    console.error('Failed to retrieve data : ', error);
                                });
                            }
                            else {
                                res.send("Invalid Credientials");
                            }

                        }).catch((error) => {
                            console.error('Failed to retrieve data : ', error);
                        });
                    }
                    else {
                        res.send("Invalid Credientials");
                    }

                }).catch((error) => {
                    console.error('Failed to retrieve data : ', error);
                });
            }
            else {
                res.send("Invalid Credientials");
            }

        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

const getMovieRating = (req, res) => {
    const MovieID = req.query.id;
    const MoviePoster = req.query.poster;
    const userName = req.session.user.username;
    const newUserName = `${userName}${MovieID}`;
    const rating = req.body.rating;

    sequelize.sync().then(() => {
        console.log('ratings table created successfully!');

        ratings.create({
            UserName: newUserName,
            MovieID: MovieID,
            RatingNo: rating
        }).then(resp => {
            res.redirect(`/user/movieReviews/?id=${MovieID}&poster=${MoviePoster}`);
        }).catch((error) => {
            res.send("You've Already Submitted Rating!");
            // console.error('Failed to create a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

const addComment = (req, res) => {
    const MovieID = req.query.id;
    const MoviePoster = req.query.poster;
    const userName = req.session.user.username;
    const time = new Date().toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })
    const comment = req.body.comment;
    sequelize.sync().then(() => {
        console.log('comments table created successfully!');

        comments.create({
            MovieID: MovieID,
            UserName: userName,
            Comment: comment,
            Time: time
        }).then(resp => {
            res.redirect(`/user/movieReviews/?id=${MovieID}&poster=${MoviePoster}`);
        }).catch((error) => {
            res.send("You've Already Submitted Rating!");
            // console.error('Failed to create a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}



const logOut = (req, res) => {
    req.session.user = null;
    req.cookies.CurrentRole = "";
    res.redirect("/cenflix");
}


module.exports = {
    signIn,
    signUp,
    sendVerificationCode,
    verifyCode,
    displayHomePage,
    DisplayBookMovie,
    BookMovie,
    sendFeedBack,
    displayMovieRating,
    displayHomePageByMovieIndustry,
    displayHomePageByMovieGenre,
    getMovieRating,
    printTicket,
    addComment,
    logOut
}
