var keydownHandler = function (ev: KeyboardEvent) {
    return keys.handler(ev, true);
};
var keyupHandler = function (ev: KeyboardEvent) {
    return keys.handler(ev, false);
};

export var keys = {
    bind:       function () {
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
    },
    reset:      function () {
        keys.left = false;
        keys.right = false;
        keys.accelerate = false;
        keys.up = false;
        keys.down = false;
    },
    unbind:     function () {
        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keyup', keyupHandler);
    },
    handler:    function (ev: KeyboardEvent, status: boolean) {
        switch (ev.keyCode) {
            case 57392://CTRL on MAC
            case 17://CTRL
            case 65://A
                keys.accelerate = status;
                break;
            case 40://DOWN ARROW
                keys.down = status;
                break;
            case 39://RIGHT ARROW
                keys.right = status;
                break;
            case 37://LEFT ARROW
                keys.left = status;
                break;
            case 38://UP ARROW
                keys.up = status;
                break;
            default:
                return true;
        }

        ev.preventDefault();
        return false;
    },
    accelerate: false,
    left:       false,
    up:         false,
    right:      false,
    down:       false,
};

