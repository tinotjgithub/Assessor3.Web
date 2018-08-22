import $ = require('jquery');

/**
 * Fracs helper class.
 */
class FracsHelper {

    private static jquery = $ as any;

    /**
     * return fracs for an element w.r.t window
     * @param element
     */
    public static getFracs(element: any) {
        return element.fracs();
    }

    /**
     * return fracs values w.r.t a container
     * @param fracsAction
     * @param element
     * @param container
     */
    public static getFracsWithRespectToContainer(fracsAction: string, element: any, container: any) {
        return element.fracs(fracsAction, container);
    }

    /**
     * return fracs values w.r.t a container using rect
     * @param elementRect
     * @param containerRect
     */
    public static getFracsWithRespectToContainerByRect(elementRect: any, containerRect: any) {
        return FracsHelper.jquery.fracs(elementRect, containerRect);
    }

    /**
     * return fracs Rect
     * @param left
     * @param top
     * @param width
     * @param height
     */
    public static fracsRect(left: number, top: number, width: number, height: number) {
        return new FracsHelper.jquery.fracs.Rect(left, top, width, height);
    }
}

export = FracsHelper;