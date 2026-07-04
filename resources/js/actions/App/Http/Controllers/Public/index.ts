import SitemapController from './SitemapController'
import HomeController from './HomeController'
import PetController from './PetController'
import LostPetController from './LostPetController'
import EventController from './EventController'
import BlogController from './BlogController'
import AboutController from './AboutController'
import ContactController from './ContactController'
import VeterinarianController from './VeterinarianController'
import ChatbotController from './ChatbotController'

const Public = {
    SitemapController: Object.assign(SitemapController, SitemapController),
    HomeController: Object.assign(HomeController, HomeController),
    PetController: Object.assign(PetController, PetController),
    LostPetController: Object.assign(LostPetController, LostPetController),
    EventController: Object.assign(EventController, EventController),
    BlogController: Object.assign(BlogController, BlogController),
    AboutController: Object.assign(AboutController, AboutController),
    ContactController: Object.assign(ContactController, ContactController),
    VeterinarianController: Object.assign(VeterinarianController, VeterinarianController),
    ChatbotController: Object.assign(ChatbotController, ChatbotController),
}

export default Public