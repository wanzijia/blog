module.exports = {
    base: '/_blog/',
    title: 'ZIJIA',
    dest: './dist', // 设置输出目录
    description: '子佳的博客',
    markdown: {
        lineNumbers: false
    },
    themeConfig: {
        logo: 'logo/logo.jpg',
        nav: require("./nav"),
        // sidebar: "auto",
        sidebarDepth: 2, // 侧边栏显示2级
        sidebar: {
            '/js/promise/': [
                '',
            ],
            '/js/program/': [
                '',
            ],
            '/module/': [
                '',
            ],
            '/ts/': [
                '',
                'ts_exerise'
            ],
            '/engineered/': [
                '',
                'interview'
            ]
        },
        smoothScroll: true,
    },
    plugins: ['@vuepress/back-to-top']
}