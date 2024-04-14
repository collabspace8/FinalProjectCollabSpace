document.addEventListener("DOMContentLoaded", () => {
  const workspaceTableBody = document.getElementById("workspaceBody");
  const workspaceForm = document.getElementById("workspaceForm");

  // Function to append new data to the existing table
  const appendData = (newWorkspace) => {
    const newRow = document.createElement("tr");
    newRow.dataset.workspaceId = newWorkspace.workspaceId; // Set data attribute for workspace ID

    // Populate the new row with data from the newWorkspace object
    newRow.innerHTML = `
      <td>${newWorkspace.propertyId}</td>
      <td>${newWorkspace.workspaceId}</td>
      <td>${newWorkspace.type}</td>
      <td>${newWorkspace.capacity}</td>
      <td>${newWorkspace.smoking}</td>
      <td>${newWorkspace.available}</td>
      <td>${newWorkspace.term}</td>
      <td>${newWorkspace.price}</td>
      <td>
        <button class="spaceeditBtn">Edit</button>
        <button class="spacedeleteBtn">Delete</button>
      </td>
    `;
    workspaceTableBody.appendChild(newRow);

    // Add event listener for edit button click
    newRow.querySelector(".spaceeditBtn").addEventListener("click", () => {
      editWorkspace(newWorkspace);
    });

    // Add event listener for delete button click
    newRow.querySelector(".spacedeleteBtn").addEventListener("click", () => {
      deleteWorkspace(newWorkspace.workspaceId);
    });
  };

  // Handle form submission
   document.getElementById("saveWorkspaceBtn")?.addEventListener("click", async () => {
    try {
      event.preventDefault();

    // Retrieve input values from the form
    const propertyId = document.getElementById("propertyId").value; // Get property ID
    const type = document.getElementById("type").value;
    const capacity = document.getElementById("capacity").value;
    const smoking = document.getElementById("smoking").value;
    const available = document.getElementById("available").value;
    const term = document.getElementById("term").value;
    const price = document.getElementById("price").value;
    const email = document.getElementById("contactInfo").value;
    const imageFile = document.getElementById("image").files[0];

   

      if (!imageFile) {
        alert("Please select an image file.");
        return;
      }

      // Construct a FormData object to send the image file along with other form data
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      formData.append("type", type);
      formData.append("capacity", capacity);
      formData.append("smoking", smoking);
      formData.append("available", available);
      formData.append("term", term);
      formData.append("price", price);
      formData.append("contactInfo", email);
      formData.append("image", imageFile); // Append the image file to the FormData object

      const response = await fetch("/add-workspace", {
        method: "POST",
        body: formData, // Send FormData instead of JSON.stringify(newWorkspace)
      });

      if (response.ok) {
        // Retrieve inserted workspace data from the response
        const insertedWorkspace = await response.json();

        // Append the new workspace to the table
        appendData(insertedWorkspace);

        // Clear form fields
        workspaceForm.reset();
        window.location.href = "owner-property.html";
      } else {
        console.error('Failed to add workspace:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding workspace:', error);
    }
  });

  // Function to handle editing an existing workspace
  const editWorkspace = (workspace) => {
  
    console.log("Editing workspace:", workspace);
  };

  // Function to handle deleting an existing workspace
  const deleteWorkspace = async (workspaceId) => {
    try {
      // Send a DELETE request to delete the workspace
      const response = await fetch(`/workspaces/${workspaceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the workspace from the table
        const workspaceRow = document.querySelector(`#workspaceBody tr[data-workspace-id="${workspaceId}"]`);
        if (workspaceRow) {
          workspaceRow.remove();
        }
      } else {
        console.error('Failed to delete workspace:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  // Handle save button click
  document.getElementById("saveWorkspaceBtn")?.addEventListener("click", () => {
    window.location.href = "owner-property.html";
  });

  // Handle back button click
  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "owner-property.html";
  });

  // Retrieve property ID from URL parameters and set it in the form
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get("propertyId");
  document.getElementById("propertyId").value = propertyId;
});
