addListeners();

function addListeners() {
    let heartbeatAnimation = null;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 10000);
        })

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartbeatAnimation = animaster().heartBeating(block);
        })

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartbeatAnimation) {
                heartbeatAnimation.stop();
            }
        })
}


function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.add('remove');
        element.classList.remove('show');
    }


    function showAndHide(element, duration) {
        const animDuration = duration / 3.0;
        fadeIn(element, animDuration);
        setTimeout(() => {
            fadeOut(element, animDuration);
        }, animDuration);
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = '';
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration) {
        move(element, duration * 2/5, {x: 100, y: 20});
        fadeOut(element, duration * 3/5);
    }

    function heartBeating(element) {
        let intervalId;
        let timeoutId;
        const animDuration = 500;
        intervalId = setInterval(() => {
            scale(element, animDuration, 1.4);
            timeoutId = setTimeout(() => {
                scale(element, animDuration, 1 / 1.4);
            }, animDuration)
        }, animDuration * 2);


        function stop() {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            element.style.transitionDuration = null;
            element.style.transform = '';
        }

        return {
            stop: stop,
        }

    }

    return {
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        showAndHide: showAndHide,
        move: move,
        scale: scale,
        moveAndHide: moveAndHide,
        heartBeating: heartBeating,
    }
}


function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
