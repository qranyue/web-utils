/** 事件触发器 */
interface QEvents {
  /** 添加监听 */
  on: (event: string, callback: Function) => void;
  /** 添加一次性监听 */
  once: (event: string, callback: Function) => void;
  /** 设置监听 */
  set: (event: string, callback: Function) => void;
  /** 设置一次性监听 */
  setOnce: (event: string, callback: Function) => void;
  /** 移除监听 */
  off: (event: string, callback?: Function) => void;
  /** 触发事件 */
  emit: (event: string, ...args: any[]) => void;
}

/** 创建事件对象 */
export const createEvents = (): QEvents => {
  /** 单例事件对象 */
  const one = new Map<string, Function>();
  /** 多例事件对象 */
  const ons = new Map<string, Set<Function>>();
  /** 事件索引 */

  /** 添加事件 */
  const addEvent = (event: string, callback: Function) => {
    if ("function" !== typeof callback)
      throw new Error("callback must be a function");
    /** 添加事件 */
    const callbacks = ons.get(event);
    if (!callbacks) ons.set(event, new Set([callback]));
    else callbacks.add(callback);
  };
  /** 移除事件 */
  const removeEvent = (event: string, callback?: Function) => {
    const callbacks = ons.get(event);
    if (!callbacks) return;
    if (typeof callback !== "function") callbacks.clear();
    else callbacks.delete(callback);
  };

  return {
    /** 添加监听 */
    on: (event, callback) => {
      /** 创建事件 */
      addEvent(`on:${event}`, callback);
    },
    /** 添加一次性监听 */
    once: (event, callback) => {
      addEvent(`once:${event}`, callback);
    },
    /** 设置监听 */
    set: (event, callback) => {
      if ("function" !== typeof callback)
        throw new Error("callback must be a function");
      one.set(`on:${event}`, callback);
    },
    /** 设置一次性监听 */
    setOnce: (event, callback) => {
      if ("function" !== typeof callback)
        throw new Error("callback must be a function");
      one.set(`once:${event}`, callback);
    },
    /** 移除监听 */
    off: (event, callback) => {
      if (!["undefined", "function"].includes(typeof callback))
        throw new Error("callback must be a function");
      /** 移除多例 */
      removeEvent(`on:${event}`, callback);
      removeEvent(`once:${event}`, callback);
      /** 移除单例 */
      if (one.has(`on:${event}`)) one.delete(`on:${event}`);
      if (one.has(`once:${event}`)) one.delete(`once:${event}`);
    },
    /** 触发事件 */
    emit: (event, ...args) => {
      let cbs = ons.get(`on:${event}`);
      if (cbs) cbs.forEach((f) => f(...args));
      cbs = ons.get(`once:${event}`);
      if (cbs) {
        cbs.forEach((f) => f(...args));
        cbs.clear();
      }
      let cb = one.get(`on:${event}`);
      if (cb) cb(...args);
      cb = one.get(`once:${event}`);
      if (cb) {
        cb(...args);
        one.delete(`once:${event}`);
      }
    },
  };
};
