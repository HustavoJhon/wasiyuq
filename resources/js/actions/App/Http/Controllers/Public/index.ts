import SitemapController from './SitemapController'
import HomeController from './HomeController'
import PetController from './PetController'
import EventController from './EventController'
import BlogController from './BlogController'
import AboutController from './AboutController'
import ContactController from './ContactController'

const Public = {
    SitemapController: Object.assign(SitemapController, SitemapController),
    HomeController: Object.assign(HomeController, HomeController),
    PetController: Object.assign(PetController, PetController),
    EventController: Object.assign(EventController, EventController),
    BlogController: Object.assign(BlogController, BlogController),
    AboutController: Object.assign(AboutController, AboutController),
    ContactController: Object.assign(ContactController, ContactController),
}

export default Public