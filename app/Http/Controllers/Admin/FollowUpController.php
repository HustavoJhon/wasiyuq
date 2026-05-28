<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\FollowUp\StoreFollowUpRequest;
use App\Http\Requests\FollowUp\UpdateFollowUpRequest;
use App\Models\Adoption;
use App\Models\FollowUp;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FollowUpController extends Controller
{
    public function index()
    {
        $followUps = FollowUp::query()
            ->with([
                'adoption.pet:id,name,slug',
                'adoption.adopter:id,name',
                'createdBy:id,name',
            ])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/FollowUps/Index', [
            'followUps' => $followUps->items(),
            'meta' => [
                'current_page' => $followUps->currentPage(),
                'last_page' => $followUps->lastPage(),
                'total' => $followUps->total(),
                'per_page' => $followUps->perPage(),
            ],
        ]);
    }

    public function create()
    {
        $adoptions = Adoption::query()
            ->with(['pet:id,name,slug', 'adopter:id,name'])
            ->get();

        return Inertia::render('Admin/FollowUps/Create', [
            'adoptions' => $adoptions,
        ]);
    }

    public function store(StoreFollowUpRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();

        FollowUp::query()->create($data);

        return redirect()->route('admin.follow-ups.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Seguimiento creado exitosamente',
            ],
        ]);
    }

    public function show(FollowUp $followUp)
    {
        $followUp->load(['adoption.pet', 'adoption.adopter', 'createdBy']);

        return Inertia::render('Admin/FollowUps/Show', [
            'followUp' => $followUp,
        ]);
    }

    public function edit(FollowUp $followUp)
    {
        $followUp->load(['adoption.pet', 'adoption.adopter']);

        $adoptions = Adoption::query()
            ->with(['pet:id,name,slug', 'adopter:id,name'])
            ->get();

        return Inertia::render('Admin/FollowUps/Edit', [
            'followUp' => $followUp,
            'adoptions' => $adoptions,
        ]);
    }

    public function update(FollowUp $followUp, UpdateFollowUpRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();

        $followUp->update($data);

        return redirect()->route('admin.follow-ups.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Seguimiento actualizado exitosamente',
            ],
        ]);
    }

    public function destroy(FollowUp $followUp)
    {
        $followUp->delete();

        return redirect()->route('admin.follow-ups.index')->with('flash', [
            'toast' => [
                'type' => 'success',
                'message' => 'Seguimiento eliminado exitosamente',
            ],
        ]);
    }
}
