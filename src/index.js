require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();

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
  // res.status(501).end();
});

app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });

  // res.status(501).end();
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

  // res.header("Content-Type", "application/json");
  //   fs.readFileSync(path.join(__dirname, "/models/todos.json/overdue"))
  //   // res.status(501).end();
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

  // res.header("Content-Type", "application/json");

  // fs.readFileSync(path.join(__dirname, "/models/todos.json/completed"));

  //   // res.status(501).end();
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
  const todosData = JSON.parse(fs.readFileSync(__dirname + todoFilePath));
  var name,
    due = req.body;

  if (currentDate.due <= currentDate) {
    todosData.push({
      id: uuidv4(),
      name,
      created: currentDate,
      due,
      completed: false,
    });

    todosData = JSON.stringify(todosData, null, 2);
    fs.writeFile(__dirname + todoFilePath, todosData, (err) => {
      if (err) {
        const message = "Unable to post ";
        res.send(message);
      } else {
        const message = "create";
        res.status(201).send(message).end();
      }
    });
  } else {
    const message = " date is invalid";
    res.status(400).send(message).end();
  }
});

//Add PATCH request with path '/todos/:id
// app.put("/todos/:id", (request, response) => {
//   var id = request.params.id;
//   if (todos[id]) {
//     var updatedTodo = JSON.parse(request.body);
//     todos[id] = updatedTodo;
//     response.status(204).send();
//   } else {
//     response.status(404, "The task is not found").send();
//   }
// });

//Add POST request with path '/todos/:id/complete

//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id
// app.delete("/todos/:id", (req, resp) => {
//   const todosData = JSON.parse(fs.readFileSync(_dirname + todoFilePath));
//   var id = parseInt(req.params.id);
//   if (todosData.filter((todo) => todo.id == id).length !== 0) {
//     todosData = todosData.filter((todo) => todo.id !== id);
//     resp.status(200).send();
//   } else {
//     resp.status(404).send();
//   }
// });

module.exports = app;
