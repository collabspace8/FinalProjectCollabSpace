document.addEventListener('DOMContentLoaded', function() {
    const workspaceData = [
      {
        propertyId: 1,
        workspaceId: 1,
        type: "Office Room",
        capacity: 15,
        smoking: "No",
        availableDate: "2024-04-30",
        leaseTerm: "Monthly",
        price: "2000",
        contactInfo: "owner2@email.com",
        rating: 4.5,
        imageURL: "img/workspace1.jpg",
      },
      {
        propertyId: 1,
        workspaceId: 2,
        type: "Meeting Room",
        capacity: 10,
        smoking: "Yes",
        availableDate: "2024-04-22",
        leaseTerm: "Weekly",
        price: "1500",
        contactInfo: "owner1@email.com",
        rating: 4.2,
        imageURL: "img/workspace2.jpg",
      },
    ];

    function populateTable() {
        const tableBody = document.getElementById('workSpaceTable');
        workspaceData.forEach((item) => {
            const row = tableBody.insertRow();
            const html = `
                <td>${item.propertyId}</td>
                <td>${item.workspaceId}</td>
                <td>${item.type}</td>
                <td>${item.capacity}</td>
                <td>${item.smoking}</td>
                <td>${item.availableDate}</td>
                <td>${item.leaseTerm}</td>
                <td>${item.price}</td>
                <td>${item.contactInfo}</td>
                <td><img src="${item.imageURL}" alt="Workspace Image" style="width: 100px;"></td>
                <td>${item.rating}</td>
            `;
            row.innerHTML = html;
        });
    }

    populateTable();

    // function setupRateButtonListeners() {
    //     const rateButtons = document.querySelectorAll('.rateButton');
    //     const closeRateModal = document.getElementById('closeRateModal');

    //     rateButtons.forEach(button => {
    //         button.addEventListener('click', function() {
    //             const workspaceId = this.getAttribute('data-id');
                
    //             const rateModal = document.getElementById('rateModal');
                
    //             document.getElementById('workspaceIdInput').value = workspaceId;
    //             rateModal.style.display = 'block';

    //             closeRateModal.addEventListener('click', function() {
    //                 rateModal.style.display = 'none'; // Hide the modal when clicked
    //             });

    //         });
    //     });
    // }

   // setupRateButtonListeners();
});


document.getElementById("logoutBtn").addEventListener("click", function() {
    window.location.href = "index.html"; 
  });
  