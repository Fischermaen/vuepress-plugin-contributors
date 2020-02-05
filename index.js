const { resolve } = require('path');
const spawn = require('cross-spawn');
const rp = require('request-promise');
const md5 = require('md5');

module.exports = (options = {}, context) => ({
    async extendPageData($page) {
        if ($page._content && $page._content.match(/<\s*contributors\s*\/>/)) {
            const showCount = options.showCount || false,
                  showAvatar = options.showAvatar || false,
                  contributors = [],
                  avatarClass = 'avatar' + (showAvatar ? '' : ' hidden'),
                  countClass = 'count' + (showCount ? '' : ' hidden');
            let shortLogEntries = getGitShortlog().split(/\r\n|\r|\n/),
                i;

            $page.avatarSize = options.avatarSize || 32;
            $page.avatarStyle = options.avatarStyle || '';

            for (i = 0; i < shortLogEntries.length; i++) {
                const matches = shortLogEntries[i].match(/(\d+)\s*(.+)\s<(.*)>/);

                if (matches) {
                    const contributionCount = matches[1],
                          fullName = matches[2],
                          email = matches[3];
                    let avatarUrl = '';
                    if (showAvatar) {
                        avatarUrl = await provideAvatarUrl({name: fullName, email: email}, options) || options.defaultAvatar;
                    }
                    contributors.push({ 
                        count: (showCount ? contributionCount : ''), 
                        countClass: countClass, 
                        name: fullName, 
                        avatarUrl: avatarUrl, 
                        avatarClass: avatarClass
                    });
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
    const { avatarProvider } = options,
          avatarSize = options.avatarSize || 32;

    if (typeof avatarProvider === 'function') {
        var avatarUrl = await avatarProvider(user, avatarSize);
        return avatarUrl;
    }

    if (options.avatarProvider === 'gitlab') {
        return await provideGitlabAvatarUrl(user, avatarSize);
    }

    if (options.avatarProvider === 'github') {
        return provideGithubAvatarUrl(user.name, avatarSize);
    }

    if (options.avatarProvider === 'gravatar') {
        return provideGravatarUrl(user.email, avatarSize);
    }

    return '';
}

const provideGithubAvatarUrl = (userName,size) => `https://github.com/${userName}.png?size=${size}`;

const provideGravatarUrl = (email, size) => `https://www.gravatar.com/${md5(email)}?s=${size}`;

const provideGitlabAvatarUrl = async (user, avatarSize) => {
    const options = {
        strictSSL: false,
        json: true 
    };
    options.uri = `https://www.gitlab.com/api/v4/avatar?email=${user.email}&size=${avatarSize}`;
    var json = await rp(options);
    return json.avatar_url;
}

function getGitShortlog() {
    let shortlog
    try {
        shortlog = spawn.sync(
            'git',
            ['shortlog', '-nse', '--no-merges', 'master']
        ).stdout.toString();
    } catch (e) { console.log(e); }
    return shortlog
}
