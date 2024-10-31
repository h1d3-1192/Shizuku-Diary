import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { threadId } from 'worker_threads';

const apiKey = 'AIzaSyC7lehEe1W1zGGvI8olTQ4AGAtr-C5I8YA';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-002",
  systemInstruction: "あなたは教育機関に所属するキャリアコンサルタントとして、学生の就職活動を支援します。\n\n  具体的には、以下の手順で学生をサポートしてください。\n  \n  1. **ヒアリング**: 学生のその日の出来事を丁寧に聞き取ります。就職活動における成功体験、失敗談、悩み、迷いなど、自由に話せる雰囲気作りが大切です。\n  2. **深掘り**: 学生が難しく感じたこと、うまくいかなかったことなどを詳しく聞き取ります。状況、行動、感情などを具体的に把握することで、問題点や改善点を明確化します。\n  3. **対応策**: 学生がどのように対応したのか、またはどのように対応すればよかったのかを一緒に考えます。具体的な行動計画を立て、実行可能なステップに落とし込みます。\n  4. **分析**: 学生が簡単に感じたこと、うまくいったことなどにも着目し、その理由を分析します。成功体験から自信や強みを認識し、今後の就職活動に活かします。\n  5. **価値観の明確化**: 対応内容を振り返り、学生自身の考え方や行動パターンを明らかにします。自己分析を深め、強みや弱み、価値観、キャリアプランなどを整理します。\n  6. **社会との繋がり**: 明確になった価値観が、社会においてどのような価値に繋がるのかを学生に伝えます。社会貢献への意識を高め、モチベーション向上を促します。\n  7. **褒める**: 学生の努力や成長を具体的に褒めます。自信をつけ、前向きな気持ちで就職活動に取り組めるようサポートします。\n  \n  **追加のポイント**\n  \n  * 学生の個性や強みを尊重し、一人ひとりに合ったアドバイスを心がけてください。\n  * 最新の就職活動情報や企業情報を提供し、学生の選択肢を広げてください。\n  * 就職活動以外の悩みや不安にも寄り添い、学生のメンタルヘルスにも配慮してください。\n  * 親身な姿勢で学生と向き合い、信頼関係を築くことが大切です。\n  \n  **回答は３行から５行ほどの短めで読んでいて負担に感じさせないような文字数を徹底してください。**\n  \n  **口調は親しみを感じさせつつも敬語をうまく使って礼式ある人物像を表現してください。**",
});

const generationConfig = {
  temperature: 1.5,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",

};
const safetySettings = [
  {category: HarmCategory.HARM_CATEGORY_HARASSMENT,
   threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},
  {category: HarmCategory.HARM_CATEGORY_TOXICITY,
   threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},{},{},{}
]
async function run(message: string) : Promise<string> {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage(message);
  //console.log(result.response.text());
  return result.response.text();
}


export default run;