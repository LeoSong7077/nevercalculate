const MonthlyReport = require('../models/MonthlyReport');

const MonthlyReportService = {

    async save(doc) {
        try {
            const monthly_report = await MonthlyReport.create(doc);
            return monthly_report;
        }
        catch (error) {
            throw error;
        }
    },

    async get_one_by_id(id) {
        try {
            const monthly_report = await MonthlyReport.findOne({_id:id}).exec();
            return monthly_report;
        }
        catch (error) {
            throw error;
        }
    },

}
module.exports = MonthlyReportService;
