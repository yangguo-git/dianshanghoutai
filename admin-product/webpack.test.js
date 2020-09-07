module.exports = {
    chainWebpack: config => {
        const imagesRule = config.module.rule('images')
        imagesRule.uses.clear()
        // 删除images的rule
        imagesRule.use('file-loader')
            .loader('url-loader')
            .options({
                limit: 10000,
                // 设置图片大小
                fallback: {
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[hash:8].[ext]'
                    }
                }
            })
        const fontsRule = config.module.rule('fonts')
        fontsRule.uses.clear()
        fontsRule.test(/\.(woff|eot|ttf|otf)(\?.*)?$/i)
        fontsRule.use('file-loader')
            .loader('url-loader')
            .options({
                fallback: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[hash:8].[ext]'
                    }
                }
            })
    }
}