const { resolve } = require('path')
const spawn = require('cross-spawn')
const contributors = [];

module.exports = () => ({
    extendPageData($page) {
        if (contributors.length == 0) {
            var output = getGitShortlog();
            var a = output.split(/\r\n|\r|\n/);
            var i;

            for (i = 0; i < a.length; i++) {
                var matches = a[i].match(/(\d+)\s+(.*)/);
                if (matches) {
                    contributors.push({ count: matches[1], name: matches[2] });
                }
            }
        }
        $page.contributors = contributors;
    },

    name: 'vuepress-plugin-contributors',

    plugins: [
        [
            '@vuepress/register-components',
            {
                componentsDir: resolve(__dirname, './components')
            }
        ]
    ]
});

function getGitShortlog() {
    let shortlog
    try {
        shortlog = spawn.sync(
            'git',
            ['shortlog', '-ns', '--no-merges', 'origin/master']
        ).stdout.toString();
    } catch (e) { console.log(e); }
    return shortlog
}
