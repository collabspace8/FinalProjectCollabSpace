document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("editForm");

  // Get the workspace ID from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const workspaceId = urlParams.get("workspaceId");
 
  // Fetch workspace details from the database and populate form fields
  if (workspaceId) {
    await fetchWorkspaceDetails(workspaceId);
  }

  // Function to fetch workspace details
  async function fetchWorkspaceDetails(workspaceId) {
    try {
      const response = await fetch(`http://localhost:3000/workspaces/${workspaceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workspace details");
      }
      const workspaceData = await response.json();
      populateFormFields(workspaceData);

      // Set the propertyId value in the hidden input field
      const propertyId = urlParams.get("propertyId");
      if (!propertyId) {
        console.error("PropertyId not found in URL query parameters");
        return;
      }
      document.getElementById("propertyId").value = propertyId;
    } catch (error) {
      console.error("Error fetching workspace details:", error);
    }
  }

  // Function to populate form fields with workspace data
  function populateFormFields(workspaceData) {
    document.getElementById("workspaceId").value = workspaceData.workspaceId; // Assuming workspace ID is stored under workspaceId key
    document.getElementById("type").value = workspaceData.type;
    document.getElementById("capacity").value = workspaceData.capacity;
    document.getElementById("smoking").value = workspaceData.smoking;
    document.getElementById("available").value = workspaceData.available;
    document.getElementById("term").value = workspaceData.term;
    document.getElementById("price").value = workspaceData.price;
    document.getElementById("contactInfo").value = workspaceData.contactInfo;
    const propertyId = urlParams.get("propertyId");
    document.getElementById("propertyId").value = propertyId;
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      // Collect updated workspace data from the form
      const updatedWorkspace = {
        type: form.type.value,
        capacity: form.capacity.value,
        smoking: form.smoking.value,
        available: form.available.value,
        term: form.term.value,
        price: form.price.value,
        contactInfo: form.contactInfo.value
      };

      // Send updated workspace data to the backend API to update in the database
      const response = await fetch(`http://localhost:3000/workspaces/${workspaceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedWorkspace)
      });

      // Check if the update was successful
      if (response.ok) {
        console.log("Workspace updated successfully");
        // Redirect to the owner-workspace.html page
        window.location.href = `owner-property.html`;
      } else {
        // Log error message if update fails
        console.error("Failed to update workspace:", response.statusText);
      }
    } catch (error) {
      // Log any errors that occur during the update process
      console.error("Error updating workspace:", error);
    }
  });

  // Handle back button click
  const propertyId = urlParams.get("propertyId");
  document.getElementById("backEdit").addEventListener("click", () => {
    if (propertyId) {
      // Redirect to the owner-workspace.html page with propertyId included
      window.location.href = `owner-workspace.html?propertyId=${propertyId}`;
    } else {
      // Redirect to the owner-workspace.html page without propertyId
      window.location.href = `owner-property.html`;
    }
  });
});
