import { NamedApiResource } from "./named-api-resource";

export interface ResourceList {
    count: number;
    next: string;
    previous?: any;
    results: NamedApiResource[];
}
