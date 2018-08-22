/**
 * Return parameter of promote to seed
 */
interface PromoteToSeedReturn {
    promotedSeedMarkGroupIdRemarkIds: Immutable.Map<string, string>;
    promotedSeedMarkGroupIds: Immutable.List<number>;
    promoteToSeedError: number;
    failureCode: number;
    success: boolean;
}

export= PromoteToSeedReturn;