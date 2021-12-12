import type { Page } from 'puppeteer'

export interface TestResult {
    test: Test
    result: Result
}

export interface Test {
    data: Data
    description: string
}

export interface Data {
    href: string
    fullHref: string
}

export interface Result {
    delta: number
    deltaPerIteration: number
    numIterations: number
    leaks: Leaks
    before: Before
    after: After
}

export interface Leaks {
    detected: boolean
    objects: any[]
    eventListeners: any[]
    domNodes: DomNodes
    collections: any[]
}

export interface DomNodes {
    delta: number
    deltaPerIteration: number
}

export interface Before {
    statistics: Statistics
    eventListeners: EventListener[]
    domNodes: DomNodes2
}

export interface Statistics {
    total: number
    v8heap: number
    native: number
    code: number
    jsArrays: number
    strings: number
    system: number
}

export interface EventListener {
    node: Node
    listeners: Listener[]
}

export interface Node {
    className: string
    description: string
}

export interface Listener {
    type: string
    useCapture: boolean
    passive: boolean
    once: boolean
    scriptId: string
    lineNumber: number
    columnNumber: number
    handler: Handler
}

export interface Handler {
    type: string
    className: string
    description: string
}

export interface DomNodes2 {
    count: number
}

export interface After {
    statistics: Statistics2
    eventListeners: EventListener2[]
    domNodes: DomNodes3
}

export interface Statistics2 {
    total: number
    v8heap: number
    native: number
    code: number
    jsArrays: number
    strings: number
    system: number
}

export interface EventListener2 {
    node: Node2
    listeners: Listener2[]
}

export interface Node2 {
    className: string
    description: string
}

export interface Listener2 {
    type: string
    useCapture: boolean
    passive: boolean
    once: boolean
    scriptId: string
    lineNumber: number
    columnNumber: number
    handler: Handler2
}

export interface Handler2 {
    type: string
    className: string
    description: string
}

export interface DomNodes3 {
    count: number
}

export declare type Scenario<T> = {
    setup?: (page: Page) => Promise<void>;
    createTests?: (page: Page) => Promise<Array<T>>;
    iteration: (page: Page, options: T) => Promise<void>;
};
export declare type Options = {
    debug?: boolean;
    heapsnapshot?: boolean;
    iterations?: number;
    scenario?: Scenario<any>;
    signal?: AbortSignal;
    progress?: boolean;
    onResult?: (result: TestResult) => void;
    returnResults?: false;
};
export declare function findLeaks(url: string, options: Options): Promise<TestResult[]>;
export declare const defaultScenario: Scenario<any>;
export {};