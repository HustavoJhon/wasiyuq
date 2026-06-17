import DashboardController from './DashboardController'
import ProfileController from './ProfileController'
import RoleManagementController from './RoleManagementController'
import UserController from './UserController'
import PetController from './PetController'
import OrganizationController from './OrganizationController'
import EventController from './EventController'
import BlogPostController from './BlogPostController'
import AdoptionController from './AdoptionController'
import FollowUpController from './FollowUpController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ProfileController: Object.assign(ProfileController, ProfileController),
    RoleManagementController: Object.assign(RoleManagementController, RoleManagementController),
    UserController: Object.assign(UserController, UserController),
    PetController: Object.assign(PetController, PetController),
    OrganizationController: Object.assign(OrganizationController, OrganizationController),
    EventController: Object.assign(EventController, EventController),
    BlogPostController: Object.assign(BlogPostController, BlogPostController),
    AdoptionController: Object.assign(AdoptionController, AdoptionController),
    FollowUpController: Object.assign(FollowUpController, FollowUpController),
}

export default Admin