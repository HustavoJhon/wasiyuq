import DashboardController from './DashboardController'
import ApplicationController from './ApplicationController'
import FollowUpReportController from './FollowUpReportController'

const Adopter = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ApplicationController: Object.assign(ApplicationController, ApplicationController),
    FollowUpReportController: Object.assign(FollowUpReportController, FollowUpReportController),
}

export default Adopter