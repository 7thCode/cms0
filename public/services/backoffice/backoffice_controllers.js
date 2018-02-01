/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
var BackOfficeControllersModule;
(function (BackOfficeControllersModule) {
    var BackOfficeControllers = angular.module('BackOfficeControllers', []);
    //Front
    BackOfficeControllers.controller('EventController', ['$scope',
        function ($scope) {
            //     $scope.$on('change_controller', (event, value) => {
            //         $scope.controller_name = value;
            //     });
        }]);
    BackOfficeControllers.controller('BackOfficeController', ['$scope',
        function ($scope) {
            var progress = function (value) {
                $scope.$emit('progress', value);
            };
            $scope.$on('progress', function (event, value) {
                $scope.progress = value;
            });
            // tinymce
            $scope.tinymceOptions = {
                onChange: function (e) {
                    // put logic here for keypress and cut/paste changes
                },
                inline: false,
                plugins: 'visualblocks code table advlist autolink link image lists charmap print preview',
                menubar: "table tools",
                toolbar: 'code formatselect | bold italic strikethrough underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                style_formats: [
                    {
                        title: 'Headers', items: [
                            { title: 'h1', block: 'h1' },
                            { title: 'h2', block: 'h2' },
                            { title: 'h3', block: 'h3' },
                            { title: 'h4', block: 'h4' },
                            { title: 'h5', block: 'h5' },
                            { title: 'h6', block: 'h6' }
                        ]
                    },
                    {
                        title: 'Blocks', items: [
                            { title: 'p', block: 'p' },
                            { title: 'div', block: 'div' },
                            { title: 'pre', block: 'pre' }
                        ]
                    },
                    {
                        title: 'Containers', items: [
                            { title: 'section', block: 'section', wrapper: true, merge_siblings: false },
                            { title: 'article', block: 'article', wrapper: true, merge_siblings: false },
                            { title: 'blockquote', block: 'blockquote', wrapper: true },
                            { title: 'hgroup', block: 'hgroup', wrapper: true },
                            { title: 'aside', block: 'aside', wrapper: true },
                            { title: 'figure', block: 'figure', wrapper: true }
                        ]
                    }
                ],
                visualblocks_default_state: true,
                end_container_on_empty_block: true,
                entity_encoding: "raw",
                skin: 'lightgray',
                theme: 'modern'
            };
        }]);
})(BackOfficeControllersModule || (BackOfficeControllersModule = {}));
//# sourceMappingURL=backoffice_controllers.js.map