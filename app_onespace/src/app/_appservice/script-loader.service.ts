import { Injectable } from '@angular/core';

interface Script {
  src: string;
  loaded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private _scripts: { [key: string]: Script } = {};

  /**
   * Load one or more scripts into a specific DOM tag (e.g., 'body', 'head').
   */
  load(tagSelector: string, ...scripts: string[]): Promise<{ src: string; loaded: boolean }[]> {
    const promises = scripts.map(src => this.loadScript(tagSelector, src, true));
    return Promise.all(promises);
  }

  /**
   * Load multiple scripts optionally allowing duplicates.
   */
  loadScripts(tagSelector: string, scripts: string[], loadOnce = false): Promise<{ src: string; loaded: boolean }[]> {
    const promises = scripts.map(src => this.loadScript(tagSelector, src, loadOnce));
    return Promise.all(promises);
  }

  /**
   * Load a single script dynamically.
   */
  private loadScript(tagSelector: string, src: string, loadOnce: boolean): Promise<{ src: string; loaded: boolean }> {
    if (loadOnce && this._scripts[src]?.loaded) {
      return Promise.resolve({ src, loaded: true });
    }

    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = src;

      scriptElement.onload = () => {
        this._scripts[src] = { src, loaded: true };
        resolve({ src, loaded: true });
      };

      scriptElement.onerror = () => {
        this._scripts[src] = { src, loaded: false };
        reject({ src, loaded: false });
      };

      const target = document.querySelector(tagSelector);
      if (target) {
        target.appendChild(scriptElement);
      } else {
        reject({ src, loaded: false, error: 'Target tag not found' });
      }
    });
  }
}
