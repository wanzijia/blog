# JS模块化

#### 背景
JS本身简单的页面设计：页面动画 + 表单提交
并无模块化 or 命名空间的概念

> JS的模块化需求日益增长

## 一、幼年期： 无模块化
1. 开始需要在页面中增加一些不同的js：动画、表单、格式化
2. 多种js文件被分在不同的文件中
3. 不同的文件又被同一个模板引用
```js
  <script src="jquery.js"></script>
  <script src="main.js"></script>
  <script src="dep1.js"></script>
  //……
```
认可：
文件分离是最基础的模块化第一步
问题出现：
* 污染全局作用域 => 不利于大型项目的开发以及多人团队的共建

## 二、成长期： 模块化的雏形 - IIFE（语法侧的优化）

#### 作用域的把控

```js
  // ex:
  // 定义一个全局变量
  let count = 0;
  // 代码块1
  const increase = () => ++count;
  // 代码块2
  const reset = () => {
    count = 0;
  }

  increase();
  reset();
```

利用函数块级作用域
```js
  (() => {
    let count = 0;
    // ……
  })
```
仅定义了一个函数，如果立即执行
```js
  (() => {
    let count = 0;
    // ……
  })();
```
初步实现了一个最最最最简单的模块

尝试去定义一个最简单的模块
```js
const iifeModule = (() => {
  let count = 0;
  return {
    increase: () => ++count;
    reset: () => {
      count = 0;
    }
  }
})();
```
**有额外依赖时，如何优化IIFE相关代码**
> 优化1： 依赖其他模块的IIFE
```js
const iifeModule = ((dependencyModule1, dependencyModule2) => {
  let count = 0;
  return {
    increase: () => ++count;
    reset: () => {
      count = 0;
    }
  }
})(dependencyModule1, dependencyModule2);
iifeModule.increase();
iifeModule.reset();
```

实际上，jquery等框架其实应用了revealing的写法：（api定义在函数中，仅仅暴露接口这个思想）
揭示模式
```js
const iifeModule = ((dependencyModule1, dependencyModule2) => {
  let count = 0;
  const increase = () => ++count;
  const reset = () => {
    count = 0;
  }

  return {
    increase, reset
  }
})(dependencyModule1, dependencyModule2);
iifeModule.increase();
iifeModule.reset();
```

## 三、成熟期：

### CJS - Commonjs
 node.js制定
特征：
* 通过module + exports 去对外暴露接口
* 通过require来调用其他模块

模块组织方式
main.js 文件
```js
// 引入部分
const dependencyModule1 = require(./dependencyModule1);
const dependencyModule2 = require(./dependencyModule2);

// 处理部分
let count = 0;
const increase = () => ++count;
const reset = () => {
  count = 0;
}
// 做一些跟引入依赖相关事宜……

// 暴露接口部分
exports.increase = increase;
exports.reset = reset;

module.exports = {
  increase, reset
}
```

模块使用方式
```js
  const { increase, reset } = require('./main.js');

  increase();
  reset();
```

* 优点：
CommonJS率先在服务端实现了，从框架层面解决依赖、全局变量污染的问题
* 缺点：
主要针对了服务端的解决方案。对于异步拉取依赖的处理整合不是那么的友好。 
为什么不去考虑异步
因为服务端文件都在硬盘上，所以同步加载读取很快 fs的读取非常快

### AMD规范
通过异步加载 + 允许制定回调函数  
经典实现框架是：require.js

