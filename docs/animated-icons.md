# 动画图标

本项目使用 Lottie 作为动画图标，设计师们需要制作各种状态之间切换的动画。

普通图标动画所需要的状态：

- Normal
- Pressed
- Selected
- PressedSelected

斜线划掉的状态：

- Off

## AE 项目

合成大小：2400×2400

帧率：60 FPS

从 Figma 导出 SVG 时请尽量使用没有 Flatten 过的矢量图形。若已经 Flatten 过，必要时请考虑重绘。

使用 [SVG2AE](https://www.gfxcamp.com/aescripts-svg2ae/) 导入到 AE，默认为 24×24，随后使用 AE 自带的 Scale Composition 脚本缩放100倍后制作。

使用标记并设定范围来控制状态，以下为通常版，请尽量保持顺序以确保时间轴最短。

- PressedToNormal
- NormalToPressed
- PressedToSelected
- SelectedToPressedSelected
- PressedSelectedToSelected
- SelectedToNormal

### 时长规范

#### 15 帧

- PressedToNormal
- NormalToPressed
- SelectedToPressedSelected
- PressedSelectedToSelected

#### 5 帧

- SelectedToNormal

#### 30 帧 - 60 帧，可任意延长

- PressedToSelected

### AE 内标记命名

```json
{
"name": "NormalToPressed"
}
```
