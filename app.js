const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();

const dbpath = path.join(__dirname, "moviesData.db");

let db = null;

const intializeDbAndServer = async () => {
  try {
    db = open({
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

// GET METHOD
app.get("/movies/", async (request, response) => {
  const movieNames = `
        SELECT 
            * 
        FROM 
            movie 
        ORDER 
            movie_name;
    `;
  const dbResponse = await db.all(movieNames);
  response.send(dbResponse);
});
