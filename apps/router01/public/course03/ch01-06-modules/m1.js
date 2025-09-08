const obj1 = {
  name: "孙悟空",
};
const [a, b] = ["将变量a作为默认导出暴露", 20];
export { b };
/*
 * export（导出）
 *   - 导出用来决定哪些是可以被外界查看
 *   - 导出分成两种：
 *      1. 默认导出；
 *          - 语法：
 *              export default xxx;
 *          - 一个模块中只能有一个默认导出
 *      2. 命名导出；
 *          - 语法：
 *              export <变量>
 *
 * import（导入）
 *   - 使用默认导入时，变量名可以任意指定，无需和模块中的变量名一样
 *   - 在网页中导入时，模块的路径必须写完整（/,./或者../开头，扩展名也要写上）
 *      import b from "./m1.js";
 *   - 使用命名导出的内容
 *      import { b as myb } from "./m1.js";
 *   - 都导入
 *      import a, {b, c} from "./m1.js";
 */

export default a;
