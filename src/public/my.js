import { application } from "express";
import fetch from "node-fetch";
const fetch = require("node-fetch");

let rsss = await fetch("http://localhost:8080/todos", {
  method: "GET", // POST, PUT, DELETE, etc.
  Accept: application / json,
  headers: {
    // the content type header value is usually auto-set
    // depending on the request body
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    response.json();
  })
  .then((data) => console.log(data));

//   .then((err) => console.log(err));

// fetch("http://localhost:8080/todos")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
// {
//   method: "GET",
//   headers: {
//     Accept: "application/json",
//   },
// })
//   .then(function (response) {
//     return response.json();
//   })
//   .then((response) => console.log(JSON.stringify(response)))
//   .then(function (todolist) {
//     let placeholder = document.querySelector("#data-output");
//     let out = "";
//     for (let list of todolist) {
//       out += (
//         <tr>
//           <td>${list.name}</td>
//           <td>${list.created}</td>
//           <td>${list.due}</td>
//           <td>${list.completed}</td>
//         </tr>
//       );
//     }
//     placeholder.innerHTML = out;
//});
