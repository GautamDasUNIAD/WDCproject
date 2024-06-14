// Function to get a specific cookie value by name
function getCookie(name) {
    let cookieArr = document.cookie.split(";"); // Split document.cookie into an array of cookies
    for (let i = 0; i < cookieArr.length; i++) { // Loop through each cookie
      let cookiePair = cookieArr[i].split("="); // Split each cookie into name and value
      if (name === cookiePair[0].trim()) { // Check if the cookie name matches the given name
        return decodeURIComponent(cookiePair[1]); // Return the cookie value
      }
    }
    return null; // Return null if the cookie is not found
  }

  // Event listener for when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    var selectedOrgId = getCookie('selectedOrgId'); // Get selectedOrgId cookie
    var name = getCookie('first_name'); // Get first_name cookie
    var last_name = getCookie('last_name'); // Get last_name cookie
    var full_name = name + " " + last_name; // Combine first and last name
    var role = getCookie('role'); // Get role cookie

    if (name != undefined) { // If the user is logged in (name is defined)
        document.querySelector('nav ul:nth-of-type(2)').remove(); // Remove the second <ul> element in the nav
        const navBar = document.querySelector('nav'); // Get the nav element

        const userDropdownDiv = document.createElement('div'); // Create a new div for the user dropdown
        userDropdownDiv.classList.add("dropdown"); // Add the "dropdown" class to the div
        userDropdownDiv.innerHTML = `
          <a class="user-dropdown-button">${full_name}</a>
          <div class="dropdown-content">
            <a href="/preferences">Preferences</a>
            <a href="users/logout">Logout</a>
          </div>
        `; // Set the inner HTML of the dropdown div
        navBar.append(userDropdownDiv); // Append the dropdown div to the nav

        if (role == "Admin" || role == "Manager") { // If the user is an Admin or Manager
            const buttonListLeft = document.querySelector('nav ul'); // Get the first <ul> element in the nav
            if (role == "Admin") { // If the user is an Admin
                const newLi2 = document.createElement('li'); // Create a new <li> element
                const newButton2 = document.createElement('a'); // Create a new <a> element
                newButton2.href = '/admin'; // Set the href attribute of the <a> element
                newButton2.textContent = 'Admin'; // Set the text content of the <a> element
                newLi2.appendChild(newButton2); // Append the <a> element to the <li>
                buttonListLeft.appendChild(newLi2); // Append the <li> to the <ul>
            }
            if (role == "Manager") { // If the user is a Manager
                fetch('/updates/manager/organizations') // Fetch the manager's organizations
                    .then(response => response.json()) // Parse the response as JSON
                    .then(managedOrganizations => { // Process the managed organizations
                        if (managedOrganizations.some(obj => obj.id == selectedOrgId)) { // Check if the manager manages the selected organization
                            const newLi2 = document.createElement('li'); // Create a new <li> element
                            const newButton2 = document.createElement('a'); // Create a new <a> element
                            newButton2.href = '/management'; // Set the href attribute of the <a> element
                            newButton2.textContent = 'Management'; // Set the text content of the <a> element
                            newLi2.appendChild(newButton2); // Append the <a> element to the <li>
                            buttonListLeft.appendChild(newLi2); // Append the <li> to the <ul>
                        }
                    })
                    .catch(error => console.error('Error fetching managed organizations:', error)); // Log any errors
            }
        }
    }

    // Fetch and populate the dropdown with organizations
    fetch('/organizations')
        .then(response => response.json()) // Parse the response as JSON
        .then(organizations => { // Process the organizations
            const dropdownContent = document.getElementById('organization-dropdown'); // Get the organization dropdown
            const dropdownButton = document.querySelector('.organizations-dropdown-button'); // Get the organization dropdown button
            const organizationTitle = document.getElementsByClassName("carousel-text")[0]; // Get the organization title element

            organizations.forEach(org => { // Loop through each organization
                if (org.id == selectedOrgId) { // If the organization is the selected organization
                    dropdownButton.textContent = org.name; // Set the dropdown button text to the organization name
                    if (organizationTitle != undefined) { // If the organization title element is defined
                        organizationTitle.textContent = ""; // Clear the organization title text
                    }
                }

                const optionDiv = document.createElement('div'); // Create a new div for the organization option
                optionDiv.dataset.id = org.id; // Set the data-id attribute to the organization id
                optionDiv.textContent = org.name; // Set the text content to the organization name
                optionDiv.classList.add("organizations-dropdown-button"); // Add the "organizations-dropdown-button" class to the div
                optionDiv.addEventListener('click', function() { // Add a click event listener to the div
                    document.cookie = "selectedOrgId=" + org.id + ";"; // Set the selectedOrgId cookie
                    const url = new URL(window.location.href); // Get the current URL
                    window.location.href = url.toString(); // Reload the page
                });
                dropdownContent.appendChild(optionDiv); // Append the organization option to the dropdown
            });

            dropdownButton.addEventListener('click', function() { // Add a click event listener to the dropdown button
                dropdownContent.classList.toggle('show'); // Toggle the dropdown content visibility
            });
        })
        .catch(error => console.error('Error fetching organizations:', error)); // Log any errors
  });
