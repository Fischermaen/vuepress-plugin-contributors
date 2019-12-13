# vuepress-plugin-contributors
This component allows you to add a list of all contributors, which is sorted descending by the number of contributions.

To get the list of contributors this plugins uses `git shortlog -nse --no-merges`. If you expect double entries due to e.g. changes of email-adresses, you may specify a `.mailmap` in the root of your project. (See [git dcumentation](https://git-scm.com/docs/git-shortlog))

## Installation
```shell
$ npm install vuepress-plugin-contributors --save

# or, if you prefer yarn
$ yarn add vuepress-plugin-contributors
```

After installing, add it to your Vuepress configuration's plugin list:

```js
module.exports = {
    plugins: [ 'vuepress-plugin-contributors' ]
}
```

## Usage

Just put the following code somewhere in one of your markdown files: 

```markdown
<contributors />
```

## Options

This plugin takes a number of options, which can be passed in n options object:

```js
module.exports = {
    plugins. [
        ['vuepress-plugin-contributors', {
            showAvatar: true,
            showCount: true,
            avatarSize: 32,
            defaultAvatar: '/not-found.png', 
            avatarProvider: 'github'
        }]
    ]
}
```

### showAvatar

- Type: `Boolean`
- Default: `false`

If set to `true` an avatarProvider has to be specified to show the avatars.

### avatarProvider

- Type: `String|function`
- Default: `undefinded`

Following avatar sources are supported: `github`, `gitlab` or `gravatar`. In case of `github` or `gitlab` the email address of the user have to public to fetch the avatar url.

You can specify a function in case you would like to use a different avatar source or your documentation is running on premise and you need a different url for the standard avatar-providers. This function is called with 2 parameters:

- user: `Object`, contains two fields `name` (String) and `email` (String)
- avatarSize: `Integer` Size of the avatar in pixel.

**Expected return value:** `String` The url to the avatar.

Sample:

```js
const rp = require('request-promise');

    ['vuepress-plugin-contributors', {
        avatarProvider: async (user, avatarSize) => {
            var options = {
                strictSSL: false,
                json: true
            };
            options.uri = `https://<your.gitlab.server>/api/v4/avatar?email=${user.email}&size=${avatarSize}`;
            var json = await rp(options);
            return json.avatar_url;
        },
        avatarSize: 32,
        defaultAvatar: '/transparent.png'
    }]
```
### defaultAvatar

- Type: `String`
- Default: `undefined`

Path to a default avatar, when no avatar is found in the source. This file must be in the public folder of `.vuepress` to ensure the name isn't changed during webpack.

### avatarSize

- Type: `Integer`
- Default: `32`

The size of the avatars. This value is provided to the `avatarProvider` function, if specified.

### showCount

- Type: `Boolean`
- Default: `false`

Should the number of commits be shown in brackets behind the name.
