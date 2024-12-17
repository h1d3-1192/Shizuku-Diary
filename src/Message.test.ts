import { createMessage } from './Message';

describe('createMessage', () => {
  it('should create a div element with the correct class and text', () => {
    const sender = 'user';
    const message = 'Test message';
    const div = createMessage(sender, message);
    expect(div.className).toBe(sender);
    expect(div.innerText).toBe(message);
  });
});
