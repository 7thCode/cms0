/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

export namespace BackOfficePageRouter {

    const express = require('express');
    export const router = express.Router();

    const core = require(process.cwd() + '/gs');
    const share: any = core.share;
    const auth: any = core.auth;
    const exception: any = core.exception;
    const analysis: any = core.analysis;

    const config = share.config;
    let message = config.message;

    const services_config = share.services_config;
    const webfonts: any[] = services_config.webfonts;

    router.get("/", [exception.page_guard, auth.page_valid, analysis.page_view, auth.page_is_system, (request: any, response: any): void => {
        response.render("services/backoffice/index", {
            config: config,
            user: request.user,
            message: message,
            status: 200,
            fonts: webfonts
        });
    }]);

}

module.exports = BackOfficePageRouter.router;