document.addEventListener("DOMContentLoaded", async () => {
  const workspaceTableBody = document.getElementById("workspaceBody");
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");
  let workspaceIdToDelete = null;

  // Function to fetch workspace data from the backend API
  const fetchWorkspaceData = async () => {
    try {
      // Fetch workspace data from the backend using the propertyId from URL
      const propertyId = getPropertyIdFromUrl();
      const response = await fetch(`http://localhost:3000/properties/${propertyId}/workspaces`);
      if (!response.ok) {
        throw new Error("Failed to fetch workspace data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      return [];
    }
  };

  // Function to append data to the table
  const appendData = async () => {
    try {
      // Fetch workspace data from the backend
      const workspaceData = await fetchWorkspaceData();

      // Clear previous data
      workspaceTableBody.innerHTML = "";

      // Append data to the table
      workspaceData.forEach((workspace) => {
        appendRow(workspace);
      });
    } catch (error) {
      console.error("Error appending data:", error);
    }
  };

  // Function to append a single row to the table
  const appendRow = (workspace) => {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>${workspace.type}</td>
      <td>${workspace.capacity}</td>
      <td>${workspace.smoking}</td>
      <td>${workspace.available}</td>
      <td>${workspace.term}</td>
      <td>${workspace.price}</td>
      <td><img src="${workspace.imageURL}" alt="Workspace Image" style="width: 100px; height: auto;"></td>
      <td>
        <button class="editWorkspaceBtn" data-workspace-id="${workspace._id}">Edit</button>
        <button class="deleteBtn" data-workspace-id="${workspace._id}">Delete</button>
      </td>
    `;
    workspaceTableBody.appendChild(newRow);

    // Attach click event handlers for buttons
    const editButton = newRow.querySelector(".editWorkspaceBtn");
    editButton.addEventListener("click", () => {
      const workspaceId = editButton.getAttribute("data-workspace-id");
      window.location.href = `edit-workspace.html?workspaceId=${workspaceId}`;
    });

    const deleteButton = newRow.querySelector(".deleteBtn");
    deleteButton.addEventListener("click", () => {
      workspaceIdToDelete = workspace._id;
      confirmationModal.style.display = "block";
    });
  };

// Event listener for the confirm delete button
confirmDeleteBtn.addEventListener("click", async () => {
  if (workspaceIdToDelete) {
    try {
      // Send a DELETE request to the backend API to delete the workspace
      const response = await fetch(`http://localhost:3000/workspaces/${workspaceIdToDelete}`, {
        method: "DELETE",
      });

      // Check if the deletion was successful
      if (response.ok) {
        // Select the button related to this workspaceId
        const deleteBtnForWorkspace = document.querySelector(`button.deleteBtn[data-workspace-id="${workspaceIdToDelete}"]`);
        // Move up two levels to select the <tr> and remove it
        if (deleteBtnForWorkspace) {
          deleteBtnForWorkspace.closest("tr").remove();
        }
        console.log("Workspace deleted successfully");
      } else {
        console.error("Failed to delete workspace:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
    } finally {
        confirmationModal.style.display = "none";
        workspaceIdToDelete = null;
    }
  }
});


  // Event listener for the cancel delete button
  cancelDeleteBtn.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    workspaceIdToDelete = null;
  });

  // Initial data append
  await appendData();
});

// Function to extract propertyId from URL query parameters
const getPropertyIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('propertyId');
  if (!propertyId) {
    console.error('PropertyId not found in URL query parameters');
  }
  return propertyId;
};
