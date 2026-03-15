/**
 * 流式请求使用示例 - AI 聊天场景
 *
 * 本示例展示如何使用 @panther-expo/core 的流式请求功能
 * 实现一个类似 ChatGPT 的逐字显示效果
 */

import { streamRequest, StreamController } from '../src/api/stream-request';
import { BaseAPI } from '../src/api/base-api';

// ==================== 示例 1: 基础使用方式 ====================

/**
 * 基础流式请求 - 直接调用 streamRequest
 */
function basicStreamExample() {
  let fullMessage = '';

  const controller = streamRequest(
    {
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: {
        Authorization: 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
      },
      body: {
        model: 'gpt-4',
        messages: [{ role: 'user', content: '你好，请介绍一下自己' }],
        stream: true,
      },
      timeout: 60000,
      retryCount: 2,
    },
    {
      // 开始接收数据
      onStart: () => {
        console.log('🤖 AI 开始回复...');
      },

      // 接收到数据片段（逐字/逐句）
      onMessage: (chunk: any) => {
        // OpenAI 格式的响应解析
        const content = chunk.choices?.[0]?.delta?.content || '';
        fullMessage += content;

        // 实时更新 UI（在 React Native 中可以是 setState）
        console.log('收到片段:', content);
      },

      // 发生错误
      onError: error => {
        console.error('❌ 请求失败:', error.message);
        if (error.statusCode === 401) {
          console.log('提示：API Key 无效');
        }
      },

      // 完成接收
      onComplete: () => {
        console.log('✅ 回复完成，完整内容:', fullMessage);
      },
    }
  );

  // 返回控制器，允许外部中断
  return controller;
}

// ==================== 示例 2: 使用 BaseAPI 子类 ====================

/**
 * 定义聊天消息类型
 */
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * 定义 AI 响应片段类型
 */
interface AIChunk {
  id: string;
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

/**
 * ChatAPI 类 - 封装聊天相关的 API 调用
 */
class ChatAPI extends BaseAPI {
  constructor() {
    super({
      baseURL: 'https://api.openai.com/v1',
      defaultHeaders: {
        Authorization: 'Bearer YOUR_API_KEY',
      },
    });
  }

  /**
   * 发送消息并流式接收回复
   *
   * @param messages 历史消息列表
   * @param onChunk 收到数据片段的回调
   * @returns StreamController 可用于中断生成
   */
  public sendMessageStream(
    messages: ChatMessage[],
    onChunk: (content: string, isDone: boolean) => void
  ): StreamController {
    return this.stream<AIChunk>(
      '/chat/completions',
      {
        model: 'gpt-4',
        messages,
        stream: true,
        temperature: 0.7,
      },
      {
        onStart: () => {
          console.log('开始生成回复...');
        },
        onMessage: chunk => {
          const content = chunk.choices?.[0]?.delta?.content || '';
          const isDone = chunk.choices?.[0]?.finish_reason === 'stop';
          onChunk(content, isDone);
        },
        onError: error => {
          console.error('生成失败:', error.message);
          onChunk('', true); // 标记结束
        },
        onComplete: () => {
          onChunk('', true); // 标记结束
        },
      },
      {
        timeout: 120000, // 2 分钟超时
        retryCount: 1, // 失败重试 1 次
      }
    );
  }
}

// ==================== 示例 3: React Native 聊天组件 ====================

/**
 * 模拟的 React Native 聊天组件（伪代码）
 * 展示如何在实际应用中使用流式请求
 */
class ChatComponent {
  private chatAPI = new ChatAPI();
  private currentController: StreamController | null = null;
  private messages: Array<{ role: string; content: string }> = [];

  /**
   * 发送用户消息
   */
  sendUserMessage(userInput: string) {
    // 1. 添加用户消息到列表
    this.messages.push({ role: 'user', content: userInput });

    // 2. 创建空的 AI 回复占位
    const aiMessageIndex = this.messages.length;
    this.messages.push({ role: 'assistant', content: '' });

    // 3. 发起流式请求
    this.currentController = this.chatAPI.sendMessageStream(this.messages, (content, isDone) => {
      if (content) {
        // 逐字追加到 AI 回复中
        this.messages[aiMessageIndex].content += content;
        this.updateUI();
      }

      if (isDone) {
        console.log('AI 回复完成');
        this.currentController = null;
      }
    });
  }

  /**
   * 中断当前生成
   */
  stopGeneration() {
    if (this.currentController?.isActive()) {
      this.currentController.abort();
      this.currentController = null;
      console.log('用户中断了生成');
    }
  }

  /**
   * 更新 UI（实际项目中会触发 React 重新渲染）
   */
  private updateUI() {
    console.log('当前消息列表:', this.messages);
  }
}

// ==================== 示例 4: 错误处理与重连 ====================

/**
 * 带错误处理和自动重连的高级示例
 */
function advancedStreamWithRetry() {
  let retryAttempts = 0;
  const maxRetries = 3;

  const controller = streamRequest(
    {
      url: 'https://api.example.com/ai-stream',
      method: 'POST',
      body: { prompt: '讲个故事' },
      retryCount: maxRetries,
      retryDelay: 2000,
      timeout: 30000,
    },
    {
      onStart: () => {
        console.log('开始请求...');
        retryAttempts = 0;
      },

      onMessage: (chunk: any) => {
        console.log('收到数据:', chunk);
        // 重置重试计数器（收到数据表示连接正常）
        retryAttempts = 0;
      },

      onError: error => {
        retryAttempts++;
        console.error(`第 ${retryAttempts} 次尝试失败:`, error.message);

        if (retryAttempts >= maxRetries) {
          console.error('已达到最大重试次数，请检查网络或稍后重试');
          // 可以在这里显示用户提示
        }
      },

      onComplete: () => {
        console.log('请求完成');
      },
    }
  );

  return controller;
}

// ==================== 导出示例 ====================

export { basicStreamExample, ChatAPI, ChatComponent, advancedStreamWithRetry };
