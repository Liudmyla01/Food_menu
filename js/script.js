window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    //tabs
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade')
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })

    //timer

    const deadline = '2021-08-25'

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();
        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);
    ///Modal

    const modalBtn = document.querySelectorAll('[data-modal]'),
        modalClose = document.querySelector('[data-close]'),
        modalWindow = document.querySelector('.modal');

    modalBtn.forEach(item => {
        item.addEventListener('click', openModalWindow)
    });

    function openModalWindow() {
        modalWindow.classList.add('show');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';//без прокрутки страницы 
        clearInterval(modalTmerId);

    }
    function closeModalWindow() {
        modalWindow.classList.add('hide');
        modalWindow.classList.remove('show');
        document.body.style.overflow = '';
    }
    modalClose.addEventListener('click', closeModalWindow);

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow) {
            closeModalWindow()
        }
    })

    document.addEventListener('keydown', (e) => {//закрыть  модалку с помощью клавиши'Escape' 
        if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
            closeModalWindow()
        }
    })
    //Автоматический показ модалки через определенное время

    const modalTmerId = setTimeout(openModalWindow, 30000);

    //показ модалки при прокрутке до самого низа страницы
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModalWindow();
            window.removeEventListener('scroll', showModalByScroll)//удаление чтоб постоянно не выскакивало при прокрутке вниз
        }
    }
    window.addEventListener('scroll', showModalByScroll);


    // Классы для карточек.Создание карточек
    class MenuCard {
        constructor(src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.classes = classes;
            this.changeToUAH();
        }
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('div');
            //автоматическое добавление класса, если пользователь забыл указать в конструкторе
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element)
            } else {
                this.classes.forEach(className => element.classList.add(className))
            }

            element.innerHTML = `
        <img src=${this.src} alt=${this.alt} >
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">Меню ${this.description} </div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
   
        `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }
    //biblioteca    
    axios.get("http://localhost:3000/menu")
        .then(cards => {
            cards.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            })
        })
    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': "application/json"
            },
            body: data
        });
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);



            // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));


            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);

                }).finally(() => {
                    form.reset()
                })
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModalWindow();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModalWindow();
        }, 4000);
    }
    fetch('http://localhost:3000/menu')
        .then(data => data.json())

    // SLider
    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider--inner'),
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
    //calcul

      const result = document.querySelector('.calculating__result span');
    let sex,height, weight, age, 
     ratio = 1.375;
if (localStorage.getItem('sex')){
    sex = localStorage.getItem('sex');
}else{
    sex = 'female';
    localStorage.setItem('sex', 'female')
}

if (localStorage.getItem('ratio')){
    ratio = localStorage.getItem('ratio');
}else{
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375)
} 

// function initLocalStor(selector,activeClass){
//     const elements = document.querySelectorAll(selector);

//     elements.forEach(elem => {
//         elem.classList.remove(activeClass);
//         if(elem.getAttribute('id') === localStorage.getItem('sex')){
//             elem.classList.add(activeClass);
//         }
//         if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
//             elem.classList.add(activeClass);
//         }

//     })
// }

// initLocalStor('#gender', 'calculating__choose-item_active');
// initLocalStor('.calculating__choose_big', 'calculating__choose-item_active');

function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio){
            result.textContent = "*";
            return;
        }

        if( sex === 'female'){
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }else{
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
calcTotal()

function getStaticInformation(parentSelector, activeClass) {
    const elements = document.querySelectorAll(`${parentSelector} div`);

    elements.forEach(elem => {
        elem.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-ratio')) {
                ratio = +e.target.getAttribute('data-ratio');
                localStorage.setItem('ratio',+e.target.getAttribute('data-ratio') )
            } else {
                sex = e.target.getAttribute('id');
                localStorage.setItem('sex', e.target.getAttribute('id'));
            }
            
            elements.forEach(elem => {
                elem.classList.remove(activeClass);
            });

            e.target.classList.add(activeClass);

            calcTotal();
        });
    });
}

getStaticInformation('#gender', 'calculating__choose-item_active');
getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

function getDynamInfo(selector){
    const input = document.querySelector(selector);
    
    input.addEventListener('input', () => {
        if( input.value.match(/\D/g)){
            input.style.border = '2px solid red';
        }else{
            input.style.border = 'none'; 
        }
        switch(input.getAttribute('id')){
        case "height":
            height = +input.value;
            break;
        case "weight":
            weight = +input.value;
            break;
        case "age":
            age = +input.value;
            break;
    }
        calcTotal();
    });
}
getDynamInfo('#height');
getDynamInfo('#weight');
getDynamInfo('#age');

});