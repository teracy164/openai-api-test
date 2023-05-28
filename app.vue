<template>
  <main>
    <!-- input area -->
    <div class="input-area">
      <div class="wrapper">
        <textarea :disabled="isLoading" v-model="input" rows="3" placeholder="質問を入力" />
        <div>
          <button :disabled="isLoading" @click="chat">チャット</button>
          <button :disabled="isLoading" @click="listen">音声入力</button>
        </div>
      </div>
    </div>
    <!-- input area -->
    <!-- Talk area -->
    <div class="talk-area">
      <div :key="updKey" class="thread">
        <div v-for="talk of talks" :key="talk.key">
          <div class="talk-wrapper question">
            <div class="talk">
              <p class="date">
                {{ dateFormat(talk.question.date) }}
              </p>
              <Markdown :text="talk.question.text" />
            </div>
          </div>
          <div class="talk-wrapper answer">
            <div class="talk">
              <template v-if="talk.answer.text">
                <p class="date">
                  {{ dateFormat(talk.answer.date) }}
                  <button v-if="talk.answer.isSpeaking" @click="stopSpeak(talk)">stop</button>
                </p>
                <Markdown :text="talk.answer.text" />
              </template>
              <span v-else>．．．</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
const input = ref('');
const updKey = ref(0);

const { $speech } = useNuxtApp();

interface Talk {
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
const talks = ref<Talk[]>([]);
const isLoading = ref(false);

onMounted(() => {
  $speech.init();
});

const dateFormat = (date: Date) => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const min = `00${date.getMinutes()}`.slice(-2);
  const sec = `00${date.getSeconds()}`.slice(-2);
  return [year, month, day].join('/') + ' ' + [hour, min, sec].join(':');
};

const chat = async () => {
  isLoading.value = true;

  try {
    const { $openApi } = useNuxtApp();

    const inputValue = input.value;

    const talk: Talk = {
      key: 0,
      question: {
        date: new Date(),
        text: inputValue,
      },
      answer: {
        date: null,
        text: '',
        isSpeaking: false,
      },
    };

    talks.value = [talk, ...talks.value];
    input.value = '';

    const answer = await $openApi.chat(talks.value.reverse());
    console.log('answer', answer);

    talk.answer = {
      date: new Date(),
      text: answer,
      isSpeaking: true,
    };
    talk.key++;
    updKey.value = updKey.value + 1;

    setTimeout(() => {
      // 読み上げ
      $speech
        .speak(answer)
        .then(() => {
          console.log('speak end');
        })
        .finally(() => {
          console.log('speak finally');
          talk.answer.isSpeaking = false;
          setTimeout(() => {
            talk.key++;
            updKey.value = updKey.value + 1;
          });
        });
    });
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const stopSpeak = (talk: Talk) => {
  $speech.stopSpeak();
  talk.answer.isSpeaking = false;
};

const listen = async () => {
  isLoading.value = true;
  try {
    // 音声認識開始。
    // 話した内容を入力欄に反映
    input.value = await $speech.listen();
    console.log('listen end', input.value);

    chat();
  } catch (err) {
    console.error(err);
    alert('エラーが発生しました');
  } finally {
    isLoading.value = false;
  }
};
</script>
<style lang="scss">
$heightInputArea: 100px;
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
main {
  padding: 1.5em;
  width: 100vw;
  padding-top: $heightInputArea;
}
button + button {
  margin-left: 5px;
}
.input-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: $heightInputArea;
  background-color: #ffcccc;
  display: flex;
  justify-content: center;

  .wrapper {
    width: 800px;
    max-width: 80vw;
    width: 100%;
    padding: 10px;
  }

  textarea {
    width: 100%;
    resize: none;
  }
}

.talk-area {
  margin-top: 20px;
  display: flex;
  justify-content: center;

  .thread {
    max-width: 800px;
    width: 100%;
  }
}
.talk-wrapper {
  width: 100%;
  display: flex;
}
.talk-wrapper.question {
  justify-content: start;
}
.talk-wrapper.answer {
  justify-content: end;
}
.talk {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 3px 3px #f0f0f0;

  .date {
    margin: 0;
    font-size: 0.8em;
    color: lightgray;
  }
}
.question > .talk {
  margin-right: 50px;
  background-color: #fff6f6;
}
.answer > .talk {
  margin-left: 50px;
  background-color: #f6f6ff;
}
</style>
