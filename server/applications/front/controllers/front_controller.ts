/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */

"use strict";

export namespace FrontModule {

    const _ = require('lodash');
    const fs: any = require('graceful-fs');

    const path: any = require('path');

    const mongodb: any = require('mongodb');
    const mongoose: any = require('mongoose');
    mongoose.Promise = global.Promise;

    const archiver: any = require('archiver');

    const sharp = require("sharp");

    const core: any = require(process.cwd() + '/gs');
    const share: any = core.share;
    const config: any = share.config;
    const applications_config: any = share.applications_config;
    const Wrapper: any = share.Wrapper;

    const validator: any = require('validator');
    const url: any = require('url');

    const ResourceModel: any = require(share.Models("systems/resources/resource"));
    const ArticleModel: any = require(share.Models("services/articles/article"));

    export class Front {

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

        static userid(request): string {
            return request.user.userid;
        }

        /**
         *  let userid = Pages.userid(request);
         *  request.sessionID;
         *  let tmp_path = '/tmp/' + sessionid;
         * @param userid
         * @param tmp_path
         * @param callback
         * @returns none
         */
        static get_file_all(userid: string, tmp_path: string, callback: (error) => void): void {

            let number: number = 27000;
            let conn = Front.connect(config.db.user);
            if (conn) {
                conn.once('open', (error: any): void => {
                    if (!error) {
                        let bucket = new mongodb.GridFSBucket(conn.db, {});
                        conn.db.collection('fs.files', (error: any, collection: any): void => {
                            if (!error) {
                                if (collection) {
                                    collection.find({"metadata.userid": userid}).toArray((error: any, docs: any): void => {
                                        if (!error) {
                                            let save = (doc: any): any => {
                                                return new Promise((resolve: any, reject: any): void => {
                                                    if (doc) {
                                                        bucket.openDownloadStreamByName(doc.filename)
                                                            .pipe(fs.createWriteStream(path.join(tmp_path, doc.filename)))
                                                            .on('error', (error): void => {
                                                                reject(error);
                                                            })
                                                            .on('finish', (): void => {
                                                                resolve({});
                                                            });
                                                    }
                                                });
                                            };

                                            Promise.all(docs.map((doc: any): void => {
                                                return save(doc);
                                            })).then((results: any[]): void => {
                                                callback(null);
                                                conn.db.close();
                                            }).catch((error: any): void => {
                                                callback(error);
                                                conn.db.close();
                                            });

                                        } else {
                                            callback({code: error.code, message: error.message});
                                            conn.db.close();
                                        }
                                    });
                                } else {
                                    callback({code: number + 20, message: "gfs error"});
                                    conn.db.close();
                                }
                            } else {
                                callback({code: error.code, message: error.message});
                                conn.db.close();
                            }
                        });
                    } else {
                        callback({code: error.code, message: error.message});
                    }
                });
            } else {
                callback({code: number + 40, message: "db error"});
            }
        }

        /**
         *  let userid = Pages.userid(request);
         * @param userid
         * @param tmp_path
         * @param callback
         * @returns none
         */
        static get_article_all(userid: string, tmp_path: string, callback: (error) => void): void {
            let namespace = "";
            ArticleModel.find({$and: [{namespace: namespace}, {userid: userid}]}, {}, {}).then((docs: any): void => {
                fs.writeFile(tmp_path, JSON.stringify(docs), (error) => {
                    callback(error);
                });
            }).catch((error: any): void => {
                callback(error);
            });
        }

        /**
         *  let userid = Pages.userid(request);
         * @param userid
         * @param tmp_path
         * @param callback
         * @returns none
         */
        static get_resource_all(userid: string, tmp_path: string, callback: (error) => void): void {
            let namespace = "";
            ResourceModel.find({$and: [{namespace: namespace}, {userid: userid}]}, {}, {}).then((docs: any): void => {
                fs.writeFile(tmp_path, JSON.stringify(docs), (error) => {
                    callback(error);
                });
            }).catch((error: any): void => {
                callback(error);
            });
        }

