function changeProgressBar() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var personalurl = document.getElementById("personalurl").value;
  var yob = document.getElementById("yob").value;
  var gender = document.getElementById("gender").value;
  var comments = document.getElementById("comments").value;

  if (email != "") {
  }
  var elem = document.getElementById("myBar");
  var width = 14.3;
  elem.style.width = width + "%";
  var id = setInterval(frame, 10);
}
function frame() {
  if (width >= 100) {
    clearInterval(id);
  } else {
    width++;
    elem.style.width = width + "%";
    elem.innerHTML = width * 1 + "%";
  }
}
