let a = 10;
// a = "hello";
console.log(a);
var b; // b is undefined
let c; // c is undefined
const d = 1; // const 常量必须给一个初始值
console.log(b);
console.log(`c is: ${c}`);

//#region r1
// 基本数据类型：number、bigint、string、boolean、symbol、undefined、Null
//#endregion

b = Symbol("123");
console.log(b, typeof b);
console.log(b === Symbol("123"));

b = undefined;
console.log(b, typeof b);

b = null;
console.log(b, typeof b);

b = NaN;
console.log(b, typeof b);

b = 10;
console.log(b, typeof b);

b = "hello";
console.log(b, typeof b);

let b1 = Symbol("123");
let b2 = Symbol("123");

let obj1 = {
  [b1]: "value1",
  [b2]: "value2",
};
console.log(obj1, obj1[b1]);

console.log(Object.getPrototypeOf(obj1));

/**
 * 函数可以赋值给变量/属性
 * 可以作为参数传递给另外一个函数
 * 可以作为函数的返回值
 */

let obj2 = {
  a: function () {
    console.log("a");
  },
};

obj2.a();

function f1() {
  console.log("f1");
}

function f2(cb) {
  cb();
}

f2(f1);

(function () {
  console.log("IIFE");
})();

const b3 = 1n;
const b4 = BigInt(4);
const b5 = 4;
console.log(b3, typeof b3);
console.log(b4, typeof b4);

// 展开运算符
let arr1 = [1, 2, 3];
console.log(...arr1);

let obj3: any = { a: 1, b: 2 };
obj3 = { id: 110, title: "Unix编程艺术", price: 119 };

// 对象的可枚举属性复制到新的对象
let obj4 = {
  ...obj3,
  a: 1,
};
console.log(obj4);

let [x, y] = [1, 2];
console.log(x, y);
console.log(obj4);
let { id: x1, title: y1, price: z1 } = obj4;
console.log(x1, y1, z1);

const var1 = 5 && "hello";
const var2 = 5 || "hello";
console.log(var1, var2);
