document.addEventListener('DOMContentLoaded', (event) => {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
        var email = xhttp.response;
        if (email != ""){
            document.querySelector('a.button2').remove();
            document.querySelector('a.button3').remove();
            const buttonList = document.querySelector('nav ul:nth-of-type(2)');
            const newLi = document.createElement('li');
            const newButton = document.createElement('a');
            newButton.textContent = email;
            newLi.appendChild(newButton);
            buttonList.appendChild(newLi);
        }
      }
    };

    xhttp.open("GET", "/users/login-check", true);
    xhttp.send();
  }
);