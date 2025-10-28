$(document).ready(function() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    const fontSize = localStorage.getItem("fontSize") || 11;

    $("#darkModeSwitch").prop("checked", darkMode);
    $("#fontSizeInput").val(fontSize);

    $("#settingsForm").on("submit", function(e) {
        e.preventDefault();
        
        const newDarkMode = $("#darkModeSwitch").prop("checked");
        const newFontSize = parseInt($("#fontSizeInput").val(), 10);

        localStorage.setItem("darkMode", newDarkMode);
        localStorage.setItem("fontSize", newFontSize);

        alert("Cambios de ajustes guardados correctamente.");
        
        $("body").css("font-size", newFontSize + "px");
        
        if (newDarkMode) {
            $("body").addClass("app-dark-bg");
        } else {
            $("body").removeClass("app-dark-bg");
        }
    });
});
