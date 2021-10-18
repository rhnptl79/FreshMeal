var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onsuccess = function (event) {
  console.log("connection success");
  db = request.result;
  loadCartItems();
  countDisplayCartItems();
};

// Array.prototype.sum = function (prop) {
//   var total = 0;
//   for (var i = 0, _len = this.length; i < _len; i++) {
//     var pp = this[i][prop];
//     total += Number(pp);
//   }
//   return total;
// };

function loadCartItems() {
  var transaction = db.transaction(["cart"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("cart");
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
    var select = document.getElementById("cart_table_body");
    //alert("total Amount" + total);
    var grandTotal = 0;
    userwise_result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        "<tr id=" +
        eachObj.cart_id +
        "><td>" +
        eachObj.prod_name +
        "</td> <td>" +
        eachObj.prod_price +
        "</td>" +
        "<td>" +
        eachObj.count +
        "</td>" +
        "<td>" +
        eachObj.count * Number(eachObj.prod_price).toFixed(2) +
        "</td>" +
        "</tr>";
      var val = eachObj.count * Number(eachObj.prod_price);
      grandTotal += val;
    });
    var tax = 0;
    tbody +=
      "<tr class='total-cart-row'><td></td><td></td><td>Discount</td><td>" +
      tax.toFixed(2) +
      "</td></tr> " +
      "<tr class='total-cart-row'><td></td><td></td><td>Tax</td><td>" +
      tax.toFixed(2) +
      "</td></tr> " +
      "<tr class='total-cart-row'><td></td><td></td><td>Total</td><td>" +
      grandTotal.toFixed(2) +
      "</td></tr> ";
    select.innerHTML = tbody;
  };
}
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function CheckOutItem() {
  alert("Your Order Placing - Inprogress");
  AddToOrder();
  // console.log("cart array");
  // console.log(cartArray);
  // var cartTotal = 0;
  // var productArray = [];
  // cartArray.forEach(function (eachObj) {
  //   console.log(eachObj);
  //   var cartObj = {
  //     prod_name: eachObj.prod_name,
  //     prod_price: eachObj.prod_price,
  //     prod_id: eachObj.prod_id,
  //     prod_count: eachObj.count,
  //   };
  //   productArray.push(cartObj);
  //   var val = eachObj.count * Number(eachObj.prod_price);
  //   cartTotal += val;
  // });
}

function AddToOrder() {
  var transaction = db.transaction(["cart"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("cart");
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

    var cartTotal = 0;
    var productArray = [];
    userwise_result.forEach(function (eachObj) {
      console.log(eachObj);
      var cartObj = {
        prod_name: eachObj.prod_name,
        prod_price: eachObj.prod_price,
        prod_id: eachObj.prod_id,
        prod_count: eachObj.count,
      };
      productArray.push(cartObj);
      var val = eachObj.count * Number(eachObj.prod_price);
      cartTotal += val;
    });

    /**
     * Place the order , and add to Order DB
     */
    console.log("product array");
    console.log(productArray);
    var orderStat = "success";
    var orderId = randomIntFromInterval(200000, 999999);
    console.log(orderId);
    var requestOrder = db
      .transaction(["orders"], "readwrite")
      .objectStore("orders")
      .add({
        user_id: localStorage.getItem("user_id"),
        order_id: orderId,
        orderItems: productArray,
        orderTotal: cartTotal,
        orderStatus: orderStat,
        orderDate: new Date().toISOString().split("T")[0],
      });

    requestOrder.onsuccess = function (event) {
      /**remove items from cart */
      userwise_result.forEach(function (eachObj) {
        db.transaction(["cart"], "readwrite")
          .objectStore("cart")
          .delete(eachObj.cart_id);
        console.log("deleted items" + eachObj.cart_id);
      });
      document.getElementById("cart_table_body").innerHTML =
        "<h3>Your Order Placed</h4>";
      setTimeout(alert("Your Order Placed Successfully.."), 6000);
      //setTimeout(window.location.reload(), 5000);
    };

    requestOrder.onerror = function (event) {
      alert("Unable to place the order , please re-try");
    };
  };
}

function countDisplayCartItems() {
  var transaction = db.transaction(["cart"], "readonly");
  console.log("counting");
  var objectStore = transaction.objectStore("cart");
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
    var select = document.getElementById("cartCountDisplay");
    //alert("total Amount" + total);
    var grandTotal = 0;
    var countOfItems = 0;
    userwise_result.forEach(function (eachObj) {
      console.log(eachObj);
      var subcount = eachObj.count * 1;
      countOfItems += subcount;
      var val = eachObj.count * Number(eachObj.prod_price);
      grandTotal += val;
    });
    console.log("count" + countOfItems + "  Total" + grandTotal);
    tbody = "" + countOfItems + " Items - ($" + grandTotal.toFixed(2) + ")";
    select.innerHTML = tbody;
  };
}
