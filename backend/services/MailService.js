const BaseService = require('./BaseService');

module.exports = class MailService extends BaseService {
    constructor(mail) {
        super(mail);
    }

    enviar(data) {
        this.mail.sendMail(data);
    }
};