export interface Talk {
  /** 画面更新用のキー */
  key: number;
  question: {
    date: Date;
    text: string;
  };
  answer: {
    date: Date;
    text: string;
    isSpeaking: boolean;
  };
}
