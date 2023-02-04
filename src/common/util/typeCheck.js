/**
 * @description: 调用参数原型的toString方法
 * @param {any} target 需要判断的属性
 * @return {string}
 */
export const judgeType = (target) => Object.prototype.toString.call(target)

/**
 * @description: 返回一个判断类型的函数
 * @param {string} type 需要判断的属性类型
 * @return {function} 判断该属性的函数
 */
const isType = (type) => (target) => judgeType(target) === `[object ${type}]`

export const isNull = isType('Null')
export const isDate = isType('Date')
export const isArray = isType('Array')
export const isString = isType('String')
export const isNumber = isType('Number')
export const isObject = isType('Object')
export const isPromise = isType('Promise')
export const isFunction = isType('Function')
export const isUndefined = isType('Undefined')
export const isSymbol = isType('Symbol')
