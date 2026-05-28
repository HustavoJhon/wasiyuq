<?php

namespace App\Enums;

enum TeamPermission: string
{
    // Team management
    case UpdateTeam = 'team:update';
    case DeleteTeam = 'team:delete';

    // Member management
    case AddMember = 'member:add';
    case UpdateMember = 'member:update';
    case RemoveMember = 'member:remove';

    // Invitations
    case CreateInvitation = 'invitation:create';
    case CancelInvitation = 'invitation:cancel';

    // Pets module
    case ViewPets = 'pets:view';
    case CreatePet = 'pets:create';
    case UpdatePet = 'pets:update';
    case DeletePet = 'pets:delete';

    // Adoptions module
    case ViewAdoptions = 'adoptions:view';
    case UpdateAdoptionStatus = 'adoptions:update-status';
    case GenerateAdoptionDocs = 'adoptions:generate-docs';

    // Follow-ups module
    case ViewFollowUps = 'follow-ups:view';
    case CreateFollowUp = 'follow-ups:create';
    case UpdateFollowUp = 'follow-ups:update';

    // Blog module
    case ViewBlog = 'blog:view';
    case CreateBlogPost = 'blog:create';
    case UpdateBlogPost = 'blog:update';
    case DeleteBlogPost = 'blog:delete';

    // Events module
    case ViewEvents = 'events:view';
    case CreateEvent = 'events:create';
    case UpdateEvent = 'events:update';
    case DeleteEvent = 'events:delete';

    // Announcements module
    case ViewAnnouncements = 'announcements:view';
    case CreateAnnouncement = 'announcements:create';
    case UpdateAnnouncement = 'announcements:update';
    case DeleteAnnouncement = 'announcements:delete';

    // Reports/Analytics
    case ViewReports = 'reports:view';
    case ExportData = 'data:export';

    /**
     * Get the display label for the permission.
     */
    public function label(): string
    {
        return str_replace(':', ' - ', ucfirst($this->value));
    }

    /**
     * Get the module this permission belongs to.
     */
    public function module(): string
    {
        return explode(':', $this->value)[0];
    }
}

