document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");
  const successMessageElement = document.getElementById("success-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Collect form data
    const formData = {
      fullname: form.querySelector("#fullname").value,
      phone: form.querySelector("#phone").value,
      email: form.querySelector("#email").value,
      role: form.querySelector("#role").value,
      username: form.querySelector("#username").value,
      password: form.querySelector("#password").value,
    };

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((data) => {
        console.log("Registration successful:", data);
        console.log("Registration successful:", formData);
        // Start countdown from 5 seconds
        let countdown = 5;
        successMessageElement.textContent = `Registration successful! Redirecting in ${countdown} seconds...`;
        successMessageElement.style.display = "block";

        // Update the countdown every second
        const intervalId = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(intervalId);
            window.location.href = "login.html"; // Redirect
          } else {
            successMessageElement.textContent = `Registration successful! Redirecting in ${countdown} seconds...`;
          }
        }, 10000);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        successMessageElement.textContent =
          "Registration failed. Please try again.";
        successMessageElement.style.color = "red";
        successMessageElement.style.display = "block";
      });

    form.reset();
  });
});
