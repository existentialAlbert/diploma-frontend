export default {
    lowerAnimation() {
        return [{transform: `translateY(-${56}px)`},
            {transform: `translateY(${9}px)`}]
    },

    newAnimation() {
        return [{
            transform: `translateY(-${56}px)`,
            opacity: '0%'
        },
            {opacity: '0%', offset: 0.63},
            {
                transform: `translateY(${9}px)`,
                opacity: '100%'
            }]
    },
    timing() {
        return {
            duration: 1040,
            easing: 'ease-in'
        }
    },

    upperAnimation() {
        return [{transform: `translateY(${3}px)`},
            {transform: `translateY(${-56}px)`}]
    },

    removeAnimation() {
        return [{transform: `translateY(${3}px)`, opacity: '100%'},
            {opacity: '100%', offset: 0.63},
            {transform: `translateY(${-56}px)`, opacity: '0%'}]
    },
    reversedRemove() {
        return [{transform: `translateY(${0}px)`, opacity: '100%'},
            {opacity: '100%', offset: 0.63},
            {transform: `translateY(${56}px)`, opacity: '0%'}]
    },
    reversedNew() {
        return [{
            transform: `translateY(${56}px)`,
            opacity: '0%'
        },
            {opacity: '0%', offset: 0.63},
            {
                transform: `translateY(${0}px)`,
                opacity: '100%'
            }]
    },
    reversedHold() {
        const a = 53.7;
        return [{transform: `translateY(${a}px)`},
            {transform: `translateY(${a}px)`}]

    },
    reversedUpper() {
        return [{transform: `translateY(${0}px)`},
            {transform: `translateY(${56}px)`}]
    },
    reversedLower() {
        return [{transform: `translateY(${56}px)`},
            {transform: `translateY(${0}px)`}]
    },
    hold() {
        const a = -53.7;
        return [{transform: `translateY(${a}px)`},
            {transform: `translateY(${a}px)`}]
    },
    leftAnimation() {
        return [
            {transform: 'translateX(0px)', opacity: '100%'},
            {transform: 'translateX(-50px)', opacity: 0}
        ]
    },
    rightAnimation() {
        return [
            {transform: 'translateX(-50px)', opacity: 0},
            {transform: 'translateX(0px)', opacity: '100%'},
        ]
    },
    memoryAppearingAnimation() {
        return [
            {opacity: '0'},
            {opacity: '100%'}
        ]
    },
    memoryDisappearingAnimation() {
        return [
            {opacity: '100%'},
            {opacity: '0'}
        ]
    },
    memoryTiming() {
        return {
            duration: 333,
            easing: 'linear'
        }
    },
    easeOutTiming() {
        return {
            duration: 750,
            easing: 'ease-out'
        }
    }
}
