"use strict";
// Based on https://github.com/phosphorjs/phosphor/blob/master/packages/signaling/src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = require("./logging");
var callback_1 = require("./util/callback");
var array_1 = require("./util/array");
var Signal = (function () {
    function Signal(sender, name) {
        this.sender = sender;
        this.name = name;
    }
    Signal.prototype.connect = function (slot, context) {
        if (context === void 0) { context = null; }
        if (!receiversForSender.has(this.sender)) {
            receiversForSender.set(this.sender, []);
        }
        var receivers = receiversForSender.get(this.sender);
        if (findConnection(receivers, this, slot, context) != null) {
            return false;
        }
        var receiver = context || slot;
        if (!sendersForReceiver.has(receiver)) {
            sendersForReceiver.set(receiver, []);
        }
        var senders = sendersForReceiver.get(receiver);
        var connection = { signal: this, slot: slot, context: context };
        receivers.push(connection);
        senders.push(connection);
        return true;
    };
    Signal.prototype.disconnect = function (slot, context) {
        if (context === void 0) { context = null; }
        var receivers = receiversForSender.get(this.sender);
        if (receivers == null || receivers.length === 0) {
            return false;
        }
        var connection = findConnection(receivers, this, slot, context);
        if (connection == null) {
            return false;
        }
        var receiver = context || slot;
        var senders = sendersForReceiver.get(receiver);
        connection.signal = null;
        scheduleCleanup(receivers);
        scheduleCleanup(senders);
        return true;
    };
    Signal.prototype.emit = function (args) {
        var receivers = receiversForSender.get(this.sender) || [];
        for (var _i = 0, receivers_1 = receivers; _i < receivers_1.length; _i++) {
            var _a = receivers_1[_i], signal = _a.signal, slot = _a.slot, context = _a.context;
            if (signal === this) {
                slot.call(context, args, this.sender);
            }
        }
    };
    return Signal;
}());
exports.Signal = Signal;
(function (Signal) {
    function disconnectBetween(sender, receiver) {
        var receivers = receiversForSender.get(sender);
        if (receivers == null || receivers.length === 0)
            return;
        var senders = sendersForReceiver.get(receiver);
        if (senders == null || senders.length === 0)
            return;
        for (var _i = 0, senders_1 = senders; _i < senders_1.length; _i++) {
            var connection = senders_1[_i];
            if (connection.signal == null)
                return;
            if (connection.signal.sender === sender)
                connection.signal = null;
        }
        scheduleCleanup(receivers);
        scheduleCleanup(senders);
    }
    Signal.disconnectBetween = disconnectBetween;
    function disconnectSender(sender) {
        var receivers = receiversForSender.get(sender);
        if (receivers == null || receivers.length === 0)
            return;
        for (var _i = 0, receivers_2 = receivers; _i < receivers_2.length; _i++) {
            var connection = receivers_2[_i];
            if (connection.signal == null)
                return;
            var receiver = connection.context || connection.slot;
            connection.signal = null;
            scheduleCleanup(sendersForReceiver.get(receiver));
        }
        scheduleCleanup(receivers);
    }
    Signal.disconnectSender = disconnectSender;
    function disconnectReceiver(receiver) {
        var senders = sendersForReceiver.get(receiver);
        if (senders == null || senders.length === 0)
            return;
        for (var _i = 0, senders_2 = senders; _i < senders_2.length; _i++) {
            var connection = senders_2[_i];
            if (connection.signal == null)
                return;
            var sender = connection.signal.sender;
            connection.signal = null;
            scheduleCleanup(receiversForSender.get(sender));
        }
        scheduleCleanup(senders);
    }
    Signal.disconnectReceiver = disconnectReceiver;
    function disconnectAll(obj) {
        var receivers = receiversForSender.get(obj);
        if (receivers != null && receivers.length !== 0) {
            for (var _i = 0, receivers_3 = receivers; _i < receivers_3.length; _i++) {
                var connection = receivers_3[_i];
                connection.signal = null;
            }
            scheduleCleanup(receivers);
        }
        var senders = sendersForReceiver.get(obj);
        if (senders != null && senders.length !== 0) {
            for (var _a = 0, senders_3 = senders; _a < senders_3.length; _a++) {
                var connection = senders_3[_a];
                connection.signal = null;
            }
            scheduleCleanup(senders);
        }
    }
    Signal.disconnectAll = disconnectAll;
})(Signal = exports.Signal || (exports.Signal = {}));
exports.Signal = Signal;
var Signalable;
(function (Signalable) {
    function connect(signal, slot) {
        return signal.connect(slot, this);
    }
    Signalable.connect = connect;
    function listenTo(event, slot) {
        logging_1.logger.warn("obj.listenTo('event', handler) is deprecated, use obj.connect(signal, slot)");
        var _a = event.split(":"), name = _a[0], attr = _a[1];
        var signal = (attr == null) ? this[name] : this.properties[attr][name];
        return signal.connect(slot, this);
    }
    Signalable.listenTo = listenTo;
    function trigger(event, args) {
        logging_1.logger.warn("obj.trigger('event', args) is deprecated, use signal.emit(args)");
        var _a = event.split(":"), name = _a[0], attr = _a[1];
        var signal = (attr == null) ? this[name] : this.properties[attr][name];
        return signal.emit(args);
    }
    Signalable.trigger = trigger;
})(Signalable = exports.Signalable || (exports.Signalable = {}));
var receiversForSender = new WeakMap();
var sendersForReceiver = new WeakMap();
function findConnection(conns, signal, slot, context) {
    return array_1.find(conns, function (conn) { return conn.signal === signal && conn.slot === slot && conn.context === context; });
}
var dirtySet = new Set();
function scheduleCleanup(connections) {
    if (dirtySet.size === 0) {
        callback_1.defer(cleanupDirtySet);
    }
    dirtySet.add(connections);
}
function cleanupDirtySet() {
    dirtySet.forEach(function (connections) {
        array_1.removeBy(connections, function (connection) { return connection.signal == null; });
    });
    dirtySet.clear();
}
