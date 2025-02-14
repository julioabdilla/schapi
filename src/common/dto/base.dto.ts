export abstract class BaseDto {}
export type Dto<T extends BaseDto> = T;
