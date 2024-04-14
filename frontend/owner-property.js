document.addEventListener("DOMContentLoaded", () => {
  const propertyTableBody = document.getElementById("propertyBody");
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");
  let propertyIdToDelete = null;

  // Function to fetch property data from the backend API
  const fetchPropertyData = async () => {
    try {
      const response = await fetch("http://localhost:3000/properties");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching property data:", error);
      return [];
    }
  };

  // Function to append data to the table
  const appendData = async () => {
    try {
      // Fetch property data from the backend
      const propertyData = await fetchPropertyData();

      // Clear previous data
      propertyTableBody.innerHTML = "";

      // Append data to the table
      propertyData.forEach((property) => {
        appendRow(property);
      });
    } catch (error) {
      console.error("Error appending data:", error);
    }
  };

  // Function to append a single row to the table
  const appendRow = (property) => {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>${property.address}</td>
      <td>${property.neighborhood}</td>
      <td>${property.squarefeet}</td>
      <td>${property.parking}</td>
      <td>${property.publicTranspo}</td>
      <td>
        <button class="editPropertyBtn" data-property-id="${property._id}">Edit</button>
        <button class="deleteBtn" data-property-id="${property._id}">Delete</button>
        <button class="addWorkspaceBtn" data-property-id="${property._id}">Add Workspace</button>
        <button class="viewWorkspaceBtn" data-property-id="${property._id}">View Workspace</button>
      </td>
    `;
    propertyTableBody.appendChild(newRow);

    // Attach click event handlers for buttons
    const editButton = newRow.querySelector(".editPropertyBtn");
    editButton.addEventListener("click", () => {
      const propertyId = editButton.getAttribute("data-property-id");
      window.location.href = `edit-property.html?propertyId=${propertyId}`;
    });
  
    // Event listener for the "Add Workspace" button
    const addButton = newRow.querySelector(".addWorkspaceBtn");
    addButton.addEventListener("click", () => {
      const propertyId = addButton.getAttribute("data-property-id");
      window.location.href = `add-workspace.html?propertyId=${propertyId}`;
    });
  
    const viewButton = newRow.querySelector(".viewWorkspaceBtn");
    viewButton.addEventListener("click", () => {
      const propertyId = viewButton.getAttribute("data-property-id");
      window.location.href = `owner-workspace.html?propertyId=${propertyId}`;
    });
  
    const deleteButton = newRow.querySelector(".deleteBtn");
    deleteButton.addEventListener("click", () => {
      propertyIdToDelete = property._id;
      confirmationModal.style.display = "block";
    });
  };

// Event listener for the confirm delete button
confirmDeleteBtn.addEventListener("click", async () => {
  if (propertyIdToDelete) {
    try {
      // Send a DELETE request to the backend API to delete the property
      const response = await fetch(`http://localhost:3000/properties/${propertyIdToDelete}`, {
        method: "DELETE",
      });

      // Check if the deletion was successful
      if (response.ok) {
        // Select the delete button related to this propertyId
        const deleteBtnForProperty = document.querySelector(`button.deleteBtn[data-property-id="${propertyIdToDelete}"]`);
        // Use closest() to find the <tr> ancestor of the delete button and remove it
        if (deleteBtnForProperty) {
          deleteBtnForProperty.closest("tr").remove();
        }
        console.log("Property deleted successfully");
      } else {
        console.error("Failed to delete property:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      confirmationModal.style.display = "none";
      propertyIdToDelete = null;
    }
  }
});



  // Event listener for the cancel delete button
  cancelDeleteBtn.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    propertyIdToDelete = null;
  });

  // Event listener for the add property button
  document.getElementById("addPropertyBtn").addEventListener("click", () => {
    window.location.href = "add-property.html";
  });

  // Initial data append
  appendData();
});
