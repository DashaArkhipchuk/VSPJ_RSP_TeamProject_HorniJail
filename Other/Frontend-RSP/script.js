function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function validateLogin() {
  var login = document.getElementById("login").value;
  var password = document.getElementById("psw").value;

  var users = {
      "editor": { login: "editor", password: "editorpass", redirect: "editor-main.html" },
      "writer": { login: "writer", password: "writerpass", redirect: "writer-main.html" },
      "admin": { login: "admin", password: "adminpass", redirect: "admin-main.html" },
      "reviewer": { login: "reviewer", password: "reviewerpass", redirect: "reviewer-main.html" }
  };

  for (var role in users) {
      if (users[role].login === login && users[role].password === password) {
          window.location.href = users[role].redirect; 
          return;
      }
  }
  alert("Invalid login or password");
}

function logout() {
  window.location.href = "index.html"; 
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
  

