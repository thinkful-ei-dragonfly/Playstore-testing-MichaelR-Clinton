/* eslint-disable strict */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
let playstore = require("./playstore");

const app = express();

app.use(morgan("common"));
app.use(cors());

// console.log('im in the file');

// do get
app.get("/apps", (req, res) => {
  const { sort, genres } = req.query;
  console.log();
  // sort the list by either rating or app, any other value results in an error, 
  // if no value provided do not perform a sort.
  console.log(sort);
  if (sort) {
    if (sort === 'rating') {
      // console.log('made it into rating=sort but not sort function');
      playstore.sort( (a, b) => {
        // console.log('i made it to sort rating');
        // console.log(playstore);
        return a.Rating - b.Rating;
      } );
    } else if (sort === 'app') {
      playstore.sort( (a, b) => {
        return a.App > b.App ? 1 : -1;
      });
    } else {
      res.status(400).send('invalid sort category, please enter rating or app');
      // send failure response status
    }
  }

  let arrPlaystore;
  // If present the value must be one of the list otherwise an error 
  // is returned. Filter the list by the given value.
  if (genres) {
    if ( ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card' ].includes(genres) ) {
      playstore = playstore.filter(application => {
        return application.Genres.includes(genres);
      });
    } else {
      res.status(400).send('please enter a valid genre');
    }
  }
  // console.log()

  // arrPlaystore = JSON.stringify(playstore);

  // const arrPlaystore = playstore.json();

  res.status(200).json(playstore);
});

app.listen(8080, () => console.log('listening on 8080'));

module.exports = app;