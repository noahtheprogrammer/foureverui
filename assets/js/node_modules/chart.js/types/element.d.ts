import { AnyObject } from 'chart.js/types/basic';
import { Point } from 'chart.js/types/geometric';

export interface Element<T = AnyObject, O = AnyObject> {
  readonly x: number;
  readonly y: number;
  readonly active: boolean;
  readonly options: O;

  tooltipPosition(useFinalPosition?: boolean): Point;
  hasValue(): boolean;
  getProps<P extends (keyof T)[]>(props: P, final?: boolean): Pick<T, P[number]>;
}
export const Element: {
  prototype: Element;
  new <T = AnyObject, O = AnyObject>(): Element<T, O>;
};
