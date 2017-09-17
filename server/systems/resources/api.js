/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceApiRouter;
(function (ResourceApiRouter) {
    const express = require('express');
    ResourceApiRouter.router = express.Router();
    const core = require(process.cwd() + '/gs');
    const share = core.share;
    const exception = core.exception;
    const AuthController = require(share.Server("systems/auth/controllers/auth_controller"));
    const auth = new AuthController.Auth;
    const ResourcesModule = require(share.Server("systems/resources/controllers/resource_controller"));
    const resource = new ResourcesModule.Resource;
    ResourceApiRouter.router.post("/api/create", [exception.exception, exception.guard, exception.authenticate, resource.create_resource]);
    ResourceApiRouter.router.get("/api/query/:query/:option", [resource.get_resource_query]);
    ResourceApiRouter.router.get('/api/count/:query', [resource.get_resource_count]);
    ResourceApiRouter.router.get("/api/:id", [resource.get_resource]);
    ResourceApiRouter.router.put("/api/:id", [exception.exception, exception.guard, exception.authenticate, resource.put_resource]);
    ResourceApiRouter.router.delete("/api/:id", [exception.exception, exception.guard, exception.authenticate, resource.delete_resource]);
    ResourceApiRouter.router.delete('/api/own', [exception.exception, exception.guard, exception.authenticate, resource.delete_own]);
})(ResourceApiRouter = exports.ResourceApiRouter || (exports.ResourceApiRouter = {}));
module.exports = ResourceApiRouter.router;
//# sourceMappingURL=api.js.map