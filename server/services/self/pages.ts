/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

import {IRouter} from "express-serve-static-core";

export namespace SelfPageRouter {

    const express: any = require('express');
    export const router: IRouter = express.Router();

    const core: any = require(process.cwd() + '/gs');
    const share: any = core.share;
    const config: any = share.config;
    const auth: any = core.auth;
    const exception: any = core.exception;
    const analysis: any = core.analysis;

    const services_config: any = share.services_config;
    const webfonts: any[] = services_config.webfonts;

    const message: any = config.message;

    //self
    router.get("/", [exception.page_guard, auth.page_valid, analysis.page_view, (request: any, response: any): void => {
        response.render("services/self/index", {
            config: config,
            user: request.user,
            role: auth.role(request.user),
            message: message,
            status: 200,
            fonts: webfonts
        });
    }]);

    router.get('/dialogs/save_done_dialog', [exception.page_guard, auth.page_valid, (req: any, result: any, next: any) => {
        result.render('services/self/dialogs/save_done_dialog', {message: message});
    }]);

}

module.exports = SelfPageRouter.router;