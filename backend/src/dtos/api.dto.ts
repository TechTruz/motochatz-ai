export class ResponsePayloadDTO<T> {
    data: T;
    pagination?: PaginationDTO | undefined;

    constructor(data: T, pagination?: PaginationDTO) {
        this.data = data;
        this.pagination = pagination;
    }

    getObject() {
        return {
            data: this.data,
            ...(this.pagination && { pagination: this.pagination }),
        };
    }
}

export abstract class PaginationDTO {
    totalRecords: number;
    currentRecords: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;

    constructor({
        totalRecords,
        currentRecords,
        hasNextPage,
        hasPrevPage,
    }: {
        totalRecords: number;
        currentRecords: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }) {
        this.totalRecords = totalRecords;
        this.currentRecords = currentRecords;
        this.hasNextPage = hasNextPage;
        this.hasPrevPage = hasPrevPage;
    }
}

export class OffsetPaginationDTO extends PaginationDTO {
    currentPage: number;
    totalPage: number;

    constructor({
        limit,
        total,
        count,
        page,
    }: {
        limit: number;
        total: number;
        count: number;
        page: number;
    }) {
        const totalPage = Math.ceil(total / limit);
        const hasNextPage = page < totalPage;
        const hasPrevPage = page > 1;

        super({
            totalRecords: total,
            currentRecords: count,
            hasNextPage,
            hasPrevPage,
        });

        this.currentPage = page;
        this.totalPage = totalPage;
    }

    getObject() {
        return {
            currentRecords: this.currentRecords,
            totalRecords: this.totalRecords,
            currentPage: this.currentPage,
            totalPage: this.totalPage,
            hasNextPage: this.hasNextPage,
            hasPrevPage: this.hasPrevPage,
        };
    }
}

export class CursorPaginationDTO extends PaginationDTO {
    latestCursor: string | null;
    oldestCursor: string | null;
    sort: string;

    constructor({
        latestCursor,
        oldestCursor,
        sort,
        total,
        count,
        hasNextPage,
        hasPrevPage,
    }: {
        latestCursor: string | null;
        oldestCursor: string | null;
        sort: string;
        total: number;
        count: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }) {
        super({
            totalRecords: total,
            currentRecords: count,
            hasNextPage,
            hasPrevPage,
        });

        this.latestCursor = latestCursor;
        this.oldestCursor = oldestCursor;
        this.sort = sort;
    }

    getObject() {
        return {
            currentRecords: this.currentRecords,
            totalRecords: this.totalRecords,
            latestCursor: this.latestCursor,
            oldestCursor: this.oldestCursor,
            sort: this.sort,
            hasNextPage: this.hasNextPage,
            hasPrevPage: this.hasPrevPage,
        };
    }
}
