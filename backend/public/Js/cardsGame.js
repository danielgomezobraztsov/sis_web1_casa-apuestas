(() => {
    // Config
    const CANVAS_ID = 'userCanvas';
    const BTN_PLAY = 'btnPlayCards';
    const BTN_RESET = 'btnResetCards';
    const MSG_EL = 'cardsMsg';
    const LEVEL_EL = 'cardsLevel';

    // Canvas & game
    let canvas, ctx;
    let w, h, dpi;
    const totalCards = 5;
    const cardWidth = 80;
    const cardHeight = 120;
    const cardSpacing = 20;
    const startY = 120; // posición Y de las cartas

    let cards = [];
    let cheatIndex = -1;
    let animating = false;
    let level = 1;
    let disabled = false;

    // Card class
    class Card {
        constructor(x, y, index) {
            this.x = x;
            this.y = y;
            this.index = index;
            this.flipped = false;
            this.flipProgress = 0;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x + cardWidth / 2, this.y + cardHeight / 2);
            const angle = this.flipProgress * Math.PI;
            const scaleX = Math.cos(angle);
            ctx.scale(scaleX, 1);

            // Card background
            ctx.fillStyle = this.flipped ? '#ffffff' : '#d10b0bff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
            ctx.strokeRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);

            // Draw mark if flipped
            if (this.flipped) {
                ctx.fillStyle = '#000';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.index === cheatIndex ? '🃏' : 'A', 0, 0);
            }

            ctx.restore();
        }

        update() {
            if (this.flipped && this.flipProgress < 1) this.flipProgress += 0.1;
            if (!this.flipped && this.flipProgress > 0) this.flipProgress -= 0.1;
        }

        contains(mx, my) {
            return mx > this.x && mx < this.x + cardWidth && my > this.y && my < this.y + cardHeight;
        }
    }

    // Init
    function init() {
        canvas = document.getElementById(CANVAS_ID);
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        setupCanvasSize();

        // Buttons
        document.getElementById(BTN_PLAY).addEventListener('click', startRound);
        document.getElementById(BTN_RESET).addEventListener('click', resetGame);

        canvas.addEventListener('click', onCanvasClick);

        window.addEventListener('resize', onResize);
        resetGame();
        gameLoop();
    }

    function setupCanvasSize() {
        const rect = canvas.getBoundingClientRect();
        dpi = window.devicePixelRatio || 1;
        w = Math.floor(rect.width);
        h = Math.floor(rect.height);
        canvas.width = Math.max(300, Math.floor(w * dpi));
        canvas.height = Math.max(300, Math.floor(h * dpi));
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    }

    function onResize() {
        setupCanvasSize();
        layoutCards();
        draw();
    }

    // Create card objects
    function layoutCards() {
        cards = [];
        const totalWidth = totalCards * cardWidth + (totalCards - 1) * cardSpacing;
        const startXCentered = (w - totalWidth) / 2;
        for (let i = 0; i < totalCards; i++) {
            const x = startXCentered + i * (cardWidth + cardSpacing);
            cards.push(new Card(x, startY, i));
        }
    }

    // Start / reset
    function startRound() {
        if (animating) return;
        disabled = false;
        document.getElementById(MSG_EL).textContent = 'Selecciona una carta (evita la tramposa).';
        chooseCheat();
        layoutCards();
        draw();
    }

    function resetGame() {
        level = 1;
        updateUI();
        startRound();
    }

    function updateUI() {
        document.getElementById(LEVEL_EL).textContent = level;
    }

    function chooseCheat() {
        cheatIndex = Math.floor(Math.random() * totalCards);
        cards.forEach(c => {
            c.flipped = false;
            c.flipProgress = 0;
        });
    }

    // Drawing
    function draw() {
        ctx.clearRect(0, 0, w, h);
        cards.forEach(c => c.draw());
    }

    // Animation loop
    function gameLoop() {
        cards.forEach(c => c.update());
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Click handler
    function onCanvasClick(e) {
        if (disabled || animating) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (const c of cards) {
            if (c.contains(mx, my) && !c.flipped) {
                handleCardClick(c);
                return;
            }
        }
    }

    function handleCardClick(card) {
        if (card.flipped || animating) return;
        disabled = true;

        animateFlip(card, () => {
            card.flipped = true;
            if (card.index === cheatIndex) {
                card.revealedMark = 'bad';
                revealAllThenGameOver();
            } else {
                card.revealedMark = 'ok';
                level++; // sube de nivel
                updateUI();
                document.getElementById(MSG_EL).textContent = '¡Bien! Mezclando cartas... ✨';
                setTimeout(() => shuffleCards(), 500);
            }
            disabled = false;
        });
    }

    function animateFlip(card, cb) {
        animating = true;
        const duration = 350;
        const start = performance.now();
        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            card.flipProgress = easeOutCubic(t);
            draw();
            if (t < 1) requestAnimationFrame(step);
            else {
                animating = false;
                if (cb) cb();
            }
        }
        requestAnimationFrame(step);
    }

    function shuffleCards() {
        // Reordenar cartas
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        // actualizar posiciones X
        const totalWidth = totalCards * cardWidth + (totalCards - 1) * cardSpacing;
        const startXCentered = (w - totalWidth) / 2;
        cards.forEach((c, i) => {
            c.x = startXCentered + i * (cardWidth + cardSpacing);
            c.flipped = false;
            c.flipProgress = 0;
        });
        chooseCheat();
        draw();
        document.getElementById(MSG_EL).textContent = 'Cartas mezcladas, elige de nuevo.';
    }

    function revealAllThenGameOver() {
        cards.forEach(c => {
            c.flipped = true;
            c.flipProgress = 1;
        });
        draw();
        document.getElementById(MSG_EL).textContent = '¡Has elegido la carta tramposa! Juego terminado.';
    }

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    document.addEventListener('DOMContentLoaded', init);
})();
