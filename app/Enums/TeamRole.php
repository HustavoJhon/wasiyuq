<?php

namespace App\Enums;

enum TeamRole: string
{
    case Owner = 'owner';
    case Admin = 'admin';
    case OrganizationManager = 'organization_manager';
    case PetManager = 'pet_manager';
    case BlogEditor = 'blog_editor';
    case AdoptionsCoordinator = 'adoptions_coordinator';
    case Member = 'member';
    case Viewer = 'viewer';

    /**
     * Get the display label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Owner => 'Propietario',
            self::Admin => 'Administrador',
            self::OrganizationManager => 'Gestor de Organización',
            self::PetManager => 'Gestor de Mascotas',
            self::BlogEditor => 'Editor de Blog',
            self::AdoptionsCoordinator => 'Coordinador de Adopciones',
            self::Member => 'Miembro',
            self::Viewer => 'Visualizador',
        };
    }

    /**
     * Get the description for this role.
     */
    public function description(): string
    {
        return match ($this) {
            self::Owner => 'Control total sobre la organización',
            self::Admin => 'Administración completa de la organización',
            self::OrganizationManager => 'Gestiona organización, mascotas y adopciones',
            self::PetManager => 'Gestiona el registro y datos de mascotas',
            self::BlogEditor => 'Crea y edita contenido del blog',
            self::AdoptionsCoordinator => 'Coordina procesos de adopción y seguimientos',
            self::Member => 'Acceso básico con permisos limitados',
            self::Viewer => 'Solo lectura de información',
        };
    }

    /**
     * Get all the permissions for this role.
     *
     * @return array<TeamPermission>
     */
    public function permissions(): array
    {
        return match ($this) {
            self::Owner => TeamPermission::cases(),
            self::Admin => [
                // Team
                TeamPermission::UpdateTeam,
                TeamPermission::DeleteTeam,
                // Members
                TeamPermission::AddMember,
                TeamPermission::UpdateMember,
                TeamPermission::RemoveMember,
                TeamPermission::CreateInvitation,
                TeamPermission::CancelInvitation,
                // Pets
                TeamPermission::ViewPets,
                TeamPermission::CreatePet,
                TeamPermission::UpdatePet,
                TeamPermission::DeletePet,
                // Adoptions
                TeamPermission::ViewAdoptions,
                TeamPermission::UpdateAdoptionStatus,
                TeamPermission::GenerateAdoptionDocs,
                // Follow-ups
                TeamPermission::ViewFollowUps,
                TeamPermission::CreateFollowUp,
                TeamPermission::UpdateFollowUp,
                // Blog
                TeamPermission::ViewBlog,
                TeamPermission::CreateBlogPost,
                TeamPermission::UpdateBlogPost,
                TeamPermission::DeleteBlogPost,
                // Events
                TeamPermission::ViewEvents,
                TeamPermission::CreateEvent,
                TeamPermission::UpdateEvent,
                TeamPermission::DeleteEvent,
                // Announcements
                TeamPermission::ViewAnnouncements,
                TeamPermission::CreateAnnouncement,
                TeamPermission::UpdateAnnouncement,
                TeamPermission::DeleteAnnouncement,
                // Reports
                TeamPermission::ViewReports,
                TeamPermission::ExportData,
            ],
            self::OrganizationManager => [
                // Team
                TeamPermission::UpdateTeam,
                // Members
                TeamPermission::AddMember,
                TeamPermission::UpdateMember,
                TeamPermission::RemoveMember,
                TeamPermission::CreateInvitation,
                TeamPermission::CancelInvitation,
                // Pets
                TeamPermission::ViewPets,
                TeamPermission::CreatePet,
                TeamPermission::UpdatePet,
                TeamPermission::DeletePet,
                // Adoptions
                TeamPermission::ViewAdoptions,
                TeamPermission::UpdateAdoptionStatus,
                TeamPermission::GenerateAdoptionDocs,
                // Follow-ups
                TeamPermission::ViewFollowUps,
                TeamPermission::CreateFollowUp,
                TeamPermission::UpdateFollowUp,
                // Reports
                TeamPermission::ViewReports,
            ],
            self::PetManager => [
                // Pets
                TeamPermission::ViewPets,
                TeamPermission::CreatePet,
                TeamPermission::UpdatePet,
                TeamPermission::DeletePet,
                // Adoptions (view only)
                TeamPermission::ViewAdoptions,
            ],
            self::BlogEditor => [
                // Blog
                TeamPermission::ViewBlog,
                TeamPermission::CreateBlogPost,
                TeamPermission::UpdateBlogPost,
                TeamPermission::DeleteBlogPost,
                // Events
                TeamPermission::ViewEvents,
                TeamPermission::CreateEvent,
                TeamPermission::UpdateEvent,
                TeamPermission::DeleteEvent,
                // Announcements
                TeamPermission::ViewAnnouncements,
                TeamPermission::CreateAnnouncement,
                TeamPermission::UpdateAnnouncement,
                TeamPermission::DeleteAnnouncement,
            ],
            self::AdoptionsCoordinator => [
                // Pets (view only)
                TeamPermission::ViewPets,
                // Adoptions
                TeamPermission::ViewAdoptions,
                TeamPermission::UpdateAdoptionStatus,
                TeamPermission::GenerateAdoptionDocs,
                // Follow-ups
                TeamPermission::ViewFollowUps,
                TeamPermission::CreateFollowUp,
                TeamPermission::UpdateFollowUp,
                // Reports
                TeamPermission::ViewReports,
            ],
            self::Member => [
                // Pets (view only)
                TeamPermission::ViewPets,
                // Adoptions (view only)
                TeamPermission::ViewAdoptions,
                // Blog (view only)
                TeamPermission::ViewBlog,
                // Events (view only)
                TeamPermission::ViewEvents,
            ],
            self::Viewer => [
                // View-only permissions
                TeamPermission::ViewPets,
                TeamPermission::ViewAdoptions,
                TeamPermission::ViewBlog,
                TeamPermission::ViewEvents,
                TeamPermission::ViewAnnouncements,
                TeamPermission::ViewFollowUps,
            ],
        };
    }

