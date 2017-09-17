/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnalysisPageRouter;
(function (AnalysisPageRouter) {
    const express = require('express');
    AnalysisPageRouter.router = express.Router();
    const share = require(process.cwd() + '/server/systems/common/share');
    const AuthController = require(share.Server("systems/auth/controllers/auth_controller"));
    const auth = new AuthController.Auth;
    const ExceptionController = require(share.Server("systems/common/controllers/exception_controller"));
    const exception = new ExceptionController.Exception;
    const config = share.config;
    const services_config = share.services_config;
    const webfonts = services_config.webfonts;
    let message = config.message;
    AnalysisPageRouter.router.get("/", [exception.page_guard, auth.page_valid, auth.page_is_system, (request, response) => {
            response.render("systems/analysis/index", {
                config: config,
                user: request.user,
                message: message,
                status: 200,
                fonts: webfonts
            });
        }]);
})(AnalysisPageRouter = exports.AnalysisPageRouter || (exports.AnalysisPageRouter = {}));
module.exports = AnalysisPageRouter.router;
//# sourceMappingURL=pages.js.map