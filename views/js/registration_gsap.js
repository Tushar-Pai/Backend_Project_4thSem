gsap.fromTo('.anim-down',
    { yPercent: -100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 1.3, ease: 'back' }
);

gsap.fromTo('.anim-up',
    { yPercent: 100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 1.3, ease: 'back' }
);

gsap.fromTo('.anim-fadeIn',
    { opacity: 0 },
    { opacity: 1, duration: 1.3, delay: 1.3, ease: 'power2.Out' }
);

gsap.fromTo('.btn',
    { yPercent: -100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 1.3, ease: 'back' }
);

gsap.fromTo('#login',
    { yPercent: 100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 1.3, ease: 'back' }
);
