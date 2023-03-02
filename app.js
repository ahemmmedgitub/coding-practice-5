const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();

const dbpath = path.join(__dirname, "moviesData.db");

let db = null;

const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server is running on http://localhost");
    });
  } catch (e) {
    console.log(`server error ${e.message}`);
    process.exit(1);
  }
};

intializeDbAndServer();

const camToSnakeCase = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

// GET METHOD
app.get("/movies/", async (request, response) => {
  const movieNames = `
        SELECT  
            movie_name 
        FROM 
            movie;
    `;
  const dbResponse = await db.all(movieNames);
  response.send(
    dbResponse.map((eachMovie) => {
      return { movieName: eachMovie.movie_name };
    })
  );
});

// POST METHOD

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieDetails = `
        INSERT INTO 
            movie (director_id, movie_name, lead_actor)
        VALUES(
            '${directorId}',
            '${movieName}',
            '${leadActor}'
        )
    `;
  const dbResponse = await db.run(addMovieDetails);
  const movieId = dbResponse.movie_id;
  response.send("Movie Successfully Added");
});

// GET METHOD
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieQuery = `
    SELECT 
        * 
    FROM 
        movie 
    WHERE 
        movie_id = ${movieId};
  `;
  const movieDetails = await db.get(movieQuery);
  response.send(camToSnakeCase(movieDetails));
});

//PUT Method

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const moveDetails = request.body;
  const { directorId, movieName, leadActor } = moveDetails;
  const putQueryDetails = `
    UPDATE 
        movie 
    SET 
        director_id = '${directorId}',
        movie_name = '${movieName}',
        lead_actor = '${leadActor}'
    WHERE 
        movie_id = ${movieId} 

  `;
  await db.run(putQueryDetails);
  response.send("Movie Details Updated");
});
// Delete Method

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `
        DELETE FROM 
            movie 
        WHERE 
            movie_id = ${movieId};
    `;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});

module.exports = app;
