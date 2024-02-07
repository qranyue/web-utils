/** 创建缓存参数 */
interface QSessOption {
  /** 缓存前缀 */
  prefix?: string;
}

/** 缓存实例 */
interface QSess {
  /** 获取对象 */
  get: <T = any>(key: string) => T | null;
  /** 设置对象 */
  set: (key: string, value: any) => void;
  /** 移除对象 */
  rm: (key: string) => void;
}

/** 创建缓存 */
export const createSession = (option?: QSessOption): QSess => {
  const opt = { prefix: "", ...option };
  return {
    /** 获取对象 */
    get: <T = any>(key: string) => {
      const cache = sessionStorage.getItem(`${opt.prefix}${key}`);
      if (!cache) return null;
      return JSON.parse(cache) as T;
    },
    /** 设置对象 */
    set: (key, value) => {
      sessionStorage.setItem(`${opt.prefix}${key}`, JSON.stringify(value));
    },
    /** 移除对象 */
    rm: (key) => {
      sessionStorage.removeItem(`${opt.prefix}${key}`);
    },
  };
};
