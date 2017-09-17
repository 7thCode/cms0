/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormApiRouter;
(function (FormApiRouter) {
    const express = require('express');
    FormApiRouter.router = express.Router();
    const core = require(process.cwd() + '/gs');
    const share = core.share;
    const exception = core.exception;
    const AuthController = require(share.Server("systems/auth/controllers/auth_controller"));
    FormApiRouter.auth = new AuthController.Auth();
    const FormsModule = require(share.Server("services/forms/controllers/forms_controller"));
    const form = new FormsModule.Form;
    FormApiRouter.router.post("/api/create", [exception.exception, exception.guard, exception.authenticate, FormApiRouter.auth.is_system, form.create_form]);
    FormApiRouter.router.get("/api/query/:query/:option", [form.get_form_query]);
    FormApiRouter.router.get('/api/count/:query', [form.get_form_count]);
    FormApiRouter.router.get("/api/:id", [form.get_form]);
    FormApiRouter.router.put("/api/:id", [exception.exception, exception.guard, exception.authenticate, FormApiRouter.auth.is_system, form.put_form]);
    FormApiRouter.router.delete("/api/:id", [exception.exception, exception.guard, exception.authenticate, FormApiRouter.auth.is_system, form.delete_form]);
    FormApiRouter.router.delete('/api/own', [exception.exception, exception.guard, exception.authenticate, FormApiRouter.auth.is_system, form.delete_own]);
})(FormApiRouter = exports.FormApiRouter || (exports.FormApiRouter = {}));
module.exports = FormApiRouter.router;
//# sourceMappingURL=api.js.map