const { resolve } = require('path');
const spawn = require('cross-spawn');
const rp = require('request-promise');
const md5 = require('md5');

module.exports = (options = {}, context) => ({
    async extendPageData($page) {
        if ($page._content && $page._content.match(/<\s*contributors\s*\/>/)) {
            const validOptions = setDefaultsIfMissing(options);
            const contributors = [],
                  avatarClass = 'avatar' + (validOptions.showAvatar ? '' : ' hidden'),
                  countClass = 'count' + (validOptions.showCount ? '' : ' hidden');
            let shortLogEntries = getGitShortlog().split(/\r\n|\r|\n/),
                i;

            $page.avatarSize = validOptions.avatarSize;
            $page.avatarStyle = validOptions.avatarStyle;

            for (i = 0; i < shortLogEntries.length; i++) {
                const matches = shortLogEntries[i].match(/(\d+)\s*(.+)\s<(.*)>/);

                if (matches) {
                    const contributionCount = matches[1],
                          fullName = matches[2],
                          email = matches[3],
                          retinaOptions = {...options, avatarSize: validOptions.avatarSize * 2},
                          uhdOptions = {...options, avatarSize: validOptions.avatarSize * 3};
                    let avatarUrls = {};
                    if (validOptions.showAvatar) {
                        avatarUrls.normalRes = await provideAvatarUrl({name: fullName, email: email}, options) || validOptions.defaultAvatar;
                        avatarUrls.retina = (await provideAvatarUrl({name: fullName, email: email}, retinaOptions) || validOptions.defaultAvatar) + ' 2x';
                        avatarUrls.uhd = (await provideAvatarUrl({name: fullName, email: email}, uhdOptions) || validOptions.defaultAvatar) + ' 3x';
                    }
                    contributors.push({ 
                        count: (validOptions.showCount ? contributionCount : ''), 
                        countClass: countClass, 
                        name: fullName, 
                        avatarUrls: avatarUrls, 
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

const provideGitlabAvatarUrl = async (user, size) => {
    const options = {
        strictSSL: false,
        json: true 
    };
    options.uri = `https://www.gitlab.com/api/v4/avatar?email=${user.email}&size=${size}`;
    var json = await rp(options);
    return json.avatar_url;
}

function getGitShortlog() {
    let shortlog
    try {
        shortlog = spawn.sync(
            'git',
            ['shortlog', '-nse', '--no-merges', 'HEAD']
        ).stdout.toString();
    } catch (e) { console.log(e); }
    return shortlog
}

const setDefaultsIfMissing = options => {
    return { 
        ...options,
        showCount: options.showCount || false,
        showAvatar: options.showAvatar || false,
        avatarSize: options.avatarSize || 32,
        avatarStyle: options.avatarStyle || ''
    }
}