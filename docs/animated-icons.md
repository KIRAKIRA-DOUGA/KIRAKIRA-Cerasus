# 动态图标

本项目使用 Lottie 作为动态图标，设计师们需要制作各种状态之间转换的动画。

## 状态

### 常规动态图标所需的状态

- Normal
- Pressed
- Selected
- PressedSelected

### 不常用状态

- Hover
- HoverSelected

### 斜线划掉的状态

- Off

### 其它自定义的特殊状态（仅供参考）

- Play
- Pause
- Replay
- Stop
- …

## 初始化 AE 项目

合成大小：2400×2400

帧率：60 fps

从 Figma 导出 SVG 时建议使用没有拼合 (Flatten) 过的矢量图形。若已被拼合过，必要时请考虑重绘。否则需要在 AE 中直接编辑路径的锚点。

使用 [SVG2AE](https://www.gfxcamp.com/aescripts-svg2ae/) 导入到 AE，默认为 24×24。随后使用 AE 自带的 Scale Composition 脚本缩放 100 倍（至 2400×2400）后制作。（如果不放大则全是马赛克。）

使用标记并设定范围来控制状态，以下为常见状态标记，~~请尽量保持顺序以确保时间轴最短~~顺序无所谓。

- PressedToNormal
- NormalToPressed
- PressedToSelected
- SelectedToPressedSelected
- PressedSelectedToSelected
- SelectedToNormal
- PressedSelectedToNormal

*如上所示，依然需要指定反向状态，因为如果直接倒放原状态的话，运动曲线是反的。*<wbr />但如果以后实现了可打断动画，则有可能会取消本条规定。

### 回退状态标记

如果缺失以下状态标记，则会自动回退到指定的状态。

- NormalToSelected\
  依次播放 NormalToPressed、PressedToNormal
- PressedSelectedToNormal\
  依次播放 PressedSelectedToSelected、SelectedToNormal
- SelectedToNormal\
  依次播放 SelectedToPressedSelected、PressedSelectedToNormal

以下状态几乎不可能会出现。除非在审查元素中强制设置元素状态，则有可能会出现这些状态。

- PressedToPressedSelected\
  无动画强行切到 PressedSelected 所在帧
- PressedSelectedToPressed\
  无动画强行切到 Pressed 所在帧

## 时长规范

### 15 帧（250 毫秒）

- PressedToNormal
- NormalToPressed
- SelectedToPressedSelected
- PressedSelectedToSelected

### 5 帧（仅颜色变化时）

- SelectedToNormal

### 30 帧 ~ 60 帧，可任意延长

- PressedToSelected
- PressedSelectedToNormal

## AE 内标记

### 方法

跳转时间轴到**指定状态**的第 1 帧，点击合成时间轴空白处（以防止将标记添加到图层中而不是合成中），然后按下键盘按键 <kbd>Numpad \*</kbd> 添加一个标记。如无小键盘可选择 *标记* 菜单中添加，或*自定义快捷键*。

双击刚添加的标记，修改持续时间为指定状态的持续时间（不是结束时间）。然后在下方注释中填写状态[命名](#命名)。

### 命名

使用 JSON 格式。\
换行、缩进、空格等均无所谓，不过建议换行。

```json
{
    "name": "NormalToPressed"
}
```

## 导出

### 修剪合成时间

在合成的有效状态时间内，转到首个状态的入点按下 <kbd>B</kbd>（如有必要），转到末个状态的出点按下 <kbd>N</kbd>，以修剪合成时间。去掉多余的时间并节省最终文件的大小。

### 导出扩展（任选其一）

- Bodymovin
- LottieFiles

### 文件格式

尽管 Lottie 推出了一款全新的 `*.lottie` 文件格式，可支持内嵌图片、音频、字体等更多新功能。但我们目前暂时不需要这些新功能，使用传统的 `*.json` 格式即可。如有需求时再切换也无妨。
