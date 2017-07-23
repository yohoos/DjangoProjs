export declare type Slot<Args, Sender extends object> = ((args: Args, sender: Sender) => void) | ((args: Args) => void) | (() => void);
export declare class Signal<Args, Sender extends object> {
    readonly sender: Sender;
    readonly name: string;
    constructor(sender: Sender, name: string);
    connect(slot: Slot<Args, Sender>, context?: object | null): boolean;
    disconnect(slot: Slot<Args, Sender>, context?: object | null): boolean;
    emit(args: Args): void;
}
export declare namespace Signal {
    function disconnectBetween(sender: object, receiver: object): void;
    function disconnectSender(sender: object): void;
    function disconnectReceiver(receiver: object): void;
    function disconnectAll(obj: object): void;
}
export interface Signalable {
    connect<Args, Sender extends object>(this: object, signal: Signal<Args, Sender>, slot: Slot<Args, Sender>): boolean;
    listenTo<Args, Sender extends object>(this: object, event: string, slot: Slot<Args, Sender>): boolean;
    trigger<Args>(this: object, event: string, args: Args): void;
}
export declare namespace Signalable {
    function connect<Args, Sender extends object>(this: object, signal: Signal<Args, Sender>, slot: Slot<Args, Sender>): boolean;
    function listenTo<Args, Sender extends object>(this: object, event: string, slot: Slot<Args, Sender>): boolean;
    function trigger<Args>(this: object, event: string, args: Args): void;
}
