declare module reactCookie {

    export function save(
        name: any,
        val: any,
        opt?: any
    ): any;

    export function load(
        name: any,
        doNotParse: any
    ): any;

}
declare module "react-cookie" {
    export = reactCookie
}
