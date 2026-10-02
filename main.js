document.addEventListener('DOMContentLoaded', function() {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<span class="close-lightbox">&times;</span><img class="lightbox-img" src="" alt=""><div class="lightbox-caption"></div>';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector('.lightbox-img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');

    var initImages = function() {
        var imgs = document.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) {
            if (!imgs[i].classList.contains('lightbox-img') && !imgs[i].classList.contains('the-rock-gif')) {
                imgs[i].style.cursor = 'zoom-in';
            }
        }
    };
    initImages();

    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img' && !e.target.classList.contains('lightbox-img') && !e.target.classList.contains('the-rock-gif')) {
            e.preventDefault();
            e.stopPropagation();

            lightboxImg.src = e.target.src;
            var captionText = e.target.alt || '\u0421\u0415\u041a\u0420\u0415\u0422\u041d\u042b\u0419 \u041c\u0410\u0422\u0415\u0420\u0418\u0410\u041b';

            if (typeof e.target.closest === 'function') {
                var figure = e.target.closest('figure');
                if (figure) {
                    var figcaption = figure.querySelector('figcaption');
                    if (figcaption) {
                        captionText = figcaption.textContent;
                    }
                }
            }

            lightboxCaption.textContent = captionText;
            lightbox.classList.add('active');
            return;
        }

        if (lightbox.classList.contains('active')) {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        }
    });

    var isDossier = !!document.querySelector('.dossier-main');
    if (!isDossier) {
        return;
    }

    var leakToast = document.getElementById('leak-toast');
    var toastClose = document.getElementById('toast-close');
    if (toastClose && leakToast) {
        toastClose.addEventListener('click', function(e) {
            e.stopPropagation();
            leakToast.classList.add('toast-hidden');
        });
    }

    if (leakToast && !leakToast.classList.contains('toast-hidden')) {
        var progressBar = document.createElement('div');
        progressBar.className = 'toast-progress-bar';
        leakToast.appendChild(progressBar);
        setTimeout(function() {
            if (!leakToast.classList.contains('toast-hidden')) {
                leakToast.classList.add('toast-hidden');
            }
        }, 8000);
    }

    var boomAudio = new Audio('audio/vine_boom.mp3');
    boomAudio.preload = 'auto';

    function triggerVineBoom() {
        try {
            boomAudio.currentTime = 0;
            boomAudio.play().catch(function() {});
        } catch(err) {}

        document.body.classList.remove('vine-shaking');
        void document.body.offsetWidth;
        document.body.classList.add('vine-shaking');
        setTimeout(function() {
            document.body.classList.remove('vine-shaking');
        }, 500);
    }

    var boomTriggers = document.querySelectorAll('.boom-trigger, .the-rock-card, .stamp, .stamp-photo, .stamp-top-right, .stamp-alert, .badge-lost');
    for (var b = 0; b < boomTriggers.length; b++) {
        boomTriggers[b].addEventListener('click', function(e) {
            triggerVineBoom();
        });
    }

    var bgAudio = document.getElementById('bg-music-audio');
    var playBtn = document.getElementById('player-toggle-btn');
    var led = document.getElementById('player-led');
    var volSlider = document.getElementById('volume-slider');
    var volVal = document.getElementById('volume-val');
    var volIcon = document.getElementById('vol-icon');

    if (bgAudio && playBtn) {
        if (volSlider) {
            bgAudio.volume = parseFloat(volSlider.value);
            if (volVal) {
                volVal.textContent = Math.round(bgAudio.volume * 100) + '%';
            }
            volSlider.addEventListener('input', function() {
                bgAudio.volume = parseFloat(this.value);
                if (volVal) {
                    volVal.textContent = Math.round(this.value * 100) + '%';
                }
                if (volIcon) {
                    if (this.value == 0) {
                        volIcon.textContent = '\uD83D\uDD07';
                    } else if (this.value < 0.5) {
                        volIcon.textContent = '\uD83D\uDD09';
                    } else {
                        volIcon.textContent = '\uD83D\uDD0A';
                    }
                }
            });
        }

        if (volIcon && volSlider) {
            var prevVolume = 0.7;
            volIcon.addEventListener('click', function() {
                if (bgAudio.volume > 0) {
                    prevVolume = bgAudio.volume;
                    bgAudio.volume = 0;
                    volSlider.value = 0;
                    volIcon.textContent = '\uD83D\uDD07';
                } else {
                    bgAudio.volume = prevVolume || 0.7;
                    volSlider.value = bgAudio.volume;
                    volIcon.textContent = bgAudio.volume < 0.5 ? '\uD83D\uDD09' : '\uD83D\uDD0A';
                }
                if (volVal) {
                    volVal.textContent = Math.round(bgAudio.volume * 100) + '%';
                }
            });
        }

        playBtn.addEventListener('click', function() {
            if (bgAudio.paused) {
                bgAudio.play().then(function() {
                    playBtn.textContent = '\u275A\u275A PAUSE';
                    if (led) led.classList.add('active');
                }).catch(function() {});
            } else {
                bgAudio.pause();
                playBtn.textContent = '\u25B6 PLAY';
                if (led) led.classList.remove('active');
            }
        });

        bgAudio.addEventListener('ended', function() {
            playBtn.textContent = '\u25B6 PLAY';
            if (led) led.classList.remove('active');
        });
    }

    var sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    var sections = document.querySelectorAll('.dossier-section');
    sections.forEach(function(sec) {
        sectionObserver.observe(sec);
    });

    var dustCanvas = document.createElement('canvas');
    dustCanvas.id = 'dust-canvas';
    dustCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    document.body.appendChild(dustCanvas);
    var dustCtx = dustCanvas.getContext('2d');
    var particles = [];
    var particleCount = 35;

    function resizeDustCanvas() {
        dustCanvas.width = window.innerWidth;
        dustCanvas.height = window.innerHeight;
    }
    resizeDustCanvas();
    window.addEventListener('resize', resizeDustCanvas);

    for (var p = 0; p < particleCount; p++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: -(Math.random() * 0.4 + 0.1),
            opacity: Math.random() * 0.2 + 0.08
        });
    }

    function animateDust() {
        dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
        for (var i = 0; i < particles.length; i++) {
            var pt = particles[i];
            pt.x += pt.speedX;
            pt.y += pt.speedY;

            if (pt.y < -10) {
                pt.y = dustCanvas.height + 10;
                pt.x = Math.random() * dustCanvas.width;
            }
            if (pt.x < -10) pt.x = dustCanvas.width + 10;
            if (pt.x > dustCanvas.width + 10) pt.x = -10;

            dustCtx.beginPath();
            dustCtx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            dustCtx.fillStyle = 'rgba(255, 255, 255, ' + pt.opacity + ')';
            dustCtx.fill();
        }
        requestAnimationFrame(animateDust);
    }
    animateDust();

    var stamps = document.querySelectorAll('.stamp, .stamp-photo, .stamp-alert, .footer-stamp');
    stamps.forEach(function(s) {
        var randomAngle = (Math.random() - 0.5) * 6;
        s.style.transform = 'rotate(' + randomAngle + 'deg)';
    });

    var redactedBoxes = document.querySelectorAll('.redacted-box');
    redactedBoxes.forEach(function(box) {
        var hoverTimer = null;
        box.addEventListener('mouseenter', function() {
            hoverTimer = setTimeout(function() {
                box.style.color = '#444';
                box.style.transition = 'color 0.15s';
                setTimeout(function() {
                    box.style.color = '#111';
                }, 250);
            }, 2000);
        });
        box.addEventListener('mouseleave', function() {
            if (hoverTimer) clearTimeout(hoverTimer);
            box.style.color = '#111';
        });
    });

    var header = document.querySelector('.dossier-header');
    if (header) {
        var headerContent = header.querySelector('.header-container');
        window.addEventListener('scroll', function() {
            var scrollY = window.pageYOffset;
            if (scrollY < 600 && headerContent) {
                headerContent.style.transform = 'translateY(' + (scrollY * 0.12) + 'px)';
            }
        }, { passive: true });
    }

    var suspectImgs = document.querySelectorAll('.suspect-img');
    suspectImgs.forEach(function(img) {
        img.addEventListener('mouseenter', function() {
            img.classList.add('glitch-active');
            setTimeout(function() {
                img.classList.remove('glitch-active');
            }, 300);
        });
    });

    var threatBars = document.querySelectorAll('.threat-bar-fill');
    var threatObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var target = entry.target;
                var width = target.getAttribute('data-width') || '75%';
                target.style.width = width;
                threatObserver.unobserve(target);
            }
        });
    }, { threshold: 0.3 });
    threatBars.forEach(function(bar) {
        bar.style.width = '0%';
        threatObserver.observe(bar);
    });

    var sigmaSequence = ['s', 'i', 'g', 'm', 'a'];
    var sigmaIndex = 0;
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === sigmaSequence[sigmaIndex]) {
            sigmaIndex++;
            if (sigmaIndex === sigmaSequence.length) {
                sigmaIndex = 0;
                triggerVineBoom();
                document.body.classList.add('sigma-flash');
                setTimeout(function() {
                    document.body.classList.remove('sigma-flash');
                }, 800);
            }
        } else {
            sigmaIndex = 0;
        }
    });
});
