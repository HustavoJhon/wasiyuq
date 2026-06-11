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

    private function photoUrl(string $species, int $lock): array
    {
        $category = match ($species) {
            'dog' => 'dog',
            'cat' => 'cat',
            'rabbit' => 'rabbit',
            'bird' => 'bird',
            default => 'hamster',
        };

        return ['https://loremflickr.com/640/480/' . $category . '?lock=' . $lock];
    }

    private function createUsers(): void
    {
        $this->superAdmin = User::factory()->create([
            'name' => 'Gustavo Jhons',
            'email' => 'hustavojhon@gmail.com',
            'is_super_admin' => true,
        ]);

        // Org admins (existing)
        $this->orgAdmins = [
            User::factory()->create(['name' => 'María García', 'email' => 'maria.garcia@email.com']),
            User::factory()->create(['name' => 'Carlos López', 'email' => 'carlos.lopez@email.com']),
        ];

        // Org members (existing)
        $this->orgMembers = [
            User::factory()->create(['name' => 'Ana Martínez', 'email' => 'ana.martinez@email.com']),
            User::factory()->create(['name' => 'Pedro Quispe', 'email' => 'pedro.quispe@email.com']),
        ];

        // Adopters (existing)
        $this->adopters = [
            User::factory()->create(['name' => 'Lucía Ramos', 'email' => 'lucia.ramos@email.com']),
            User::factory()->create(['name' => 'José Condori', 'email' => 'jose.condori@email.com']),
            User::factory()->create(['name' => 'Sofía Vargas', 'email' => 'sofia.vargas@email.com']),
        ];

        $this->regularUser = User::factory()->create([
            'name' => 'Diego Castillo',
            'email' => 'diego.castillo@email.com',
        ]);

        // New org admins
        $this->orgAdmins[] = User::factory()->create(['name' => 'Elena Huamán', 'email' => 'elena.huaman@email.com']);
        $this->orgAdmins[] = User::factory()->create(['name' => 'Roberto Sotomayor', 'email' => 'roberto.sotomayor@email.com']);

        // New org members
        $this->orgMembers[] = User::factory()->create(['name' => 'Carmen Flores', 'email' => 'carmen.flores@email.com']);
        $this->orgMembers[] = User::factory()->create(['name' => 'Luis Chacón', 'email' => 'luis.chacon@email.com']);
        $this->orgMembers[] = User::factory()->create(['name' => 'Rosa Huillca', 'email' => 'rosa.huillca@email.com']);
        $this->orgMembers[] = User::factory()->create(['name' => 'Miguel Arce', 'email' => 'miguel.arce@email.com']);

        // New adopters
        $this->adopters[] = User::factory()->create(['name' => 'Camila Torres', 'email' => 'camila.torres@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Fernando Gutiérrez', 'email' => 'fernando.gutierrez@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Valeria Cárdenas', 'email' => 'valeria.cardenas@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Bruno Mendoza', 'email' => 'bruno.mendoza@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Paula Mercado', 'email' => 'paula.mercado@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Martín Quispe', 'email' => 'martin.quispe@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Daniela Núñez', 'email' => 'daniela.nunez@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Ricardo Pineda', 'email' => 'ricardo.pineda@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Andrea Castillo', 'email' => 'andrea.castillo@email.com']);
        $this->adopters[] = User::factory()->create(['name' => 'Jorge Mamani', 'email' => 'jorge.mamani@email.com']);
    }

    private function createOrganizations(): void
    {
        $this->org1 = Team::factory()->create([
            'name' => 'Patitas Felices',
            'slug' => 'patitas-felices',
            'bio' => 'Refugio dedicado al rescate y rehabilitación de animales abandonados en la ciudad de Cusco. Contamos con un equipo de voluntarios comprometidos con el bienestar animal.',
            'website' => 'https://patitasfelices.org',
            'phone' => '+51 984 123 456',
            'address' => 'Av. Los Incas 456',
            'city' => 'Cusco',
            'state' => 'Cusco',
        ]);

        $this->org2 = Team::factory()->create([
            'name' => 'Huellas del Cusco',
            'slug' => 'huellas-del-cusco',
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

        // New members for org1 (Patitas Felices)
        $this->org1->members()->attach($this->orgAdmins[2], ['role' => TeamRole::Admin]);
        $this->org1->members()->attach($this->orgMembers[2], ['role' => TeamRole::Member]);
        $this->org1->members()->attach($this->orgMembers[3], ['role' => TeamRole::Member]);

        // New members for org2 (Huellas del Cusco)
        $this->org2->members()->attach($this->orgAdmins[3], ['role' => TeamRole::Admin]);
        $this->org2->members()->attach($this->orgMembers[4], ['role' => TeamRole::Member]);
        $this->org2->members()->attach($this->orgMembers[5], ['role' => TeamRole::Member]);

        $usersWithTeams = [
            [$this->orgAdmins[0], $this->org1->id],
            [$this->orgAdmins[1], $this->org2->id],
            [$this->orgMembers[0], $this->org1->id],
            [$this->orgMembers[1], $this->org2->id],
            [$this->orgAdmins[2], $this->org1->id],
            [$this->orgAdmins[3], $this->org2->id],
            [$this->orgMembers[2], $this->org1->id],
            [$this->orgMembers[3], $this->org1->id],
            [$this->orgMembers[4], $this->org2->id],
            [$this->orgMembers[5], $this->org2->id],
        ];

        foreach ($usersWithTeams as [$user, $teamId]) {
            $user->forceFill(['current_team_id' => $teamId])->save();
        }
    }

    private function createPets(): void
    {
        $this->pets = collect();

        $petsData = [
            // ── Patitas Felices (org1) - existing ──
            ['name' => 'Luna', 'species' => 'dog', 'breed' => 'Labrador', 'age_years' => 2, 'age_months' => 3, 'gender' => 'female', 'size' => 'large', 'color' => 'Dorado', 'status' => 'available', 'description' => 'Luna es una labrador cariñosa y llena de energía. Le encanta jugar con niños y otros perros. Está vacunada y desparasitada. Busca un hogar con espacio para correr y una familia que le dé mucho amor.'],
            ['name' => 'Milo', 'species' => 'dog', 'breed' => 'Mestizo', 'age_years' => 4, 'age_months' => 0, 'gender' => 'male', 'size' => 'medium', 'color' => 'Marrón', 'status' => 'available', 'description' => 'Milo fue rescatado de la calle y ha demostrado ser un perro agradecido y leal. Es tranquilo y se lleva bien con gatos. Ideal para un hogar tranquilo sin niños pequeños.'],
            ['name' => 'Whiskers', 'species' => 'cat', 'breed' => 'Siamés', 'age_years' => 1, 'age_months' => 6, 'gender' => 'male', 'size' => 'small', 'color' => 'Blanco', 'status' => 'available', 'description' => 'Whiskers es un gatito siamés juguetón y curioso. Le fascinan las cajas y los juguetes con plumas. Es muy cariñoso y ronronea apenas lo acaricias.'],
            ['name' => 'Canela', 'species' => 'cat', 'breed' => 'Criollo', 'age_years' => 3, 'age_months' => 0, 'gender' => 'female', 'size' => 'medium', 'color' => 'Atigrado', 'status' => 'adopted', 'description' => 'Canela es una gata dulce y tranquila. Disfruta de las siestas al sol y las comidas sabrosas. Ya fue adoptada y vive feliz con su nueva familia.'],
            ['name' => 'Copito', 'species' => 'rabbit', 'breed' => 'Mini Lop', 'age_years' => 1, 'age_months' => 2, 'gender' => 'male', 'size' => 'small', 'color' => 'Blanco', 'status' => 'available', 'description' => 'Copito es un conejo suave y dócil. Le encanta comer zanahorias y saltar por el jardín. Es ideal para familias con niños que quieran una mascota tranquila.'],
            ['name' => 'Piolín', 'species' => 'bird', 'breed' => 'Canario', 'age_years' => 2, 'age_months' => 0, 'gender' => 'male', 'size' => 'small', 'color' => 'Amarillo', 'status' => 'available', 'description' => 'Piolín es un canario con un canto hermoso que alegrará cualquier hogar. Es activo y disfruta de su espacio con ramas y columpios.'],
            // ── Huellas del Cusco (org2) - existing ──
            ['name' => 'Rocky', 'species' => 'dog', 'breed' => 'Pastor Alemán', 'age_years' => 3, 'age_months' => 0, 'gender' => 'male', 'size' => 'large', 'color' => 'Negro', 'status' => 'in_process', 'description' => 'Rocky es un pastor alemán inteligente y protector. Responde bien al entrenamiento y es leal a su familia. Actualmente en proceso de adopción con una familia evaluada.'],
            ['name' => 'Nala', 'species' => 'cat', 'breed' => 'Persa', 'age_years' => 2, 'age_months' => 0, 'gender' => 'female', 'size' => 'medium', 'color' => 'Gris', 'status' => 'available', 'description' => 'Nala es una gata persa de mirada expresiva y pelaje sedoso. Es tranquila y elegante, disfruta de los mimos y las comodidades del hogar.'],
            ['name' => 'Tobby', 'species' => 'dog', 'breed' => 'Golden Retriever', 'age_years' => 1, 'age_months' => 6, 'gender' => 'male', 'size' => 'large', 'color' => 'Dorado', 'status' => 'available', 'description' => 'Tobby es un golden retriever cachorro lleno de vida. Es juguetón, inteligente y excelente con niños. Necesita una familia activa que pueda seguir su ritmo.'],
            ['name' => 'Lola', 'species' => 'rabbit', 'breed' => 'Holandés', 'age_years' => 2, 'age_months' => 0, 'gender' => 'female', 'size' => 'small', 'color' => 'Tricolor', 'status' => 'adopted', 'description' => 'Lola fue adoptada por una familia maravillosa que le brinda todos los cuidados que merece.'],
            ['name' => 'Pelusa', 'species' => 'cat', 'breed' => 'Angora', 'age_years' => 4, 'age_months' => 0, 'gender' => 'female', 'size' => 'medium', 'color' => 'Blanco', 'status' => 'available', 'description' => 'Pelusa es una gata angora de pelaje largo y suave. Es independiente pero cariñosa cuando ella lo decide. Ideal para personas que respetan el espacio de los gatos.'],
            ['name' => 'Max', 'species' => 'bird', 'breed' => 'Perico', 'age_years' => 1, 'age_months' => 0, 'gender' => 'male', 'size' => 'small', 'color' => 'Verde', 'status' => 'withheld', 'description' => 'Max es un perico hablador y divertido. Ya dice algunas palabras y está aprendiendo más. Está reservado para una familia que ya está en proceso de evaluación.'],

            // ── Patitas Felices (org1) - nuevos ──
            ['name' => 'Simba', 'species' => 'dog', 'breed' => 'Bulldog Francés', 'age_years' => 2, 'age_months' => 0, 'gender' => 'male', 'size' => 'small', 'color' => 'Atigrado', 'status' => 'available', 'description' => 'Simba es un bulldog francés lleno de carácter y cariño. Le encanta dormir en el sofá y salir a pasear tranquilamente. Perfecto para departamentos, no requiere mucho espacio ni ejercicio extremo. Es ideal para familias que buscan un compañero tranquilo y divertido.'],
            ['name' => 'Kiara', 'species' => 'dog', 'breed' => 'Beagle', 'age_years' => 1, 'age_months' => 8, 'gender' => 'female', 'size' => 'medium', 'color' => 'Tricolor', 'status' => 'available', 'description' => 'Kiara es una beagle curiosa y llena de energía. Le encanta seguir rastros y explorar el mundo con su nariz. Muy sociable con otros perros y personas. Necesita un hogar con patio y una familia activa que disfrute de paseos largos y juegos al aire libre.'],
            ['name' => 'Misha', 'species' => 'dog', 'breed' => 'Husky', 'age_years' => 3, 'age_months' => 0, 'gender' => 'female', 'size' => 'large', 'color' => 'Gris y Blanco', 'status' => 'available', 'description' => 'Misha es una husky siberiana de mirada penetrante y personalidad fuerte. Es inteligente, leal y ama el frío. Necesita un dueño con experiencia en razas nórdicas, espacio amplio y mucho tiempo para ejercicio diario. Responde bien al entrenamiento.'],
            ['name' => 'Thor', 'species' => 'dog', 'breed' => 'Doberman', 'age_years' => 4, 'age_months' => 0, 'gender' => 'male', 'size' => 'large', 'color' => 'Negro y Café', 'status' => 'available', 'description' => 'Thor es un doberman imponente pero de corazón noble. Excelente perro de guardia y compañía. Obediente y entrenado en comandos básicos. Busca una familia firme pero cariñosa que pueda darle la actividad y disciplina que necesita.'],
            ['name' => 'Coco', 'species' => 'cat', 'breed' => 'Maine Coon', 'age_years' => 2, 'age_months' => 0, 'gender' => 'male', 'size' => 'large', 'color' => 'Marrón', 'status' => 'available', 'description' => 'Coco es un majestuoso gato Maine Coon de gran tamaño y pelaje esponjoso. Es amigable, inteligente y se lleva bien con perros. Disfruta del agua y los juegos interactivos. Ideal para familias que aprecian un gato con personalidad de perro.'],
            ['name' => 'Luna', 'species' => 'cat', 'breed' => 'Bengalí', 'age_years' => 1, 'age_months' => 6, 'gender' => 'female', 'size' => 'medium', 'color' => 'Atigrado', 'status' => 'available', 'description' => 'Luna es una gata bengalí exótica con un pataje similar al de un leopardo. Es extremadamente activa, curiosa y necesita estimulación constante. Juguetes interactivos, rascadores altos y tiempo de juego diario son imprescindibles para esta princesa salvaje.'],
            ['name' => 'Titán', 'species' => 'rabbit', 'breed' => 'Rex', 'age_years' => 0, 'age_months' => 8, 'gender' => 'male', 'size' => 'small', 'color' => 'Café', 'status' => 'available', 'description' => 'Titán es un conejo Rex de pelaje aterciopelado. Es curioso, amigable y le encanta explorar espacios seguros. Ya está entrenado para usar su esquina. Una mascota ideal para niños responsables que quieran aprender sobre el cuidado de animales pequeños.'],
            ['name' => 'Lucky', 'species' => 'dog', 'breed' => 'Mestizo', 'age_years' => 5, 'age_months' => 0, 'gender' => 'male', 'size' => 'medium', 'color' => 'Blanco y Negro', 'status' => 'available', 'description' => 'Lucky fue encontrado en la calle con una pata lastimada. Después de atención veterinaria se recuperó por completo. Es un perro agradecido, tranquilo y obediente. Perfecto para personas mayores o familias que buscan un compañero sereno y leal.'],
            ['name' => 'Princesa', 'species' => 'dog', 'breed' => 'Poodle', 'age_years' => 1, 'age_months' => 0, 'gender' => 'female', 'size' => 'small', 'color' => 'Blanco', 'status' => 'in_process', 'description' => 'Princesa es una poodle miniatura inteligente y juguetona. Aprende trucos con facilidad y le encanta ser el centro de atención. Hipoalergénica, ideal para alérgicos. Está en proceso de adopción con una familia que ya fue evaluada positivamente.'],
            ['name' => 'Rocko', 'species' => 'bird', 'breed' => 'Agaporni', 'age_years' => 1, 'age_months' => 2, 'gender' => 'male', 'size' => 'small', 'color' => 'Verde y Naranja', 'status' => 'available', 'description' => 'Rocko es un agapornis (inseparable) lleno de color y personalidad. Es muy sociable y le encanta posarse en el hombro de su dueño. Repite sonidos y silbidos. Ideal para quienes buscan un ave carismática y de fácil cuidado.'],

            // ── Huellas del Cusco (org2) - nuevos ──
            ['name' => 'Bruno', 'species' => 'dog', 'breed' => 'San Bernardo', 'age_years' => 3, 'age_months' => 0, 'gender' => 'male', 'size' => 'large', 'color' => 'Blanco y Marrón', 'status' => 'available', 'description' => 'Bruno es un san bernardo gigante y adorable. A pesar de su tamaño es un perro gentil, paciente y excelente con niños pequeños. Necesita espacio amplio y clima fresco. Su pelaje requiere cepillado regular pero su amor incondicional lo compensa todo.'],
            ['name' => 'Duke', 'species' => 'dog', 'breed' => 'Rottweiler', 'age_years' => 4, 'age_months' => 0, 'gender' => 'male', 'size' => 'large', 'color' => 'Negro y Café', 'status' => 'available', 'description' => 'Duke es un rottweiler fuerte y seguro de sí mismo. Es un guardián nato pero extremadamente leal y cariñoso con su familia. Requiere dueño con experiencia en razas de trabajo, socialización continua y ejercicio diario. Será el protector más fiel que puedas tener.'],
            ['name' => 'Manchitas', 'species' => 'dog', 'breed' => 'Dálmata', 'age_years' => 2, 'age_months' => 0, 'gender' => 'female', 'size' => 'large', 'color' => 'Blanco con Manchas Negras', 'status' => 'available', 'description' => 'Manchitas es una dálmata llena de vida y energía. Necesita ejercicio intenso diario, ideal para personas que corren o montan bicicleta. Es inteligente, leal y tiene un espíritu independiente. No recomendada para espacios pequeños o dueños sedentarios.'],
            ['name' => 'Garfy', 'species' => 'cat', 'breed' => 'Criollo', 'age_years' => 5, 'age_months' => 0, 'gender' => 'male', 'size' => 'large', 'color' => 'Naranja', 'status' => 'available', 'description' => 'Garfy es un gato naranja robusto y cariñoso. Le encanta comer, dormir al sol y recibir masajes en la panza. Es tranquilo y se adapta a cualquier hogar. Su ronroneo es tan fuerte como su personalidad. Ideal para quienes buscan un gato relajado y afectuoso.'],
            ['name' => 'Pompon', 'species' => 'rabbit', 'breed' => 'Angora', 'age_years' => 1, 'age_months' => 0, 'gender' => 'female', 'size' => 'small', 'color' => 'Gris', 'status' => 'available', 'description' => 'Pompon es una coneja angora de pelaje larguísimo y suave como el algodón. Es dulce, tranquila y le encanta que la acaricien. Requiere cepillado diario para mantener su pelaje sin nudos. Una mascota perfecta para un hogar tranquilo y paciente.'],
            ['name' => 'Nemo', 'species' => 'other', 'breed' => 'Hámster Ruso', 'age_years' => 0, 'age_months' => 3, 'gender' => 'male', 'size' => 'small', 'color' => 'Gris Blanco', 'status' => 'available', 'description' => 'Nemo es un hámster ruso diminuto y veloz. Le encanta correr en su rueda y guardar comida en sus mejillas. Es fácil de cuidar y perfecto como primera mascota para niños. Viene con su jaula, rueda y accesorios básicos incluidos.'],
            ['name' => 'Chispita', 'species' => 'cat', 'breed' => 'Criollo', 'age_years' => 0, 'age_months' => 4, 'gender' => 'female', 'size' => 'small', 'color' => 'Tricolor', 'status' => 'available', 'description' => 'Chispita es una gatita bebé llena de travesuras y mimos. Fue rescatada junto a sus hermanos y está lista para encontrar un hogar amoroso. Es juguetona, cariñosa y usa perfectamente la caja de arena. Se entrega con primera vacuna y desparasitación.'],
            ['name' => 'Rex', 'species' => 'dog', 'breed' => 'Schnauzer', 'age_years' => 2, 'age_months' => 0, 'gender' => 'male', 'size' => 'medium', 'color' => 'Sal y Pimienta', 'status' => 'available', 'description' => 'Rex es un schnauzer alerta y energético. Es un excelente perro de vigilancia con un ladrido imponente para su tamaño. Inteligente y fácil de entrenar. Requiere cepillado regular de su pelaje duro. Ideal para familias activas que buscan un perro vivaz y protector.'],
            ['name' => 'Estrella', 'species' => 'dog', 'breed' => 'Border Collie', 'age_years' => 1, 'age_months' => 0, 'gender' => 'female', 'size' => 'medium', 'color' => 'Negro y Blanco', 'status' => 'in_process', 'description' => 'Estrella es una border collie extremadamente inteligente y activa. Necesita estimulación mental y física constante. Ideal para personas con experiencia en pastoreo o agility. Actualmente en proceso de adopción con una familia que practica deportes caninos.'],
            ['name' => 'Bimba', 'species' => 'other', 'breed' => 'Cobayo', 'age_years' => 0, 'age_months' => 6, 'gender' => 'female', 'size' => 'small', 'color' => 'Café y Blanco', 'status' => 'available', 'description' => 'Bimba es una cobaya (cuy) adorable y sociable. Emite silbidos de alegría cuando ve comida. Es fácil de cuidar y disfruta la compañía de otros cobayos. Ideal para niños que quieran aprender responsabilidad con una mascota de bajo mantenimiento.'],
        ];

        foreach ($petsData as $i => $data) {
            if ($i < 6) {
                $org = $this->org1;
            } elseif ($i < 12) {
                $org = $this->org2;
            } elseif ($i < 22) {
                $org = $this->org1;
            } else {
                $org = $this->org2;
            }

            $slug = Pet::generateUniqueSlug($data['name']);

            $pet = Pet::create(array_merge($data, [
                'team_id' => $org->id,
                'slug' => $slug,
                'photos' => $this->photoUrl($data['species'], $i),
            ]));

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
            // Nuevos eventos
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[2]->id, 'title' => 'Concurso de Disfraces para Mascotas', 'type' => 'adoption_fair', 'event_date' => now()->addDays(90), 'location' => 'Parque Zonal, Cusco', 'description' => 'Trae a tu mascota disfrazada y participa por increíbles premios. Habrá categorías: mejor disfraz, mejor pareja dueño-mascota y el más divertido. Inscripción gratuita. Todos los fondos irán al cuidado de los animales del refugio.', 'is_published' => true, 'published_at' => now()],
            ['team_id' => $this->org2->id, 'user_id' => $this->orgAdmins[3]->id, 'title' => 'Charla: Tenencia Responsable en Zonas Rurales', 'type' => 'workshop', 'event_date' => now()->addDays(35), 'location' => 'Municipalidad de Urubamba', 'description' => 'Charla informativa dirigida a comunidades rurales sobre el cuidado básico de animales de compañía. Abordaremos alimentación, vacunación, esterilización y control de parásitos. Entrada libre.', 'is_published' => true, 'published_at' => now()],
            ['team_id' => $this->org2->id, 'user_id' => $this->orgAdmins[3]->id, 'title' => 'Colecta de Alimentos y Útiles para Mascotas', 'type' => 'campaign', 'event_date' => now()->addDays(120), 'location' => 'Calle Real 234, Urubamba', 'description' => 'Necesitamos tu ayuda! Estamos recolectando alimento balanceado, latas de comida húmeda, mantas, collares, juguetes y productos de limpieza. Todo lo donado será distribuido entre los animales rescatados. Punto de acopio en nuestras instalaciones.', 'is_published' => true, 'published_at' => now()],
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
            // Nuevos posts
            ['team_id' => $this->org1->id, 'user_id' => $this->orgAdmins[2]->id, 'title' => '5 razones para esterilizar a tu mascota', 'category' => 'Salud', 'excerpt' => 'La esterilización salva vidas y mejora la calidad de vida de tu compañero.', 'content' => "Esterilizar a tu mascota es una decisión responsable que trae múltiples beneficios:\n\n1. Control de la sobrepoblación: Millones de animales terminan en la calle cada año.\n2. Prevención de enfermedades: Reduce el riesgo de cáncer y infecciones.\n3. Mejora el comportamiento: Disminuye la agresividad, el marcaje y el vagabundeo.\n4. Mayor longevidad: Las mascotas esterilizadas viven más y más sanas.\n5. Contribución social: Ayudas a reducir el número de animales abandonados.\n\nInfórmate con tu veterinario sobre el mejor momento para esterilizar a tu mascota.", 'is_published' => true, 'published_at' => now()->subDays(1)],
            ['team_id' => $this->org2->id, 'user_id' => $this->orgAdmins[3]->id, 'title' => 'Qué hacer si encuentras un animal abandonado', 'category' => 'Consejos', 'excerpt' => 'Guía paso a paso para ayudar a un perro o gato en situación de calle.', 'content' => "Encontrar un animal abandonado puede ser abrumador. Sigue estos pasos:\n\n1. Acércate con calma: Habla suavemente y evita movimientos bruscos.\n2. Verifica su estado: Si está herido, contacta a un veterinario de inmediato.\n3. Proporciona agua y comida: Si parece desnutrido, dale pequeñas cantidades.\n4. Revisa si tiene identificación: Chip, placa o tatuaje.\n5. Contacta refugios y redes de rescate: Ellos pueden orientarte.\n6. Difunde en redes sociales: Una foto puede llegar a su dueño.\n\nRecuerda: tu ayuda puede ser la diferencia entre la vida y la muerte para ese animal.", 'is_published' => true, 'published_at' => now()->subDays(6)],
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
            // Adopciones existentes
            ['pet_id' => $this->pets[3]->id, 'user_id' => $this->adopters[0]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Completed->value, 'motivation' => 'Siempre he querido darle un hogar a un gato rescatado. Canela me robó el corazón desde que la vi en la página.', 'experience_with_pets' => true, 'has_yard' => false, 'housing_type' => 'Departamento', 'family_composition' => 'Vive sola', 'why_this_pet' => 'Me enamoré de su mirada dulce y su personalidad tranquila', 'has_children' => false, 'other_pets' => false, 'housing_ownership' => 'own', 'hours_alone' => 9, 'veterinary_plan' => 'Tengo un veterinario de confianza y seguro para mascotas', 'agreement' => true, 'reviewed_by' => $this->orgAdmins[0]->id, 'reviewed_at' => now()->subDays(10)],
            ['pet_id' => $this->pets[9]->id, 'user_id' => $this->adopters[1]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Completed->value, 'motivation' => 'Mis hijos quieren un conejo y Lola nos parece perfecta. Tenemos espacio y tiempo para dedicarle.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa con jardín', 'family_composition' => 'Familia con hijos', 'why_this_pet' => 'Lola es el tamaño ideal para mis hijos y es muy dócil', 'has_children' => true, 'other_pets' => false, 'housing_ownership' => 'own', 'hours_alone' => 5, 'veterinary_plan' => 'Llevaremos a Lola al veterinario local para sus chequeos', 'agreement' => true, 'reviewed_by' => $this->orgAdmins[1]->id, 'reviewed_at' => now()->subDays(15)],
            ['pet_id' => $this->pets[0]->id, 'user_id' => $this->adopters[2]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Luna sería la compañera perfecta para mis largas caminatas matutinas. Tengo experiencia con labradores y un patio grande.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Pareja', 'why_this_pet' => 'Siempre he querido un labrador y Luna tiene la energía que busco', 'has_children' => false, 'other_pets' => false, 'housing_ownership' => 'own', 'hours_alone' => 5, 'veterinary_plan' => 'Tengo veterinario de cabecera y presupuesto para cuidados', 'agreement' => true, 'reviewed_by' => null, 'reviewed_at' => null],
            ['pet_id' => $this->pets[6]->id, 'user_id' => $this->adopters[0]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Approved->value, 'motivation' => 'Rocky sería un excelente compañero de protección y cariño. Vivo en una casa con jardín grande.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Vive solo', 'why_this_pet' => 'Los pastores alemanes son mi raza favorita y Rocky tiene buen temperamento', 'has_children' => false, 'other_pets' => false, 'housing_ownership' => 'own', 'hours_alone' => 7, 'veterinary_plan' => 'Afiliado a una clínica veterinaria con plan de salud', 'agreement' => true, 'reviewed_by' => $this->orgAdmins[1]->id, 'reviewed_at' => now()->subDays(3)],
            ['pet_id' => $this->pets[1]->id, 'user_id' => $this->adopters[1]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Rejected->value, 'motivation' => 'Quiero un perro para que cuide la casa.', 'experience_with_pets' => false, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Familia numerosa', 'why_this_pet' => 'Milo parece un perro resistente y alerta', 'has_children' => true, 'other_pets' => true, 'housing_ownership' => 'own', 'hours_alone' => 9, 'veterinary_plan' => 'Lo llevaré al veterinario cuando se enferme', 'agreement' => false, 'reviewed_by' => $this->orgAdmins[0]->id, 'reviewed_at' => now()->subDays(5)],
            ['pet_id' => $this->pets[8]->id, 'user_id' => $this->adopters[2]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Tobby sería el compañero ideal para mis hijos. Tenemos experiencia con golden retrievers y mucho espacio.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa con jardín', 'family_composition' => 'Familia con hijos', 'why_this_pet' => 'Los golden retrievers son excelentes con niños y Tobby es cachorro', 'has_children' => true, 'other_pets' => false, 'housing_ownership' => 'own', 'hours_alone' => 5, 'veterinary_plan' => 'Presupuesto destinado para su cuidado y alimentación premium', 'agreement' => true, 'reviewed_by' => null, 'reviewed_at' => null],

            // Nuevas adopciones
            ['pet_id' => $this->pets[12]->id, 'user_id' => $this->adopters[3]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Siempre he querido un bulldog francés. Vivo en departamento y sé que se adaptan perfectamente.', 'experience_with_pets' => true, 'has_yard' => false, 'housing_type' => 'Departamento', 'family_composition' => 'Vive sola', 'why_this_pet' => 'Simba tiene la personalidad perfecta para mi estilo de vida', 'has_children' => false, 'other_pets' => false, 'housing_ownership' => 'rent', 'hours_alone' => 7, 'veterinary_plan' => 'Tengo seguro para mascotas y ahorros para emergencias', 'agreement' => true, 'reviewed_by' => null, 'reviewed_at' => null],
            ['pet_id' => $this->pets[16]->id, 'user_id' => $this->adopters[4]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Quiero darle un hogar a Coco. Los Maine Coon son fascinantes y tengo experiencia con gatos grandes.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Familia con hijos', 'why_this_pet' => 'Coco es majestuoso y su personalidad amigable es ideal para mi familia', 'has_children' => true, 'other_pets' => true, 'housing_ownership' => 'own', 'hours_alone' => 5, 'veterinary_plan' => 'Clínica veterinaria especializada en felinos', 'agreement' => true, 'reviewed_by' => null, 'reviewed_at' => null],
            ['pet_id' => $this->pets[21]->id, 'user_id' => $this->adopters[5]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Approved->value, 'motivation' => 'Bruno es un san bernardo que siempre he soñado tener. Vivo en una casa grande con patio.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa con jardín', 'family_composition' => 'Familia con hijos', 'why_this_pet' => 'Su tamaño y temperamento gentil son perfectos para mi familia', 'has_children' => true, 'other_pets' => false, 'housing_ownership' => 'own', 'hours_alone' => 3, 'veterinary_plan' => 'Veterinario especializado en razas grandes', 'agreement' => true, 'reviewed_by' => $this->orgAdmins[3]->id, 'reviewed_at' => now()->subDays(2)],
            ['pet_id' => $this->pets[25]->id, 'user_id' => $this->adopters[10]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Quiero un gato adulto y tranquilo. Garfy me parece perfecto para mi hogar.', 'experience_with_pets' => true, 'has_yard' => false, 'housing_type' => 'Departamento', 'family_composition' => 'Vive sola', 'why_this_pet' => 'Garfy es relajado y cariñoso, justo lo que busco', 'has_children' => false, 'other_pets' => false, 'housing_ownership' => 'rent', 'hours_alone' => 9, 'veterinary_plan' => 'Veterinario cerca de mi domicilio', 'agreement' => true, 'reviewed_by' => null, 'reviewed_at' => null],
            ['pet_id' => $this->pets[26]->id, 'user_id' => $this->adopters[6]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Completed->value, 'motivation' => 'Mis hijos quieren una mascota pequeña y Pompón es ideal.', 'experience_with_pets' => false, 'has_yard' => true, 'housing_type' => 'Casa', 'family_composition' => 'Familia con hijos', 'why_this_pet' => 'Los conejos angora son hermosos y Pompón es muy dócil', 'has_children' => true, 'other_pets' => false, 'housing_ownership' => 'own', 'hours_alone' => 3, 'veterinary_plan' => 'Veterinario de animales exóticos recomendado', 'agreement' => true, 'reviewed_by' => $this->orgAdmins[3]->id, 'reviewed_at' => now()->subDays(8)],
            ['pet_id' => $this->pets[14]->id, 'user_id' => $this->adopters[7]->id, 'team_id' => $this->org1->id, 'status' => AdoptionStatus::Rejected->value, 'motivation' => 'Misha es hermosa, quiero una perra imponente.', 'experience_with_pets' => false, 'has_yard' => false, 'housing_type' => 'Departamento', 'family_composition' => 'Vive solo', 'why_this_pet' => 'Me gusta su apariencia de lobo', 'has_children' => false, 'other_pets' => false, 'housing_ownership' => 'rent', 'hours_alone' => 12, 'veterinary_plan' => 'No tengo veterinario aún', 'agreement' => false, 'reviewed_by' => $this->orgAdmins[2]->id, 'reviewed_at' => now()->subDays(4)],
            ['pet_id' => $this->pets[29]->id, 'user_id' => $this->adopters[8]->id, 'team_id' => $this->org2->id, 'status' => AdoptionStatus::Pending->value, 'motivation' => 'Quiero una border collie para hacer agility. Tengo experiencia con la raza.', 'experience_with_pets' => true, 'has_yard' => true, 'housing_type' => 'Casa con jardín', 'family_composition' => 'Vive sola', 'why_this_pet' => 'Estrella tiene la energía e inteligencia que busco para competencias', 'has_children' => false, 'other_pets' => true, 'housing_ownership' => 'own', 'hours_alone' => 3, 'veterinary_plan' => 'Tengo seguro veterinario completo', 'agreement' => true, 'reviewed_by' => null, 'reviewed_at' => null],
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

        $approvedAdoptions = $this->adoptionRecords->where('status', AdoptionStatus::Approved->value);
        foreach ($approvedAdoptions as $adoption) {
            FollowUp::create([
                'adoption_id' => $adoption->id,
                'scheduled_date' => now()->addDays(45)->format('Y-m-d'),
                'status' => FollowUpStatus::Pending->value,
                'notes' => 'Seguimiento programado para verificar que todo esté en orden antes de finalizar el proceso de ' . $adoption->pet->name . '.',
                'created_by' => $adoption->reviewed_by,
            ]);
        }
    }
}
