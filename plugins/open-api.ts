import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
import { Talk } from '~/types/talk';

declare module '#app' {
  interface NuxtApp {
    $openApi: OpenApi;
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $openApi: OpenApi;
  }
}

enum Mode {
  NONE = 0,
  INIT,
  READY,
}

class OpenApi {
  private _mode: Mode = Mode.NONE;
  private _config: Configuration;
  private _openai: OpenAIApi;

  constructor() {
    this.init();
  }

  get isReady() {
    return this._mode === Mode.READY;
  }

  private async init() {
    const runtimeConfig = useRuntimeConfig();
    this._mode = Mode.INIT;
    this._config = new Configuration({
      organization: 'org-JnB4yyWCL2WM6afvtNMeDK14',
      apiKey: runtimeConfig.public.openApiKey,
    });

    this._openai = new OpenAIApi(this._config);
    this._mode = Mode.READY;
  }

  async chat(talks: Talk[]) {
    const messages: ChatCompletionRequestMessage[] = talks
      .map((t) => {
        const m: ChatCompletionRequestMessage[] = [
          {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: t.question.text,
          },
        ];
        if (t.answer.text) {
          m.push({
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: t.answer.text,
          });
        }
        return m;
      })
      .flat();

    const completion = await this._openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });
    return completion?.data?.choices?.at(0)?.message?.content;
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      openApi: new OpenApi(),
    },
  };
});
