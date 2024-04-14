document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", LoginBtn);

  function LoginBtn() {
    var username = document.getElementById("login-user").value;
    var password = document.getElementById("login-password").value;
    console.log("username", username);
    console.log("password", password);

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        console.log("username", username);
        console.log("password", password);
        if (!response.ok) {
          console.log("username", username);
          console.log("password", password);
          throw new Error("Invalid username or password");
        }
        return response.json();
      })
      .then((data) => {
        // Redirect based on user role
        console.log("data", data);

        if (data && data.user) {
          if (data.user.role === "owner") {
            window.location.href = "owner-property.html";
          } else if (data.user.role === "co-worker") {
            window.location.href = "coworker.html";
          }
        } else {
          throw new Error("User not found");
        }
      })
      .catch((error) => {
        const errorMessage = document.getElementById("login-error-message");
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";
      });
  }
});