    /**
     * Determine if the role has the given permission.
     */
    public function hasPermission(TeamPermission $permission): bool
    {
        return in_array($permission, $this->permissions());
    }

    /**
     * Get the hierarchy level for this role.
     * Higher numbers indicate higher privileges.
     */
    public function level(): int
    {
        return match ($this) {
            self::Owner => 10,
            self::Admin => 9,
            self::OrganizationManager => 8,
            self::PetManager => 5,
            self::BlogEditor => 4,
            self::AdoptionsCoordinator => 6,
            self::Member => 2,
            self::Viewer => 1,
        };
    }

    /**
     * Check if this role is at least as privileged as another role.
     */
    public function isAtLeast(TeamRole $role): bool
    {
        return $this->level() >= $role->level();
    }

    /**
     * Get the roles that can be assigned to team members (excludes Owner).
     *
     * @return array<array{value: string, label: string, description: string}>
     */
    public static function assignable(): array
    {
        return collect(self::cases())
            ->filter(fn (self $role) => $role !== self::Owner)
            ->map(fn (self $role) => [
                'value' => $role->value,
                'label' => $role->label(),
                'description' => $role->description(),
            ])
            ->values()
            ->toArray();
    }

    /**
     * Get all available modules per role.
     */
    public function modules(): array
    {
        $permissions = $this->permissions();
        $modules = [];

        foreach ($permissions as $permission) {
            $module = $permission->module();
            if (!isset($modules[$module])) {
                $modules[$module] = [
                    'name' => $module,
                    'permissions' => [],
                ];
            }
            $modules[$module]['permissions'][] = $permission->value;
        }

        return $modules;
    }
}

