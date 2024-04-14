document.addEventListener("DOMContentLoaded", () => {
  const propertyTableBody = document.getElementById("propertyBody");
  const propertyForm = document.getElementById("propertyForm");

  // Function to append new data to the existing table
  const appendData = (newProperty) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${newProperty.propertyId}</td>
      <td>${newProperty.address}</td>
      <td>${newProperty.neighborhood}</td>
      <td>${newProperty.squarefeet}</td>
      <td>${newProperty.parking}</td>
      <td>${newProperty.publicTranspo}</td>
      <td>
        <button class="editPropertyBtn" data-property-id="${newProperty.propertyId}">Edit</button>
        <button class="deleteBtn" data-property-id="${newProperty.propertyId}">Delete</button>
        <button class="detailBtn" onclick="location.href='add-workspace.html'">Add Workspace</button>
        <button class="detailBtn" onclick="location.href='owner-workspace.html'">View Workspace</button>
      </td>
    `;
    propertyTableBody.appendChild(newRow);
  };

  // Handle form submission
  propertyForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Retrieve input values from the form
    const address = document.getElementById("address").value;
    const neighborhood = document.getElementById("neighborhood").value;
    const squarefeet = parseInt(document.getElementById("squarefeet").value);
    const parking = document.getElementById("parking").value;
    const publicTranspo = document.getElementById("publicTranspo").value;

    // Construct a new property object
    const newProperty = {
      address: address,
      neighborhood: neighborhood,
      squarefeet: squarefeet,
      parking: parking,
      publicTranspo: publicTranspo,
    };

    try {
      // Send POST request to backend API endpoint
      const response = await fetch("/add-property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProperty),
      });

      if (!response.ok) {
        throw new Error("Failed to add property");
      }

      const responseData = await response.json();
      appendData(responseData.result);
      propertyForm.reset();
    } catch (error) {
      console.error("Error:", error);
      // Handle error here
    }
  });

  // Handle save button click
  document.getElementById("savePropertyBtn").addEventListener("click", () => {
    window.location.href = "owner-property.html";
  });

  // Handle back button click
  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "owner-property.html";
  });

  // Handle add button click
  document.getElementById("addPropertyBtn").addEventListener("click", () => {
    window.location.href = "add-property.html";
  });

});
