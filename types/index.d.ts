import type { Page } from 'puppeteer'

export interface TestResult {
    test: {
        data: any,
        description: string
    },
    result: {
        delta: number,
        deltaPerIteration: number,
        numIterations: number,
        leaks: any, // TODO: types for this
        before: any, // TODO: types for this
        after: any // TODO: types for this
    }
}

export declare type Scenario<T> = {
    setup?: (page: Page) => Promise<void>;
    createTests?: (page: Page) => Promise<Array<T>>;
    iteration: (page: Page, options: T) => Promise<void>;
    teardown?: (page: Page) => Promise<void>;
    waitForIdle?: (page: Page) => Promise<void>;
};
export declare type Options = {
    debug?: boolean;
    heapsnapshot?: boolean;
    iterations?: number;
    scenario?: Scenario<any>;
    signal?: AbortSignal;
    progress?: boolean;
};
export declare function findLeaks(url: string, options: Options): AsyncGenerator<TestResult>;
export declare const defaultScenario: Scenario<any>;
export {};