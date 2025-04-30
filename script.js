// 选择 DOM 元素
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// 固定回复内容
const fixedReply = "感谢您的咨询，我们会尽快回复您！";

// 添加用户消息到对话框
function addUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'right');
    userMessage.innerHTML = `<div class="message-content">${message}</div>`;
    chatWindow.appendChild(userMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight; // 保持滚动条在底部
}

// 添加客服回复到对话框
function addReplyMessage(reply) {
    const replyMessage = document.createElement('div');
    replyMessage.classList.add('chat-message', 'left');
    replyMessage.innerHTML = `<div class="message-content">${reply}</div>`;
    chatWindow.appendChild(replyMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight; // 保持滚动条在底部
}

// 发送按钮点击事件
sendButton.addEventListener('click', () => {
    const userInput = chatInput.value.trim();
    if (userInput) {
        addUserMessage(userInput); // 显示用户消息
        chatInput.value = ''; // 清空输入框
        setTimeout(() => addReplyMessage(fixedReply), 500); // 显示固定回复，模拟延迟
    }
});

// 输入框按 Enter 键发送消息
chatInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
// Azure Speech Service 配置
const AZURE_SUBSCRIPTION_KEY = 'RYKohZyhdBaoDTgdaEJN:XRuqUYjNmdocBsMdKFwG';
const AZURE_REGION = '你的 Azure Region'; // 例如 'eastus'

// 获取 DOM 元素
const chatMessages = document.getElementById('chat-messages');
const voiceButton = document.getElementById('voice-button');

// 引入 Azure Speech SDK
import * as SpeechSDK from 'https://cdn.jsdelivr.net/npm/microsoft-cognitiveservices-speech-sdk/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle.js';

// 初始化语音识别器
function initializeSpeechRecognizer() {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(AZURE_SUBSCRIPTION_KEY, AZURE_REGION);
    speechConfig.speechRecognitionLanguage = 'zh-CN'; // 设置为中文

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    return recognizer;
}

// 初始化语音合成器
function initializeSpeechSynthesizer() {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(AZURE_SUBSCRIPTION_KEY, AZURE_REGION);
    speechConfig.speechSynthesisLanguage = 'zh-CN'; // 设置为中文
    speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaoxiaoNeural'; // 选择语音

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    return synthesizer;
}

// 添加消息到聊天窗口
function addMessageToChat(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 滚动到底部
}

// 点击语音按钮
voiceButton.addEventListener('click', () => {
    const recognizer = initializeSpeechRecognizer();
    const synthesizer = initializeSpeechSynthesizer();

    addMessageToChat('系统', '正在监听，请开始说话...');

    recognizer.recognizeOnceAsync(
        (result) => {
            if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                const userMessage = result.text;
                addMessageToChat('用户', userMessage);

                // 根据用户输入生成回复内容
                const replyMessage = generateReply(userMessage);
                addMessageToChat('系统', replyMessage);

                // 使用语音合成播放回复
                synthesizer.speakTextAsync(replyMessage);
            } else {
                addMessageToChat('系统', '未能识别语音，请重试。');
            }
            recognizer.close();
        },
        (err) => {
            addMessageToChat('系统', `语音识别出错：${err}`);
            recognizer.close();
        }
    );
});

// 根据用户输入生成回复
function generateReply(userInput) {
    if (userInput.includes('你好')) {
        return '你好！很高兴为您服务。';
    } else if (userInput.includes('天气')) {
        return '今天天气很好，适合外出。';
    } else {
        return '抱歉，我不太明白您的意思。';
    }
}
