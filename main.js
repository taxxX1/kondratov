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
            if (!imgs[i].classList.contains('lightbox-img')) {
                imgs[i].style.cursor = 'zoom-in';
            }
        }
    };
    initImages();

    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img' && !e.target.classList.contains('lightbox-img')) {
            e.preventDefault();
            e.stopPropagation();
            
            lightboxImg.src = e.target.src;
            var captionText = e.target.alt || 'СЕКРЕТНЫЙ МАТЕРИАЛ';
            
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

    var leakToast = document.getElementById('leak-toast');
    var toastClose = document.getElementById('toast-close');
    if (toastClose && leakToast) {
        toastClose.addEventListener('click', function(e) {
            e.stopPropagation();
            leakToast.classList.add('toast-hidden');
        });
    }
});
