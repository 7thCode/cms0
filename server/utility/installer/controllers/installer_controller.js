/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstallerModule;
(function (InstallerModule) {
    const fs = require('graceful-fs');
    class Installer {
        read(request, response) {
            let result = "";
            let config_seed_file = fs.openSync(process.cwd() + "/config/systems/config.json", 'r');
            if (config_seed_file) {
                try {
                    result = JSON.parse(fs.readFileSync(config_seed_file, 'utf8'));
                }
                catch (e) {
                }
                finally {
                    fs.closeSync(config_seed_file);
                    response.json({ code: 0, message: "", value: result });
                }
            }
        }
        write(request, response) {
            let config_seed = request.body.setting;
            config_seed.mode = 1;
            let config_seed_file = fs.openSync(process.cwd() + "/config/systems/config.json", 'w');
            if (config_seed_file) {
                try {
                    fs.writeFileSync(config_seed_file, JSON.stringify(config_seed, null, 1));
                }
                catch (e) {
                }
                finally {
                    fs.closeSync(config_seed_file);
                    response.json({ code: 0, message: "", value: config_seed });
                }
            }
        }
    }
    InstallerModule.Installer = Installer;
})(InstallerModule = exports.InstallerModule || (exports.InstallerModule = {}));
module.exports = InstallerModule;
//# sourceMappingURL=installer_controller.js.map