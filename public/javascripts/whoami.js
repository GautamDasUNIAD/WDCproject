function getCookie(name){
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++){
    let cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()){
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

document.addEventListener('DOMContentLoaded', function() {
  var selectedOrgId = getCookie('selectedOrgId');
  var name = getCookie('first_name');
  var last_name = getCookie('last_name');
  var full_name = name + " " + last_name;
  var role = getCookie('role');

  if (name != undefined) {
      document.querySelector('nav ul:nth-of-type(2)').remove();
      const navBar = document.querySelector('nav');

      const userDropdownDiv = document.createElement('div');
      userDropdownDiv.classList.add("dropdown");
      userDropdownDiv.innerHTML = `
        <a class="user-dropdown-button">${full_name}</a>
        <div class="dropdown-content">
          <a href="/preferences">Preferences</a>
          <a href="users/logout">Logout</a>
        </div>
      `;
      navBar.append(userDropdownDiv);

      if (role == "Admin" || role == "Manager") {
          const buttonListLeft = document.querySelector('nav ul');
          if (role == "Admin") {
              const newLi2 = document.createElement('li');
              const newButton2 = document.createElement('a');
              newButton2.href = '/admin';
              newButton2.textContent = 'Admin';
              newLi2.appendChild(newButton2);
              buttonListLeft.appendChild(newLi2);
          }
          if (role == "Manager") {
              fetch('/updates/manager/organizations')
                  .then(response => response.json())
                  .then(managedOrganizations => {
                      if (managedOrganizations.some(obj => obj.id == selectedOrgId)) {
                          const newLi2 = document.createElement('li');
                          const newButton2 = document.createElement('a');
                          newButton2.href = '/management';
                          newButton2.textContent = 'Management';
                          newLi2.appendChild(newButton2);
                          buttonListLeft.appendChild(newLi2);
                      }
                  })
                  .catch(error => console.error('Error fetching managed organizations:', error));
          }
      }
  }

  // Fetch and populate the dropdown with organizations
  fetch('/organizations')
      .then(response => response.json())
      .then(organizations => {
          const dropdownContent = document.getElementById('organization-dropdown');
          const dropdownButton = document.querySelector('.organizations-dropdown-button');
          const organizationTitle = document.getElementsByClassName("carousel-text")[0];

          organizations.forEach(org => {
              if (org.id == selectedOrgId) {
                  dropdownButton.textContent = org.name;
                  if (organizationTitle != undefined) {
                      organizationTitle.textContent = "";
                  }
              }

              const optionDiv = document.createElement('div');
              optionDiv.dataset.id = org.id;
              optionDiv.textContent = org.name;
              optionDiv.classList.add("organizations-dropdown-button");
              optionDiv.addEventListener('click', function() {
                  document.cookie = "selectedOrgId=" + org.id + ";";
                  const url = new URL(window.location.href);
                  window.location.href = url.toString();
              });
              dropdownContent.appendChild(optionDiv);
          });

          dropdownButton.addEventListener('click', function() {
              dropdownContent.classList.toggle('show');
          });
      })
      .catch(error => console.error('Error fetching organizations:', error));
});
