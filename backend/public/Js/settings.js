let currentCardForFunds = null;
const addFundsModal = new bootstrap.Modal(document.getElementById("addFundsModal"));
const addPaymentModal = new bootstrap.Modal(document.getElementById("addPaymentModal"));

$(document).ready(function() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    const fontSize = localStorage.getItem("fontSize") || 11;

    $("#darkModeSwitch").prop("checked", darkMode);
    $("#fontSizeInput").val(fontSize);

    loadPaymentMethods();

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

    $("#addPaymentBtn").on("click", function() {
        addPaymentModal.show();
    });

    $("#savePaymentBtn").on("click", function() {
        const cardType = $("#cardType").val();
        const cardNumber = $("#cardNumber").val();
        const cardholderName = $("#cardholderName").val();

        if (!cardType || !cardNumber || !cardholderName) {
            alert("Por favor completa todos los campos");
            return;
        }

        $.ajax({
            url: "/api/users/add-payment-method",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                cardType: cardType,
                cardNumber: cardNumber,
                cardholderName: cardholderName
            }),
            success: function(response) {
                alert("Tarjeta agregada correctamente");
                addPaymentModal.hide();
                $("#addPaymentForm")[0].reset();
                loadPaymentMethods();
            },
            error: function(xhr) {
                alert("Error: " + (xhr.responseJSON?.error || "Error al agregar tarjeta"));
            }
        });
    });
});

function loadPaymentMethods() {
    $.ajax({
        url: "/api/users/payment-methods",
        method: "GET",
        success: function(response) {
            const container = $("#paymentMethodsList");
            container.empty();

            if (response.paymentMethods.length === 0) {
                container.html("<p class='text-muted'>No payment methods added yet</p>");
                return;
            }

            response.paymentMethods.forEach((card, index) => {
                const cardHtml = `
                    <div class="card mb-2 p-3 app-dark-bg" style="border-color: #333;">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <p class="mb-1"><strong>${card.cardType}</strong> **** **** **** ${card.cardNumber}</p>
                                <p class="mb-0 text-muted">${card.cardholderName}</p>
                            </div>
                            <div>
                                <button type="button" class="btn btn-sm btn-header-primary" onclick="showAddFundsModal('${card.cardNumber}')">Add Funds</button>
                                <button type="button" class="btn btn-sm btn-danger" onclick="deleteCard('${card.cardNumber}')">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                container.append(cardHtml);
            });
        },
        error: function(xhr) {
            console.error("Error loading payment methods:", xhr);
        }
    });
}

function showAddFundsModal(cardNumber) {
    currentCardForFunds = cardNumber;
    addFundsModal.show();
}

function addFundsAmount(amount) {
    $.ajax({
        url: "/api/users/add-funds",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ amount: amount }),
        success: function(response) {
            alert(`$${amount} added successfully! New balance: $${response.newBalance}`);
            addFundsModal.hide();
            currentCardForFunds = null;

            const balanceEl = document.getElementById('user-balance');
            if (balanceEl) {
                balanceEl.textContent = '$' + response.newBalance;
            }

            setTimeout(() => {
                window.location.reload();
            }, 200);
        },
        error: function(xhr) {
            alert("Error: " + (xhr.responseJSON?.error || "Error adding funds"));
        }
    });
}

function deleteCard(cardNumber) {
    if (confirm("Are you sure you want to delete this card?")) {
        $.ajax({
            url: "/api/users/delete-payment-method",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ cardNumber: cardNumber }),
            success: function(response) {
                alert("Card deleted successfully");
                loadPaymentMethods();
            },
            error: function(xhr) {
                alert("Error: " + (xhr.responseJSON?.error || "Error deleting card"));
            }
        });
    }
}