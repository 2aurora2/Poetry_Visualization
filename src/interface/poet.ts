export interface INode {
    name: string;
    isCenter?: boolean;
}

export interface ILink {
    source: string;
    target: string;
    name: string[];
    lineStyle: any;
}

export interface IPoet {
    nodes: INode[];
    links: ILink[];
}