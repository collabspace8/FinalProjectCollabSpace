document.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();

  const tableBody = document.getElementById("propertyTableBody");
  tableBody.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("view-workspace")) {
      const propertyId = e.target.getAttribute("data-id");
      const address =
        e.target.getAttribute("data-address") || "No address provided";
      document.querySelector(
        ".property-header h3 span"
      ).textContent = `${address}`;
      document.querySelector(".property-header h3 span").style.color = "red";

      fetchWorkspaceDetails(propertyId);
    }
  });

  // EVENT LISTENER FOR SEARCH BUTTON
  document.getElementById("searchBtn").addEventListener("click", function () {
    const address = document.getElementById("address").value.trim();
    const neighborhood = document.getElementById("neighborhood").value;
    const squarefeet = document.getElementById("squarefeet").value;
    const parking = document.getElementById("parking").value;
    const publictranspo = document.getElementById("publictranspo").value;
    const capacity = document.getElementById("capacity").value;
    const smoking = document.getElementById("smoking").value;
    const dateavailable = document.getElementById("dateavailable").value;
    const term = document.getElementById("term").value;
    const price = document.getElementById("price").value;

    const searchCriteria = {
      address,
      neighborhood,
      squarefeet,
      parking,
      publictranspo,
      capacity,
      smoking,
      dateavailable,
      term,
      price,
    };

    // Clear previous search results and messages
    document.getElementById("propertyTableBody").innerHTML = "";
    document.getElementById("searchBtn");
    document.getElementById("clearFiltersBtn");
    // document.getElementById("sortButton");

    fetchSearchResults(searchCriteria);
  });

  function fetchSearchResults(criteria) {
    const queryParams = new URLSearchParams();

    for (const key in criteria) {
      if (criteria[key]) {
        queryParams.append(key, criteria[key]);
      }
    }

    fetch(`/search-properties?${queryParams}`)
      .then((response) => response.json())
      .then((properties) => {
        if (properties && properties.length > 0) {
          populatePropertyTable(properties);
        } else {
          // Show no results message or clear table
          document.getElementById("propertyTableBody").innerHTML =
            '<tr><td colspan="7" style="text-align: center;">No property found.</td></tr>';
        }
      })
      .catch((error) => console.error("Failed to fetch properties:", error));
  }

  function populatePropertyTable(properties) {
    const tableBody = document.getElementById("propertyTableBody");
    tableBody.innerHTML = "";

    properties.forEach((property) => {
      let row = `<tr>
          <td>${property.address}</td>
          <td>${property.neighborhood}</td>
          <td>${property.squarefeet}</td>
          <td>${property.parking}</td>
          <td>${property.publicTranspo}</td>
          <td>
              <button class="view-workspace" data-id="${
                property._id
              }" data-address="${
        property.address || ""
      }">View Workspace</button>
          </td>
        </tr>`;
      tableBody.innerHTML += row;
    });

    // Add event listeners to all 'View Workspace' buttons
    document.querySelectorAll(".view-workspace").forEach((button) => {
      button.addEventListener("click", function () {
        const propertyId = this.getAttribute("data-id");
        const searchCriteria = getSearchCriteria(); // You need to call this function to get the criteria
        fetchWorkspaceDetails(propertyId, searchCriteria); // Pass the criteria to the function
      });
    });
  }

  function fetchWorkspaceDetails(propertyId, searchCriteria) {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    fetch(`/api/properties/${propertyId}/workspaces?${queryParams}`)
      .then((response) => response.json())
      .then((workspaces) => {
        const workspaceBody = document.getElementById("workspaceTableBody");
        workspaceBody.innerHTML = "";
        if (workspaces.length === 0) {
          workspaceBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No workspace found based on the search criteria.</td></tr>`;
        } else {
          workspaces.forEach((workspace) => {
            let workspaceRow = `<tr>
                        <td>${workspace.type}</td>
                        <td>${workspace.capacity}</td>
                        <td>${workspace.smoking}</td>
                        <td>${workspace.available}</td>
                        <td>${workspace.term}</td>
                        <td>${workspace.price}</td>
                        <td>${workspace.imageURL || "No image"}</td>
                        <td>${workspace.contactInfo}</td>
                    </tr>`;
            workspaceBody.innerHTML += workspaceRow;
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch workspace details:", error);
        workspaceBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Error fetching workspace details.</td></tr>`;
      });
  }

  document
    .getElementById("clearFiltersBtn")
    .addEventListener("click", function () {
      // Clear input fields
      document.getElementById("address").value = "";
      document.getElementById("neighborhood").selectedIndex = 0;
      document.getElementById("squarefeet").value = "";
      document.getElementById("parking").selectedIndex = 0;
      document.getElementById("publictranspo").selectedIndex = 0;
      document.getElementById("capacity").value = "";
      document.getElementById("smoking").value = "";
      document.getElementById("dateavailable").value = "";
      document.getElementById("term").value = "";
      document.getElementById("price").value = "";

      document.getElementById("propertyTableBody").innerHTML = "";
      document.getElementById("workspaceTableBody").innerHTML = "";
      document.getElementById("searchMessage").style.display = "none";
      document.querySelector(".property-header h3 span").textContent = "";
    });

  function getSearchCriteria() {
    return {
      capacity: document.getElementById("capacity").value,
      smoking: document.getElementById("smoking").value, // Assuming this is an <input> or <select>
      dateavailable: document.getElementById("dateavailable").value,
      term: document.getElementById("term").value, // This should match the dropdown for lease term
      price: document.getElementById("price").value,
    };
  }

  // Function for Log Out Button
  document.getElementById("logoutBtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });
});
