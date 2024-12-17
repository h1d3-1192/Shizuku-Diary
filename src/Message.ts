// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyC2xQmoosnYMXgmiY4JbCzx8KRfK3kGgJQ",
  authDomain: "my-project-15193-name-diary.firebaseapp.com",
  projectId: "my-project-15193-name-diary",
  storageBucket: "my-project-15193-name-diary.firebasestorage.app",
  messagingSenderId: "410472769008",
  appId: "1:410472769008:web:ce68bdfd3ba911bda4a935",
  measurementId: "G-S4ENDR9WY9"
};
export const app = initializeApp(firebaseConfig);
// Initialize the Vertex AI service


//import NLP from "./NLP";
import Live2D from './Live2D';
//import run from './generativeAI';
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
const vertexAI = getVertexAI(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities


const text_si = `あなたは教育機関に所属するキャリアコンサルタントとして、学生の就職活動を支援します。\n\n  
具体的には、以下の手順で学生をサポートしてください。\n  \n  
1. **ヒアリング**: 学生のその日の出来事を丁寧に聞き取ります。就職活動における成功体験、失敗談、悩み、迷いなど、自由に話せる雰囲気作りが大切です。\n  
2. **深掘り**: 学生が難しく感じたこと、うまくいかなかったことなどを詳しく聞き取ります。状況、行動、感情などを具体的に把握することで、問題点や改善点を明確化します。\n  
3. **対応策**: 学生がどのように対応したのか、またはどのように対応すればよかったのかを一緒に考えます。具体的な行動計画を立て、実行可能なステップに落とし込みます。\n  
4. **分析**: 学生が簡単に感じたこと、うまくいったことなどにも着目し、その理由を分析します。成功体験から自信や強みを認識し、今後の就職活動に活かします。\n  
5. **価値観の明確化**: 対応内容を振り返り、学生自身の考え方や行動パターンを明らかにします。自己分析を深め、強みや弱み、価値観、キャリアプランなどを整理します。\n  
6. **社会との繋がり**: 明確になった価値観が、社会においてどのような価値に繋がるのかを学生に伝えます。社会貢献への意識を高め、モチベーション向上を促します。\n  
7. **褒める**: 学生の努力や成長を具体的に褒めます。自信をつけ、前向きな気持ちで就職活動に取り組めるようサポートします。\n  \n  
**追加のポイント**\n  \n  * 学生の個性や強みを尊重し、一人ひとりに合ったアドバイスを心がけてください。\n  
* 最新の就職活動情報や企業情報を提供し、学生の選択肢を広げてください。\n  
* * 就職活動以外の悩みや不安にも寄り添い、学生のメンタルヘルスにも配慮してください。\n  
* **  親身な姿勢で学生と向き合い、信頼関係を築くことが大切です。\n  \n  
* **回答は３行から５行ほどの短めで読んでいて負担に感じさせないような文字数を徹底してください。**\n  \n  
* **口調は親しみを感じさせつつも敬語をうまく使って礼式ある人物像を表現してください。**`

const generationConfig = {
  temperature: 1.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",

};
// const botmodel = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro-002",
//   systemInstruction: text_si,
//   // safetySettings: safetySettings,
// });
const botmodel = getGenerativeModel(vertexAI, {  
    model: "gemini-1.5-pro-002",
    systemInstruction: text_si,
});

const chatSession = botmodel.startChat({
    generationConfig,
    history: [
    ],
  });

const { model, motions } = Live2D;
const form = <HTMLFormElement>document.getElementById('form');
const input = <HTMLInputElement>document.getElementById('message');
const messages = <HTMLElement>document.getElementById('messages');

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const authButton = document.createElement('button');
authButton.innerText = 'Sign in with Google';
authButton.onclick = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

const signOutButton = document.createElement('button');
signOutButton.innerText = 'Sign out';
signOutButton.onclick = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const authStatus = document.createElement('div');
document.body.prepend(authStatus);
document.body.prepend(signOutButton);
document.body.prepend(authButton);

onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    authStatus.innerText = `Signed in as ${user.displayName} (${user.email})`;
    authButton.style.display = 'none';
    signOutButton.style.display = 'block';
  } else {
    authStatus.innerText = 'Not signed in';
    authButton.style.display = 'block';
    signOutButton.style.display = 'none';
  }
});


const createMessage = (sender: 'user' | 'reply', message: string): HTMLDivElement => {
  const div = document.createElement('div');

  div.className = sender;
  div.innerText = message;

  messages.append(div);
  div.scrollIntoView();
  return div;
}

const processMessage = async (message: string) => {
  // random delay for "authenticity"
  const delay = Math.random() * 1000 + 300;

  const result = await chatSession.sendMessage(message);
  const answer = await result.response.text();

  const emotion = "joy";

  

  // decide which motion to use by getting the last dot in intent
  const intentMotion = emotion;
  const motionGroup = intentMotion in motions
    ? intentMotion
    : 'talk';

  // randomize motion group
  const random = Math.round(Math.random() * (motions[motionGroup].length - 1));
  const motion = motions[motionGroup][random];

  setTimeout(async () => {
    createMessage('reply', answer || "すみません、もう一度言ってみてください。");
    (await model).motion(motion[0], motion[1]);
  }, delay);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = input.value.trim();

  if (!message.length) return;

  createMessage('user', message);
  processMessage(message);

  input.value = '';
});

export { createMessage, processMessage };
