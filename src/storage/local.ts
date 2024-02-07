/** 缓存内容 */
interface QCache<T = any> {
  /** 过期时间 */
  expire: number;
  /** 缓存内容 */
  value: T;
}

/** 创建缓存参数 */
interface QCacheOptions {
  /** 前缀 */
  prefix?: string;
  /** 过期时间，单位毫秒，默认0不过期 */
  expire?: number;
}

/** 缓存对象 */
interface QStorage {
  /** 获取对象 */
  get: <T = any>(key: string) => T | null;
  /** 设置对象 */
  set: (key: string, value: any, expire?: number) => void;
  /** 移除对象 */
  rm: (key: string) => void;
}

/** 创建长效缓存 */
export const createStorage = (option?: QCacheOptions): QStorage => {
  const opt = { prefix: "", expire: 0, ...option };
  return {
    /** 获取缓存 */
    get: <T = any>(key: string) => {
      const cache = localStorage.getItem(`${opt.prefix}${key}`);
      if (!cache) return null;
      const { expire, value } = JSON.parse(cache) as QCache<T>;
      if (expire && expire < Date.now()) {
        localStorage.removeItem(`${opt.prefix}${key}`);
        return null;
      }
      return value;
    },
    /** 设置缓存 */
    set: (key, value, expire = opt.expire) => {
      if (expire) expire += Date.now();
      localStorage.setItem(
        `${opt.prefix}${key}`,
        JSON.stringify({ expire, value })
      );
    },
    /** 移除缓存 */
    rm: (key) => {
      localStorage.removeItem(`${opt.prefix}${key}`);
    },
  };
};
