$(document).ready(function () {
    // Ocultar formularios al inicio
    $("#loginBox, #signInBox").hide();

    // Mostrar formulario Sign-in
    $("#btnSignIn").click(function () {
        $("#menuBox").hide();
        $("#signInBox").fadeIn(200);
    });

    // Mostrar formulario Log-in
    $("#btnLogIn").click(function () {
        $("#menuBox").hide();
        $("#loginBox").fadeIn(200);
    });

    // Log-in como invitado
    $("#btnGuest").click(function () {
        window.location.href = "/"; //Nos lleva a index.ejs
    });

    // Botón Atrás (funciona para ambos formularios)
    $(".btnAtras").click(function () {
        $("#loginBox, #signInBox").hide();
        $("#menuBox").fadeIn(200);
    });

    function validUserData() {
        let valid = true;
        $('.error').text(''); // limpiar errores
        const userName = $('#userName').val().trim();
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const confPassword = $('#passwordConfirm').val().trim();
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
        if (password !== confPassword) {
            $('#errorPasswordConfirm').text('Las contraseñas no coinciden.');
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
    const form = $('#signInForm');

    // Enviar formulario
    form.on('submit', (e) => {
        e.preventDefault();
        if (!validUserData()) {
            return;
        }

        alert('Información guardada correctamente ✅');
        // Aquí podrías hacer un fetch() si tuvieras backend
    });
});
