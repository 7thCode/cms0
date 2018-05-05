/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

namespace MembersControllersModule {

    let MembersControllers: angular.IModule = angular.module('MembersControllers', []);

    MembersControllers.controller('MemberController', ['$scope', '$document', '$log', '$uibModal', 'MemberService',
        ($scope: any, $document: any, $log: any, $uibModal: any, MemberService: any): void => {

            let progress = (value) => {
                $scope.$emit('progress', value);
            };

            $scope.$on('progress', (event, value): void => {
                $scope.progress = value;
            });

            let error_handler: (code: number, message: string) => void = (code: number, message: string): void => {
                progress(false);
                $scope.message = message;
                $log.error(message);
                alert(message);
            };

            let alert = (message: string): void => {
                let modalInstance: any = $uibModal.open({
                    controller: 'AlertDialogController',
                    templateUrl: '/common/dialogs/alert_dialog',
                    resolve: {
                        items: (): any => {
                            return message;
                        }
                    }
                });
                modalInstance.result.then((answer: any): void => {
                }, (): void => {
                });
            };

            $document.on('drop dragover', (e: any): void => {
                e.stopPropagation();
                e.preventDefault();
            });

            let Draw = () => {
                MemberService.Query((result: any): void => {
                    if (result) {
                        $scope.accounts = result;
                    }
                }, error_handler);
            };

            let Count = (): void => {
                MemberService.Count((result: any): void => {
                    if (result) {
                        $scope.count = result;
                    }
                }, error_handler);
            };

            let Next = () => {
                progress(true);
                MemberService.Next((result): void => {
                    if (result) {
                        $scope.accounts = result;
                    }
                    progress(false);
                }, error_handler);
            };

            let Prev = () => {
                progress(true);
                MemberService.Prev((result): void => {
                    if (result) {
                        $scope.accounts = result;
                    }
                    progress(false);
                }, error_handler);
            };

            let Find = (name): void => {
                if (name) {
                    MemberService.query = {username: {$regex: name}};
                }
                Draw();
                Count();
            };

            let Open = (acount: any): void => {
                let modalRegist: any = $uibModal.open({
                    controller: 'MemberOpenDialogController',
                    templateUrl: '/members/dialogs/open_dialog',
                    resolve: {
                        items: acount
                    }
                });

                modalRegist.result.then((group: any): void => {
                    $scope.layout = group;
                    $scope.name = group.name;
                    $scope.opened = true;
                }, (): void => {
                });

            };

            $scope.showMemberDialog = (): void => {
                let modalRegist = $uibModal.open({
                    controller: 'MemberDialogController',
                    templateUrl: '/auth/dialogs/memberdialog',
                    backdrop: "static",
                    resolve: {
                        items: (): any => {
                            return $scope.items;
                        }
                    }
                });

                modalRegist.result.then((): void => {
                    confirmMember();
                }, (): void => {
                });
            };

            let confirmMember = () => {
                let modalRegistConfirm = $uibModal.open({
                    controller: 'MemberConfirmDialogController',
                    templateUrl: '/auth/dialogs/memberconfirmdialog',
                    backdrop: "static",
                    targetEvent: null
                });

                modalRegistConfirm.result.then((): void => {
                }, (): void => {
                });
            };

            $scope.Next = Next;
            $scope.Prev = Prev;
            $scope.Count = Count;
            $scope.Find = Find;
            $scope.Open = Open;

            Find(null);

        }]);

    MembersControllers.controller('MemberDialogController', ['$scope', '$uibModalInstance', 'AuthService',
        ($scope: any, $uibModalInstance: any, AuthService: any): void => {

            let progress = (value) => {
                $scope.$emit('progress', value);
            };

            $scope.$on('progress', (event, value) => {
                $scope.progress = value;
            });

            $scope.hide = (): void => {
                $uibModalInstance.close();
            };

            $scope.cancel = (): void => {
                $uibModalInstance.dismiss();
            };

            $scope.answer = (items: any): void => {
                $scope.message = "";
                progress(true);
                AuthService.Member($scope.items.username, $scope.items.password, $scope.items.displayName, items, (account) => {
                    $uibModalInstance.close(account);
                    progress(false);
                }, (error, message) => {
                    $scope.message = message;
                    progress(false);
                });

            };
        }]);

    MembersControllers.controller('MemberConfirmDialogController', ['$scope', '$uibModalInstance',
        ($scope: any, $uibModalInstance: any): void => {

            $scope.hide = (): void => {
                $uibModalInstance.close();
            };

            $scope.cancel = (): void => {
                $uibModalInstance.dismiss();
            };

            $scope.answer = (answer): void => {
                $uibModalInstance.close($scope);
            };

        }]);


    MembersControllers.controller('MemberOpenDialogController', ['$scope', '$uibModalInstance', 'items',
        ($scope: any, $uibModalInstance: any, items: any): void => {

            $scope.items = items;

            $scope.hide = (): void => {
                $uibModalInstance.close();
            };

            $scope.cancel = (): void => {
                $uibModalInstance.dismiss();
            };

        }]);
}
/*! Controllers  */
