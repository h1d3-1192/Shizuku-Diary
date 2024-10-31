```
[![NPM Downloads](https://img.shields.io/npm/dm/%40google-cloud%2Fvertexai)](https://www.npmjs.com/package/@google-cloud/vertexai)
[![Node Current](https://img.shields.io/node/v/%40google-cloud%2Fvertexai)](https://www.npmjs.com/package/@google-cloud/vertexai)

# Node.js 用 Vertex AI SDK クイックスタート

Node.js 用 Vertex AI SDK を使用すると、Vertex AI Gemini API を使用して、AI を活用した機能とアプリケーションを構築できます。TypeScript と JavaScript の両方がサポートされています。このドキュメントのサンプルコードは、JavaScript で記述されています。

Vertex AI Node.js SDK を使用した詳細なサンプルについては、GitHub の [サンプルリポジトリ](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/main/generative-ai/snippets) をご覧ください。

Vertex AI で利用可能な Gemini モデルの最新リストについては、Vertex AI ドキュメントの [モデル情報](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models#gemini-models) ページをご覧ください。

## 開始する前に

1.  node.js のバージョンが 18 以上であることを確認してください。
1.  Google Cloud プロジェクトを [選択](https://console.cloud.google.com/project) または [作成](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) します。
1.  [プロジェクトの課金を有効にします](https://cloud.google.com/billing/docs/how-to/modify-project)。
1.  [Vertex AI API を有効にします](https://console.cloud.google.com/flows/enableapi?apiid=aiplatform.googleapis.com)。
1.  [gcloud CLI をインストールします](https://cloud.google.com/sdk/docs/install)。
1.  [gcloud CLI を初期化します](https://cloud.google.com/sdk/docs/initializing)。
1.  ユーザーアカウントのローカル認証資格を作成します。

    ```sh
    gcloud auth application-default login
    ```
GoogleAuthOptions インターフェースのリストは、google-auth-library-node.js GitHub レポの [GoogleAuthOptions](https://github.com/googleapis/google-auth-library-nodejs/blob/3ae120d0a45c95e36c59c9ac8286483938781f30/src/auth/googleauth.ts#L87) にあります。
1.  公式ドキュメントは、[Vertex AI SDK 概要](https://cloud.google.com/vertex-ai/generative-ai/docs/reference/nodejs/latest/overview) ページでご覧いただけます。ここから、クラス、インターフェース、列挙型に関する完全なドキュメントリストがご覧いただけます。

## SDK をインストールする

次のコマンドを実行して、Node.js 用 Vertex AI SDK をインストールします。

```shell
npm install @google-cloud/vertexai
```

## `VertexAI` クラスを初期化する

Node.js 用 Vertex AI SDK を使用するには、Google Cloud プロジェクト ID とロケーションを渡して `VertexAI` のインスタンスを作成します。次に、VertexAI クラスメソッドを使用して、GenerativeModel クラスのインスタンスを作成します。

```javascript
const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');

const project = 'your-cloud-project';
const location = 'us-central1';
const textModel =  'gemini-1.0-pro';
const visionModel = 'gemini-1.0-pro-vision';

const vertexAI = new VertexAI({project: project, location: location});

// Gemini モデルをインスタンス化する
const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // 次のパラメータはオプションです
    // これらのパラメータは、個々のコンテンツ生成リクエストにも渡すことができます
    safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
    generationConfig: {maxOutputTokens: 256},
    systemInstruction: {
      role: 'system',
      parts: [{"text": `For example, you are a helpful customer service agent.`}]
    },
});

const generativeVisionModel = vertexAI.getGenerativeModel({
    model: visionModel,
});

const generativeModelPreview = vertexAI.preview.getGenerativeModel({
    model: textModel,
});
```

## テキストプロンプトレクエストを送信する

ストリーミングされたレスポンスには `generateContentStream` を使用し、ストリーミングされていないレスポンスには `generateContent` を使用して、テキストプロンプトレクエストを送信できます。

### ストリーミングされたテキストレスポンスを取得する

レスポンスは生成中にチャンクで返されるため、人間の読者にとってはレイテンシが少なく感じられます。

```typescript
async function streamGenerateContent() {
  const request = {
    contents: [{role: 'user', parts: [{text: 'How are you doing today?'}]}],
  };
  const streamingResult = await generativeModel.generateContentStream(request);
  for await (const item of streamingResult.stream) {
    console.log('stream chunk: ', JSON.stringify(item));
  }
  const aggregatedResponse = await streamingResult.response;
  console.log('aggregated response: ', JSON.stringify(aggregatedResponse));
};

