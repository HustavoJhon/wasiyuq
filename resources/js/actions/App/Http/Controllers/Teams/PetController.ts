import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Teams\PetController::index
* @see app/Http/Controllers/Teams/PetController.php:17
* @route '/{current_team}/mascotas'
*/
export const index = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/{current_team}/mascotas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teams\PetController::index
* @see app/Http/Controllers/Teams/PetController.php:17
* @route '/{current_team}/mascotas'
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
* @see \App\Http\Controllers\Teams\PetController::index
* @see app/Http/Controllers/Teams/PetController.php:17
* @route '/{current_team}/mascotas'
*/
index.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::index
* @see app/Http/Controllers/Teams/PetController.php:17
* @route '/{current_team}/mascotas'
*/
index.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teams\PetController::index
* @see app/Http/Controllers/Teams/PetController.php:17
* @route '/{current_team}/mascotas'
*/
const indexForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::index
* @see app/Http/Controllers/Teams/PetController.php:17
* @route '/{current_team}/mascotas'
*/
indexForm.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::index
* @see app/Http/Controllers/Teams/PetController.php:17
* @route '/{current_team}/mascotas'
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
* @see \App\Http\Controllers\Teams\PetController::create
* @see app/Http/Controllers/Teams/PetController.php:47
* @route '/{current_team}/mascotas/crear'
*/
export const create = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/{current_team}/mascotas/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teams\PetController::create
* @see app/Http/Controllers/Teams/PetController.php:47
* @route '/{current_team}/mascotas/crear'
*/
create.url = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\PetController::create
* @see app/Http/Controllers/Teams/PetController.php:47
* @route '/{current_team}/mascotas/crear'
*/
create.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::create
* @see app/Http/Controllers/Teams/PetController.php:47
* @route '/{current_team}/mascotas/crear'
*/
create.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teams\PetController::create
* @see app/Http/Controllers/Teams/PetController.php:47
* @route '/{current_team}/mascotas/crear'
*/
const createForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::create
* @see app/Http/Controllers/Teams/PetController.php:47
* @route '/{current_team}/mascotas/crear'
*/
createForm.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::create
* @see app/Http/Controllers/Teams/PetController.php:47
* @route '/{current_team}/mascotas/crear'
*/
createForm.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Teams\PetController::store
* @see app/Http/Controllers/Teams/PetController.php:54
* @route '/{current_team}/mascotas'
*/
export const store = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/{current_team}/mascotas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teams\PetController::store
* @see app/Http/Controllers/Teams/PetController.php:54
* @route '/{current_team}/mascotas'
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
* @see \App\Http\Controllers\Teams\PetController::store
* @see app/Http/Controllers/Teams/PetController.php:54
* @route '/{current_team}/mascotas'
*/
store.post = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\PetController::store
* @see app/Http/Controllers/Teams/PetController.php:54
* @route '/{current_team}/mascotas'
*/
const storeForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\PetController::store
* @see app/Http/Controllers/Teams/PetController.php:54
* @route '/{current_team}/mascotas'
*/
storeForm.post = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Teams\PetController::show
* @see app/Http/Controllers/Teams/PetController.php:35
* @route '/{current_team}/mascotas/{id}'
*/
export const show = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{current_team}/mascotas/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teams\PetController::show
* @see app/Http/Controllers/Teams/PetController.php:35
* @route '/{current_team}/mascotas/{id}'
*/
show.url = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        id: args.id,
    }

    return show.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\PetController::show
* @see app/Http/Controllers/Teams/PetController.php:35
* @route '/{current_team}/mascotas/{id}'
*/
show.get = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::show
* @see app/Http/Controllers/Teams/PetController.php:35
* @route '/{current_team}/mascotas/{id}'
*/
show.head = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teams\PetController::show
* @see app/Http/Controllers/Teams/PetController.php:35
* @route '/{current_team}/mascotas/{id}'
*/
const showForm = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::show
* @see app/Http/Controllers/Teams/PetController.php:35
* @route '/{current_team}/mascotas/{id}'
*/
showForm.get = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::show
* @see app/Http/Controllers/Teams/PetController.php:35
* @route '/{current_team}/mascotas/{id}'
*/
showForm.head = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Teams\PetController::edit
* @see app/Http/Controllers/Teams/PetController.php:83
* @route '/{current_team}/mascotas/{id}/editar'
*/
export const edit = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/{current_team}/mascotas/{id}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teams\PetController::edit
* @see app/Http/Controllers/Teams/PetController.php:83
* @route '/{current_team}/mascotas/{id}/editar'
*/
edit.url = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        id: args.id,
    }

    return edit.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\PetController::edit
* @see app/Http/Controllers/Teams/PetController.php:83
* @route '/{current_team}/mascotas/{id}/editar'
*/
edit.get = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::edit
* @see app/Http/Controllers/Teams/PetController.php:83
* @route '/{current_team}/mascotas/{id}/editar'
*/
edit.head = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teams\PetController::edit
* @see app/Http/Controllers/Teams/PetController.php:83
* @route '/{current_team}/mascotas/{id}/editar'
*/
const editForm = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::edit
* @see app/Http/Controllers/Teams/PetController.php:83
* @route '/{current_team}/mascotas/{id}/editar'
*/
editForm.get = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teams\PetController::edit
* @see app/Http/Controllers/Teams/PetController.php:83
* @route '/{current_team}/mascotas/{id}/editar'
*/
editForm.head = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Teams\PetController::update
* @see app/Http/Controllers/Teams/PetController.php:96
* @route '/{current_team}/mascotas/{id}'
*/
export const update = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/{current_team}/mascotas/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Teams\PetController::update
* @see app/Http/Controllers/Teams/PetController.php:96
* @route '/{current_team}/mascotas/{id}'
*/
update.url = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        id: args.id,
    }

    return update.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\PetController::update
* @see app/Http/Controllers/Teams/PetController.php:96
* @route '/{current_team}/mascotas/{id}'
*/
update.put = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Teams\PetController::update
* @see app/Http/Controllers/Teams/PetController.php:96
* @route '/{current_team}/mascotas/{id}'
*/
const updateForm = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\PetController::update
* @see app/Http/Controllers/Teams/PetController.php:96
* @route '/{current_team}/mascotas/{id}'
*/
updateForm.put = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Teams\PetController::destroy
* @see app/Http/Controllers/Teams/PetController.php:192
* @route '/{current_team}/mascotas/{id}'
*/
export const destroy = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/{current_team}/mascotas/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teams\PetController::destroy
* @see app/Http/Controllers/Teams/PetController.php:192
* @route '/{current_team}/mascotas/{id}'
*/
destroy.url = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        id: args.id,
    }

    return destroy.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\PetController::destroy
* @see app/Http/Controllers/Teams/PetController.php:192
* @route '/{current_team}/mascotas/{id}'
*/
destroy.delete = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Teams\PetController::destroy
* @see app/Http/Controllers/Teams/PetController.php:192
* @route '/{current_team}/mascotas/{id}'
*/
const destroyForm = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\PetController::destroy
* @see app/Http/Controllers/Teams/PetController.php:192
* @route '/{current_team}/mascotas/{id}'
*/
destroyForm.delete = (args: { current_team: string | { slug: string }, id: string | number } | [current_team: string | { slug: string }, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const PetController = { index, create, store, show, edit, update, destroy }

export default PetController