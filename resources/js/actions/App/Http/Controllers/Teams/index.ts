import PetController from './PetController'
import TeamProfileController from './TeamProfileController'
import VeterinarianController from './VeterinarianController'
import TeamInvitationController from './TeamInvitationController'
import TeamController from './TeamController'
import TeamMemberController from './TeamMemberController'

const Teams = {
    PetController: Object.assign(PetController, PetController),
    TeamProfileController: Object.assign(TeamProfileController, TeamProfileController),
    VeterinarianController: Object.assign(VeterinarianController, VeterinarianController),
    TeamInvitationController: Object.assign(TeamInvitationController, TeamInvitationController),
    TeamController: Object.assign(TeamController, TeamController),
    TeamMemberController: Object.assign(TeamMemberController, TeamMemberController),
}

export default Teams