const {EventEmitter} = require("events");
const db = require('./db.js');
let instance;
let data = [];
let MAX = 50;

class Records extends EventEmitter {
    constructor () {
        super();
    }

    push (msg) {
        data.push(msg);
        db.pushMsg(msg.name, msg.msg);
        if (data.length > MAX) {
            data.splice(0, 1);
        }

        this.emit("new_message", msg);
    }

    get () {
        db.getRecord(function(records){
            data = records;
        });
        return data;
    }

    setMax (max) {
        MAX = max;
    }

    getMax () {
        return MAX;
    }
}

module.exports = (function () {
    if (!instance) {
        instance = new Records();
    }

    return instance;
})();