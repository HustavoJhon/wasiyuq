<?php

namespace App\Services;

use App\Models\Adoption;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class PetRecommendationService
{
    public function getAdopterProfile(User $user): ?Adoption
    {
        return Adoption::query()
            ->where('user_id', $user->id)
            ->with('pet')
            ->latest()
            ->first();
    }

    public function calculateCompatibility(Pet $pet, Adoption $userProfile): int
    {
        $score = 0;

        // 1. Species match - 25 points
        if ($userProfile->pet && $pet->species->value === $userProfile->pet->species->value) {
            $score += 25;
        }

        // 2. Housing + Size match - 20 points
        if ($userProfile->has_yard) {
            $score += 20;
        } else {
            match ($userProfile->housing_type) {
                'apartment' => match ($pet->size->value) {
                    'small' => $score += 20,
                    'medium' => $score += 12,
                    default => $score += 5,
                },
                'condo' => match ($pet->size->value) {
                    'small' => $score += 18,
                    'medium' => $score += 15,
                    default => $score += 5,
                },
                'house' => match ($pet->size->value) {
                    'small' => $score += 18,
                    'medium' => $score += 18,
                    'large' => $score += 15,
                },
                default => $score += 10,
            };
        }

        // 3. Experience match - 15 points
        if ($userProfile->experience_with_pets) {
            $score += 15;
        } else {
            if ($pet->age_years >= 2) {
                $score += 15;
            } elseif ($pet->age_years >= 1) {
                $score += 10;
            } else {
                $score += 5;
            }
        }

        // 4. Children compatibility - 15 points
        if ($userProfile->has_children) {
            $descriptionLower = strtolower($pet->description ?? '');
            $breedLower = strtolower($pet->breed ?? '');

            $familyKeywords = ['niño', 'niña', 'familia', 'paciente', 'tranquilo', 'dócil', 'amigable', 'cariñoso'];
            $familyBreeds = ['labrador', 'beagle', 'golden', 'golden retriever', 'boxer', 'bulldog', 'pastor', 'mestizo'];

            $isFamilyFriendly = false;
            foreach ($familyKeywords as $keyword) {
                if (str_contains($descriptionLower, $keyword)) {
                    $isFamilyFriendly = true;
                    break;
                }
            }

            if ($pet->species->value === 'dog') {
                foreach ($familyBreeds as $breed) {
                    if (str_contains($breedLower, $breed)) {
                        $isFamilyFriendly = true;
                        break;
                    }
                }
            }

            $score += $isFamilyFriendly ? 15 : 7;
        } else {
            $score += 15;
        }

        // 5. Hours alone - 10 points
        if ($userProfile->hours_alone >= 8) {
            if ($pet->species->value === 'cat' || $pet->species->value === 'bird') {
                $score += 10;
            } elseif ($pet->age_years >= 2) {
                $score += 8;
            } else {
                $score += 4;
            }
        } else {
            $score += 10;
        }

        // 6. Other pets compatibility - 10 points
        if ($userProfile->other_pets && !empty(trim((string) $userProfile->other_pets))) {
            $descriptionLower = strtolower($pet->description ?? '');

            if (str_contains($descriptionLower, 'social')
                || str_contains($descriptionLower, 'convive')
                || str_contains($descriptionLower, 'amigable')
                || str_contains($descriptionLower, 'sociable')) {
                $score += 10;
            } else {
                $score += 5;
            }
        } else {
            $score += 10;
        }

        // 7. Housing ownership - 5 points
        if ($userProfile->housing_ownership === 'rent') {
            if (in_array($pet->size->value, ['small', 'medium'])) {
                $score += 5;
            }
        } else {
            $score += 5;
        }

        return $score;
    }

    public function getRecommendedPets(User $user, int $limit = 6): array
    {
        $profile = $this->getAdopterProfile($user);

        if (! $profile) {
            return [];
        }

        $pets = Pet::query()
            ->where('status', 'available')
            ->with('team:id,name,slug,city,state')
            ->get();

        $scored = $pets->map(function (Pet $pet) use ($profile) {
            $score = $this->calculateCompatibility($pet, $profile);

            return [
                'id' => $pet->id,
                'name' => $pet->name,
                'slug' => $pet->slug,
                'species' => $pet->species->value,
                'species_label' => $pet->species->label(),
                'breed' => $pet->breed,
                'age_years' => $pet->age_years,
                'age_months' => $pet->age_months,
                'size' => $pet->size->value,
                'size_label' => $pet->size->label(),
                'gender' => $pet->gender,
                'photos' => $pet->photos,
                'compatibility' => $score,
                'team' => $pet->team ? [
                    'id' => $pet->team->id,
                    'name' => $pet->team->name,
                    'slug' => $pet->team->slug,
                    'city' => $pet->team->city,
                ] : null,
            ];
        })
            ->sortByDesc('compatibility')
            ->take($limit)
            ->values()
            ->toArray();

        return $scored;
    }

    public function searchPublishedRanked(
        User $user,
        ?string $species = null,
        ?string $size = null,
        ?string $gender = null,
        ?string $search = null,
        int $perPage = 12,
    ): LengthAwarePaginator|array {
        $profile = $this->getAdopterProfile($user);

        if (! $profile) {
            return [];
        }

        $baseQuery = Pet::query()->where('status', 'available')
            ->when($species, fn ($q, $v) => $q->where('species', $v))
            ->when($size, fn ($q, $v) => $q->where('size', $v))
            ->when($gender, fn ($q, $v) => $q->where('gender', $v))
            ->when($search, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('name', 'like', "%{$v}%")
                    ->orWhere('breed', 'like', "%{$v}%");
            }))
            ->with('team:id,name,slug,city,state');

        $allPets = $baseQuery->get();

        $scored = $allPets->map(function (Pet $pet) use ($profile) {
            $compatibility = $this->calculateCompatibility($pet, $profile);

            return array_merge($pet->toArray(), ['compatibility' => $compatibility]);
        })->sortByDesc('compatibility')->values();

        $page = Paginator::resolveCurrentPage();
        $total = $scored->count();

        return new LengthAwarePaginator(
            $scored->forPage($page, $perPage)->values(),
            $total,
            $perPage,
            $page,
            ['path' => Paginator::resolveCurrentPath()],
        );
    }
}
