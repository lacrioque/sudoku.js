/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function (v: any, seq: Array<any>): boolean {
    /* Return if a value `v` is in sequence `seq`.*/
    return seq.indexOf(v) !== -1;
}