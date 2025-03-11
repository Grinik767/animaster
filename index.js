addListeners()


function addListeners() {
    let heartbeatAnimation = null;
    let moveAndHide = null;

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
            moveAndHide = animaster().moveAndHide(block, 10000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartbeatAnimation = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartbeatAnimation) {
                heartbeatAnimation.stop();
            }
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHide) {
                moveAndHide.reset();
            }
        });

    document.getElementById('customAnimation1Play')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimation1Block');
            const customAnimation2 = animaster()
                .addFadeOut(500)
                .addMove(200, {x: 40, y: 40})
                .addFadeIn(500)
                .addScale(500, 2)
                .addScale(500, 1)
                .addMove(200, {x: 0, y: 0})
            customAnimation2.play(block);
        });

    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document.getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);

}

function animaster() {
    return {
        _steps: [],

        fadeIn(element, duration) {
            element.style.transition = `opacity ${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            return {
                reset: () => {
                    element.style.transition = '';
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            };
        },

        fadeOut(element, duration) {
            element.style.transition = `opacity ${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return {
                reset: () => {
                    element.style.transition = '';
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            };
        },

        move(element, duration, translation) {
            element.style.transition = `transform ${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {
                reset: () => {
                    element.style.transition = '';
                    element.style.transform = '';
                }
            };
        },

        scale(element, duration, ratio) {
            element.style.transition = `transform ${duration}ms`;
            let currentTransform = element.style.transform.replace(/scale\([^)]+\)/, '');
            element.style.transform = `${currentTransform} scale(${ratio})`.trim();
            return {
                reset: () => {
                    element.style.transition = '';
                    element.style.transform = '';
                }
            };
        },

        addMove(duration, translation) {
            this._steps.push({type: 'move', duration, params: translation});
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({type: 'scale', duration, params: ratio});
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({type: 'fadeIn', duration});
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({type: 'fadeOut', duration});
            return this;
        },

        addDelay(duration) {
            this._steps.push({type: 'delay', duration});
            return this;
        },

        play(element, cycled = false) {
            let timeOffset = 0;
            let intervalId;
            const resetFunctions = [];

            const executeAnimation = () => {
                timeOffset = 0;
                this._steps.forEach(step => {
                    setTimeout(() => {
                        let animation;
                        switch (step.type) {
                            case 'move':
                                animation = this.move(element, step.duration, step.params);
                                break;
                            case 'scale':
                                animation = this.scale(element, step.duration, step.params);
                                break;
                            case 'fadeIn':
                                animation = this.fadeIn(element, step.duration);
                                break;
                            case 'fadeOut':
                                animation = this.fadeOut(element, step.duration);
                                break;
                        }
                        if (animation && animation.reset) {
                            resetFunctions.push(animation.reset);
                        }
                    }, timeOffset);
                    timeOffset += step.duration;
                });
            };

            executeAnimation();
            if (cycled) {
                intervalId = setInterval(executeAnimation, timeOffset);
            }

            return {
                stop: () => clearInterval(intervalId),
                reset: () => resetFunctions.forEach(reset => reset())
            };
        },

        moveAndHide(element, duration) {
            const animation = this.addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
                .play(element);

            return {
                reset: () => {
                    animation.reset();
                    element.style.transform = '';
                    element.classList.add('show');
                }
            };
        },

        buildHandler() {
            const self = this;
            return function () {
                self.play(this);
            };
        },

        showAndHide(element, duration) {
            return this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        }
    };
}

function getTransform(translation, ratio) {
    return `${translation ? `translate(${translation.x}px,${translation.y}px)` : ''} ${ratio ? `scale(${ratio})` : ''}`.trim();
}