        /**
         *  let userid = Pages.userid(request);
         * @param work
         * @param target
         * @param callback
         * @returns none
         */
        static zip(work: string, target: string, callback: (error) => void) {

            let zip_file_name = work + "/" + target + ".zip";
            let archive = archiver.create('zip', {});
            let output = fs.createWriteStream(zip_file_name);

            let carrent = process.cwd();

            output.on("close", () => {
                process.chdir(carrent);
                callback(null);
            });

            archive.on('error', (error) => {
                process.chdir(carrent);
                callback(error);
            });

            process.chdir(work);
            archive.pipe(output);
            archive.glob("data/*");
            archive.finalize();

        }

        /**
         *  let userid = Pages.userid(request);
         * @param request
         * @param response
         * @returns none
         */
        public get_all(request: any, response: any): void {
            let userid = Front.userid(request);
            let tmp_path = path.join("/tmp", request.sessionID);
            fs.mkdir(tmp_path, (error): void => {
                if (!error) {
                    fs.mkdir(path.join(tmp_path, "data"), (error): void => {
                        if (!error) {
                            Front.get_file_all(userid, path.join(tmp_path, "data"), (error: any): void => {
                                if (!error) {
                                    Front.get_article_all(userid, path.join(tmp_path, "data/articles.txt"), (error: any): void => {
                                        if (!error) {
                                            Front.get_resource_all(userid, path.join(tmp_path, "data/resources.txt"), (error: any): void => {
                                                if (!error) {
                                                    Front.zip(tmp_path, "data", (error: any): void => {
                                                        if (!error) {
                                                            response.download(path.join(tmp_path, "data.zip"), (error: any): void => {
                                                                if (!error) {
                                                                    let exec = require('child_process').exec;
                                                                    exec('rm -r ' + tmp_path, (error, stdout, stderr) => {
                                                                        //        Wrapper.SendSuccess(response, {code: 0, message: ""});
                                                                    });
                                                                } else {
                                                                    Wrapper.SendError(response, error.code, error.message, error);
                                                                }
                                                            });
                                                        } else {
                                                            Wrapper.SendError(response, error.code, error.message, error);
                                                        }
                                                    });
                                                } else {
                                                    Wrapper.SendError(response, error.code, error.message, error);
                                                }
                                            });
                                        } else {
                                            Wrapper.SendError(response, error.code, error.message, error);
                                        }
                                    });
                                } else {
                                    Wrapper.SendError(response, error.code, error.message, error);
                                }
                            });
                        } else {
                            Wrapper.SendError(response, error.code, error.message, error);
                        }
                    });
                } else {
                    Wrapper.SendError(response, error.code, error.message, error);
                }
            });
        }

        public put_all(request: any, response: any): void {
        }

        /**
         * @param request
         * @param response
         * @returns none
         */
        public build(request: any, response: any): void {
            let userid = Front.userid(request);
            let name = request.params.name;
            let namespace = request.params.namespace;

            const core = require(process.cwd() + '/gs');
            const file: any = core.file;
            const resource: any = core.resource;

            let all_resource_set = applications_config.sites;
            if (all_resource_set) {
                let target_resource_set = all_resource_set[name];
                if (target_resource_set) {
                    file.create_files(userid, namespace, target_resource_set.files, (error: any, result: any): void => {
                        if (!error) {
                            resource.create_resources(userid, namespace, target_resource_set.resources, (error: any, result: any): void => {
                                if (!error) {
                                    Wrapper.SendSuccess(response, {code: 0, message: ""});
                                } else {
                                    Wrapper.SendError(response, error.code, error.message, error);
                                }
                            });
                        } else {
                            Wrapper.SendError(response, error.code, error.message, error);
                        }
                    });
                }
            }
        }
    }

}

module.exports = FrontModule;