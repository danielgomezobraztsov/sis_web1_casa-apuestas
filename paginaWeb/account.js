const $ = (id)=>document.getElementById(id);
const fileInput = $('fileInput');
const avatarBox = $('avatarBox');
const avatarImg = $('avatarImg');
const previewBox = $('previewBox');
const previewImg = $('previewImg');
const btnChangePhoto = $('btnChangePhoto');
const form = $('userForm');
const btnCancel = $('btnCancel');
const btnDelete = $('btnDelete');


btnChangePhoto.addEventListener('click', ()=> fileInput.click());

fileInput.addEventListener('change', ()=>{
    const [file] = fileInput.files || [];
    if(!file) return;
    const url = URL.createObjectURL(file);
    avatarImg.src = url;
    previewImg.src = url;
    avatarBox.classList.add('has-image');
    previewBox.classList.add('has-image');
});

btnCancel.addEventListener('click', ()=>{
    form.reset();
    fileInput.value = '';
    avatarImg.removeAttribute('src');
    previewImg.removeAttribute('src');
    avatarBox.classList.remove('has-image');
    previewBox.classList.remove('has-image');
});

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!validUserData()){
        return;
    }
    alert('Información guardada');
    // ...enviar por fetch() a tu backend si aplica...
});

btnDelete.addEventListener('click', ()=>{
    if(confirm('¿Eliminar usuario? Esta acción no se puede deshacer.')){
        alert('Usuario eliminado');
        // ...llamar a tu backend para eliminar...
    }
});

$(document).ready(() => {
/*Validaciones de datos usuario*/
    function validUserData() {
        
        let valid = true;
        //limpiar errores
        $('.error').text('');
        //obtener valores
        const userName = $('#userName').val();
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const date = $('#date');
        const password = $('#password').val().trim();
        
        //validar nombre
        const valNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/
        if (!valNombre.test(firstName)){
            $('#errorFirstName').text('Solo puedes poner tu nombre, 1 palabra y que sean solo letras.');
            valid = false;
        }

        //validar apellido
        const valApellido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)$/;
        if (!valApellido.test(lastName) || lastName.toLowerCase() === firstName.toLowerCase()){
            $('#errorLastName').text('Tu apellido no puede ser igual a tu nombre o contener numeros o simbolos.');
            valid = false;
        }

    }
});