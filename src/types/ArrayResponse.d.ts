interface ArrayResponse<T> {
    count: number;
    next: any;
    previous: any;
    results: T[];
}