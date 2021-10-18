//prefixes of implementation that we want to test
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;
window.IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

const categoryData = [
  { cat_id: "100", name: "Juices" },
  {
    cat_id: "101",
    name: "Breads",
  },
  { cat_id: "102", name: "Pizzas" },

  { cat_id: "103", name: "Burgers" },

  { cat_id: "104", name: "Chinese" },
];

const productData = [
  {
    cat_id: "101",
    price: "600",
    prod_id: "1001",
    product_name: "Chappathi",
  },
  { cat_id: "101", price: "600", prod_id: "1007", product_name: "Porotta" },
  { cat_id: "100", price: "900", prod_id: "1006", product_name: "Lime Juice" },
  {
    cat_id: "100",
    price: "200",
    prod_id: "1005",
    product_name: "Orange Juice",
  },
  { cat_id: "102", price: "1300", prod_id: "1008", product_name: "Veg Pizza" },
  { cat_id: "103", price: "700", prod_id: "1009", product_name: "Veg Burger" },
  {
    cat_id: "104",
    price: "1200",
    prod_id: "1011",
    product_name: "Chinese Cutlet",
  },
];

const adminData = [
  {
    id: "1001",
    name: "superadmin",
    age: 35,
    email: "superadmin@gmail.com",
    password: "1234",
    isAdmin: true,
  },
];
var db;
var request = window.indexedDB.open("ekartDatabaseNew", 7);

request.onerror = function (event) {
  console.log("error: ");
};

request.onsuccess = function (event) {
  db = request.result;
};

request.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStoreCategory = db.createObjectStore("category", {
    keyPath: "cat_id",
  });

  var objectStoreProducts = db.createObjectStore("products", {
    keyPath: "prod_id",
  });
  var objectStoreCart = db.createObjectStore("cart", {
    keyPath: "cart_id",
  });
  var objectStoreOrders = db.createObjectStore("orders", {
    keyPath: "order_id",
  });
  var objectStore = db.createObjectStore("employee", { keyPath: "email" });

  for (var i in adminData) {
    console.log("adminData[=>> added]");
    console.log(adminData[i]);
    objectStore.add(adminData[i]);
  }
  for (var i in categoryData) {
    console.log("categoryData[=>> added]");
    console.log(categoryData[i]);
    objectStoreCategory.add(categoryData[i]);
  }
  for (var i in productData) {
    console.log("productData[=>> added]");
    console.log(productData[i]);
    objectStoreProducts.add(productData[i]);
  }
};
