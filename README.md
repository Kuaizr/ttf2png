这是一个将ttf字体文件中的字转化成背景透明的png图片的小工具。

安装

```javascript
npm install ttf2png
```

使用

```javascript
const ttf2png = require("ttf2png")
let pngdata = ttf2png.fromChars(fontPath,noUpsideDown,width,chars)
```

ttf2png提供两个API:

**ttf2png.fromChars(fontPath,noUpsideDown,width,chars,save)**

> 返回值：一个包含chars文字的所有图片数据的list
>
> 参数：
>
> - fontPath:字体文件路径
> - 图片是否上下翻转(部分字体文件需要)
> - width:图片宽度
> - chars:需要导出的文字
> - save:默认为true,是否把图片保存到当前目录下的字体文件目录

**ttf2png.fromFile(fontPath,noUpsideDown,width,save)**

> 返回值：一个包含该字体文件所有图片数据的list，该方法执行会比较慢
>
> 参数：
>
> - fontPath:字体文件路径
> - 图片是否上下翻转(部分字体文件需要)
> - width:图片宽度
> - save:默认为true,是否把图片保存到当前目录下的字体文件目录
