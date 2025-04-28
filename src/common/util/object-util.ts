export class ObjectUtil {
  static objIds = new WeakMap();
  static nextId = 0;

  static getObjectId(obj: object) {
    if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
      throw new TypeError('ids can only be generated for objects or functions.');
    }
    // 如果已有 ID，直接返回；否则分配一个新的
    if (!this.objIds.has(obj)) {
      this.objIds.set(obj, this.nextId++);
    }
    return this.objIds.get(obj);
  }

}