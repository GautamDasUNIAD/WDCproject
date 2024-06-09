document.addEventListener('DOMContentLoaded', (event) => {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
        var response = JSON.parse(xhttp.response);
        var email = response.email;
        var role = response.role;
        if (email != undefined){
            document.querySelector('a.button2').remove();
            document.querySelector('a.button3').remove();
            const buttonListRight = document.querySelector('nav ul:nth-of-type(2)');
            const newLi = document.createElement('li');
            const newButton = document.createElement('a');
            newButton.textContent = email;
            newLi.appendChild(newButton);
            buttonListRight.appendChild(newLi);
            if (role == "Admin"){
              const buttonListLeft = document.querySelector('nav ul');
              const newLi2 = document.createElement('li');
              const newButton2 = document.createElement('a');
              newButton2.href = '/admin';
              newButton2.textContent = 'Admin';
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