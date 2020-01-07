var path = require('path');

var root = path.join(__dirname);

var config = {
    rootDir:                root,
    // Targets ========================================================
    serveDir:               path.join(root, '.serve'),
    distDir:                path.join(root, 'dist'),
    clientManifestFile:     'manifest.webpack.json',
    clientStatsFile:        'stats.webpack.json',

    // Source Directory ===============================================
    srcDir:                 path.join(root, 'app'),
    srcServerDir:           path.join(root, 'server'),

    // HTML Layout ====================================================
    srcHtmlLayout:          path.join(root, 'app', 'index.html'),

    // Site Config ====================================================
    siteTitle:              'Node Scrapper V 0.1',
    siteDescription:        'Scrap Marketbits Data',
    siteCannonicalUrl:      'http://127.0.0.1:4100',
    siteKeywords:           'Market Bits',
    scssIncludes:           [],
    loginAPI:      'http://127.0.0.1:3005/api/login',
    dashboardRoute:      'http://127.0.0.1:4100/dashboards/projects'
}

// var appApiConfig = {
//     loginAPI:      'http://127.0.0.1:3005/api/login',
//     dashboardRoute:      'http://127.0.0.1:4100/dashboards/projects'
// }

// var appRouteConfig = {
//     dashboardRoute:      'http://127.0.0.1:4100/dashboards/projects'
// }

module.exports = config;
//module.exports = appApiConfig;
//module.exports = appRouteConfig;