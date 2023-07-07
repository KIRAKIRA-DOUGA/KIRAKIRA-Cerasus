# CSS 选择器和 XPath

<table>
<thead>
<th>描述</th>
<th>CSS Selector</th>
<th>XPath</th>
<th>对应 HTML</th>
</thead>
<tbody>
<tr>
<td colspan="4">组合器</td>
<tr>
<td>群组元素</td>
<td>

```css
div, a
```
</td>
<td>

```xml
//div | //a
```
</td>
<td>

```html
<div>

<a>
```
</td>
</tr>
<tr>
<td>子元素</td>
<td>

```css
div > a
```
</td>
<td>

```xml
//div/a
```
</td>
<td>

```html
<div>
  <a>
```
</td>
</tr>
<tr>
<td>子孙元素</td>
<td>

```css
div a
div >> a
```
</td>
<td>

```xml
//div//a
```
</td>
<td>

```html
<div>
  ⋱
    <a>
```
</td>
</tr>
<tr>
<td>弟弟元素</td>
<td>

```css
div + a
```
</td>
<td>

```xml
//div/following-sibling::a[1]
```
</td>
<td>

```html
<div>
<a>
```
</td>
</tr>
<tr>
<td>弟弟们元素</td>
<td>

```css
div ~ a
```
</td>
<td>

```xml
//div/following-sibling::
```
</td>
<td>

```html
<div>
⋮
<a>
```
</td>
</tr>
<tr>
<td>父元素</td>
<td>

```css
div:has(> a)
```
</td>
<td>

```xml
//div/..
```
</td>
<td>

```html
<div>
  <a>
```
</td>
</tr>
<tr>
<td>祖先元素</td>
<td>

```css
div:has(a)
```
</td>
<td>

```xml
//div//..
```
</td>
<td>

```html
<div>
  ⋱
    <a>
```
</td>
</tr>
<tr>
<td>哥哥元素</td>
<td>

```css
div:has(+ a)
```
</td>
<td>

```xml
//div/preceding-sibling::a[1]
```
</td>
<td>

```html
<div>
<a>
```
</td>
</tr>
<tr>
<td>哥哥们元素</td>
<td>

```css
div:has(~ a)
```
</td>
<td>

```xml
//div/preceding-sibling::
```
</td>
<td>

```html
<div>
⋮
<a>
```
</td>
</tr>
</tbody>
</table>
