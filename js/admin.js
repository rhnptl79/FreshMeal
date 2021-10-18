var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onerror = function (event) {
  console.log("error: ");
};

request.onsuccess = function (event) {
  console.log("connection success");
  db = request.result;

  var transaction = db.transaction(["category"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("category");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);

  reqObjStore.onsuccess = function (event) {
    var result = reqObjStore.result;
    console.log("get option");
    console.log(result);
    var option = "";
    var select = document.getElementById("category_select");

    result.forEach(function (eachObj) {
      console.log(eachObj);
      option +=
        "<option value='" + eachObj.cat_id + "'> " + eachObj.name + "</option>";
    });

    select.innerHTML = option;
  };

  getListOfItems();
};

/**
 * For adding categories
 */
function addCategory() {
  var id = randomIntFromInterval(103, 999);
  var cat_name = document.getElementById("category_name").value;

  var request = db
    .transaction(["category"], "readwrite")
    .objectStore("category")
    .add({ cat_id: "" + id, name: cat_name });

  request.onsuccess = function (event) {
    alert("Category has been added to your database.");
  };

  request.onerror = function (event) {
    alert("Unable to add data\rCategory is aready exist in your database! ");
  };
}

/**
 * For adding products
 */
function addProducts() {
  var id = randomIntFromInterval(1010, 9999);
  var name = document.getElementById("product_name").value;
  var price = document.getElementById("product_price").value;
  var cat_id = document.getElementById("category_select").value;
  var request = db
    .transaction(["products"], "readwrite")
    .objectStore("products")
    .add({
      prod_id: "" + id,
      product_name: name,
      price: price,
      cat_id: cat_id,
    });

  request.onsuccess = function (event) {
    alert("Product has been added to your database.");
  };

  request.onerror = function (event) {
    alert("Unable to add data\rProduct is aready exist in your database! ");
  };
}

function getAllProducts() {
  var transaction = db.transaction(["products"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("products");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);

  reqObjStore.onsuccess = function (event) {
    var result = reqObjStore.result;
    console.log(result);
    var tbody = "";
    var select = document.getElementById("product_table_body");

    result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        "<tr id=" +
        eachObj.prod_id +
        "><td>" +
        eachObj.product_name +
        "</td> <td>" +
        eachObj.price +
        "</td> <td> <button onclick='RemoveProduct(" +
        eachObj.prod_id +
        ")'> Remove</button> </td></tr>";
    });

    select.innerHTML = tbody;
  };
}

function getAllCategories() {
  var transaction = db.transaction(["category"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("category");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);

  reqObjStore.onsuccess = function (event) {
    var result = reqObjStore.result;
    console.log("get option");
    console.log(result);
    var tbody = "";
    var select = document.getElementById("category_table_body");

    result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        "<tr id=" +
        eachObj.cat_id +
        "> <td>" +
        eachObj.cat_id +
        "</td> <td>" +
        eachObj.name +
        "</td> <td> <button onclick='RemoveCategory(" +
        eachObj.cat_id +
        ")'> Remove</button> </td></tr>";
    });

    select.innerHTML = tbody;
  };
}

function getAllOrders() {
  var transaction = db.transaction(["orders"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("orders");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);

  reqObjStore.onsuccess = function (event) {
    var result = reqObjStore.result;
    console.log(result);
    var tbody = "";
    var select = document.getElementById("customer_table_body");

    result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        "<tr id=" +
        eachObj.user_id +
        "><td>" +
        eachObj.user_id +
        "</td><td>" +
        eachObj.orderDate +
        "</td> <td>" +
        eachObj.order_id +
        "</td> <td> <input type='text' style='width: 100px;' id='stat" +
        eachObj.order_id +
        "' value='" +
        eachObj.orderStatus +
        "'></input></td> <td>" +
        eachObj.orderTotal +
        "</td> <td> <button onclick='updateOrderStatus(" +
        eachObj.order_id +
        ")'>Edit Status</button></td></tr>";
    });

    select.innerHTML = tbody;
  };
}

function updateOrderStatus(id) {
  var transaction = db.transaction(["orders"]);
  var objectStore = transaction.objectStore("orders");
  alert("order id" + id);
  var orderStat = document.getElementById("stat" + id).value;
  var reqCartAll = objectStore.get(id);

  reqCartAll.onerror = function (event) {
    alert("Unable to retrieve daa from database!");
  };

  reqCartAll.onsuccess = function (event) {
    if (reqCartAll.result) {
      var res = reqCartAll.result;
      console.log(res);
      alert(res.order_id);
      res.orderStatus = orderStat;
      alert(res.orderStatus);
      var request = db
        .transaction(["orders"], "readwrite")
        .objectStore("orders")
        .put(res);
    }

    request.onsuccess = function (event) {
      alert("Updated the Order Status");
      window.location.reload();
    };
    request.onerror = function (event) {
      alert("Unable to update the status! ");
    };
  };
}

function getSalesByCondition() {
  var transaction = db.transaction(["orders"], "readonly");
  var objectStore = transaction.objectStore("orders");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);

  reqObjStore.onsuccess = function (event) {
    var result = reqObjStore.result;
    console.log(result);
    var tbody = "";
    var select = document.getElementById("sales_table_body");
    var salesTotal = 0;
    result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        "<tr id=" +
        eachObj.user_id +
        "><td>" +
        eachObj.orderDate +
        "</td><td>" +
        eachObj.user_id +
        "</td> <td>" +
        eachObj.order_id +
        "</td> <td>" +
        eachObj.orderTotal +
        "</td></tr>";

      salesTotal += eachObj.orderTotal;
    });
    tbody +=
      "<tr class='total-cart-row'><td></td><td></td><td>Total Sales</td><td>" +
      salesTotal.toFixed(2) +
      "</td></tr> ";
    select.innerHTML = tbody;
  };
}

function RemoveProduct(product_id) {
  alert("Deleted the Product");
  var transaction = db.transaction(["products"], "readwrite");
  var objectStore = transaction.objectStore("products");
  objectStore.delete("" + product_id);
  getAllProducts();
}

function RemoveCategory(category_id) {
  alert("Deleted the Category");
  var transaction = db.transaction(["category"], "readwrite");
  var objectStore = transaction.objectStore("category");
  objectStore.delete("" + category_id);
  getAllCategories();
}

function getListOfItems() {
  getSalesByCondition();
  getAllOrders();
  getAllProducts();
  getAllCategories();
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
