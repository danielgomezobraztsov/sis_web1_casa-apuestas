$(document).ready(() => {
    const fileInput = $('#fileInput');
    const avatarBox = $('#avatarBox');
    const avatarImg = $('#avatarImg');
    const btnChangePhoto = $('#btnChangePhoto');
    const form = $('#userForm');
    const btnCancel = $('#btnCancel');
    const btnDelete = $('#btnDelete');

    // Cambiar foto
    btnChangePhoto.on('click', () => fileInput.click());

    fileInput.on('change', () => {
        const file = fileInput[0].files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        avatarImg.attr('src', url);
        avatarBox.addClass('has-image');
    });

    // Cancelar cambios
    btnCancel.on('click', () => {
        form[0].reset();
        fileInput.val('');
        avatarImg.removeAttr('src');
        avatarBox.removeClass('has-image');
        $('.error').text('');
    });

    // Validar datos
    function validUserData() {
        let valid = true;
        $('.error').text(''); // limpiar errores

        const userName = $('#userName').val().trim();
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const date = $('#date').val();

        // Validar nombre
        const valNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
        if (!valNombre.test(firstName)) {
            $('#errorFirstName').text('Solo puedes poner tu nombre (una palabra, solo letras).');
            valid = false;
        }

        // Validar apellido
        const valApellido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/;
        if (!valApellido.test(lastName) || lastName.toLowerCase() === firstName.toLowerCase()) {
            $('#errorLastName').text('Tu apellido no puede ser igual al nombre ni contener números o símbolos.');
            valid = false;
        }

        // Validar nombre de usuario
        if (userName.length < 3) {
            $('#errorUserName').text('El nombre de usuario debe tener al menos 3 caracteres.');
            valid = false;
        }

        // Validar email
        const valEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!valEmail.test(email)) {
            $('#errorEmail').text('Introduce un correo válido.');
            valid = false;
        }

        // Validar contraseña
        if (password.length < 6) {
            $('#errorPassword').text('La contraseña debe tener al menos 6 caracteres.');
            valid = false;
        }

        // Validar fecha (opcional)
        if (!date) {
            $('#errorDate').text('Debes ingresar tu fecha de nacimiento.');
            valid = false;
        } else {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            const adjustedAge = (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ? age - 1 : age;

            if (adjustedAge < 18) {
                $('#errorDate').text('Debes tener al menos 18 años.');
                valid = false;
            }
        }

        return valid;
    }

    // 🔹 Enviar formulario
    form.on('submit', (e) => {
        //e.preventDefault();
        if (!validUserData()) {
            e.preventDefault();
        }

        alert('Información guardada correctamente ✅');
        // Aquí podrías hacer un fetch() si tuvieras backend
    });

    // 🔹 Eliminar cuenta
    btnDelete.on('click', () => {
        if (!confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
            return;
        }

        $.ajax({
            url: "/api/users/deleteUser",
            method: "POST",
            success: function (response) {
                alert("Tu cuenta ha sido eliminada correctamente.");
                window.location.href = "/logMenu"; // o "/"
            },
            error: function (xhr) {
                alert("Error eliminando la cuenta: " + (xhr.responseJSON?.error || "Error desconocido"));
            }
        });
    });
});
