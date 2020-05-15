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
            {opacity: '0%', offset: 0.5},
            {
                transform: `translateY(${9}px)`,
                opacity: '100%'
            }]
    },
    timing() {
        return {
            duration: 1000,
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

    hold() {
        const a = -52.75;
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

    easeOutTiming() {
        return {
            duration: 750,
            easing: 'ease-out'
        }
    }
}
