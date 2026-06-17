import Admin from './Admin'
import Public from './Public'
import Auth from './Auth'
import Adopter from './Adopter'
import Teams from './Teams'
import Dashboard from './Dashboard'
import Settings from './Settings'

const Controllers = {
    Admin: Object.assign(Admin, Admin),
    Public: Object.assign(Public, Public),
    Auth: Object.assign(Auth, Auth),
    Adopter: Object.assign(Adopter, Adopter),
    Teams: Object.assign(Teams, Teams),
    Dashboard: Object.assign(Dashboard, Dashboard),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers