/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

import {IRouter} from "express-serve-static-core";

export namespace ResourcePageRouter {

    const express: any = require('express');
    export let router: IRouter = express.Router();

    const core: any = require(process.cwd() + '/gs');
    const share: any = core.share;
    const exception: any = core.exception;

    const config: any = share.config;
    const services_config: any = share.services_config;
    const webfonts: any[] = services_config.webfonts || [];

    const message: any = config.message;

    const AuthController: any = require(share.Server("systems/auth/controllers/auth_controller"));
    const auth: any = new AuthController.Auth();

  //  const AnalysisModule: any = require(share.Server("systems/analysis/controllers/analysis_controller"));
  //  const analysis: any = new AnalysisModule.Analysis;

    const ResourcesModule: any = require(share.Server("systems/resources/controllers/resource_controller"));

    const pages: any = new ResourcesModule.Pages;

    router.get("/", [exception.page_guard, auth.page_valid, auth.page_is_system, (request: any, response: any): void => {
        response.render("systems/resources/player/index", {
            config: config,
            user: request.user,
            role: auth.role(request.user),
            message: message,
            status: 200,
            fonts: webfonts
        });
    }]);

    router.get("/builder", [exception.page_guard, auth.page_valid, auth.page_is_system, (request: any, response: any): void => {
        response.render("systems/resources/builder/index", {
            config: config,
            domain: share.config.domain,
            user: request.user,
            role: auth.role(request.user),
            message: message,
            status: 200,
            fonts: webfonts
        });
    }]);

    router.get('/dialogs/create_dialog', [exception.page_guard, auth.page_valid, auth.page_is_system, (req: any, result: any, next: any) => {
        result.render('systems/resources/builder/dialogs/create_dialog', {message: message});
    }]);

    router.get('/dialogs/open_dialog', [exception.page_guard, auth.page_valid, auth.page_is_system, (req: any, result: any, next: any) => {
        result.render('systems/resources/builder/dialogs/open_dialog', {message: message});
    }]);

    router.get('/dialogs/delete_confirm_dialog', [exception.page_guard, auth.page_valid, auth.page_is_system, (req: any, result: any, next: any) => {
        result.render('systems/resources/builder/dialogs/delete_confirm_dialog', {message: message});
    }]);

    // New Render

    let Error = (error: { code: number, message: string }, request: any, response: any) => {
        switch (error.code) {
            case 10000:
            case 20000:
                let userid:string = request.params.userid;
                pages.render_object(userid, "error.html", {  // user define error
                    status: 404,
                    message: error.message,
                    url: request.url
                }, (error: any, result: any) => {
                    if (!error) {
                        response.writeHead(200, {'Content-Type': result.type, 'Cache-Control': config.cache});
                        response.write(result.content);
                        response.end();
                    } else {
                        response.status(404).render('error', {  // system default error
                            status: 404,
                            message: error.message,
                            url: request.url
                        });
                    }
                });
                break;
            default:
                response.status(500).render('error', {
                    status: 500,
                    message: error.message,
                    url: request.url
                });
        }
    };
    /*
        let render_static = (request: any,sub_path:string[], response: any): void => {
            pages.render_direct(request, sub_path, (error: { code: number, message: string }, result: any): void => {
                if (!error) {
                    response.writeHead(200, {'Content-Type': result.type, 'Cache-Control': config.cache});
                    response.write(result.content);
                    response.end();
                } else {
                    Error(error, request, response);
                }
            });
        };

        router.get("/:userid/:namespace/doc/js/:page", [exception.page_catch, analysis.page_view, (request: any, response: any): void => {
            render_static(request,["doc", "js"], response);
        }]);

        router.get("/:userid/:namespace/doc/css/:page", [exception.page_catch, analysis.page_view, (request: any, response: any): void => {
            render_static(request,["doc", "css"], response);
        }]);

        router.get("/:userid/:namespace/static/:page", [exception.page_catch, analysis.page_view, (request: any, response: any): void => {
            render_static(request,["static"], response);
        }]);

        let render_html = (request: any, response: any): void => {
            pages.render_html(request, (error: { code: number, message: string }, result: any): void => {
                if (!error) {
                    response.writeHead(200, {'Content-Type': result.type, 'Cache-Control': config.cache});
                    response.write(result.content);
                    response.end();
                } else {
                    Error(error, request, response);
                }
            });
        };

        router.get("/:userid/:namespace/doc/:page", [exception.page_catch, analysis.page_view, (request: any, response: any): void => {
            render_html(request, response);
        }]);

        // router.get("/:userid/doc", [exception.page_catch, analysis.page_view, (request: any, response: any): void => {
        //     render_html(request, response);
        // }]);

        router.get("/:userid/:namespace/fragment/:parent/:page", [exception.page_catch, analysis.page_view, (request: any, response: any): void => {
            pages.render_fragment(request, (error: { code: number, message: string }, result: any): void => {
                if (!error) {
                    response.writeHead(200, {'Content-Type': result.type, 'Cache-Control': config.cache});
                    response.write(result.content);
                    response.end();
                } else {
                    Error(error, request, response);
                }
            });
        }]);
    */
}

module.exports = ResourcePageRouter.router;