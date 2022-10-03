import { BrowserSession } from './BrowserSession';
import inquirer, { PromptModule } from 'inquirer';
import { Subject } from 'rxjs';
export class UserControls {
  private isSwitchingSongs = false;

  constructor(private session: BrowserSession) {
    this.basicPrompt();

    this.session.PlayUpdates.subscribe((song) => {
      if (!this.isSwitchingSongs) this.basicPrompt();
    });
  }

  async basicPrompt() {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);

    const userResponse = await inquirer.prompt([
      {
        type: 'list',
        name: 'control',
        message: this.session.PlayUpdates.nowPlaying,
        choices: this.getChoices(),
      },
    ]);
    userResponse.control();

    this.isSwitchingSongs = true;
    setTimeout(() => {
      this.isSwitchingSongs = false;
      this.basicPrompt();
    }, 500);
  }

  getChoices() {
    return [...this.session.PlaybackControls.controlActions];
  }
}
