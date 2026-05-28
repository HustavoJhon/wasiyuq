<?php

namespace Database\Seeders;

use App\Enums\AdoptionStatus;
use App\Enums\FollowUpStatus;
use App\Enums\TeamRole;
use App\Models\Adoption;
use App\Models\Announcement;
use App\Models\BlogPost;
use App\Models\FollowUp;
use App\Models\Pet;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->createUsers();
        $this->createOrganizations();
        $this->assignMembers();
        $this->createPets();
        $this->createAnnouncements();
        $this->createBlogPosts();
        $this->createAdoptions();
        $this->createFollowUps();
    }

    private function createUsers(): void
    {
        $this->superAdmin = User::factory()->create([
            'name' => 'Gustavo Jhons',
            'email' => 'hustavojhon@gmail.com',
            'is_super_admin' => true,
        ]);

        $this->orgAdmins = [
            User::factory()->create(['name' => 'María García', 'email' => 'maria.garcia@email.com']),
            User::factory()->create(['name' => 'Carlos López', 'email' => 'carlos.lopez@email.com']),
        ];

        $this->orgMembers = [
            User::factory()->create(['name' => 'Ana Martínez', 'email' => 'ana.martinez@email.com']),
            User::factory()->create(['name' => 'Pedro Quispe', 'email' => 'pedro.quispe@email.com']),
        ];

        $this->adopters = [
            User::factory()->create(['name' => 'Lucía Ramos', 'email' => 'lucia.ramos@email.com']),
            User::factory()->create(['name' => 'José Condori', 'email' => 'jose.condori@email.com']),
            User::factory()->create(['name' => 'Sofía Vargas', 'email' => 'sofia.vargas@email.com']),
        ];
    }

    private function createOrganizations(): void
    {
        $this->org1 = Team::factory()->create([
            'name' => 'Patitas Felices',
            'bio' => 'Refugio dedicado al rescate y rehabilitación de animales abandonados en la ciudad de Cusco. Contamos con un equipo de voluntarios comprometidos con el bienestar animal.',
            'website' => 'https://patitasfelices.org',
            'phone' => '+51 984 123 456',
            'address' => 'Av. Los Incas 456',
            'city' => 'Cusco',
            'state' => 'Cusco',
        ]);

        $this->org2 = Team::factory()->create([
            'name' => 'Huellas del Cusco',
            'bio' => 'Asociación sin fines de lucro que promueve la adopción responsable y el cuidado de mascotas en el Valle Sagrado. Organizamos ferias y campañas de concientización.',
            'website' => 'https://huellasdelcusco.org',
            'phone' => '+51 984 789 012',
            'address' => 'Calle Real 234',
            'city' => 'Urubamba',
            'state' => 'Cusco',
        ]);
    }

    private function assignMembers(): void
    {
        $this->org1->members()->attach($this->superAdmin, ['role' => TeamRole::Owner]);
        $this->org1->members()->attach($this->orgAdmins[0], ['role' => TeamRole::Admin]);
        $this->org1->members()->attach($this->orgMembers[0], ['role' => TeamRole::Member]);

        $this->org2->members()->attach($this->superAdmin, ['role' => TeamRole::Owner]);
        $this->org2->members()->attach($this->orgAdmins[1], ['role' => TeamRole::Admin]);
        $this->org2->members()->attach($this->orgMembers[1], ['role' => TeamRole::Member]);
    }

    private function createPets(): void
    {
        $this->pets = collect();

        $petsData = [
            // Patitas Felices (org1)
            ['name' => 'Luna', 'species' => 'dog', 'breed' => 'Labrador', 'age_years' => 2, 'gender' => 'female', 'size' => 'large', 'color' => 'Dorado', 'status' => 'available', 'description' => 'Luna es una labrador cariñosa y llena de energía. Le encanta jugar con niños y otros perros. Está vacunada y desparasitada. Busca un hogar con espacio para correr y una familia que le dé mucho amor.'],
            ['name' => 'Milo', 'species' => 'dog', 'breed' => 'Mestizo', 'age_years' => 4, 'gender' => 'male', 'size' => 'medium', 'color' => 'Marrón', 'status' => 'available', 'description' => 'Milo fue rescatado de la calle y ha demostrado ser un perro agradecido y leal. Es tranquilo y se lleva bien con gatos. Ideal para un hogar tranquilo sin niños pequeños.'],
            ['name' => 'Whiskers', 'species' => 'cat', 'breed' => 'Siamés', 'age_years' => 1, 'gender' => 'male', 'size' => 'small', 'color' => 'Blanco', 'status' => 'available', 'description' => 'Whiskers es un gatito siamés juguetón y curioso. Le fascinan las cajas y los juguetes con plumas. Es muy cariñoso y ronronea apenas lo acaricias.'],
            ['name' => 'Canela', 'species' => 'cat', 'breed' => 'Criollo', 'age_years' => 3, 'gender' => 'female', 'size' => 'medium', 'color' => 'Atigrado', 'status' => 'adopted', 'description' => 'Canela es una gata dulce y tranquila. Disfruta de las siestas al sol y las comidas sabrosas. Ya fue adoptada y vive feliz con su nueva familia.'],
            ['name' => 'Copito', 'species' => 'rabbit', 'breed' => 'Mini Lop', 'age_years' => 1, 'gender' => 'male', 'size' => 'small', 'color' => 'Blanco', 'status' => 'available', 'description' => 'Copito es un conejo suave y dócil. Le encanta comer zanahorias y saltar por el jardín. Es ideal para familias con niños que quieran una mascota tranquila.'],
            ['name' => 'Piolín', 'species' => 'bird', 'breed' => 'Canario', 'age_years' => 2, 'gender' => 'male', 'size' => 'small', 'color' => 'Amarillo', 'status' => 'available', 'description' => 'Piolín es un canario con un canto hermoso que alegrará cualquier hogar. Es activo y disfruta de su espacio con ramas y columpios.'],
            // Huellas del Cusco (org2)
            ['name' => 'Rocky', 'species' => 'dog', 'breed' => 'Pastor Alemán', 'age_years' => 3, 'gender' => 'male', 'size' => 'large', 'color' => 'Negro', 'status' => 'in_process', 'description' => 'Rocky es un pastor alemán inteligente y protector. Responde bien al entrenamiento y es leal a su familia. Actualmente en proceso de adopción con una familia evaluada.'],
            ['name' => 'Nala', 'species' => 'cat', 'breed' => 'Persa', 'age_years' => 2, 'gender' => 'female', 'size' => 'medium', 'color' => 'Gris', 'status' => 'available', 'description' => 'Nala es una gata persa de mirada expresiva y pelaje sedoso. Es tranquila y elegante, disfruta de los mimos y las comodidades del hogar.'],
            ['name' => 'Tobby', 'species' => 'dog', 'breed' => 'Golden Retriever', 'age_years' => 1, 'gender' => 'male', 'size' => 'large', 'color' => 'Dorado', 'status' => 'available', 'description' => 'Tobby es un golden retriever cachorro lleno de vida. Es juguetón, inteligente y excelente con niños. Necesita una familia activa que pueda seguir su ritmo.'],
            ['name' => 'Lola', 'species' => 'rabbit', 'breed' => 'Holandés', 'age_years' => 2, 'gender' => 'female', 'size' => 'small', 'color' => 'Tricolor', 'status' => 'adopted', 'description' => 'Lola fue adoptada por una familia maravillosa que le brinda todos los cuidados que merece.'],
            ['name' => 'Pelusa', 'species' => 'cat', 'breed' => 'Angora', 'age_years' => 4, 'gender' => 'female', 'size' => 'medium', 'color' => 'Blanco', 'status' => 'available', 'description' => 'Pelusa es una gata angora de pelaje largo y suave. Es independiente pero cariñosa cuando ella lo decide. Ideal para personas que respetan el espacio de los gatos.'],
            ['name' => 'Max', 'species' => 'bird', 'breed' => 'Perico', 'age_years' => 1, 'gender' => 'male', 'size' => 'small', 'color' => 'Verde', 'status' => 'withheld', 'description' => 'Max es un perico hablador y divertido. Ya dice algunas palabras y está aprendiendo más. Está reservado para una familia que ya está en proceso de evaluación.'],
        ];

        foreach ($petsData as $i => $data) {
            $org = $i < 6 ? $this->org1 : $this->org2;
            $pet = Pet::create(array_merge($data, ['team_id' => $org->id, 'slug' => \Illuminate\Support\Str::slug($data['name']) . '-' . $data['species']]));
            $this->pets->push($pet);
        }
    }

    private function createAnnouncements(): void
    {
        $eventsData = [
            // Patitas Felices
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[0]->id, 'title' => 'Gran Feria de Adopción Junio 2026', 'type' => 'adoption_fair', 'event_date' => now()->addDays(15), 'location' => 'Plaza de Armas, Cusco', 'description' => 'Te esperamos en nuestra feria mensual de adopción. Más de 20 mascotas esperando un hogar. Habrá asesoría gratuita sobre tenencia responsable y stands de comida. ¡No faltes!', 'is_published' => true, 'published_at' => now()],
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[0]->id, 'title' => 'Taller de Cuidado Responsable', 'type' => 'workshop', 'event_date' => now()->addDays(45), 'location' => 'Local Comunal, Wanchaq', 'description' => 'Taller gratuito sobre alimentación, salud y bienestar de mascotas. Impartido por veterinarios especializados. Cupos limitados.', 'is_published' => true, 'published_at' => now()],
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[0]->id, 'title' => 'Campaña de Esterilización Julio', 'type' => 'campaign', 'event_date' => now()->addDays(30), 'location' => 'Av. Los Incas 456, Cusco', 'description' => 'Campaña de esterilización a bajo costo para perros y gatos. Incluye consulta prequirúrgica, cirugía y medicamentos. Reserva tu cupo con anticipación.', 'is_published' => true, 'published_at' => now()],
            // Huellas del Cusco
            ['team_id' => $this->org2->id, 'user_id' => $this->orgAdmins[1]->id, 'title' => 'Jornada de Vacunación Gratuita', 'type' => 'campaign', 'event_date' => now()->addDays(20), 'location' => 'Calle Real 234, Urubamba', 'description' => 'Jornada gratuita de vacunación antirrábica y desparasitación para perros y gatos. Trae a tu mascota y asegura su salud.', 'is_published' => true, 'published_at' => now()],
            ['team_id' => $this->org2->id, 'user_id' => $this->orgAdmins[1]->id, 'title' => 'Bazar Solidario Huellas del Cusco', 'type' => 'fundraiser', 'event_date' => now()->addDays(60), 'location' => 'Plaza de Armas, Urubamba', 'description' => 'Venta de artículos usados en buen estado, artesanías y productos para mascotas. Todo lo recaudado se destina al cuidado de los animales rescatados.', 'is_published' => true, 'published_at' => now()],
        ];

        foreach ($eventsData as $data) {
            Announcement::create(array_merge($data, [
                'slug' => \Illuminate\Support\Str::slug($data['title']) . '-' . \Illuminate\Support\Str::random(4),
            ]));
        }
    }

    private function createBlogPosts(): void
    {
        $postsData = [
            // Patitas Felices
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[0]->id, 'title' => 'Cómo preparar tu hogar para la llegada de un perro adoptado', 'category' => 'Cuidado', 'excerpt' => 'Consejos prácticos para que la transición de tu nueva mascota sea lo más suave posible.', 'content' => "Adoptar un perro es una experiencia maravillosa, pero requiere preparación. Aquí te compartimos algunos consejos clave:\n\n1. Prepara un espacio seguro: Designa un área de la casa con su cama, agua y juguetes.\n2. Compra lo esencial: Plato de comida, correa, collar, cama y juguetes.\n3. Establece una rutina: Los perros se sienten seguros con horarios predecibles.\n4. Ten paciencia: El periodo de adaptación puede tomar semanas o meses.\n\nRecuerda que cada perro es único y necesita tiempo para confiar en su nueva familia.", 'is_published' => true, 'published_at' => now()->subDays(5)],
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[0]->id, 'title' => 'Beneficios de adoptar un gato adulto', 'category' => 'Adopción', 'excerpt' => 'Los gatos adultos tienen mucho que ofrecer. Conoce por qué son una excelente opción.', 'content' => "Si estás pensando en adoptar un gato, no descartes a los adultos. Aquí algunos beneficios:\n\n- Personalidad definida: Sabes exactamente cómo es su carácter.\n- Ya están entrenados: Generalmente ya usan la caja de arena.\n- Menos destructivos: Ya pasaron la etapa de arañar muebles.\n- Agradecimiento eterno: Un gato adulto rescatado será tu compañero más fiel.", 'is_published' => true, 'published_at' => now()->subDays(3)],
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[0]->id, 'title' => 'La historia de Luna: de la calle al hogar', 'category' => 'Historias', 'excerpt' => 'Conoce el inspirador viaje de Luna, una labrador que encontró su final feliz.', 'content' => "Luna llegó a nuestro refugio desnutrida y asustada. Con paciencia y amor, recuperó su salud y su alegría. Hoy es una perra feliz que corre y juega sin parar.\n\nSu historia es un recordatorio de que todos los animales merecen una segunda oportunidad. Si estás considerando adoptar, recuerda que estás salvando una vida.", 'is_published' => true, 'published_at' => now()->subDays(7)],
            // Huellas del Cusco
            ['team_id' => $this->org2->id, 'user_id' => $this->orgAdmins[1]->id, 'title' => 'Alimentación saludable para perros: guía básica', 'category' => 'Salud', 'excerpt' => 'Todo lo que necesitas saber para alimentar correctamente a tu mejor amigo.', 'content' => "Una alimentación balanceada es fundamental para la salud de tu perro. Aquí algunos puntos clave:\n\n- Elige un alimento de calidad según su edad y tamaño.\n- Establece horarios fijos de comida.\n- Evita darle comida humana, especialmente chocolate, uvas y cebolla.\n- Siempre ten agua fresca disponible.\n- Consulta al veterinario antes de cambiar su dieta.", 'is_published' => true, 'published_at' => now()->subDays(4)],
            ['team_id' => $this->org2->id, 'user_id' => $this->orgAdmins[1]->id, 'title' => 'Señales de que tu mascota está feliz y saludable', 'category' => 'Consejos', 'excerpt' => 'Aprende a leer el lenguaje corporal de tu perro o gato.', 'content' => "Las mascotas tienen muchas formas de mostrarnos que están contentas:\n\nEn perros: Cola alegre, orejas relajadas, lamidas suaves, \"sonrisa\" con la boca abierta.\nEn gatos: Ronroneo, amasamiento, cola erguida, parpadeo lento.\n\nConocer estas señales te ayudará a fortalecer el vínculo con tu mascota y detectar cualquier problema a tiempo.", 'is_published' => true, 'published_at' => now()->subDays(2)],
        ];

        foreach ($postsData as $data) {
            BlogPost::create(array_merge($data, [
                'slug' => \Illuminate\Support\Str::slug($data['title']) . '-' . \Illuminate\Support\Str::random(4),
                'tags' => ['adopción', 'cuidado', 'bienestar'],
            ]));
        }
    }

    private function createAdoptions(): void
    {
        $adoptionsData = [
            ['pet_id' => $this->pets[3]->id, 'user_id' => $this->adopters[0]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Completed->value, 'motivation' => 'Siempre he querido darle un hogar a un gato rescatado. Canela me robó el corazón desde que la vi en la página.', 'experience_with_pets' => true, 'has_yard' => false, 'housing_type' => 'Departamento', 'family_composition' => 'Vive sola', 'reviewed_by' => $this->orgAdmins[0]->id, 'reviewed_at' => now()->subDays(10)],
            ['pet_id' => $this->pets[9]->id, 'user_id' => $this->adopters[1]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Completed->value, 'motivation' => 'Mis hijos quieren un conejo y Lola nos parece perfecta. Tenemos espacio y tiempo para dedicarle.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa con jardín', 'family_composition' => 'Familia con hijos', 'reviewed_by' => $this->orgAdmins[1]->id, 'reviewed_at' => now()->subDays(15)],
            ['pet_id' => $this->pets[0]->id, 'user_id' => $this->adopters[2]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Luna sería la compañera perfecta para mis largas caminatas matutinas. Tengo experiencia con labradores y un patio grande.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Pareja', 'reviewed_by' => null, 'reviewed_at' => null],
            ['pet_id' => $this->pets[6]->id, 'user_id' => $this->adopters[0]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Approved->value, 'motivation' => 'Rocky sería un excelente compañero de protección y cariño. Vivo en una casa con jardín grande.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Vive solo', 'reviewed_by' => $this->orgAdmins[1]->id, 'reviewed_at' => now()->subDays(3)],
            ['pet_id' => $this->pets[1]->id, 'user_id' => $this->adopters[1]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Rejected->value, 'motivation' => 'Quiero un perro para que cuide la casa.', 'experience_with_pets' => false, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Familia numerosa', 'reviewed_by' => $this->orgAdmins[0]->id, 'reviewed_at' => now()->subDays(5)],
            ['pet_id' => $this->pets[8]->id, 'user_id' => $this->adopters[2]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Tobby sería el compañero ideal para mis hijos. Tenemos experiencia con golden retrievers y mucho espacio.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa con jardín', 'family_composition' => 'Familia con hijos', 'reviewed_by' => null, 'reviewed_at' => null],
        ];

        $this->adoptionRecords = collect();
        foreach ($adoptionsData as $data) {
            $this->adoptionRecords->push(Adoption::create($data));
        }
    }

    private function createFollowUps(): void
    {
        $completedAdoptions = $this->adoptionRecords->where('status', AdoptionStatus::Completed->value);

        foreach ($completedAdoptions as $adoption) {
            FollowUp::create([
                'adoption_id' => $adoption->id,
                'scheduled_date' => now()->addDays(30)->format('Y-m-d'),
                'status' => FollowUpStatus::Pending->value,
                'notes' => 'Primera visita de seguimiento para verificar la adaptación de ' . $adoption->pet->name . ' en su nuevo hogar.',
                'created_by' => $adoption->reviewed_by,
            ]);

            FollowUp::create([
                'adoption_id' => $adoption->id,
                'scheduled_date' => now()->subDays(5)->format('Y-m-d'),
                'completed_date' => now()->subDays(5)->format('Y-m-d'),
                'status' => FollowUpStatus::Completed->value,
                'notes' => 'Visita realizada. ' . $adoption->pet->name . ' se encuentra feliz y adaptado. La familia reporta buena convivencia.',
                'created_by' => $adoption->reviewed_by,
            ]);

            FollowUp::create([
                'adoption_id' => $adoption->id,
                'scheduled_date' => now()->subDays(15)->format('Y-m-d'),
                'completed_date' => null,
                'status' => FollowUpStatus::Missed->value,
                'notes' => 'No se pudo concretar la visita. La familia no se encontraba en el domicilio. Se reprogramará.',
                'created_by' => $adoption->reviewed_by,
            ]);
        }

        $approvedAdoption = $this->adoptionRecords->where('status', AdoptionStatus::Approved->value)->first();
        if ($approvedAdoption) {
            FollowUp::create([
                'adoption_id' => $approvedAdoption->id,
                'scheduled_date' => now()->addDays(45)->format('Y-m-d'),
                'status' => FollowUpStatus::Pending->value,
                'notes' => 'Seguimiento programado para verificar que todo esté en orden antes de finalizar el proceso.',
                'created_by' => $approvedAdoption->reviewed_by,
            ]);
        }
    }
}
