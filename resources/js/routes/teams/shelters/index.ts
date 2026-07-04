import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Teams\ShelterController::index
* @see app/Http/Controllers/Teams/ShelterController.php:13
* @route '/{current_team}/albergues'
*/
export const index = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/{current_team}/albergues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teams\ShelterController::index
* @see app/Http/Controllers/Teams/ShelterController.php:13
* @route '/{current_team}/albergues'
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
* @see \App\Http\Controllers\Teams\ShelterController::index
* @see app/Http/Controllers/Teams/ShelterController.php:13
* @route '/{current_team}/albergues'
*/
index.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::index
* @see app/Http/Controllers/Teams/ShelterController.php:13
* @route '/{current_team}/albergues'
*/
index.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::index
* @see app/Http/Controllers/Teams/ShelterController.php:13
* @route '/{current_team}/albergues'
*/
const indexForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::index
* @see app/Http/Controllers/Teams/ShelterController.php:13
* @route '/{current_team}/albergues'
*/
indexForm.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::index
* @see app/Http/Controllers/Teams/ShelterController.php:13
* @route '/{current_team}/albergues'
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
* @see \App\Http\Controllers\Teams\ShelterController::store
* @see app/Http/Controllers/Teams/ShelterController.php:24
* @route '/{current_team}/albergues'
*/
export const store = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/{current_team}/albergues',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teams\ShelterController::store
* @see app/Http/Controllers/Teams/ShelterController.php:24
* @route '/{current_team}/albergues'
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
* @see \App\Http\Controllers\Teams\ShelterController::store
* @see app/Http/Controllers/Teams/ShelterController.php:24
* @route '/{current_team}/albergues'
*/
store.post = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::store
* @see app/Http/Controllers/Teams/ShelterController.php:24
* @route '/{current_team}/albergues'
*/
const storeForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::store
* @see app/Http/Controllers/Teams/ShelterController.php:24
* @route '/{current_team}/albergues'
*/
storeForm.post = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Teams\ShelterController::destroy
* @see app/Http/Controllers/Teams/ShelterController.php:39
* @route '/{current_team}/albergues/{shelter}'
*/
export const destroy = (args: { current_team: string | { slug: string }, shelter: number | { id: number } } | [current_team: string | { slug: string }, shelter: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/{current_team}/albergues/{shelter}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teams\ShelterController::destroy
* @see app/Http/Controllers/Teams/ShelterController.php:39
* @route '/{current_team}/albergues/{shelter}'
*/
destroy.url = (args: { current_team: string | { slug: string }, shelter: number | { id: number } } | [current_team: string | { slug: string }, shelter: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            shelter: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        shelter: typeof args.shelter === 'object'
        ? args.shelter.id
        : args.shelter,
    }

    return destroy.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{shelter}', parsedArgs.shelter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\ShelterController::destroy
* @see app/Http/Controllers/Teams/ShelterController.php:39
* @route '/{current_team}/albergues/{shelter}'
*/
destroy.delete = (args: { current_team: string | { slug: string }, shelter: number | { id: number } } | [current_team: string | { slug: string }, shelter: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::destroy
* @see app/Http/Controllers/Teams/ShelterController.php:39
* @route '/{current_team}/albergues/{shelter}'
*/
const destroyForm = (args: { current_team: string | { slug: string }, shelter: number | { id: number } } | [current_team: string | { slug: string }, shelter: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\ShelterController::destroy
* @see app/Http/Controllers/Teams/ShelterController.php:39
* @route '/{current_team}/albergues/{shelter}'
*/
destroyForm.delete = (args: { current_team: string | { slug: string }, shelter: number | { id: number } } | [current_team: string | { slug: string }, shelter: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const shelters = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default shelters