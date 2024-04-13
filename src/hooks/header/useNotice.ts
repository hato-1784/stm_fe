import { useState, useEffect } from 'react';
import { noticeList } from 'src/pages/api/notice';
import { Notice } from 'src/interfaces/notice/response_notice';

const useNotice = () => {
  const [notice, setNotice] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await noticeList();
        setNotice(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotice();
  }, []);

  return notice;
};

export default useNotice;

