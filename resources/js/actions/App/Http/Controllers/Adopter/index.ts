import DashboardController from './DashboardController'
import ApplicationController from './ApplicationController'
import PetController from './PetController'
import LostPetController from './LostPetController'
import FollowUpReportController from './FollowUpReportController'

const Adopter = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ApplicationController: Object.assign(ApplicationController, ApplicationController),
    PetController: Object.assign(PetController, PetController),
    LostPetController: Object.assign(LostPetController, LostPetController),
    FollowUpReportController: Object.assign(FollowUpReportController, FollowUpReportController),
}

export default Adopter