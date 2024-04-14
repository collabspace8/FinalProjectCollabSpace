function search() {
  window.location.href = "coworker-propertySearch.html";
}

function viewRentedWorkspaceBtn() {
  window.location.href = "viewRentedWorkspace.html";
}

document.addEventListener("DOMContentLoaded", function () {
  populatePropertyTable();
});

function populatePropertyTable() {
  // Make a request to fetch property data from the backend API
  fetch("http://localhost:3000/properties")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch property data");
      }
      return response.json();
    })
    .then((propertyData) => {
      // Once data is fetched, populate the property table
      var propertyTable = document
        .getElementById("propertyTable")
        .getElementsByTagName("tbody")[0];
      propertyTable.innerHTML = ""; // Clear existing data

      if (propertyData.length === 0) {
        console.log("No properties found.");
        return;
      }

      propertyData.forEach(function (property) {
        var row = propertyTable.insertRow();
        row.innerHTML = `
          <td>${property.address}</td>
          <td>${property.neighborhood}</td>
          <td>${property.squarefeet}</td>
          <td>${property.parking}</td>
          <td>${property.publicTranspo}</td>
          <td><button onclick="viewAvailableWorkspaces('${property._id}')">View Available Workspaces</button></td>
        `;
      });
    })
    .catch((error) => {
      console.error("Error fetching property data:", error);
    });
}

function viewAvailableWorkspaces(propertyId) {
  fetch(
    `http://localhost:3000/properties/${encodeURIComponent(
      propertyId
    )}/workspaces`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }
      return response.json();
    })
    .then((workspaceData) => {
      const modal = document.getElementById("workspaceModal");
      const modalContent = modal.getElementsByClassName("modal-content")[0];
      modalContent.innerHTML = ""; // Clear existing data

      const table = document.createElement("table");
      table.classList.add("workspace-table");

      const header = table.createTHead();
      const headerRow = header.insertRow();
      headerRow.innerHTML = `
              <th>Type</th>
              <th>Capacity</th>
              <th>Smoking Allowed</th>
              <th>Available</th>
              <th>Term</th>
              <th>Price</th>
              <th>Contact Info</th>
              <th>Image</th>
          `;

      const body = table.createTBody();
      workspaceData.forEach((workspace) => {
        const row = body.insertRow();
        row.innerHTML = `
                  <td>${workspace.type}</td>
                  <td>${workspace.capacity}</td>
                  <td>${workspace.smoking}</td>
                  <td>${workspace.available}</td>
                  <td>${workspace.term}</td>
                  <td>${workspace.price}</td>
                  <td class="email-cell"><span class="email">${workspace.contactInfo}</span></td>
                  <td><img class="workspace-image" src="${workspace.imageURL}" alt="Workspace Image" style="max-width: 100px; max-height: 100px; cursor: pointer;"></td>
              `;
      });

      modalContent.appendChild(table);
      modal.style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching workspace data:", error);
    });
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  window.location.href = "index.html";
});

function closeModal() {
  document.getElementById("workspaceModal").style.display = "none";
}

// This function will be called when you click outside of the modal
window.onclick = function (event) {
  const modal = document.getElementById("workspaceModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
