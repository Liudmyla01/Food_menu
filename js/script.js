import tabs from './modules/tabs';
import modal, { openModal } from './modules/madal';
import timer from './modules/timer';
import cards from './modules/cards';
import calc from './modules/calc';
import forms from './modules/form';
import slider from './modules/slider';


window.addEventListener('DOMContentLoaded', () => {
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 2000)

    tabs();
    modal('[data-modal]','.modal', modalTimerId);
    timer('.timer', '2021-08-25');
    cards();
    calc();
    forms(modalTimerId);
    slider({
        container:'.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter:'#total',
        slide: '.offer__slide',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field:'.offer__slider--inner'
    });


});