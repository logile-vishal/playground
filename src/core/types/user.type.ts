export type User = {
    userId: number;
    userName: string;
    orgId: number;
    orgName: string;
    orgType: string;
    orgLevelId: number;
    orgLevelName: string;
    positionId: number;
    positionName: string;
    isAdmin: boolean;
    parentPositionId?: number;
};