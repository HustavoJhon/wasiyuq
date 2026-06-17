import AdoptionController from './AdoptionController'
import FollowUpController from './FollowUpController'
import BlogPostController from './BlogPostController'
import EventController from './EventController'

const Dashboard = {
    AdoptionController: Object.assign(AdoptionController, AdoptionController),
    FollowUpController: Object.assign(FollowUpController, FollowUpController),
    BlogPostController: Object.assign(BlogPostController, BlogPostController),
    EventController: Object.assign(EventController, EventController),
}

export default Dashboard