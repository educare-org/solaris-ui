export interface SvgPathElement {
  type: 'path';
  d: string;
}

export interface SvgLineElement {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SvgPolylineElement {
  type: 'polyline';
  points: string;
}

export interface SvgPolygonElement {
  type: 'polygon';
  points: string;
}

export interface SvgCircleElement {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
}

export type SvgElement =
  | SvgPathElement
  | SvgLineElement
  | SvgPolylineElement
  | SvgPolygonElement
  | SvgCircleElement;

export interface SolarisIconDefinition {
  name: string;
  viewBox: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  elements: SvgElement[];
}
