module.exports = {
    configureWebpack: {
        // 配置路径别名
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
                'store': '@/store'
            }
        },
    }
}