gsap.fromTo('.anim-ltr',
    { xPercent: 100, opacity: 0 },
    { xPercent: 0, opacity: 1, duration: 1.3, ease: 'power1.Out' }
);

gsap.fromTo('.anim-rtl',
    { xPercent: -100, opacity: 0 },
    { xPercent: 0, opacity: 1, duration: 1.3, ease: 'power1.Out' }
);

gsap.fromTo('.anim-fadeIn',
    { opacity: 0 },
    { opacity: 1, duration: 1.3, delay: 1.4, ease: 'power1.Out' }
);