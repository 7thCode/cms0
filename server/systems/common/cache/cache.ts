/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

export namespace CacheModule {

    const _: any = require('lodash');
    const fs: any = require('graceful-fs');
    const path: any = require('path');

    const core: any = require(process.cwd() + '/gs');
    const share: any = core.share;
    const event: any = share.Event;
    const logger: any = share.logger;

    const file_utility: any = share.Utility;

    export class Cache {

        private root_path: string;

        constructor(root_dir: string) {
            this.root_path = path.join(process.cwd(), root_dir);

            event.emitter.on('cache_invalidate', (data: any): void => {
                this.invalidate(data);
            });

            event.emitter.on('cache_write', (data: any): void => {
                this.write(data);
            });
        }

        public write(data: any): void {

            let error_handler = (error: any): void => {
                logger.error(error.message);
            };

            let path_array: any[] = data.path;
            let file_name: string = path_array.pop();

            if ("stream" in data) {
                let readstream = data.stream;
                file_utility.create_dir(this.root_path, path_array, (target_path) => {
                    let write_file = fs.createWriteStream(path.join(target_path, file_name));
                    readstream.pipe(write_file);
                }, error_handler);
            } else if ("string" in data) {
                let content = data.string;
                file_utility.create_dir(this.root_path, path_array, (target_path) => {
                    file_utility.writefile(path.join(target_path, file_name), content, (error: any) => {
                    });
                }, error_handler);
            }
        };

        public invalidate(data: any): void {
            let path_string = path.join(this.root_path, data.path);
            file_utility.delete_folder_recursive(path_string);
        }
    }
}

module.exports = CacheModule;
