# vuepress-plugin-contributors
This component allows you to add a list of all contributors. This list is sorted descending by the number of contributions.

_Requires Vuepress 1.0+_

## Demo
![](preview.gif)

## Installation
```shell
$ npm install vuepress-plugin-contributors --save
```

After installing, add it to your Vuepress configuration's plugin list:

```js
module.exports = {
    plugins: [ 'vuepress-plugin-contributors' ]
}
```

### Usage
```markdown
    <contributors />
```