function showMenu(role) {

    document.getElementById('writerMenu').style.display = 'none';
    document.getElementById('editorMenu').style.display = 'none';
    document.getElementById('reviewerMenu').style.display = 'none';
    document.getElementById('adminMenu').style.display = 'none';

    if (role === 'writer') {
        document.getElementById('writerMenu').style.display = 'flex';
    } else if (role === 'editor') {
        document.getElementById('editorMenu').style.display = 'flex';
    } else if (role === 'reviewer') {
        document.getElementById('reviewerMenu').style.display = 'flex';
    } else if (role === 'admin') {
        document.getElementById('adminMenu').style.display = 'flex';
    }
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
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
  

