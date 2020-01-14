const { resolve } = require('path');
const spawn = require('cross-spawn');
const rp = require('request-promise');
const md5 = require('md5');

module.exports = (options = {}, context) => ({
    async extendPageData($page) {
        if ($page._content && $page._content.match(/<\s*contributors\s*\/>/)) {
            const showCount = options.showCount || false;
            const showAvatar = options.showAvatar || false;
            const contributors = [];
            const avatarClass = 'avatar' + (showAvatar ? '' : ' hidden');
            const countClass = 'count' + (showCount ? '' : ' hidden');
            var output = getGitShortlog();
            var shortLogEntries = output.split(/\r\n|\r|\n/);
            var i;

            $page.avatarSize = options.avatarSize || 32;

            for (i = 0; i < shortLogEntries.length; i++) {
                var matches = shortLogEntries[i].match(/(\d+)\s*(.+)\s<(.*)>/);
                if (matches) {
                    var avatarUrl = '';
                    if (showAvatar) {
                        avatarUrl = await provideAvatarUrl({name: matches[2], email: matches[3]}, options) || options.defaultAvatar;
                    }
                    contributors.push({ 
                        count: (showCount ? matches[1] : ''), 
                        countClass: countClass, 
                        name: matches[2], 
                        avatarUrl: avatarUrl, 
                        avatarClass: avatarClass });
                }
            }
            $page.contributors = contributors;
        }
    },

    name: 'vuepress-plugin-contributors',

    enhanceAppFiles: resolve(__dirname, 'enhanceAppFile.js'),

    plugins: [
        [
            '@vuepress/register-components',
            {
                componentsDir: resolve(__dirname, './components')
            }
        ]
    ]

});

async function provideAvatarUrl(user, options) {
    const { avatarProvider } = options;
    const avatarSize = options.avatarSize || 32;

    if (typeof avatarProvider === 'function') {
        var avatarUrl = await avatarProvider(user, avatarSize);
        return avatarUrl;
    }

    if (options.avatarProvider === 'gitlab') {
        var options = {
            strictSSL: false,
            json: true 
        };
        options.uri = `https://www.gitlab.com/api/v4/avatar?email=${user.email}&size=${avatarSize}`;
        var json = await rp(options);
        return json.avatar_url;
    }

    if (options.avatarProvider === 'github') {
        return `https://github.com/${user.name}.png?size=${avatarSize}`;
    }

    if (options.avatarProvider === 'gravatar') {
        return `https://www.gravatar.com/${md5(user.email)}?s=${avatarSize}`;
    }

    return '';
}

function getGitShortlog() {
    let shortlog
    try {
        shortlog = spawn.sync(
            'git',
            ['shortlog', '-nse', '--no-merges', 'origin/master']
        ).stdout.toString();
    } catch (e) { console.log(e); }
    return shortlog
}
