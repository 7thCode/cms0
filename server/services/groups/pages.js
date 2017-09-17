/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GroupPageRouter;
(function (GroupPageRouter) {
    const express = require('express');
    GroupPageRouter.router = express.Router();
    const core = require(process.cwd() + '/gs');
    const auth = core.auth;
    const share = core.share;
    const exception = core.exception;
    const config = share.config;
    const services_config = share.services_config;
    const webfonts = services_config.webfonts;
    let message = config.message;
    GroupPageRouter.router.get("/", [exception.page_guard, auth.page_valid, (request, response) => {
            response.render("services/groups/index", {
                config: config,
                user: request.user,
                message: message,
                status: 200,
                fonts: webfonts
            });
        }]);
    GroupPageRouter.router.get('/dialogs/create_dialog', [exception.page_guard, auth.page_valid, (request, response, next) => {
            response.render("services/groups/dialogs/create_dialog", { message: message });
        }]);
    GroupPageRouter.router.get('/dialogs/open_dialog', [exception.page_guard, auth.page_valid, (request, response, next) => {
            response.render("services/groups/dialogs/open_dialog", { message: message });
        }]);
    GroupPageRouter.router.get('/dialogs/delete_confirm_dialog', [exception.page_guard, auth.page_valid, (request, response, next) => {
            response.render('services/groups/dialogs/delete_confirm_dialog', { message: message });
        }]);
})(GroupPageRouter = exports.GroupPageRouter || (exports.GroupPageRouter = {}));
module.exports = GroupPageRouter.router;
//# sourceMappingURL=pages.js.map