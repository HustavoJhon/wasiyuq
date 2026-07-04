import DashboardController from './DashboardController'
import ApplicationController from './ApplicationController'
import PetController from './PetController'
import FollowUpReportController from './FollowUpReportController'

const Adopter = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ApplicationController: Object.assign(ApplicationController, ApplicationController),
    PetController: Object.assign(PetController, PetController),
    FollowUpReportController: Object.assign(FollowUpReportController, FollowUpReportController),
}

export default Adopter