function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function validateLogin() {
  // Get the values from the form
  var login = document.getElementById("login").value;
  var password = document.getElementById("psw").value;

  // Define valid credentials for each role
  var users = {
      "editor": { login: "editor", password: "editorpass", redirect: "editor-main.html" },
      "writer": { login: "writer", password: "writerpass", redirect: "writer-main.html" },
      "admin": { login: "admin", password: "adminpass", redirect: "admin-main.html" },
      "reviewer": { login: "reviewer", password: "reviewerpass", redirect: "reviewer-main.html" }
  };

  // Check if the login and password match any of the users
  for (var role in users) {
      if (users[role].login === login && users[role].password === password) {
          window.location.href = users[role].redirect; // Redirect to the corresponding page
          return;
      }
  }

  // If no match is found, alert the user
  alert("Invalid login or password");
}

function logout() {
  // Optionally, clear any session storage or cookies if necessary
  window.location.href = "index.html"; // Redirect to the main page (index.html)
}

function toggleCollapse(elementId, button) {
    const collapseElements = document.querySelectorAll('.multi-collapse');
    
    
    collapseElements.forEach(el => {
      if (el.id !== elementId) {
        const collapseInstance = new bootstrap.Collapse(el, {
          toggle: false
        });
        collapseInstance.hide();
      }
    });
  
    
    const selectedElement = document.getElementById(elementId);
    const rect = button.getBoundingClientRect(); 
    selectedElement.style.top = `${rect.bottom + window.scrollY}px`; 
  
    const selectedInstance = new bootstrap.Collapse(selectedElement, {
      toggle: false
    });
    selectedInstance.toggle();
  }
  