streamGenerateContent();
```

### ストリーミングされていないテキストレスポンスを取得する

レスポンスは一度にすべて返されます。

```javascript
async function generateContent() {
  const request = {
    contents: [{role: 'user', parts: [{text: 'How are you doing today?'}]}],
  };
  const result = await generativeModel.generateContent(request);
  const response = result.response;
  console.log('Response: ', JSON.stringify(response));
};

generateContent();
```

## マルチターンチャットリクエストを送信する

チャットリクエストは、新しいプロンプトに応答する際に、以前のメッセージをコンテキストとして使用します。マルチターンチャットリクエストを送信するには、ストリーミングされたレスポンスには `sendMessageStream` を使用し、ストリーミングされていないレスポンスには `sendMessage` を使用します。

### ストリーミングされたチャットレスポンスを取得する

レスポンスは生成中にチャンクで返されるため、人間の読者にとってはレイテンシが少なく感じられます。

```javascript
async function streamChat() {
  const chat = generativeModel.startChat();
  const chatInput = "How can I learn more about Node.js?";
  const result = await chat.sendMessageStream(chatInput);
  for await (const item of result.stream) {
      console.log("Stream chunk: ", item.candidates[0].content.parts[0].text);
  }
  const aggregatedResponse = await result.response;
  console.log('Aggregated response: ', JSON.stringify(aggregatedResponse));
}

streamChat();
```

### ストリーミングされていないチャットレスポンスを取得する

レスポンスは一度にすべて返されます。

```javascript
async function sendChat() {
  const chat = generativeModel.startChat();
  const chatInput = "How can I learn more about Node.js?";
  const result = await chat.sendMessage(chatInput);
  const response = result.response;
  console.log('response: ', JSON.stringify(response));
}

sendChat();
```

## プロンプトレクエストに画像や動画を含める

プロンプトレクエストには、テキストに加えて、画像または動画を含めることができます。詳細については、Vertex AI ドキュメントの [マルチモーダルプロンプトレクエストを送信する](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/send-multimodal-prompts) をご覧ください。

### 画像を含める

画像は、画像が保存されている Cloud Storage URI を指定するか、画像の base64 エンコーディングを含めることで、プロンプトに含めることができます。

#### 画像の Cloud Storage URI を指定する

`fileUri` に画像の Cloud Storage URI を指定できます。

```javascript
async function multiPartContent() {
    const filePart = {fileData: {fileUri: "gs://generativeai-downloads/images/scones.jpg", mimeType: "image/jpeg"}};
    const textPart = {text: 'What is this picture about?'};
    const request = {
        contents: [{role: 'user', parts: [textPart, filePart]}],
      };
    const streamingResult = await generativeVisionModel.generateContentStream(request);
    for await (const item of streamingResult.stream) {
      console.log('stream chunk: ', JSON.stringify(item));
    }
    const aggregatedResponse = await streamingResult.response;
    console.log(aggregatedResponse.candidates[0].content);
}

multiPartContent();
```

#### base64 画像エンコーディング文字列を指定する

`data` に base64 画像エンコーディング文字列を指定できます。

```javascript
async function multiPartContentImageString() {
    // これは、独自の base64 画像文字列に置き換えてください
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const filePart = {inline_data: {data: base64Image, mimeType: 'image/jpeg'}};
    const textPart = {text: 'What is this picture about?'};
    const request = {
        contents: [{role: 'user', parts: [textPart, filePart]}],
      };
    const streamingResult = await generativeVisionModel.generateContentStream(request);
    const contentResponse = await streamingResult.response;
    console.log(contentResponse.candidates[0].content.parts[0].text);
}

