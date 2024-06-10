document.addEventListener('DOMContentLoaded', (event) => {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      var response = JSON.parse(xhttp.response);
      var email = response.email;
      var role = response.role;
      if (email != undefined){
          document.querySelector('nav ul:nth-of-type(2)').remove();
          const navBar = document.querySelector('nav');

          const userDropdownDiv = document.createElement('div');
          userDropdownDiv.classList.add("dropdown");

          const dropdownBtn = document.createElement('a');
          dropdownBtn.classList.add("dropbtn");
          dropdownBtn.textContent = email;

          const dropdownContentDiv = document.createElement('div');
          dropdownContentDiv.classList.add("dropdown-content");

          const logoutBtn = document.createElement('a');
          logoutBtn.classList.add("dropdown-content");
          logoutBtn.href = "/users/logout";
          logoutBtn.textContent = "Logout";

          dropdownContentDiv.append(logoutBtn);
          userDropdownDiv.append(dropdownBtn);
          userDropdownDiv.append(dropdownContentDiv);
          navBar.append(userDropdownDiv);


          if (role == "Admin" || role == "Manager"){
            const buttonListLeft = document.querySelector('nav ul');
            const newLi2 = document.createElement('li');
            const newButton2 = document.createElement('a');
            if (role == "Admin"){
              newButton2.href = '/admin';
              newButton2.textContent = 'Admin';
            }
            if (role == "Manager"){
              newButton2.href = '/management';
              newButton2.textContent = 'Management';
            }
            newLi2.appendChild(newButton2);
            buttonListLeft.appendChild(newLi2);
          }
      }
    }
  };

  xhttp.open("GET", "/users/whoami", true);
  xhttp.send();
}
);