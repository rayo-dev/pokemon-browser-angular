import { NamedApiResource } from "./named-api-resource";

export interface ResourceList {
    count: number;
    next: string | null;
    previous: string | null;
    results: NamedApiResource[];
}
