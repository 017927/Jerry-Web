document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.classList.add('opacity-0');

        setTimeout(() => {
            splash.classList.add('hidden');
        }, 1000);
    }, 2000);

    const mouseGlow = document.getElementById('mouse-glow');

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });

        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target) {
            const isHoverable = target.closest('h1, h2, h3, p, span, a');
            if (isHoverable) {
                mouseGlow.classList.add('glow-hover');
            } else {
                mouseGlow.classList.remove('glow-hover');
            }
        }
    });

    document.addEventListener('mouseleave', () => {
        mouseGlow.classList.remove('glow-hover');
    });
});
