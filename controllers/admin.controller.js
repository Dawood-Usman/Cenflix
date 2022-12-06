const { sequelize } = require("../config/sequelize");
const adminCredentials = require("../models/adminCredentials.model");
const userCredentials = require("../models/userCredentials.model");
const feedBack = require("../models/feedBack.model");
const slider = require("../models/slider.model");
const movie = require("../models/movie.model");
const booking = require("../models/bookings.model");
const visitors = require("../models/visitors.model");

const transporter = require("../config/transporter");
const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const bookings = require("../models/bookings.model");
const options = { format: "A4" };


const SignIn = (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    sequelize.sync().then(() => {
        adminCredentials.findOne({
            where: {
                UserName: userName,
                Password: password
            }
        }).then(resp => {
            if (resp) {
                const admin = { username: userName, password: password };
                req.session.admin = admin;
                res.cookie("CurrentRole", "Admin");
                res.redirect("/admin/dashBoard");
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

const displayUIAccordingly = (req, res) => {
    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";
    res.render(`admin${req.url}`, { Name: name, Admin: admin });
}

// const displayCustomer = (req,res)=>{

// }

const displayCustomers = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        userCredentials.findAll().then(customersData => {
            res.render("admin/viewUsers", { customersData: customersData, Name: name, Admin: admin });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

const displayFeedBack = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        feedBack.findAll().then(customersFeedBack => {
            res.render("admin/viewFeedBack", { customersFeedBack: customersFeedBack, Name: name, Admin: admin });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

const uploadSlider = (req, res) => {
    if (!req.files) {
        res.send("No Files Recieved!\n" + JSON.stringify(req.files));
    }
    else {

        const slider1 = req.files["slider-1"][0]["filename"];
        const slider2 = req.files["slider-2"][0]["filename"];
        const slider3 = req.files["slider-3"][0]["filename"];

        sliderImages = [
            { SliderImage: slider1 },
            { SliderImage: slider2 },
            { SliderImage: slider3 }
        ];

        slider.sync({ force: true }).then(() => {
            slider.bulkCreate(sliderImages, { validate: true }).then(() => {
                res.redirect("/user/homePage");
            }).catch((err) => { console.log(err); });
        }).catch((error) => {
            console.error('Unable to create the table : ', error);
        });
    }
}

const addMovie = (req, res) => {

    if (!req.file) {
        return res.send("File Not Recieved!");
    }

    const MovieID = req.body.movieID;
    const MovieName = req.body.movieName;
    const MovieStatus = req.body.movieStatus;
    const ParentalGuidance = req.body.moviePG;
    const MovieIndustry = req.body.movieIndustry;
    const MovieGenre = req.body.movieGenre;
    const MovieDuration = req.body.movieDuration;
    const MovieTrailer = req.body.movieTrailer;
    const TicketPrice = req.body.ticketPrice;
    const ShowDate = req.body.showDate;
    const ShowTime = req.body.showTime;
    const MoviePoster = req.file.originalname;

    sequelize.sync().then(() => {
        console.log('movie table created successfully!');

        movie.create({
            MovieID: MovieID,
            MovieName: MovieName,
            MovieStatus: MovieStatus,
            ParentalGuidance: ParentalGuidance,
            MovieIndustry: MovieIndustry,
            MovieGenre: MovieGenre,
            MovieDuration: MovieDuration,
            MovieTrailer: MovieTrailer,
            TicketPrice: TicketPrice,
            ShowDate: ShowDate,
            ShowTime: ShowTime,
            MoviePoster: MoviePoster
        }).then(resp => {
            res.redirect("/admin/runningMovies");
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const displayRunningMovies = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        movie.findAll({
            where: {
                MovieStatus: "Running"
            }
        }).then(movieData => {
            res.render("admin/runningMovies", { movieData: movieData, Name: name, Admin: admin });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

const DisplayEditMovie = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";
    const MovieID = req.params.MovieID;
    sequelize.sync().then(() => {
        movie.findOne({
            where: {
                MovieID: MovieID
            }
        }).then(movie => {
            if (movie) {
                res.render("admin/editMovie", { movie: movie, Name: name, Admin: admin });
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

const EditMovie = (req, res) => {
    if (!req.file) {
        return res.send("File Not Recieved!");
    }

    const MovieID = req.body.movieID;
    const MovieName = req.body.movieName;
    const MovieStatus = req.body.movieStatus;
    const ParentalGuidance = req.body.moviePG;
    const MovieIndustry = req.body.movieIndustry;
    const MovieGenre = req.body.movieGenre;
    const MovieDuration = req.body.movieDuration;
    const MovieTrailer = req.body.movieTrailer;
    const TicketPrice = req.body.ticketPrice;
    const ShowDate = req.body.showDate;
    const ShowTime = req.body.showTime;
    const MoviePoster = req.file.originalname;

    sequelize.sync().then(() => {
        console.log('movie table created successfully!');
        movie.update({
            MovieName: MovieName,
            MovieStatus: MovieStatus,
            ParentalGuidance: ParentalGuidance,
            MovieIndustry: MovieIndustry,
            MovieGenre: MovieGenre,
            MovieDuration: MovieDuration,
            MovieTrailer: MovieTrailer,
            TicketPrice: TicketPrice,
            ShowDate: ShowDate,
            ShowTime: ShowTime,
            MoviePoster: MoviePoster
        },
            {
                where: {
                    MovieID: MovieID
                }
            }
        ).then(resp => {
            res.redirect("/admin/runningMovies");
        }).catch((error) => {
            console.error('Failed to update a new record : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}



const logOut = (req, res) => {
    req.session.admin = null;
    req.cookies.CurrentRole = "";
    res.redirect("/cenflix");
}


const displayPendingMovies = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        booking.findAll({
            attributes: ['MovieID', 'UserName', 'MovieName', 'ShowDate', 'ShowTime', [sequelize.fn('count', sequelize.col('TotalAmount')), 'BookedSeats'], [sequelize.fn('sum', sequelize.col('TotalAmount')), 'TotalAmount']],
            group: ["UserName", "MovieID"],
            where: {
                BookingStatus: "Pending",
                MovieStatus: "Running"
            }
        }).then(bookingDetails => {
            movie.findAll({
                attributes: ['MovieName'],
                where: {
                    MovieStatus: "Running"
                }
            }).then(runningMovies => {
                res.render("admin/pendingBookings", { bookingDetails: bookingDetails, runningMovies: runningMovies, Name: name, Admin: admin });
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

const displayRunningMoviesBookings = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        booking.findAll({
            where: {
                BookingStatus: "Confirmed",
                MovieStatus: "Running"
            }
        }).then(bookingDetails => {
            movie.findAll({
                attributes: ['MovieName'],
                where: {
                    MovieStatus: "Running"
                }
            }).then(runningMovies => {
                res.render("admin/runningMoviesBookings", { bookingDetails: bookingDetails, runningMovies: runningMovies, Name: name, Admin: admin });
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

const displayFeaturedMoviesBookings = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        booking.findAll({
            where: {
                BookingStatus: "Confirmed",
                MovieStatus: "Featured"
            }
        }).then(bookingDetails => {
            movie.findAll({
                attributes: ['MovieName'],
                where: {
                    MovieStatus: "Featured"
                }
            }).then(runningMovies => {
                res.render("admin/featuredMoviesBookings", { bookingDetails: bookingDetails, runningMovies: runningMovies, Name: name, Admin: admin });
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

const featuredMovie = (req, res) => {
    sequelize.sync().then(() => {
        movie.update({
            MovieStatus: "Featured",
        },
            {
                where: {
                    MovieID: req.params.MovieID
                }
            }
        ).then(resp => {
            booking.update({
                MovieStatus: "Featured",
            },
                {
                    where: {
                        MovieID: req.params.MovieID
                    }
                }
            ).then(resp => {
                res.redirect("/admin/runningMovies");
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

const confirmBooking = (req, res) => {
    sequelize.sync().then(() => {
        booking.update({
            BookingStatus: "Confirmed",
        },
            {
                where: {
                    MovieID: req.query.MovieID,
                    UserName: req.query.UserName
                }
            }
        ).then(resp => {
            res.redirect("/admin/pendingBookings");
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const displayMoviesHistory = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        movie.findAll({
            where: {
                MovieStatus: "Featured"
            }
        }).then(movieData => {
            movie.findAll({
                attributes: ['MovieName'],
                where: {
                    MovieStatus: "Featured"
                }
            }).then(runningMovies => {
                res.render("admin/moviesHistory", { movieData: movieData, runningMovies: runningMovies, Name: name, Admin: admin });
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

const deleteBooking = (req, res) => {
    sequelize.sync().then(() => {
        bookings.destroy({
            where: {
                MovieID: req.query.MovieID,
                UserName: req.query.UserName
            }
        }).then(resp => {
            res.redirect("/admin/pendingBookings");
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const displayPaymentDetails = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    //select MovieName, ShowDate, ShowTime, TotalAmount as TicketPrice, count(MovieID)As TotalTickets, sum(TotalAmount)As TotalAmount from bookings group by MovieID; 
    sequelize.sync().then(() => {
        booking.findAll({
            attributes: ['MovieID','MovieName', 'ShowDate', 'ShowTime', ['TotalAmount', 'TicketPrice'], [sequelize.fn('count', sequelize.col('MovieID')), 'BookedSeats'], [sequelize.fn('sum', sequelize.col('TotalAmount')), 'TotalAmount']],
            group: ["MovieID"],
            where: {
                BookingStatus: "Confirmed",
            }
        }).then(paymentDetails => {
            movie.findAll({
                attributes: ['MovieName'],
            }).then(runningMovies => {
                res.render("admin/paymentDetails", { paymentDetails: paymentDetails, runningMovies: runningMovies, Name: name, Admin: admin });
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

const displayDashBoard = (req, res) => {

    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    sequelize.sync().then(() => {
        userCredentials.findOne({
            attributes: [[sequelize.fn('count', sequelize.col('UserName')), 'Users']]
        }).then(usersData => {
            movie.findOne({
                attributes: [[sequelize.fn('count', sequelize.col('MovieID')), 'RunningMovies']],
                where: {
                    MovieStatus: "Running"
                }
            }).then(RunningMovies => {
                movie.findOne({
                    attributes: [[sequelize.fn('count', sequelize.col('MovieID')), 'FeaturedMovies']],
                    where: {
                        MovieStatus: "Featured"
                    }
                }).then(FeaturedMovies => {
                    booking.findOne({
                        attributes: [[sequelize.fn('sum', sequelize.col('TotalAmount')), 'Earnings']],
                        where: {
                            BookingStatus: "Confirmed"
                        }
                    }).then(Earnings => {
                        booking.findOne({
                            attributes: [[sequelize.fn('count', sequelize.col('UserName')), 'Pendings']],
                            where: {
                                BookingStatus: "Pending"
                            }
                        }).then(PendingMovies => {
                            visitors.findOne({
                                attributes: ["VisitorCount"],
                                where: {
                                    id: 1
                                }
                            }).then(VisitorCount => {
                                res.render("admin/dashBoard", { usersData: usersData, RunningMovies: RunningMovies, FeaturedMovies: FeaturedMovies, Earnings: Earnings, PendingMovies: PendingMovies, VisitorCount: VisitorCount, Name: name, Admin: admin });
                            }).catch((error) => {
                                console.error('Failed to retrieve data : ', error);
                            });
                        }).catch((error) => {
                            console.error('Failed to retrieve data : ', error);
                        });
                    }).catch((error) => {
                        console.error('Failed to retrieve data : ', error);
                    });
                }).catch((error) => {
                    console.error('Failed to retrieve data : ', error);
                });
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

const displayGenerateReport = (req, res) => {
    let admin = "";
    const name = req.session.admin.username;
    name == "Dawood_Usman" ? admin = "Admin 1.0" : admin = "Admin 2.0";

    //select MovieName, ShowDate, ShowTime, TotalAmount as TicketPrice, count(MovieID)As TotalTickets, sum(TotalAmount)As TotalAmount from bookings group by MovieID; 
    sequelize.sync().then(() => {
        booking.findAll({
            attributes: ['MovieName', 'ShowDate', 'ShowTime', ['TotalAmount', 'TicketPrice'], [sequelize.fn('count', sequelize.col('MovieID')), 'BookedSeats'], [sequelize.fn('sum', sequelize.col('TotalAmount')), 'TotalAmount']],
            group: ["MovieID"],
            where: {
                BookingStatus: "Confirmed",
            }
        }).then(paymentDetails => {
            res.render("admin/generateReport", { paymentDetails: paymentDetails, Name: name, Admin: admin });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
}

const generateReport = (req, res) => {

    sequelize.sync().then(() => {
        booking.findAll({
            attributes: ['MovieName', 'ShowDate', 'ShowTime', ['TotalAmount', 'TicketPrice'], [sequelize.fn('count', sequelize.col('MovieID')), 'BookedSeats'], [sequelize.fn('sum', sequelize.col('TotalAmount')), 'TotalAmount']],
            group: ["MovieID"],
            where: {
                BookingStatus: "Confirmed",
            }
        }).then(paymentDetails => {
            res.render(
                "admin/moviesReport",
                {
                    paymentDetails: paymentDetails
                },
                function (err, html) {
                    pdf
                        .create(html, options)
                        .toFile("CenflixReports/MovieDetail.pdf", function (err, result) {
                            if (err) return console.log("nikal jaa ", err);
                            else {
                                var allMoviesPdf = fs.readFileSync("CenflixReports/MovieDetail.pdf");
                                var Report = fs.readFileSync("mail/mailBody.html");
                                res.header("content-type", "application/pdf");
                                res.send(allMoviesPdf);
                                transporter.sendMail({
                                    from: '"Cenflix" <yourscenflix@gmail.com>',
                                    to: "dawoodusman370@gmail.com",
                                    subject: "Cenflix Report",
                                    text: "Hello world?",
                                    html: Report,
                                    attachments: [
                                        {
                                            filename: 'MovieDetail.pdf',
                                            path: path.join(__dirname, "../CenflixReports/MovieDetail.pdf")
                                        }]
                                });
                            }
                        });
                }
            );
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });

    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });

}

module.exports = {
    SignIn,
    displayDashBoard,
    displayUIAccordingly,
    displayCustomers,
    displayFeedBack,
    addMovie,
    uploadSlider,
    displayRunningMovies,
    DisplayEditMovie,
    displayPendingMovies,
    displayRunningMoviesBookings,
    displayFeaturedMoviesBookings,
    displayMoviesHistory,
    displayPaymentDetails,
    displayGenerateReport,
    generateReport,
    EditMovie,
    featuredMovie,
    confirmBooking,
    deleteBooking,
    logOut
}