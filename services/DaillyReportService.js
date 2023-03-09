const DailyReport = require('../models/DailyReport');

const DailyReportService = {

    async save(doc) {
        try {
            const daily_report = await DailyReport.create(doc);
            return daily_report;
        }
        catch (error) {
            throw error;
        }
    },

    async get_all() {
        try {
            const daily_reports = await DailyReport.find().sort({_id:-1}).exec();
            return daily_reports;
        }
        catch (error) {
            throw error;
        }
    },

    async get_many_by_doc(doc) {
        try {
            const daily_reports = await DailyReport.find(doc).sort({_id:1}).exec();
            return daily_reports;
        }
        catch (error) {
            throw error;
        }
    }

}
module.exports = DailyReportService;
