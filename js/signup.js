var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onerror = function (event) {
  console.log("error: ");
};

request.onsuccess = function (event) {
  db = request.result;
};

function add() {
  var emailadd = document.getElementById("email").value;
  var passwordadd = document.getElementById("password").value;
  var personalurl = document.getElementById("personalurl").value;
  var yob = document.getElementById("yob").value;
  var gender = document.getElementById("gender").value;
  var comments = document.getElementById("comments").value;
  const cb = document.getElementById("agree");
  console.log("check box value");
  console.log(cb.checked);

  if (!emailadd || emailadd == "") {
    alert("enter the email id, it is mandatory");
    return false;
  }
  if (!passwordadd || passwordadd == "") {
    alert("enter the password, it is mandatory");
    return false;
  }
  if (!yob || yob == "") {
    alert("enter the year of birth, it is mandatory");
    return false;
  }
  if (!gender || gender == "") {
    alert("enter the gender field details, it is mandatory");
    return false;
  }
  if (!cb.checked) {
    alert("Please agree and tick the checkbox");
    return false;
  }

  var request = db
    .transaction(["employee"], "readwrite")
    .objectStore("employee")
    .add({
      id: emailadd,
      email: emailadd,
      password: passwordadd,
      age: 25,
      isAdmin: false,
    });

  request.onsuccess = function (event) {
    alert("User has been added to your database.");
  };

  request.onerror = function (event) {
    alert("Unable to add data\r\nUser is aready exist in your database! ");
  };
}

function read() {
  var transaction = db.transaction(["employee"]);
  var objectStore = transaction.objectStore("employee");
  var request = objectStore.get("00-03");

  request.onerror = function (event) {
    alert("Unable to retrieve daa from database!");
  };

  request.onsuccess = function (event) {
    // Do something with the request.result!
    if (request.result) {
      alert(
        "Name: " +
          request.result.name +
          ", Age: " +
          request.result.age +
          ", Email: " +
          request.result.email
      );
    } else {
      alert("Kenny couldn't be found in your database!");
    }
  };
}
