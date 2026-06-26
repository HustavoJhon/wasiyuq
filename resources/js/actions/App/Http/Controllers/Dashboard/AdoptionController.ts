import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::index
* @see app/Http/Controllers/Dashboard/AdoptionController.php:19
* @route '/{current_team}/adopciones'
*/
export const index = (args: { current_team: string | number | { slug: string | number } } | [current_team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/{current_team}/adopciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::index
* @see app/Http/Controllers/Dashboard/AdoptionController.php:19
* @route '/{current_team}/adopciones'
*/
index.url = (args: { current_team: string | number | { slug: string | number } } | [current_team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\Dashboard\AdoptionController::index
* @see app/Http/Controllers/Dashboard/AdoptionController.php:19
* @route '/{current_team}/adopciones'
*/
index.get = (args: { current_team: string | number | { slug: string | number } } | [current_team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::index
* @see app/Http/Controllers/Dashboard/AdoptionController.php:19
* @route '/{current_team}/adopciones'
*/
index.head = (args: { current_team: string | number | { slug: string | number } } | [current_team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::index
* @see app/Http/Controllers/Dashboard/AdoptionController.php:19
* @route '/{current_team}/adopciones'
*/
const indexForm = (args: { current_team: string | number | { slug: string | number } } | [current_team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::index
* @see app/Http/Controllers/Dashboard/AdoptionController.php:19
* @route '/{current_team}/adopciones'
*/
indexForm.get = (args: { current_team: string | number | { slug: string | number } } | [current_team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::index
* @see app/Http/Controllers/Dashboard/AdoptionController.php:19
* @route '/{current_team}/adopciones'
*/
indexForm.head = (args: { current_team: string | number | { slug: string | number } } | [current_team: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Dashboard\AdoptionController::show
* @see app/Http/Controllers/Dashboard/AdoptionController.php:43
* @route '/{current_team}/adopciones/{adoption}'
*/
export const show = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{current_team}/adopciones/{adoption}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::show
* @see app/Http/Controllers/Dashboard/AdoptionController.php:43
* @route '/{current_team}/adopciones/{adoption}'
*/
show.url = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            adoption: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        adoption: typeof args.adoption === 'object'
        ? args.adoption.id
        : args.adoption,
    }

    return show.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{adoption}', parsedArgs.adoption.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::show
* @see app/Http/Controllers/Dashboard/AdoptionController.php:43
* @route '/{current_team}/adopciones/{adoption}'
*/
show.get = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::show
* @see app/Http/Controllers/Dashboard/AdoptionController.php:43
* @route '/{current_team}/adopciones/{adoption}'
*/
show.head = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::show
* @see app/Http/Controllers/Dashboard/AdoptionController.php:43
* @route '/{current_team}/adopciones/{adoption}'
*/
const showForm = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::show
* @see app/Http/Controllers/Dashboard/AdoptionController.php:43
* @route '/{current_team}/adopciones/{adoption}'
*/
showForm.get = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::show
* @see app/Http/Controllers/Dashboard/AdoptionController.php:43
* @route '/{current_team}/adopciones/{adoption}'
*/
showForm.head = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::approve
* @see app/Http/Controllers/Dashboard/AdoptionController.php:55
* @route '/{current_team}/adopciones/{adoption}/aprobar'
*/
export const approve = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/{current_team}/adopciones/{adoption}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::approve
* @see app/Http/Controllers/Dashboard/AdoptionController.php:55
* @route '/{current_team}/adopciones/{adoption}/aprobar'
*/
approve.url = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            adoption: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        adoption: typeof args.adoption === 'object'
        ? args.adoption.id
        : args.adoption,
    }

    return approve.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{adoption}', parsedArgs.adoption.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::approve
* @see app/Http/Controllers/Dashboard/AdoptionController.php:55
* @route '/{current_team}/adopciones/{adoption}/aprobar'
*/
approve.post = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::approve
* @see app/Http/Controllers/Dashboard/AdoptionController.php:55
* @route '/{current_team}/adopciones/{adoption}/aprobar'
*/
const approveForm = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::approve
* @see app/Http/Controllers/Dashboard/AdoptionController.php:55
* @route '/{current_team}/adopciones/{adoption}/aprobar'
*/
approveForm.post = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::reject
* @see app/Http/Controllers/Dashboard/AdoptionController.php:69
* @route '/{current_team}/adopciones/{adoption}/rechazar'
*/
export const reject = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/{current_team}/adopciones/{adoption}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::reject
* @see app/Http/Controllers/Dashboard/AdoptionController.php:69
* @route '/{current_team}/adopciones/{adoption}/rechazar'
*/
reject.url = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            adoption: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        adoption: typeof args.adoption === 'object'
        ? args.adoption.id
        : args.adoption,
    }

    return reject.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{adoption}', parsedArgs.adoption.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::reject
* @see app/Http/Controllers/Dashboard/AdoptionController.php:69
* @route '/{current_team}/adopciones/{adoption}/rechazar'
*/
reject.post = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::reject
* @see app/Http/Controllers/Dashboard/AdoptionController.php:69
* @route '/{current_team}/adopciones/{adoption}/rechazar'
*/
const rejectForm = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\AdoptionController::reject
* @see app/Http/Controllers/Dashboard/AdoptionController.php:69
* @route '/{current_team}/adopciones/{adoption}/rechazar'
*/
rejectForm.post = (args: { current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, adoption: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

const AdoptionController = { index, show, approve, reject }

export default AdoptionController