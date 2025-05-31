import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bubble, Sender, useXChat, useXAgent } from '@ant-design/x';
import { FaRobot } from 'react-icons/fa';
import { Input, Select, Button, Spin, message } from 'antd';
import axios from 'axios';

// 后端API地址
const API_BASE_URL = 'http://localhost:8501';

// 提示词模板选项
const promptTemplates = [
  { value: 'yuanbao', label: '元宝总结' },
  { value: 'coolpapaers', label: 'Papers.cool风格' },
  { value: 'summary', label: '简洁总结' },
];

const AIChat = () => {
  const [paperUrl, setPaperUrl] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('yuanbao');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // 创建AI代理
  const [agent] = useXAgent({
    // 连接到SmartPaper后端API
    request: async (info, callbacks) => {
      const { message } = info;
      const { onUpdate, onSuccess, onError } = callbacks;
      
      // 检查消息是否包含论文URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urlMatches = message.match(urlRegex);
      
      try {
        setLoading(true);
        setErrorMsg('');
        
        if (urlMatches && urlMatches.length > 0) {
          // 提取URL并处理论文
          const paperUrl = urlMatches[0];
          await processPaper(paperUrl, selectedPrompt, onUpdate, onSuccess);
        } else if (paperUrl) {
          // 使用已输入的URL
          await processPaper(paperUrl, selectedPrompt, onUpdate, onSuccess);
        } else {
          // 普通对话，使用简单回复
          let content = '';
          const response = `感谢您的提问！我是SmartPaper的AI助手。您问到的是："${message}"。请提供一个论文URL，我可以帮您分析。`;
          
          // 模拟流式响应
          for (let i = 0; i < response.length; i++) {
            content += response[i];
            onUpdate(content);
            await new Promise(resolve => setTimeout(resolve, 20));
          }
          
          onSuccess(content);
        }
      } catch (error) {
        console.error('处理请求时出错:', error);
        setErrorMsg(error.message || '处理请求时出错');
        onError(error.message || '处理请求时出错');
      } finally {
        setLoading(false);
      }
    },
  });
  
  // 处理论文分析
  const processPaper = async (url, promptName, onUpdate, onSuccess) => {
    try {
      // 这里我们模拟与后端API的交互
      // 实际项目中，你需要替换为真实的API调用
      let content = '';
      const response = `正在分析论文: ${url}\n使用提示词模板: ${promptName}\n\n# 论文分析结果\n\n## 摘要\n这是一篇关于人工智能的论文，主要研究了深度学习在自然语言处理中的应用。\n\n## 主要贡献\n1. 提出了一种新的模型架构\n2. 在多个基准测试上取得了SOTA结果\n3. 开源了代码和预训练模型\n\n## 方法论\n作者使用了Transformer架构，并进行了以下改进...\n\n## 实验结果\n在GLUE基准测试上，该模型平均得分提高了2.3%...`;
      
      // 模拟流式响应
      for (let i = 0; i < response.length; i++) {
        content += response[i];
        onUpdate(content);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      onSuccess(content);
      
      // 实际API调用应该类似于：
      /*
      const response = await fetch(`${API_BASE_URL}/api/process_paper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          prompt_name: promptName,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        content += chunk;
        onUpdate(content);
      }
      
      onSuccess(content);
      */
    } catch (error) {
      console.error('处理论文时出错:', error);
      throw error;
    }
  };

  // 使用聊天管理工具
  const { messages, onRequest } = useXChat({ agent });

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            SmartPaper AI 助手
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            使用 Ant Design X 构建的智能对话界面，轻松获取论文分析和学术帮助
          </p>
        </motion.div>
        
        {/* 论文URL输入和提示词选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">论文URL</label>
              <Input 
                placeholder="输入arXiv论文URL，例如: https://arxiv.org/pdf/2305.12002" 
                value={paperUrl}
                onChange={(e) => setPaperUrl(e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">提示词模板</label>
              <Select
                options={promptTemplates}
                value={selectedPrompt}
                onChange={setSelectedPrompt}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>
          {errorMsg && (
            <div className="mt-2 text-red-500 text-sm">{errorMsg}</div>
          )}
        </motion.div>
        
        {/* 聊天界面 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
        >
          {/* 聊天头部 */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-white" />
              </div>
              <h2 className="text-white font-medium">AI 助手</h2>
            </div>
            {loading && (
              <div className="flex items-center gap-2">
                <Spin size="small" />
                <span className="text-white text-sm">处理中...</span>
              </div>
            )}
          </div>
          
          {/* 聊天内容区域 */}
          <div className="p-6 h-[500px] overflow-y-auto flex flex-col">
            {/* 欢迎消息 */}
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-4">
                  <FaRobot className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">欢迎使用 SmartPaper AI 助手</h3>
                <p className="text-gray-500 max-w-md">
                  我可以帮助您分析学术论文、解释复杂概念，或者回答您关于研究方法的问题。
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>您可以：</p>
                  <ul className="list-disc text-left mt-2 ml-4">
                    <li>在上方输入框粘贴arXiv论文URL</li>
                    <li>选择合适的提示词模板</li>
                    <li>在下方聊天框中输入问题</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* 消息列表 */}
            <Bubble.List items={messages} />
          </div>
          
          {/* 发送框 */}
          <div className="border-t border-gray-100 p-4">
            <Sender 
              onSubmit={onRequest} 
              placeholder="输入您的问题或粘贴论文URL..." 
              sendButtonProps={{
                className: 'bg-gradient-to-r from-purple-600 to-blue-600',
                loading: loading
              }}
              disabled={loading}
            />
          </div>
        </motion.div>
        
        {/* 功能说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-2">论文分析</h3>
            <p className="text-gray-600">输入论文URL，AI将帮助您分析结构、方法和结论</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-2">多种模板</h3>
            <p className="text-gray-600">选择不同的提示词模板，获取不同风格的论文分析</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-2">智能对话</h3>
            <p className="text-gray-600">与AI助手交流，深入了解论文内容和相关概念</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIChat;