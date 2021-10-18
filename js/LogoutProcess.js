function Logout() {
  localStorage.removeItem("user_id");
  alert("You have logged out Successfully");
  window.location.href = "index.html";
}
