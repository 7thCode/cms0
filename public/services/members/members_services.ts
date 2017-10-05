/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

let MembersServices: angular.IModule = angular.module('MembersServices', []);

MembersServices.factory('GroupMember', ['$resource',
    ($resource: any): any => {
        return $resource('/members/api/:id', {id: "@id"}, {
            get: {method: 'GET'},
            put: {method: 'PUT'},
            delete: {method: 'DELETE'}
        });
    }]);

MembersServices.factory('GroupMemberQuery', ['$resource',
    ($resource: any): any => {
        return $resource('/members/api/query/:query/:option', {query: '@query', option: '@option'}, {
            query: {method: 'GET'}
        });
    }]);

MembersServices.factory('GroupMemberCount', ['$resource',
    ($resource: any): any => {
        return $resource('/members/api/count/:query', {query: '@query'}, {
            get: {method: 'GET'}
        });
    }]);

MembersServices.service('MemberService', ['GroupMember','GroupMemberQuery', 'GroupMemberCount', 'CollectionService',
    function (GroupMember:any, GroupMemberQuery: any, GroupMemberCount: any, CollectionService: any): void {

        this.SetQuery = (query):void => {
            this.option.skip = 0;
            this.query = {};
            if (query) {
                this.query = query;
            }
        };

        let init = ():void => {
            this.option = {limit: 40, skip: 0};
            this.SetQuery(null);
        };

        this.Init = ():void => {
            init();
        };

        this.Query = (callback: (data) => void, error: (code: number, message: string) => void): void => {
            CollectionService.List(GroupMemberQuery, this.query, this.option, callback, error);
        };

        this.Count = (callback: (data: any) => void, error: (code: number, message: string) => void): void => {
            CollectionService.Count(GroupMemberCount, this.query, callback, error);
        };

        this.Over = (callback: (result: any) => void, error: (code: number, message: string) => void): void => {
            this.Count((count) => {
                callback((this.option.skip + this.option.limit) <= count);
            }, error);
        };

        this.Under = (callback: (result: any) => void, error: (code: number, message: string) => void): void => {
            callback(this.option.skip > 0);
        };

        this.Next = (callback: (result: any) => void, error: (code: number, message: string) => void): void => {
            this.Over((hasnext):void => {
                if (hasnext) {
                    this.option.skip = this.option.skip + this.option.limit;
                    this.Query(callback, error);
                } else {
                    callback(null);
                }
            });
        };

        this.Prev = (callback: (result: any) => void, error: (code: number, message: string) => void): void => {
            this.Under((hasprev):void => {
                if (hasprev) {
                    this.option.skip = this.option.skip - this.option.limit;
                    this.Query(callback, error);
                } else {
                    callback(null);
                }
            });
        };

        this.Put = (username: any, content: any, callback: (result: any) => void, error: (code: number, message: string) => void): void => {
            let group = new GroupMember();
            group.content = content;
            group.$put({
                username: username
            }, (result: any): void => {
                if (result) {
                    if (result.code === 0) {
                        callback(result.value);
                        this.dirty = false;
                    } else {
                        error(result.code, result.message);
                    }
                } else {
                    error(10000, "network error");
                }
            });
        };

        this.Init();
    }]);