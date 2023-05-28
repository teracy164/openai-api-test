import { Configuration, OpenAIApi } from 'openai';

declare module '#app' {
  interface NuxtApp {
    $speech: SpeechAPI;
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $speech: SpeechAPI;
  }
}
interface SpeechRecognitionResult {
  [id: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[];
}

interface SpeechRecognition {
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}

/** 会話用プラグイン */
class SpeechAPI {
  /** 音声認識用APIインスタンス */
  private _instListen: SpeechRecognition;

  constructor() {}

  /** 音声認識用APIが使用できるかチェック */
  public isAvailableListen() {
    return !!this.SpeechRecognitionClass;
  }

  public isAvailableSpeech() {
    return 'speechSynthesis' in window;
  }

  private get SpeechRecognitionClass() {
    const global = window as any;
    return global.webkitSpeechRecognition || global.SpeechRecognition;
  }

  private getSpeechRecognitionInst() {
    const c = this.SpeechRecognitionClass;
    return new c();
  }

  /**
   * 初期化処理
   * ※windowを参照するため、onload以降のタイミングで呼び出すこと
   */
  public init() {
    this.initListen();
  }

  private initListen() {
    const global = window as any;
    const SpeechRecognition = global.webkitSpeechRecognition || global.SpeechRecognition;
    if (SpeechRecognition) {
      this._instListen = new SpeechRecognition();
    }
  }

  /** 音声認識開始 */
  public listen(): Promise<string> {
    if (!this.isAvailableListen) return;

    return new Promise((resolve, reject) => {
      if (this._instListen) {
        this._instListen.stop();
      }

      this._instListen = this.getSpeechRecognitionInst();
      this._instListen.onresult = (event: SpeechRecognitionEvent) => {
        // 認識完了したら音声認識停止
        this._instListen.stop();
        resolve(event.results[0][0].transcript);
      };
      this._instListen.onerror = (err: any) => {
        this._instListen.stop();
        reject(err);
      };
      this._instListen.start();
    });
  }

  /** 音声認識停止 */
  public listenStop() {
    if (!this.isAvailableListen) return;

    this._instListen.stop();
  }

  /** テキスト読み上げ */
  public speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isAvailableSpeech) return reject(new Error('非対応です'));

      const inst = new SpeechSynthesisUtterance();
      // 言語を設定
      inst.lang = 'ja-JP';
      // 速度を設定
      inst.rate = 1;
      // 高さを設定
      inst.pitch = 1;
      // 音量を設定
      inst.volume = 1;
      // 読み上げテキストを設定
      inst.text = text;

      // ハンドリング
      inst.onend = () => {
        console.log('speak on end');
        resolve();
      };
      inst.onerror = (ev) => {
        console.error('speak error');
        reject(ev);
      };

      console.log('speak start', text);
      speechSynthesis.speak(inst);
    });
  }

  /** 読み上げ停止 */
  public stopSpeak() {
    if (!this.isAvailableSpeech) return;
    speechSynthesis.pause();
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      speech: new SpeechAPI(),
    },
  };
});
