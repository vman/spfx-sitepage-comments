import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';

import styles from './Comments.module.scss';
import * as strings from 'commentsStrings';
import { ICommentsWebPartProps } from './ICommentsWebPartProps';

import { Comment } from '../../dto';

export default class CommentsWebPart extends BaseClientSideWebPart<ICommentsWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.comments}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${styles.button}">
                <span class="${styles.label}">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;

    //this.getSitePageComments();
    this.setSitePageComments();
  }

  private async getSitePageComments() {

    const currentWebUrl: string = this.context.pageContext.web.serverRelativeUrl;

    const response = await this.context.spHttpClient.get(`${currentWebUrl}/_api/web/lists('1aaec881-7f5b-4f82-b1f7-9e02cc116098')/GetItemById(3)/Comments`, SPHttpClient.configurations.v1);

    const responseJSON = await response.json();

    const comments: Comment[] = responseJSON.value;

    comments.map((comment) => {
      console.log(comment.text);
      console.log(comment.replyCount);
    });

  }

  private async setSitePageComments() {

    const currentWebUrl: string = this.context.pageContext.web.serverRelativeUrl;

    const spOpts: ISPHttpClientOptions = {
      body: `{ "text": "from spfx code" }`
    };

    const response = await this.context.spHttpClient.post(`${currentWebUrl}/_api/web/lists('1aaec881-7f5b-4f82-b1f7-9e02cc116098')/GetItemById(3)/Comments`,
      SPHttpClient.configurations.v1,
      spOpts);

    const responseJSON = await response.json();

    const comment: Comment = responseJSON;

    console.log(comment.text);
    console.log(comment.replyCount);

  }


  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
