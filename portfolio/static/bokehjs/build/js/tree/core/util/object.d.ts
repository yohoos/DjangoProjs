export declare const keys: (o: any) => string[];
export declare function values<T>(object: {
    [key: string]: T;
}): Array<T>;
export declare function extend<T, T1>(dest: T, source: T1): T & T1;
export declare function clone<T>(obj: T): T;
export declare function merge<T>(obj1: {
    [key: string]: Array<T>;
}, obj2: {
    [key: string]: Array<T>;
}): {
    [key: string]: Array<T>;
};
export declare function size<T>(obj: T): number;
export declare function isEmpty<T>(obj: T): boolean;
