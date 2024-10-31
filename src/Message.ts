//import NLP from "./NLP";
import Live2D from './Live2D';
import run from './generativeAI';

const { model, motions } = Live2D;
const form = <HTMLFormElement>document.getElementById('form');
const input = <HTMLInputElement>document.getElementById('message');
const messages = <HTMLElement>document.getElementById('messages');

const createMessage = (sender: 'user' | 'reply', message: string) => {
  const div = document.createElement('div');

  div.className = sender;
  div.innerText = message;

  messages.append(div);
  div.scrollIntoView();
}

const processMessage = async (message: string) => {
  // random delay for "authenticity"
  const delay = Math.random() * 1000 + 300;
  
  const answer = await run(message)


  const emotion = "joy";

  

  // decide which motion to use by getting the last dot in intent
  const intentMotion = emotion;
  const motionGroup = intentMotion in motions
    ? intentMotion
    : 'talk';

  // randomize motion group
  const random = Math.round(Math.random() * (motions[motionGroup].length - 1));
  const motion = motions[motionGroup][random];

  setTimeout(() => {
    createMessage('reply', answer || "すみません、もう一度言ってみてください。");
    model.motion(motion[0], motion[1]);
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
