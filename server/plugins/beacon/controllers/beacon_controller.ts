/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

export namespace BeaconModule {

    const _ = require('lodash');

    const mongoose = require('mongoose');
    const Grid = require('gridfs-stream');

    const core = require(process.cwd() + '/gs');
    const share: any = core.share;

    const config = share.config;
    const Cipher = share.Cipher;
    const Wrapper = share.Wrapper;
    const logger = share.logger;

    export class Beacon {

        constructor() {

        }

        static connect(user): any {
            let result = null;
            const options = {useMongoClient: true, keepAlive: 300000, connectTimeoutMS: 1000000};
            if (user) {
                result = mongoose.createConnection("mongodb://" + config.db.user + ":" + config.db.password + "@" + config.db.address + "/" + config.db.name, options);
            } else {
                result = mongoose.createConnection("mongodb://" + config.db.address + "/" + config.db.name, options);
            }
            return result;
        }


        /*

         let data = {
         time: now,
         address: request.connection.remoteAddress,
         user: "",
         headers: request.headers['user-agent'],
         referer: ""
         };

         */

        /**
         * @param request
         * @param response
         * @returns none
         */
        public get_beacon(request: any, response: any, next: any): void {
            try {
                let token: any = {};
                try {
                    token = JSON.parse(Cipher.FixedDecrypt(request.params.token, config.tokensecret));
                } catch (e) {
                }

                let conn = Beacon.connect(config.db.user);

                conn.once('open', (error: any): void => {
                    if (!error) {
                        let gfs = Grid(conn.db, mongoose.mongo); //missing parameter
                        if (gfs) {
                            conn.db.collection('fs.files', (error: any, collection: any): void => {
                                if (!error) {
                                    if (collection) {
                                        collection.findOne({filename: "blank.png"}, (error: any, item: any): void => {
                                            if (!error) {
                                                if (item) {
                                                    let readstream = gfs.createReadStream({_id: item._id});
                                                    if (readstream) {
                                                        response.setHeader("Content-Type", item.metadata.type);
                                                        response.setHeader("Cache-Control", "no-cache");
                                                        readstream.on('close', (file: any): void => {
                                                            conn.db.close();
                                                        });
                                                        readstream.on('error', (error: any): void => {
                                                            conn.db.close();
                                                        });
                                                        readstream.pipe(response);
                                                    } else {
                                                        conn.db.close();
                                                        next();
                                                    }
                                                } else {
                                                    conn.db.close();
                                                    next();
                                                }
                                            } else {
                                                conn.db.close();
                                                next();
                                            }
                                        });
                                    } else {
                                        conn.db.close();
                                        next();
                                    }
                                } else {
                                    conn.db.close();
                                    next();
                                }
                            });
                        } else {
                            next();
                        }
                    } else {
                        next();
                    }
                });
            } catch (e) {
                next();
            }
        }
    }
}

module.exports = BeaconModule;
