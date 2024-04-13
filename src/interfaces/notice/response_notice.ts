export interface Notice {
  id: string;
  username: string;
  title: string;
  message: string;
  read_flag: boolean;
}

export interface NoticeUpload {
  uploadSuccess?: boolean; // アップロード成功
  // 他の通知タイプが必要な場合はここに追加
}
