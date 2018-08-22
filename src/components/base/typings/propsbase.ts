/**
 * interface for all the Props
 */
interface PropsBase {
    id: string;
    key: string;
	forceRerender?: boolean;
	isOnline?: boolean;
    setOfflineContainer?: Function;
}