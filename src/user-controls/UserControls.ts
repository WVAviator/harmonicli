import { BrowserSession } from './BrowserSession';
import inquirer from 'inquirer';
export class UserControls {
  constructor(private session: BrowserSession) {
    this.basicPrompt();
  }

  async basicPrompt() {
    const basicControls = await inquirer.prompt([
      {
        type: 'list',
        name: 'control',
        message: this.session.PlayUpdates.nowPlaying,
        choices: this.getChoices(),
      },
    ]);

    basicControls.control();
    this.basicPrompt();
  }

  getChoices() {
    return this.session.PlaybackControls.controlActions;
  }
}
