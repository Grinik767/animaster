addListeners();

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

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHide) {
                moveAndHide.reset();
            }
        })
}

function animaster() {
    return {
        _steps: [],

        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            return {
                reset: () => {
                    element.style.transitionDuration = null;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            };
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return {
                reset: () => {
                    element.style.transitionDuration = null;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            };
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {
                reset: () => this.resetMoveAndScale(element)
            };
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {
                reset: () => this.resetMoveAndScale(element)
            };
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = '';
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
            const steps = this._steps;
            let intervalId;
            const resetFunctions = [];

            function executeAnimation() {
                timeOffset = 0;
                for (let step of steps) {
                    setTimeout(() => {
                        let animation;
                        switch (step.type) {
                            case 'move':
                                animation = animaster().move(element, step.duration, step.params);
                                break;
                            case 'scale':
                                animation = animaster().scale(element, step.duration, step.params);
                                break;
                            case 'fadeIn':
                                animation = animaster().fadeIn(element, step.duration);
                                break;
                            case 'fadeOut':
                                animation = animaster().fadeOut(element, step.duration);
                                break;
                            case 'delay':
                                break;
                        }
                        if (animation && animation.reset) {
                            resetFunctions.push(animation.reset);
                        }
                    }, timeOffset);
                    timeOffset += step.duration;
                }
            }

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
                    this.resetMoveAndScale(element);
                }
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
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

