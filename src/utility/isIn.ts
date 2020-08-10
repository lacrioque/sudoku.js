/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function (v: any, seq: Array<any>|Record<string,string>): boolean {
    /* Return if a value `v` is in sequence `seq`.*/
    if(typeof seq.indexOf == "function") {
        return seq.indexOf(v) !== -1;
    }
    return Object.values(seq).indexOf(v) !== -1;
}