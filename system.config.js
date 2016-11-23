System.config({
    paths: {
        'npm:': 'node_modules/'
    },
    map: {
        zbuffer: './',
        '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
        '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
        '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
        '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
        'rxjs': 'npm:rxjs'
    },
    packages: {
        zbuffer: {
            main: './dist/index.js',
            defaultExtension: 'js'
        },
        rxjs: {
            defaultExtension: 'js'
        }
    }
});
