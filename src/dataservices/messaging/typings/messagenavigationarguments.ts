    /**
     * Interface used to carry the message navigation arguments
     */
interface MessageNavigationArguments {
    responseId: number;
    canNavigate: boolean;
    navigateTo: number;
    navigationConfirmed: boolean;
    hasMessageContainsDirtyValue: boolean;
    triggerPoint: number;
}