```js
  // 通过define来定义一个模块，然后require进行加载
  /*
  define
  params: 模块名，依赖模块，工厂方法
   */
  define(id, [depends], callback);
  require([module], callback);
```
模块定义方式
```js
  define('amdModule', ['dependencyModule1', 'dependencyModule2'], (dependencyModule1, dependencyModule2) => {
    // 业务逻辑
    // 处理部分
    let count = 0;
    const increase = () => ++count;
    const reset = () => {
      count = 0;
    }

    return {
      increase, reset
    }
  })
```
引入模块：
```js
  require(['amdModule'], amdModule => {
    amdModule.increase();
  })
```
**如果在AMDmodule中想兼容已有代码，怎么办**
```js
  define('amdModule', [], require => {
    // 引入部分
    const dependencyModule1 = require(./dependencyModule1);
    const dependencyModule2 = require(./dependencyModule2);

    // 处理部分
    let count = 0;
    const increase = () => ++count;
    const reset = () => {
      count = 0;
    }
    // 做一些跟引入依赖相关事宜……

    return {
      increase, reset
    }
  })
```

### CMD规范
按需加载
主要应用的框架 sea.js
```js
  define('module', (require, exports, module) => {
    let $ = require('jquery');
    // jquery相关逻辑

    let dependencyModule1 = require('./dependecyModule1');
    // dependencyModule1相关逻辑
  })
```
* 优点：按需加载，依赖就近
* 依赖于打包，加载逻辑存在于每个模块中，扩大模块体积

### ES6模块化
新增定义：
引入关键字 —— import
导出关键字 —— export
模块引入、导出和定义的地方：
```js
  // 引入区域
  import dependencyModule1 from './dependencyModule1.js';
  import dependencyModule2 from './dependencyModule2.js';

  // 实现代码逻辑
  let count = 0;
  export const increase = () => ++count;
  export const reset = () => {
    count = 0;
  }

  // 导出区域
  export default {
    increase, reset
  }
```
模板引入的地方
```js
  <script type="module" src="esModule.js"></script>
```
node中：
```js
  import { increase, reset } from './esModule.mjs';
  increase();
  reset();

  import esModule from './esModule.mjs';
  esModule.increase();
  esModule.reset();
```

* 优点（重要性）：通过一种最统一的形态整合了js的模块化
* 缺点（局限性）：本质上还是运行时的依赖分析

## 模块化有关的面试题

1. AMD&CMD区别  
依赖就近，按需加载

2. 了解早期jquery的依赖处理以及模块加载方案吗？/ 了解传统IIFE是如何解决多方依赖的问题？  
IIFE加传参调配，jquery等框架其实应用了revealing（揭示模式）的写法：（api定义在函数中，仅仅暴露接口这个思想）


1. AMD中使用revealing
```js
  define('amdModule', [], (require, export, module) => {
    // 引入部分
    const dependencyModule1 = require(./dependencyModule1);
    const dependencyModule2 = require(./dependencyModule2);

    // 处理部分
    let count = 0;
    const increase = () => ++count;
    const reset = () => {
      count = 0;
    }
    // 做一些跟引入依赖相关事宜……

    export.increase = increase();
    export.reset = reset();
  })

  define('amdModule', [], require => {
    const otherModule = require('amdModule');
    otherModule.increase();
    otherModule.reset();
  })
```

4. 兼容AMD&CJS/如何判断CJS和AMD**

UMD的出现
```js
  (define('amdModule', [], (require, exports, module) => {
    // 引入部分
    const dependencyModule1 = require(./dependencyModule1);
    const dependencyModule2 = require(./dependencyModule2);

    // 处理部分
    let count = 0;
    const increase = () => ++count;
    const reset = () => {
      count = 0;
    }
    // 做一些跟引入依赖相关事宜……

    exports.increase = increase();
    exports.reset = reset();
  }))(
    // 目标是一次性区分CommonJSorAMD
    typeof module === "object"
    && module.exports
    && typeof define !== "function"
      ? // 是 CJS
        factory => module.exports = factory(require, exports, module)
      : // 是AMD
        define
  )
```
* 优点: 适合在浏览器中加载异步模块，可以并行加载多个模块
* 缺点：会有引入成本，不能按需加载

5. import如何解决动态模块
```js
function myImport(src) {
  return new promise((resolve,reject) => {
    resolve(require(src))
  })
}

// ES11原生解决方案：
  import('./esModule.js').then(dynamicEsModule => {
    dynamicEsModule.increase();
  })
```