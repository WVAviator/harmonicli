import fs from 'fs';

const CONFIG_DIR: string = `${process.env.HOME}/.mcli`
const CONFIG_PATH: string = `${CONFIG_DIR}/config.json`;

type ColorOptions = {
  textColor: string,
  focusColor: string,
  unfocusedColor: string,
  gradient: string,
}

export interface Config {
  colors?: ColorOptions,
  defaultPlayer?: string,
}

const defaultConfig: Config = {
  'colors': {
    textColor: 'white',
    focusColor: 'yellow',
    unfocusedColor: 'white',
    gradient: 'summer',
  },
  'defaultPlayer': 'YTMusic',
}

// Will refactor later using getter/setter.
const ConfigUtils = {

  /**
   * Saves the config to file.
   * Path is '$HOME/.mcli/config.json'
   * 
   * @param key Config item.
   * @param value Value item.
   */
  save: function (key: string, value: string): void {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ ...this.getConfig(), [key]: value }));
  },

  /**
   * Resets a config item.
   * Resets entire config if there is no item specified.
   * 
   * @param key Config item to reset.
   */
  reset: function (key?: string): void {
    if (key) {
      this.save(key, '');
    } else {
      fs.rmSync(CONFIG_DIR, { recursive: true });
    }
  },
  
  /**
   * Gets config entries from the config file.
   */
  // I'm sure there's a better way to do this.
  // TODO: error handling
  getConfig: function (): Config {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, { encoding: 'utf-8' }));
    } catch (err) {
      fs.mkdirSync(CONFIG_DIR);
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig));
      return this.getConfig();
    }
  }
}

export default ConfigUtils;