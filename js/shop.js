var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onsuccess = function (event) {
  console.log("connection success");
  db = request.result;
  countDisplayCartItems();
  loadCategoryDatas();
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
      var rnd = randomIntFromInterval(1, 5);
      var randomImg = "./images/category" + rnd + ".png";
      tbody +=
        " <div class='cook-card_item'>" +
        "<div class='cook-card_inner'>" +
        "<img src='" +
        randomImg +
        "' alt='' />" +
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
      var rnd = randomIntFromInterval(1, 7);
      var randomImg = "./images/prod" + rnd + ".png";
      tbody +=
        " <div class='cook-card_item'>" +
        "<div class='cook-card_inner'>" +
        "<img src='" +
        randomImg +
        "' alt='' />" +
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
      //alert("Item exist on the cart");
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
      //  alert("this product is new to cart");

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
        countDisplayCartItems();
      };
      request.onerror = function (event) {
        alert(
          "Unable to add data\rCategory is aready exist in your database! "
        );
      };
    }
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

function searchFor() {
  var results = [];
  var toSearch = document.getElementById("search_id").value;
  console.log(toSearch); // trim it
  var transaction = db.transaction(["products"], "readonly");
  console.log("here came");
  var objectStore = transaction.objectStore("products");
  var reqObjStore = objectStore.getAll();
  console.log("request" + reqObjStore);

  reqObjStore.onsuccess = function (event) {
    var prodArray = reqObjStore.result;
    console.log("get option");
    console.log(prodArray);
    var tbody = "";
    var select = document.getElementById("product_listing_id");

    for (var i = 0; i < prodArray.length; i++) {
      for (var key in prodArray[i]) {
        console.log("product names");
        //console.log(key);
        console.log(prodArray[i]["product_name"]);
        //var searcKey = prodArray[i][key].toLowerCase();
        if (
          prodArray[i][key].toLowerCase().indexOf(toSearch.toLowerCase()) != -1
        ) {
          if (!itemExists(results, prodArray[i])) results.push(prodArray[i]);
        }
      }
    }
    results.forEach(function (eachObj) {
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

function compareObjects(o1, o2) {
  var k = "";
  for (k in o1) if (o1[k] != o2[k]) return false;
  for (k in o2) if (o1[k] != o2[k]) return false;
  return true;
}

function itemExists(haystack, needle) {
  for (var i = 0; i < haystack.length; i++)
    if (compareObjects(haystack[i], needle)) return true;
  return false;
}