multiPartContentImageString();
```

### 動画を含める

`fileUri` に動画が保存されている Cloud Storage URI を指定することで、動画をプロンプトに含めることができます。

```javascript
async function multiPartContentVideo() {
    const filePart = {fileData: {fileUri: 'gs://cloud-samples-data/video/animals.mp4', mimeType: 'video/mp4'}};
    const textPart = {text: 'What is in the video?'};
    const request = {
        contents: [{role: 'user', parts: [textPart, filePart]}],
      };
    const streamingResult = await generativeVisionModel.generateContentStream(request);
    for await (const item of streamingResult.stream) {
      console.log('stream chunk: ', JSON.stringify(item));
    }
    const aggregatedResponse = await streamingResult.response;
    console.log(aggregatedResponse.candidates[0].content);
}

multiPartContentVideo();
```

## 関数呼び出し

Node.js 用 Vertex AI SDK は、`sendMessage`、`sendMessageStream`、`generateContent`、`generateContentStream` メソッドで [関数呼び出し](https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/function-calling) をサポートしています。チャットメソッド (`sendMessage` または `sendMessageStream`) を使用することをお勧めしますが、以下に両方の方法の例を示します。

### 関数を宣言する

次の例では、関数の宣言方法を示します。

```javascript
const functionDeclarations = [
  {
    functionDeclarations: [
      {
        name: "get_current_weather",
        description: 'get weather in a given location',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            location: {type: FunctionDeclarationSchemaType.STRING},
            unit: {
              type: FunctionDeclarationSchemaType.STRING,
              enum: ['celsius', 'fahrenheit'],
            },
          },
          required: ['location'],
        },
      },
    ],
  },
];

const functionResponseParts = [
  {
    functionResponse: {
      name: "get_current_weather",
      response:
          {name: "get_current_weather", content: {weather: "super nice"}},
    },
  },
];
```

### `sendMessageStream` を使用した関数呼び出し

関数を宣言したら、プロンプトレクエストの `tools` パラメータに渡すことができます。

```javascript
async function functionCallingChat() {
  // チャットセッションを作成し、関数宣言を渡します
  const chat = generativeModel.startChat({
    tools: functionDeclarations,
  });

  const chatInput1 = 'What is the weather in Boston?';

  // これは、モデルからの関数呼び出しレスポンスを含むはずです
  const streamingResult1 = await chat.sendMessageStream(chatInput1);
  for await (const item of streamingResult1.stream) {
    console.log(item.candidates[0]);
  }
  const response1 = await streamingResult1.response;
  console.log("first aggregated response: ", JSON.stringify(response1));

  // 関数レスポンスを伴うフォローアップメッセージを送信します
  const streamingResult2 = await chat.sendMessageStream(functionResponseParts);
  for await (const item of streamingResult2.stream) {
    console.log(item.candidates[0]);
  }

  // これは、上記のレスポンスコンテンツを使用して、モデルからテキストレスポンスを含むはずです
  const response2 = await streamingResult2.response;
  console.log("second aggregated response: ", JSON.stringify(response2));
}

functionCallingChat();
```

### `generateContentStream` を使用した関数呼び出し

```javascript
async function functionCallingGenerateContentStream() {
  const request = {
    contents: [
      {role: 'user', parts: [{text: 'What is the weather in Boston?'}]},
      {role: 'model', parts: [{functionCall: {name: 'get_current_weather', args: {'location': 'Boston'}}}]},
      {role: 'user', parts: functionResponseParts}
    ],
    tools: functionDeclarations,
  };
  const streamingResult =
      await generativeModel.generateContentStream(request);
  for await (const item of streamingResult.stream) {
    console.log(item.candidates[0]);
  }
}

functionCallingGenerateContentStream();
```

## トークンのカウント

```javascript
async function countTokens() {
  const request = {
      contents: [{role: 'user', parts: [{text: 'How are you doing today?'}]}],
    };
  const response = await generativeModel.countTokens(request);
  console.log('count tokens response: ', JSON.stringify(response));
}

