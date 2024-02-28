const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
uuid = require('uuid');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const Directors = Models.Director;
const Genres = Models.Genre;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });


// Log Requests

app.use(morgan('common'));


// User requests

//Add user

app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users

app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username

app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username

app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) 
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error:" + err);
  })

});

// Add a movie to a user's list of favorites

app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

// Delete favorite movie

app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

// Delete a user by username

app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// GET all movies

app.get('/movies', async (req, res) => {
  await Movies.find()
  .then((movies)=>{
    res.status(201).json(movies);
  })  
  .catch((err) =>{
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET movies by title name

app.get('/movies/:title', async(req, res) => {
  await Movies.findOne({Title: req.params.title})
  .then((movie) =>{
    res.status(201).json(movie)
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

// // GET movie by ID

app.get('/movies/id/:idNumber', async(req, res) => {
  await Movies.findOne({_id: req.params.idNumber})
  .then((movies) => {
    res.status(201).json(movies)
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

// GET genres from movies

app.get('/movies/genre/:genreName', async(req, res) => {
  await Movies.find({genres: req.params.genreName})
  .then((movies) => {
    res.status(201).json(movies)
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

// GET genres

app.get('/genre/:genreName', async(req, res) => {
await Genres.findOne({name: req.params.genreName})
.then((genre) =>{
   res.status(201).json(genre)
})
  .catch((err) =>{
   console.log(err);
   res.send(500).send('Error: ' + err)
  });
});

// GET Directors

app.get('/directors/:directorName', async(req, res) => {
  await Directors.findOne({name: req.params.directorName})
  .then((director) =>{
    res.status(201).json(director)
  })
  .catch((err) =>{
    console.log(err);
    res.send(500).send('Error: ' + err)
  });
});

// Default route

app.get('/', (req, res) => {
  res.send('Welcome to my movie app!  No need to silence your phone!');
});
  
//Static file - Documentation Route

app.use('/documentation', express.static('public', {index: 'documentation.html'}));

// Error Handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Looks Like We Misses Our Mark...Take Two');
 });

 // Listen for Requests

 app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
 });
