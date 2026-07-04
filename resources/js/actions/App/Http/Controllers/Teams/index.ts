import PetController from './PetController'
import VeterinarianController from './VeterinarianController'
import ShelterController from './ShelterController'
import TeamInvitationController from './TeamInvitationController'
import TeamController from './TeamController'
import TeamMemberController from './TeamMemberController'

const Teams = {
    PetController: Object.assign(PetController, PetController),
    VeterinarianController: Object.assign(VeterinarianController, VeterinarianController),
    ShelterController: Object.assign(ShelterController, ShelterController),
    TeamInvitationController: Object.assign(TeamInvitationController, TeamInvitationController),
    TeamController: Object.assign(TeamController, TeamController),
    TeamMemberController: Object.assign(TeamMemberController, TeamMemberController),
}

export default Teams