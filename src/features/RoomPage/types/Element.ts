export default interface Element {
    type: string;
    offsetX: number;
    offsetY: number;
    width?: number;
    height?: number;
    stroke: string;
    path?: number[][];
}