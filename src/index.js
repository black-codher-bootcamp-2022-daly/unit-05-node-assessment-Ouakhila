require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const currentDate = new Date();
const todoFilePath = process.env.BASE_JSON_PATH;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });
});

/// GET todos/:id

//Add GET request with path '/todos/overdue'

app.get("/todos/overdue", (req, res) => {
  let overdueArray = [];
  const todosData = JSON.parse(fs.readFileSync(__dirname + todoFilePath));

  console.log(todosData);
  todosData.forEach(checkingDates);

  function checkingDates(overduedates) {
    if (
      new Date(overduedates.due) < currentDate &&
      overduedates.completed === false
    ) {
      return overdueArray.push(overduedates);
    } else {
      return overdueArray;
    }
  }
  console.log(overdueArray);
  res.header("Content-Type", "application/json");

  res.send(JSON.stringify(overdueArray, null, 2));
});

//Add GET request with path '/todos/completed'

app.get("/todos/completed", (req, res) => {
  const todosData = JSON.parse(fs.readFileSync(__dirname + todoFilePath));

  console.log(todosData);

  let list = todosData.filter(completedTask);

  function completedTask(taskCompleted) {
    if (taskCompleted.completed === true) {
      return taskCompleted.completed === true;
    }
  }

  res.header("Content-Type", "application/json");
  console.log(list);
  res.send(JSON.stringify(list, null, 2));
});

app.get("/todos/:id", (req, res) => {
  const todosId = req.params.id;
  const todosData = JSON.parse(fs.readFileSync(__dirname + todoFilePath));
  if (todosData.find((element) => element.id == todosId)) {
    res.send(
      JSON.stringify(
        todosData.find((element) => element.id == todosId),
        null,
        2
      )
    );
  } else {
    res.status(404).end();
  }
});

//Add POST request with path '/todos'
app.post("/todos", (req, res) => {
  let todosData = JSON.parse(fs.readFileSync(__dirname + todoFilePath));

  const name = req.body.name;
  const due = req.body.due;

  // try {
  if (name != null || due != null) {
    console.log("great");
    todosData.push({
      id: uuidv4(),
      name,
      created: currentDate,
      due,
      completed: false,
    });
    console.log(req.body);
    console.log(todosData);

    todosData = JSON.stringify(todosData, null, 2);
    // console.log(todosData);
    fs.writeFile(__dirname + todoFilePath, todosData, (err) => {
      if (!err) {
        const message = "create";
        res.status(201).end();
      } else {
        const message = "Unable to post ";
        res.send(message);
      }
    });
  }
  // catch (error) {
  else {
    const message = "invalid";
    res.status(400).end();
    // }
    // }
    // catch (error) {
    // }
  }
});

//Add PATCH request with path '/todos/:id

app.patch("/todos/:id", (req, res) => {
  const name = req.body.name;
  const due = req.body.due;
  var id = req.params.id;
  let todosData = JSON.parse(fs.readFileSync(__dirname + todoFilePath));

  let foundID = todosData.find((todo) => todo.id == id);
  console.log(foundID);
  if (foundID) {
    if (name) {
      foundID.name = name;
    }
    if (due) foundID.due = due;
    console.log(foundID);
  }

  fs.writeFileSync(__dirname + todoFilePath, JSON.stringify(todosData));
  // res.json(todosData);
  const message = " done";
  res.status(200).send(message).end();
});
//Add POST request with path '/todos/:id/complete

app.post("/todos/:id/complete", (req, res) => {
  var id = req.params.id;

  let todo = JSON.parse(fs.readFileSync(__dirname + todoFilePath));
  const index = todo.find((el) => el.id == id);
  console.log(index);
  if (!index) {
    const message = "id not found";
    res.status(404).send(message);
  } else {
    if (index) {
      if (index.completed != null) index.completed = true;

      fs.writeFile(
        __dirname + todoFilePath,
        JSON.stringify(todo, null, 2),
        (err) => {
          if (err) {
            res.send("try again");
          } else {
            const message = " great";
            res.status(200).end();
          }
        }
      );
    }
  }
});

//Add POST request with path '/todos/:id/undo

app.post("/todos/:id/undo", (req, res) => {
  var id = req.params.id;
  // let completed = req.body.completed;
  let todo = JSON.parse(fs.readFileSync(__dirname + todoFilePath));
  const index = todo.find((el) => el.id == id);
  console.log(index);
  if (!index) {
    const message = "id not found";
    res.status(404).send(message);
  } else {
    if (index) {
      if (index.completed != null) index.completed = false;

      fs.writeFile(
        __dirname + todoFilePath,
        JSON.stringify(todo, null, 2),
        (err) => {
          if (err) {
            res.send("try again");
          } else {
            const message = " great";
            res.status(200).end();
          }
        }
      );
    }
  }
});

//Add DELETE request with path '/todos/:id
app.delete("/todos/:id", (req, res) => {
  let todosData = JSON.parse(fs.readFileSync(__dirname + todoFilePath));
  var id = req.params.id;

  const index = todosData.find((el) => el.id == id);
  todosData = todosData.filter((todo) => todo.id != id);
  console.log(todosData);
  if (!index) {
    const message = "id not found";
    res.status(404).send(message);
  } else {
    fs.writeFile(
      __dirname + todoFilePath,
      JSON.stringify(todosData, null, 2),
      (err) => {
        if (err) {
          res.status(404);
        } else {
          const message = "deleted";
          res.status(200).end();
        }
      }
    );
  }
});

module.exports = app;
