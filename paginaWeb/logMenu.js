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
        window.location.href = "index.html";
    });

    // Botón Atrás (funciona para ambos formularios)
    $(".btnAtras").click(function () {
        $("#loginBox, #signInBox").hide();
        $("#menuBox").fadeIn(200);
    });
});
