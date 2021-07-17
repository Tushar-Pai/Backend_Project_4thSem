

gsap.fromTo('#greeting img',
    { xPercent: -100 },
    { xPercent: 0, duration: 2, ease: 'back' }
);

gsap.fromTo('nav',
    { opacity: 0 },
    { opacity: 1, duration: 1.9, ease: 'power1.Out' }
);

gsap.fromTo('#greeting h1',
    { yPercent: -100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 1.3, ease: 'back', delay: 1.3 }
);

gsap.fromTo('#greeting h5',
    { yPercent: 100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 1.3, ease: 'back', delay: 1.3 }
);