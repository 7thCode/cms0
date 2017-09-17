/**!
 Copyright (c) 2016 7thCode.(http://seventh-code.com/)
 This software is released under the MIT License.
 //opensource.org/licenses/mit-license.php
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SlackModule;
(function (SlackModule) {
    const _ = require('lodash');
    const Botkit = require('botkit');
    const core = require(process.cwd() + '/gs');
    const share = core.share;
    const config = share.config;
    const Wrapper = share.Wrapper;
    const logger = share.logger;
    const plugins_config = share.plugins_config;
    let controller = null;
    class Slack {
        constructor() {
            controller = Botkit.slackbot({
                debug: false
            });
            controller.spawn({
                token: plugins_config.slack.token
            }).startRTM((err) => {
                if (err) {
                }
            });
            controller.hears('', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
                bot.startConversation(message, function (err, convo) {
                    convo.say('やあ!');
                    convo.say('おしゃべりしよ!');
                    convo.ask('元気?', function (response, convo) {
                        convo.say(response.text + "なのね!");
                        convo.next();
                    });
                });
            });
        }
    }
    SlackModule.Slack = Slack;
})(SlackModule = exports.SlackModule || (exports.SlackModule = {}));
module.exports = SlackModule;
//# sourceMappingURL=slack_controller.js.map