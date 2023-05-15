
export interface Book {
    type: "Book";
    name: string;
    abbrev: string;
    chapters: ReadonlyArray<ReadonlyArray<string>>
}


export const getBookByName = (name: string) => {

}