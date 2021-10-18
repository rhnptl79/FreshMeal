var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onsuccess = function (event) {
  console.log("connection success");
  db = request.result;
  countDisplayCartItems();
  loadProductDatas();
};

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

function loadProductDatas() {
  var transaction = db.transaction(["products"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("products");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);

  reqObjStore.onsuccess = function (event) {
    var result = reqObjStore.result;
    console.log("get option");
    console.log(result);
    var tbody = "";
    var select = document.getElementById("product_listing_id");
    if (result.length < 1) {
      return false;
    }
    result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        " <div class='cook-card_item'>" +
        "<div class='cook-card_inner'>" +
        "<img src='./images/plate-2.png' alt='' />" +
        "<div class='cook-role_name'>" +
        eachObj.product_name +
        "</div>" +
        "<div class='price text-center'>$" +
        eachObj.price +
        "</div>" +
        "<div class='flex justify-center product_cart'>" +
        "<button onclick='AddToCart(" +
        eachObj.prod_id +
        ")'>Add To Cart</button>" +
        "</div>" +
        "</div>" +
        "</div>";
    });

    select.innerHTML = tbody;
  };
}
