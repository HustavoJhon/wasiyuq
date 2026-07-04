import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Teams\VeterinarianController::index
* @see app/Http/Controllers/Teams/VeterinarianController.php:13
* @route '/{current_team}/veterinarias'
*/
export const index = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/{current_team}/veterinarias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::index
* @see app/Http/Controllers/Teams/VeterinarianController.php:13
* @route '/{current_team}/veterinarias'
*/
index.url = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { current_team: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
    }

    return index.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::index
* @see app/Http/Controllers/Teams/VeterinarianController.php:13
* @route '/{current_team}/veterinarias'
*/
index.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::index
* @see app/Http/Controllers/Teams/VeterinarianController.php:13
* @route '/{current_team}/veterinarias'
*/
index.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::index
* @see app/Http/Controllers/Teams/VeterinarianController.php:13
* @route '/{current_team}/veterinarias'
*/
const indexForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::index
* @see app/Http/Controllers/Teams/VeterinarianController.php:13
* @route '/{current_team}/veterinarias'
*/
indexForm.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::index
* @see app/Http/Controllers/Teams/VeterinarianController.php:13
* @route '/{current_team}/veterinarias'
*/
indexForm.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::store
* @see app/Http/Controllers/Teams/VeterinarianController.php:34
* @route '/{current_team}/veterinarias'
*/
export const store = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/{current_team}/veterinarias',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::store
* @see app/Http/Controllers/Teams/VeterinarianController.php:34
* @route '/{current_team}/veterinarias'
*/
store.url = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { current_team: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
    }

    return store.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::store
* @see app/Http/Controllers/Teams/VeterinarianController.php:34
* @route '/{current_team}/veterinarias'
*/
store.post = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::store
* @see app/Http/Controllers/Teams/VeterinarianController.php:34
* @route '/{current_team}/veterinarias'
*/
const storeForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::store
* @see app/Http/Controllers/Teams/VeterinarianController.php:34
* @route '/{current_team}/veterinarias'
*/
storeForm.post = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::destroy
* @see app/Http/Controllers/Teams/VeterinarianController.php:59
* @route '/{current_team}/veterinarias/{veterinarian}'
*/
export const destroy = (args: { current_team: string | { slug: string }, veterinarian: number | { id: number } } | [current_team: string | { slug: string }, veterinarian: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/{current_team}/veterinarias/{veterinarian}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::destroy
* @see app/Http/Controllers/Teams/VeterinarianController.php:59
* @route '/{current_team}/veterinarias/{veterinarian}'
*/
destroy.url = (args: { current_team: string | { slug: string }, veterinarian: number | { id: number } } | [current_team: string | { slug: string }, veterinarian: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            veterinarian: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        veterinarian: typeof args.veterinarian === 'object'
        ? args.veterinarian.id
        : args.veterinarian,
    }

    return destroy.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{veterinarian}', parsedArgs.veterinarian.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::destroy
* @see app/Http/Controllers/Teams/VeterinarianController.php:59
* @route '/{current_team}/veterinarias/{veterinarian}'
*/
destroy.delete = (args: { current_team: string | { slug: string }, veterinarian: number | { id: number } } | [current_team: string | { slug: string }, veterinarian: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::destroy
* @see app/Http/Controllers/Teams/VeterinarianController.php:59
* @route '/{current_team}/veterinarias/{veterinarian}'
*/
const destroyForm = (args: { current_team: string | { slug: string }, veterinarian: number | { id: number } } | [current_team: string | { slug: string }, veterinarian: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\VeterinarianController::destroy
* @see app/Http/Controllers/Teams/VeterinarianController.php:59
* @route '/{current_team}/veterinarias/{veterinarian}'
*/
destroyForm.delete = (args: { current_team: string | { slug: string }, veterinarian: number | { id: number } } | [current_team: string | { slug: string }, veterinarian: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const veterinarians = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default veterinarians