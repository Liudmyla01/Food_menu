    function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}){
    // SLider
    const slides = document.querySelectorAll(slide),
        sl = document.querySelector(container),
        prev = document.querySelector(prevArrow),
        next = document.querySelector(nextArrow),
        total = document.querySelector(totalCounter),
        current = document.querySelector(currentCounter),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let ofset = 0;


    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length
        current.textContent = slideIndex;
    }

    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(item => {
        item.style.width = width;
    })

    next.addEventListener('click', () => {
        if (ofset == +width.replace(/\D/g, '') * (slides.length - 1)) {
            ofset = 0;
        } else {
            ofset += +width.replace(/\D/g, '');
        }
        slidesField.style.transform = `translateX(-${ofset}px)`;
        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex;
        }
    })
    prev.addEventListener('click', () => {
        if (ofset == 0) {
            ofset = +width.replace(/\D/g, '') * (slides.length - 1)
        } else {
            ofset -= +width.replace(/\D/g, '');
        }
        slidesField.style.transform = `translateX(-${ofset}px)`;
        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex;
        }
    })
}

export default slider;