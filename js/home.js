// copy of shop.js -> customize for home
var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onsuccess = function (event) {
  console.log("connection success");
  db = request.result;
  //loadCategoryDatas();
  loadProductDatas();
};
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function loadCategoryDatas() {
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
    var select = document.getElementById("category_listing_id");

    result.forEach(function (eachObj) {
      console.log(eachObj);
      tbody +=
        " <div class='cook-card_item'>" +
        "<div class='cook-card_inner'>" +
        "<img src='./images/plate-1.png' alt='' />" +
        "<div class='cook-role_name'>" +
        eachObj.name +
        "</div>" +
        "<div class='flex justify-center product_cart'>" +
        "<button onclick='GetCategoryWiseProducts(" +
        eachObj.cat_id +
        ")'>View Products</button>" +
        "</div>" +
        "</div>" +
        "</div>";
    });

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

function GetCategoryWiseProducts(cat_id) {
  var transaction = db.transaction(["products"]);
  var objectStore = transaction.objectStore("products");
  var request = objectStore.getAll();

  console.log("category wise listing" + cat_id);
  request.onerror = function (event) {
    alert("Unable to retrieve daa from database!");
  };

  var categorywise_result = [];
  request.onsuccess = function (event) {
    var arrayRes = request.result;
    console.log(arrayRes);
    categorywise_result = arrayRes.filter((obj) => {
      return obj.cat_id == cat_id;
    });
    console.log("categorywise_result []");
    console.log(categorywise_result);

    var tbody = "";
    var select = document.getElementById("product_listing_id");

    categorywise_result.forEach(function (eachObj) {
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
  document.getElementById("product_listing_id").scrollIntoView();
}

/**
 * Add to cart
 */
function AddToCart(productId) {
  var user = localStorage.getItem("user_id");
  if (user != null) {
    // alert("addeding to cart " + productId);
    addProductsToCart(productId, user);
  } else {
    alert("Please Login to Continue");
    window.location.href = "login.html";
  }
}

function addProductsToCart(productId, user) {
  console.log("product details");

  var transaction = db.transaction(["products"], "readwrite");
  var objectStore = transaction.objectStore("products");
  var request = objectStore.get("" + productId);

  request.onerror = function (event) {
    alert("Unable to retrieve daa from database!");
  };
  request.onsuccess = function (event) {
    // Do something with the request.result!
    console.log("request");
    console.log(request);
    if (request.result) {
      // alert("prod avail");
      // alert(request.result.prod_id);
      // alert(request.result.price);
      console.log(request.result);
      addToCartDatabaseTable(request.result, user);
    }
  };
}

function addToCartDatabaseTable(prod_details, user) {
  const rndInt = randomIntFromInterval(10000, 99999);

  var transaction = db.transaction(["cart"]);
  var objectStore = transaction.objectStore("cart");
  var reqCartAll = objectStore.getAll();
  reqCartAll.onerror = function (event) {
    alert("Unable to retrieve product details from cart");
  };

  var cart_details = [];
  reqCartAll.onsuccess = function (event) {
    var arrayRes = reqCartAll.result;
    console.log(arrayRes);
    cart_details = arrayRes.filter((obj) => {
      return obj.prod_id == prod_details.prod_id;
    });
    if (cart_details.length > 0) {
      alert("Item exist on the cart");
      console.log("cart_details prod object");
      var cartObject = cart_details[0];
      cartObject.count += 1;
      console.log(cartObject);

      var request = db
        .transaction(["cart"], "readwrite")
        .objectStore("cart")
        .put(cartObject);
      request.onsuccess = function (event) {
        alert("Added to Cart");
      };
      request.onerror = function (event) {
        alert(
          "Unable to add data\rCategory is aready exist in your database! "
        );
      };
    } else {
      //new Item
      alert("this product is new to cart");

      var request = db
        .transaction(["cart"], "readwrite")
        .objectStore("cart")
        .add({
          cart_id: rndInt,
          prod_id: prod_details.prod_id,
          prod_price: prod_details.price,
          prod_name: prod_details.product_name,
          user_id: user,
          count: 1,
        });
      request.onsuccess = function (event) {
        alert("Added to Cart");
      };
      request.onerror = function (event) {
        alert(
          "Unable to add data\rCategory is aready exist in your database! "
        );
      };
    }
  };
}
