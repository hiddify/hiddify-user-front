declare type ValueOf<T> = T[keyof T];
declare type NeverToUndefined<T> = [T] extends [never] ? undefined : T;
declare type UndefinedToFalse<T> = [T] extends [undefined] ? false : T;
