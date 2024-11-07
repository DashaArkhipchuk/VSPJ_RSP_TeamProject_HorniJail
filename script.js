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


showMenu('writer');


