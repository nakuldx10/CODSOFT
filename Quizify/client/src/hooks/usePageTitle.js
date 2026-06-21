import { useEffect } from 'react';
import { APP_NAME } from '../utils/constants';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
};

export default usePageTitle;
