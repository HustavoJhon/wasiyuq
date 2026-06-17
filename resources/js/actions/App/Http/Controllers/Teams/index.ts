import PetController from './PetController'
import TeamInvitationController from './TeamInvitationController'
import TeamController from './TeamController'
import TeamMemberController from './TeamMemberController'

const Teams = {
    PetController: Object.assign(PetController, PetController),
    TeamInvitationController: Object.assign(TeamInvitationController, TeamInvitationController),
    TeamController: Object.assign(TeamController, TeamController),
    TeamMemberController: Object.assign(TeamMemberController, TeamMemberController),
}

export default Teams