import { IEntity } from "../../../common/interfaces";

export interface Book extends IEntity {
    abbrev: string;
    chapters: string[][];
    name: string;
}