/*
 * Interface to hold the classified response details.
 */
interface ResponseMarkDetails {
	esMarkGroupId: number;
	displayLabel: string;
	mark: string;
	sequenceNo: number;
	usedInTotal: boolean;
}