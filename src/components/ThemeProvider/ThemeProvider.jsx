import React from 'react';
import { ConfigProvider, theme } from 'antd';

// 创建主题提供者组件，用于配置Ant Design和Ant Design X的主题
const ThemeProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        // 使用Ant Design的算法
        algorithm: theme.defaultAlgorithm,
        // 自定义主题颜色
        token: {
          colorPrimary: '#6366f1', // 紫色，与现有渐变色相匹配
          borderRadius: 8,
          fontFamily: 'Inter Display, sans-serif',
        },
        // 组件级别的样式覆盖
        components: {
          Button: {
            colorPrimary: '#6366f1',
            algorithm: true,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;