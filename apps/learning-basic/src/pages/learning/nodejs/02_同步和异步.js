/*
  进程和线程
    - 进程
      - 程序的运行环境（类似于工厂）
    - 线程
      - 线程是实际进行运算的东西（类似于工厂里面工作的工人）

  同步
    - 通常代码都是自上而下一行一行的执行
    - 前面的代码没有执行完，后面的代码也不会执行（阻塞）
    - 一行代码执行慢会影响到后面代码的执行

  解决同步的问题
    - java python 通过多线程来解决同步的问题
    - nodejs 通过异步的方式来解决阻塞问题

  异步
    - 一段异步执行的代码不会影响到其他的程序
    - 异步的问题
      - 异步的代码无法通过return来设置返回值
    - 特点
      - 不会阻塞其他代码的执行
      - 需要通过回调函数返回结果
    - 基于回调函数带来的问题
      - 代码的可读性差
      - 代码的可调式性差
    - 解决回调函数的问题
      - 需要一个东西，可以代替回调函数来给我们返回结果
      - promise横空出世
        - promise 是一个可以用来存储数据的对象
          - promise存储数据的方式比较特殊，取数据也同样特殊
          - 这种特殊可以用于存储异步调用的返回值
*/

function sum1(a, b) {
  const begin = Date.now()

  while(Date.now() - begin < 10000) {

  }

  return a + b;
}

function sum2(a, b, cb) {
  const begin = Date.now()

  setTimeout(() => {
    cb(a + b);
  }, 5000)
}

// 代码的同步执行
console.log("Line 1...");

// const result = sum1(10, 20);
// sum2(10, 20, (result) => {console.log(`result: ${result}`)});

sum2(10, 20, (result) => {
  sum2(result, 30, (result) => {
    sum2(result, 40, (result) => {
      console.log(`result: ${result}`)
    })
  })
})

console.log("Line 2...");
console.log("Line 3...");




