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

export interface IWork {
    paragraphs: string[];
    emotion: string;
    title?: string;
    tags?: string[];
    rhythmic?: string;
}

export interface IPoet {
    nodes: INode[];
    links: ILink[];
    representative_works?: IWork[];
    emotions: any[];
    avatar: string;
    name: string;
    gender: string;
    address: string;
    yearBirth: string;
    yearDeath: string;
    desc: string;
}