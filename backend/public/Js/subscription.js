document.addEventListener('DOMContentLoaded', function () {
    const monthlyRadio = document.getElementById('monthly');
    const yearlyRadio = document.getElementById('yearly');
    const freePrice = document.querySelector('.free-card .h3');
    const premiumPrice = document.querySelector('.premium-card .h3');
    const freePeriod = document.querySelector('.free-card .pricing-period');
    const premiumPeriod = document.querySelector('.premium-card .pricing-period');

    function setMonthly() {
        freePrice.textContent = '$0';
        premiumPrice.textContent = '$15';
        freePeriod.textContent = '/month';
        premiumPeriod.textContent = '/month';
    }

    function setYearly() {
        freePrice.textContent = '$0';
        premiumPrice.textContent = '$120';
        freePeriod.textContent = '/year';
        premiumPeriod.textContent = '/year';
    }

    monthlyRadio.addEventListener('change', function () {
        if (this.checked) setMonthly();
    });

    yearlyRadio.addEventListener('change', function () {
        if (this.checked) setYearly();
    });

    if (monthlyRadio.checked) setMonthly();
    if (yearlyRadio.checked) setYearly();

    const buyBtn = document.getElementById('buyPremiumBtn');
    const balanceEl = document.getElementById('user-balance');

    if (buyBtn) {
        buyBtn.addEventListener('click', async function () {
            const period = document.getElementById('monthly').checked ? 'monthly' : 'yearly';
            const price = period === 'monthly' ? 15 : 120;

            if (!confirm(`Confirmas comprar Premium (${period}) por $${price}?`)) {
                return;
            }

            try {
                const res = await fetch('/subscription/purchase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ period })
                });

                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || 'Error al procesar la compra');
                    return;
                }

                alert('Compra realizada correctamente. Suscripción activa hasta: ' + new Date(data.subscriptionEnd).toLocaleString());
                if (balanceEl) balanceEl.textContent = '$' + data.newBalance;
                
                buyBtn.textContent = 'Suscrito';
                buyBtn.disabled = true;
                buyBtn.classList.remove('btn-outline-primary');
                buyBtn.classList.add('btn-success');
            } catch (err) {
                console.error(err);
                alert('Error al conectar con el servidor');
            }
        });
    }
});