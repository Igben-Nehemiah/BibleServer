import { IEntity } from "../../../common/interfaces";

export interface IBook extends IEntity {
    abbrev: string;
    chapters: string[][];
    name: string;
}