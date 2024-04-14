document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editForm");

  // Get the property ID from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get("propertyId");

  // Fetch property details from the database
  fetchPropertyDetails(propertyId);

  async function fetchPropertyDetails(propertyId) {
    try {
      const response = await fetch(`http://localhost:3000/properties/${propertyId}`);
      const propertyData = await response.json();
      
      // Populate form fields with the retrieved data
      populateFormFields(propertyData);
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  }

  // Function to populate form fields with property data
  function populateFormFields(propertyData) {
    document.getElementById("propertyId").value = propertyData.propertyId; // Use _id from the database
    document.getElementById("address").value = propertyData.address;
    document.getElementById("neighborhood").value = propertyData.neighborhood;
    document.getElementById("squarefeet").value = propertyData.squarefeet;
    document.getElementById("parking").value = propertyData.parking;
    document.getElementById("publicTranspo").value = propertyData.publicTranspo;
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      // Collect updated property data from the form
      const updatedProperty = {
        address: form.address.value,
        neighborhood: form.neighborhood.value,
        squarefeet: form.squarefeet.value,
        parking: form.parking.value,
        publicTranspo: form.publicTranspo.value
      };

      // Send updated property data to the backend API to update in the database
      const response = await fetch(`http://localhost:3000/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProperty)
      });

      // Check if the update was successful
      if (response.ok) {
        console.log("Property updated successfully");
        // Redirect to the owner-property.html page
        window.location.href = "owner-property.html";
      } else {
        // Log error message if update fails
        console.error("Failed to update property:", response.statusText);
      }
    } catch (error) {
      // Log any errors that occur during the update process
      console.error("Error updating property:", error);
    }
  });

  // Handle back button click
  document.getElementById("backEdit").addEventListener("click", () => {
    // Redirect to the owner-property.html page
    window.location.href = "owner-property.html";
  });
});
