/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigProvider, theme as antdTheme } from 'antd';
import { ExamPage } from './pages/ExamPage';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#4f46e5', // indigo-600
          fontFamily: 'Inter, system-ui, sans-serif',
          borderRadius: 8,
          colorBgContainer: isDarkMode ? '#1e293b' : '#ffffff',
        },
      }}
    >
      <ExamPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </ConfigProvider>
  );
}
