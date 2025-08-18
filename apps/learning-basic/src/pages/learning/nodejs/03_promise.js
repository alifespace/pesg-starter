/*
    异步调用必须通过回调函数返回数据，但是由于回调地狱的问题，我们使用promise

    Promise的构造函数需要传一个执行器（函数）
        - Proise构造函数中传入的执行器，需要传递两个函数，resolve, reject
        - 通过这两个函数保存数据, resolve 在执行正常时存储数据，reject 在执行错误时存储数据
        - 通过函数来向promise添加数据，好处就是可以添加通过异步调用的数据
*/

function sum(a, b) {
    return a + b;
}

let result = sum(10, 20)

const promise1 = new Promise((resolve, reject) => {
    // console.log("promise1");
    // resolve("成功解决")
    setTimeout(() => {
        resolve("成功解决")
    }, 2000)
})

// console.log(promise1);
setTimeout(() => {
    console.log(promise1);
}, 3000
)

/*
    从promise读取数据
        - 可以通过promise实例方法then来读取promise中存储的数据
        - then需要两个回调函数作为参数，回调函数用来获得promise数据
        - 通过resolve存储的数据会调用第一个函数返回
        - 通过reject存储的数据，或者出现异常的时候，会调用第二个函数返回
*/
promise1.then((result) => {
    console.log("promise中的数据", result)
}, (reason) => {
    console.log("promise中的错误", reason)
})