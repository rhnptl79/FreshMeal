var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onsuccess = function (event) {
  console.log("connection success");
  db = request.result;
  loadOrderedItems();
};

// Array.prototype.sum = function (prop) {
//   var total = 0;
//   for (var i = 0, _len = this.length; i < _len; i++) {
//     var pp = this[i][prop];
//     total += Number(pp);
//   }
//   return total;
// };

function loadOrderedItems() {
  var transaction = db.transaction(["orders"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("orders");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);
  var userid = localStorage.getItem("user_id");
  var userwise_result = [];
  reqObjStore.onsuccess = function (event) {
    var result = reqObjStore.result;
    userwise_result = result.filter((obj) => {
      return obj.user_id == userid;
    });
    console.log(userwise_result);

    var tbody = "";
    var select = document.getElementById("order_table_body");
    //alert("total Amount" + total);
    var grandTotal = 0;
    userwise_result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        "<tr id=" +
        eachObj.order_id +
        "><td>" +
        eachObj.order_id +
        "</td> <td>" +
        eachObj.orderDate +
        "</td>" +
        "<td>" +
        eachObj.orderTotal +
        "</td>" +
        "<td>" +
        eachObj.orderStatus +
        "</td>" +
        "</tr>";
    });
    var tax = 0;
    tbody +=
      "<tr class=''><td></td><td></td><td>User</td><td>" +
      localStorage.getItem("user_id") +
      "</td></tr> ";
    select.innerHTML = tbody;
  };
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
