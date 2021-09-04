const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const notes = require("./db/db.json")
const fs = require("fs");
const util = require("util");
const uuid = require("./helpers/uuid");



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) => {
    return res.json(notes);
});

app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
  
    if (req.body) {
      const newTask = {
        title,
        text,
        id: uuid()
      };
  
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        }
        else {
          const parsedTasks = JSON.parse(data);
  
          parsedTasks.push(newTask);
  
          fs.writeFile("./db/db.json", JSON.stringify(parsedTasks, null, 4),
          (writeErr) => writeErr ? console.log(writeErr) : console.log("Review updated successfully")
          );
        }
      });
  
      const response = {
        status: "success",
        body: newTask
      };
      console.log(response);
      res.status(201).json(response);
    }
    else {
      res.status(500).json("Error in posting review")
    }
  });

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () =>
  console.log(`The app is listening at http://localhost:${PORT}`)
);