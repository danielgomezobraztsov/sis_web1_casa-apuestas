document.addEventListener('DOMContentLoaded', function () {
    const monthlyRadio = document.getElementById('monthly');
    const yearlyRadio = document.getElementById('yearly');
    const freePrice = document.querySelector('.free-card .h3');
    const premiumPrice = document.querySelector('.premium-card .h3');
    const freePeriod = document.querySelector('.free-card .pricing-period');
    const premiumPeriod = document.querySelector('.premium-card .pricing-period');

    monthlyRadio.addEventListener('change', function () {
        if (this.checked) {
            freePrice.textContent = '$0';
            premiumPrice.textContent = '$15';
            freePeriod.textContent = '/month';
            premiumPeriod.textContent = '/month';
        }
    });

    yearlyRadio.addEventListener('change', function () {
        if (this.checked) {
            freePrice.textContent = '$0';
            premiumPrice.textContent = '$150';
            freePeriod.textContent = '/year';
            premiumPeriod.textContent = '/year';
        }
    });
});