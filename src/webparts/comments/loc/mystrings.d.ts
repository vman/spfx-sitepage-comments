declare interface ICommentsStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'commentsStrings' {
  const strings: ICommentsStrings;
  export = strings;
}
