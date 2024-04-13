import React, { createContext, useContext, useState } from 'react';

// 通知の型を定義
interface Notification {
  uploadSuccess?: boolean; // アップロード成功
  // 他の通知タイプが必要な場合はここに追加
}

const UploadSuccessContext = createContext<[Notification, (notification: Notification) => void]>([{}, () => {}]);

export const UploadSuccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification>({});

  return (
    <UploadSuccessContext.Provider value={[notification, setNotification]}>
      {children}
    </UploadSuccessContext.Provider>
  );
};

export const useUploadSuccess = () => useContext(UploadSuccessContext);