countTokens();
```


## グランディング (プレビュー)

グランディングは、プレビュー限定の機能です。

グランディングを使用すると、モデルの出力を検証可能な情報源に接続して、幻覚を減らすことができます。Google Search または Vertex AI Search をグランディングのデータソースとして指定できます。

### Google Search を使用したグランディング (プレビュー)

```javascript
async function generateContentWithGoogleSearchGrounding() {
  const generativeModelPreview = vertexAI.preview.getGenerativeModel({
    model: textModel,
    // 次のパラメータはオプションです
    // これらのパラメータは、個々のコンテンツ生成リクエストにも渡すことができます
    safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
    generationConfig: {maxOutputTokens: 256},
  });

  const googleSearchRetrievalTool = {
    googleSearchRetrieval: {
      disableAttribution: false,
    },
  };
  const result = await generativeModelPreview.generateContent({
    contents: [{role: 'user', parts: [{text: 'Why is the sky blue?'}]}],
    tools: [googleSearchRetrievalTool],
  })
  const response = result.response;
  const groundingMetadata = response.candidates[0].groundingMetadata;
  console.log("GroundingMetadata is: ", JSON.stringify(groundingMetadata));
}
generateContentWithGoogleSearchGrounding();

```

### Vertex AI Search を使用したグランディング (プレビュー)

```javascript
async function generateContentWithVertexAISearchGrounding() {
  const generativeModelPreview = vertexAI.preview.getGenerativeModel({
    model: textModel,
    // 次のパラメータはオプションです
    // これらのパラメータは、個々のコンテンツ生成リクエストにも渡すことができます
    safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
    generationConfig: {maxOutputTokens: 256},
  });

  const vertexAIRetrievalTool = {
    retrieval: {
      vertexAiSearch: {
        datastore: 'projects/.../locations/.../collections/.../dataStores/...',
      },
      disableAttribution: false,
    },
  };
  const result = await generativeModelPreview.generateContent({
    contents: [{role: 'user', parts: [{text: 'Why is the sky blue?'}]}],
    tools: [vertexAIRetrievalTool],
  })
  const response = result.response;
  const groundingMetadata = response.candidates[0].groundingMetadata;
  console.log("Grounding metadata is: ", JSON.stringify(groundingMetadata));
}
generateContentWithVertexAISearchGrounding();

```
## システムインストラクション

生成モデルをインスタンス化するときに、モデルにさらにコンテキストを提供するためのオプションのシステムインストラクションを含めることができます。

システムインストラクションは、個々のテキストプロンプトレクエストにも渡すことができます。

### 生成モデルのインスタンス化にシステムインストラクションを含める

```javascript
const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // 次のパラメータはオプションです。
    systemInstruction: {
      role: 'system',
      parts: [{"text": `For example, you are a helpful customer service agent.`}]
    },
});
```

### テキストプロンプトレクエストにシステムインストラクションを含める

```javascript
async function generateContent() {
  const request = {
    contents: [{role: 'user', parts: [{text: 'How are you doing today?'}]}],
    systemInstruction: { role: 'system', parts: [{ text: `For example, you are a helpful customer service agent.` }] },
  };
  const result = await generativeModel.generateContent(request);
  const response = result.response;
  console.log('Response: ', JSON.stringify(response));
};

generateContent();
```
## FAQ
### デフォルトオプションではなく、認証オプションを指定する必要がある場合はどうすればよいですか？

**ステップ 1**: GoogleAuthOptions インターフェースのリストは、google-auth-library-node.js GitHub レポの [GoogleAuthOptions](https://github.com/googleapis/google-auth-library-nodejs/blob/3ae120d0a45c95e36c59c9ac8286483938781f30/src/auth/googleauth.ts#L87) にあります。

**ステップ 2:** 次のように、`GoogleAuthOptions` インターフェースを渡して `VertexAI` クラスをインスタンス化します。


```javascript

const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleAuthOptions } = require('google-auth-library');
const vertexAI = new VertexAI(
  {
    googleAuthOptions: {
      // GoogleAuthOptions インターフェース
    }
  }
)
```

## ライセンス

このリポジトリの内容は、[Apache License バージョン 2.0](http://www.apache.org/licenses/LICENSE-2.0) によってライセンスされています。
```