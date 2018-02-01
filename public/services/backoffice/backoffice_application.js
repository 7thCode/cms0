/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
var BackOfficeApplicationModule;
(function (BackOfficeApplicationModule) {
    var BackOfficeApplication = angular.module('BackOfficeApplication', [
        'ngMessages', "ngResource", 'ui.bootstrap', 'angular.chips', 'ui.ace', 'ngDraggable', 'angular-loading-bar', 'ngCropper',
        'ngSanitize',
        'ui.tinymce',
        //'froala',//froala
        "Services",
        'FrontControllers',
        "TemplateServices",
        "LayoutServices",
        "LayoutsProviders",
        'ImageControllers',
        'BuilderControllers',
        'PlayerControllers',
        "BackOfficeControllers",
        'FileServices',
        'FileControllers',
        "AuthServices",
        'AuthControllers',
        "GroupControllers",
        "GroupServices",
        "FormsProviders",
        'FormPlayerServices',
        'FormPlayerControllers',
        "FormBuilderServices",
        'FormBuilderControllers',
        'AccountServices',
        'AccountControllers',
        'AnalysisServices',
        'AnalysisControllers',
        'ArticleServices',
        'ArticleControllers',
        'ProfileControllers',
        'SettingControllers',
        "SettingServices",
        "GoogleServices",
        "YahooServices",
        "PublicKeyServices",
        "ResourcesProviders",
        "ResourceBuilderServices",
        'ResourceBuilderControllers',
        'ResourcePlayerServices',
        'ResourcePlayerControllers',
        "MailerControllers",
        "MailerServices",
        "RobotControllers",
        "RobotServices",
        "GoogleServices",
        "GoogleControllers",
        "NamespaceControllers",
        "NamespaceServices",
        "MembersControllers",
        "MembersServices",
        "PagesControllers",
        "PicturesControllers",
        "BlobControllers",
        "SVGControllers",
        "DataControllers",
        "DataServices",
        "SelfControllers"
    ]);
    BackOfficeApplication.run(['$rootScope',
        function ($rootScope) {
            $rootScope.$on("$routeChangeSuccess", function (event, current, previous, rejection) {
            });
        }
    ]);
    BackOfficeApplication.config(['$compileProvider', '$httpProvider',
        function ($compileProvider, $httpProvider) {
            $compileProvider.debugInfoEnabled(false);
            $httpProvider.defaults.headers.common = { 'x-requested-with': 'XMLHttpRequest' };
            $httpProvider.defaults.headers.common['If-Modified-Since'] = 'Thu, 01 Jun 1970 00:00:00 GMT'; //マイクロソフトのバグ対応！！！
        }]);
    BackOfficeApplication.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.parentSelector = '#body';
            cfpLoadingBarProvider.spinnerTemplate = '<div style="z-index:20000;position:fixed;top:50%;left:50%;margin-top:-70px;margin-left:-75px;"><div id="progress"><div id="rond"><div id="test"></div></div><div id="load"></div></div></div>';
            cfpLoadingBarProvider.latencyThreshold = 500;
        }]);
    BackOfficeApplication.config(['ShapeEditProvider', function (ShapeEditProvider) {
            ShapeEditProvider.configure({
                wrapper: 'wrapper',
                canvas: 'canvas',
                width: 600,
                height: 600
            });
        }]);
    BackOfficeApplication.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['**']);
        }]);
    BackOfficeApplication.filter('limit', [function () {
            return function (text, limit) {
                var result = "";
                if (text) {
                    result = text;
                    if (text.length > limit) {
                        result = text.slice(0, limit) + "...";
                    }
                }
                return result;
            };
        }]);
    BackOfficeApplication.controller('AlertDialogController', ['$scope', '$uibModalInstance', 'items',
        function ($scope, $uibModalInstance, items) {
            $scope.message = items;
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);
})(BackOfficeApplicationModule || (BackOfficeApplicationModule = {}));
//# sourceMappingURL=backoffice_application.js.map