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

document.addEventListener('DOMContentLoaded', (event) => {
  var name = getCookie('first_name');
  var last_name = getCookie('last_name');
  var full_name = name + " " + last_name;
  var role = getCookie('role');
      if (name != undefined){
          document.querySelector('nav ul:nth-of-type(2)').remove();
          const navBar = document.querySelector('nav');

          const userDropdownDiv = document.createElement('div');
          userDropdownDiv.classList.add("dropdown");
          userDropdownDiv.innerHTML = `
            <a class="dropbtn">${full_name}</a>
            <div class="dropdown-content">
              <a href="/preferences">Preferences</a>
              <a href="users/logout">Logout</a>
            </div>
          `;
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
);