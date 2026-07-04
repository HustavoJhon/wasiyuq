import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:14
* @route '/mi-adopcion/mascotas-perdidas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/mascotas-perdidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:14
* @route '/mi-adopcion/mascotas-perdidas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:14
* @route '/mi-adopcion/mascotas-perdidas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:14
* @route '/mi-adopcion/mascotas-perdidas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:14
* @route '/mi-adopcion/mascotas-perdidas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:14
* @route '/mi-adopcion/mascotas-perdidas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:14
* @route '/mi-adopcion/mascotas-perdidas'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Adopter\LostPetController::edit
* @see app/Http/Controllers/Adopter/LostPetController.php:32
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}/editar'
*/
export const edit = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/mascotas-perdidas/{lostPet}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\LostPetController::edit
* @see app/Http/Controllers/Adopter/LostPetController.php:32
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}/editar'
*/
edit.url = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lostPet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lostPet: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lostPet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lostPet: typeof args.lostPet === 'object'
        ? args.lostPet.id
        : args.lostPet,
    }

    return edit.definition.url
            .replace('{lostPet}', parsedArgs.lostPet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\LostPetController::edit
* @see app/Http/Controllers/Adopter/LostPetController.php:32
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}/editar'
*/
edit.get = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::edit
* @see app/Http/Controllers/Adopter/LostPetController.php:32
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}/editar'
*/
edit.head = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::edit
* @see app/Http/Controllers/Adopter/LostPetController.php:32
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}/editar'
*/
const editForm = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::edit
* @see app/Http/Controllers/Adopter/LostPetController.php:32
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}/editar'
*/
editForm.get = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::edit
* @see app/Http/Controllers/Adopter/LostPetController.php:32
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}/editar'
*/
editForm.head = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Adopter\LostPetController::update
* @see app/Http/Controllers/Adopter/LostPetController.php:43
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
export const update = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/mi-adopcion/mascotas-perdidas/{lostPet}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Adopter\LostPetController::update
* @see app/Http/Controllers/Adopter/LostPetController.php:43
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
update.url = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lostPet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lostPet: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lostPet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lostPet: typeof args.lostPet === 'object'
        ? args.lostPet.id
        : args.lostPet,
    }

    return update.definition.url
            .replace('{lostPet}', parsedArgs.lostPet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\LostPetController::update
* @see app/Http/Controllers/Adopter/LostPetController.php:43
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
update.put = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::update
* @see app/Http/Controllers/Adopter/LostPetController.php:43
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
const updateForm = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::update
* @see app/Http/Controllers/Adopter/LostPetController.php:43
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
updateForm.put = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Adopter\LostPetController::destroy
* @see app/Http/Controllers/Adopter/LostPetController.php:89
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
export const destroy = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/mi-adopcion/mascotas-perdidas/{lostPet}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Adopter\LostPetController::destroy
* @see app/Http/Controllers/Adopter/LostPetController.php:89
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
destroy.url = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lostPet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lostPet: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lostPet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lostPet: typeof args.lostPet === 'object'
        ? args.lostPet.id
        : args.lostPet,
    }

    return destroy.definition.url
            .replace('{lostPet}', parsedArgs.lostPet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\LostPetController::destroy
* @see app/Http/Controllers/Adopter/LostPetController.php:89
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
destroy.delete = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::destroy
* @see app/Http/Controllers/Adopter/LostPetController.php:89
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
const destroyForm = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::destroy
* @see app/Http/Controllers/Adopter/LostPetController.php:89
* @route '/mi-adopcion/mascotas-perdidas/{lostPet}'
*/
destroyForm.delete = (args: { lostPet: number | { id: number } } | [lostPet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const LostPetController = { index, edit, update, destroy }

export default LostPetController