// //prefixes of implementation that we want to test
// window.indexedDB =
//   window.indexedDB ||
//   window.mozIndexedDB ||
//   window.webkitIndexedDB ||
//   window.msIndexedDB;

// //prefixes of window.IDB objects
// window.IDBTransaction =
//   window.IDBTransaction ||
//   window.webkitIDBTransaction ||
//   window.msIDBTransaction;
// window.IDBKeyRange =
//   window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// if (!window.indexedDB) {
//   window.alert("Your browser doesn't support a stable version of IndexedDB.");
// }

// const employeeData = [
//   { id: "00-01", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
//   { id: "00-02", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" },
// ];
// var db;
// var request = window.indexedDB.open("ekartDatabaseNew", 1);

// request.onerror = function (event) {
//   console.log("error: ");
// };

// request.onsuccess = function (event) {
//   db = request.result;
// };

// request.onupgradeneeded = function (event) {
//   var db = event.target.result;
//   var objectStore = db.createObjectStore("employee", { keyPath: "email" });

//   for (var i in employeeData) {
//     objectStore.add(employeeData[i]);
//   }
// };

var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onerror = function (event) {
  console.log("error: ");
};

request.onsuccess = function (event) {
  console.log("connection success");
  db = request.result;
};

function login() {
  var emailadd = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var transaction = db.transaction(["employee"]);
  var objectStore = transaction.objectStore("employee");
  var request = objectStore.get(emailadd);

  request.onerror = function (event) {
    alert("Unable to retrieve daa from database!");
  };
  request.onsuccess = function (event) {
    // Do something with the request.result!
    if (request.result) {
      if (
        request.result.email == emailadd &&
        request.result.password == password &&
        request.result.isAdmin
      ) {
        alert("admin login success");
        localStorage.setItem("user_id", emailadd);
        window.location.href = "admin.html";
      } else if (
        request.result.email == emailadd &&
        request.result.password == password
      ) {
        alert("user login success");
        localStorage.setItem("user_id", emailadd);
        window.location.href = "index.html";
      } else {
        alert("Password Incorrect");
      }
    } else {
      alert("Email address not found.");
    }
  };
}

function read() {}
