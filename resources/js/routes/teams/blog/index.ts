import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::index
* @see app/Http/Controllers/Dashboard/BlogPostController.php:22
* @route '/{current_team}/blog'
*/
export const index = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/{current_team}/blog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::index
* @see app/Http/Controllers/Dashboard/BlogPostController.php:22
* @route '/{current_team}/blog'
*/
index.url = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
    }

    return index.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::index
* @see app/Http/Controllers/Dashboard/BlogPostController.php:22
* @route '/{current_team}/blog'
*/
index.get = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::index
* @see app/Http/Controllers/Dashboard/BlogPostController.php:22
* @route '/{current_team}/blog'
*/
index.head = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::index
* @see app/Http/Controllers/Dashboard/BlogPostController.php:22
* @route '/{current_team}/blog'
*/
const indexForm = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::index
* @see app/Http/Controllers/Dashboard/BlogPostController.php:22
* @route '/{current_team}/blog'
*/
indexForm.get = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::index
* @see app/Http/Controllers/Dashboard/BlogPostController.php:22
* @route '/{current_team}/blog'
*/
indexForm.head = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Dashboard\BlogPostController::create
* @see app/Http/Controllers/Dashboard/BlogPostController.php:44
* @route '/{current_team}/blog/crear'
*/
export const create = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/{current_team}/blog/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::create
* @see app/Http/Controllers/Dashboard/BlogPostController.php:44
* @route '/{current_team}/blog/crear'
*/
create.url = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
    }

    return create.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::create
* @see app/Http/Controllers/Dashboard/BlogPostController.php:44
* @route '/{current_team}/blog/crear'
*/
create.get = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::create
* @see app/Http/Controllers/Dashboard/BlogPostController.php:44
* @route '/{current_team}/blog/crear'
*/
create.head = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::create
* @see app/Http/Controllers/Dashboard/BlogPostController.php:44
* @route '/{current_team}/blog/crear'
*/
const createForm = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::create
* @see app/Http/Controllers/Dashboard/BlogPostController.php:44
* @route '/{current_team}/blog/crear'
*/
createForm.get = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::create
* @see app/Http/Controllers/Dashboard/BlogPostController.php:44
* @route '/{current_team}/blog/crear'
*/
createForm.head = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Dashboard\BlogPostController::store
* @see app/Http/Controllers/Dashboard/BlogPostController.php:53
* @route '/{current_team}/blog'
*/
export const store = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/{current_team}/blog',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::store
* @see app/Http/Controllers/Dashboard/BlogPostController.php:53
* @route '/{current_team}/blog'
*/
store.url = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
    }

    return store.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::store
* @see app/Http/Controllers/Dashboard/BlogPostController.php:53
* @route '/{current_team}/blog'
*/
store.post = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::store
* @see app/Http/Controllers/Dashboard/BlogPostController.php:53
* @route '/{current_team}/blog'
*/
const storeForm = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::store
* @see app/Http/Controllers/Dashboard/BlogPostController.php:53
* @route '/{current_team}/blog'
*/
storeForm.post = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::show
* @see app/Http/Controllers/Dashboard/BlogPostController.php:70
* @route '/{current_team}/blog/{id}'
*/
export const show = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{current_team}/blog/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::show
* @see app/Http/Controllers/Dashboard/BlogPostController.php:70
* @route '/{current_team}/blog/{id}'
*/
show.url = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
        id: args.id,
    }

    return show.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::show
* @see app/Http/Controllers/Dashboard/BlogPostController.php:70
* @route '/{current_team}/blog/{id}'
*/
show.get = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::show
* @see app/Http/Controllers/Dashboard/BlogPostController.php:70
* @route '/{current_team}/blog/{id}'
*/
show.head = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::show
* @see app/Http/Controllers/Dashboard/BlogPostController.php:70
* @route '/{current_team}/blog/{id}'
*/
const showForm = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::show
* @see app/Http/Controllers/Dashboard/BlogPostController.php:70
* @route '/{current_team}/blog/{id}'
*/
showForm.get = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::show
* @see app/Http/Controllers/Dashboard/BlogPostController.php:70
* @route '/{current_team}/blog/{id}'
*/
showForm.head = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Dashboard\BlogPostController::edit
* @see app/Http/Controllers/Dashboard/BlogPostController.php:86
* @route '/{current_team}/blog/{id}/editar'
*/
export const edit = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/{current_team}/blog/{id}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::edit
* @see app/Http/Controllers/Dashboard/BlogPostController.php:86
* @route '/{current_team}/blog/{id}/editar'
*/
edit.url = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
        id: args.id,
    }

    return edit.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::edit
* @see app/Http/Controllers/Dashboard/BlogPostController.php:86
* @route '/{current_team}/blog/{id}/editar'
*/
edit.get = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::edit
* @see app/Http/Controllers/Dashboard/BlogPostController.php:86
* @route '/{current_team}/blog/{id}/editar'
*/
edit.head = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::edit
* @see app/Http/Controllers/Dashboard/BlogPostController.php:86
* @route '/{current_team}/blog/{id}/editar'
*/
const editForm = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::edit
* @see app/Http/Controllers/Dashboard/BlogPostController.php:86
* @route '/{current_team}/blog/{id}/editar'
*/
editForm.get = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::edit
* @see app/Http/Controllers/Dashboard/BlogPostController.php:86
* @route '/{current_team}/blog/{id}/editar'
*/
editForm.head = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Dashboard\BlogPostController::update
* @see app/Http/Controllers/Dashboard/BlogPostController.php:101
* @route '/{current_team}/blog/{id}'
*/
export const update = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/{current_team}/blog/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::update
* @see app/Http/Controllers/Dashboard/BlogPostController.php:101
* @route '/{current_team}/blog/{id}'
*/
update.url = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
        id: args.id,
    }

    return update.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::update
* @see app/Http/Controllers/Dashboard/BlogPostController.php:101
* @route '/{current_team}/blog/{id}'
*/
update.put = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::update
* @see app/Http/Controllers/Dashboard/BlogPostController.php:101
* @route '/{current_team}/blog/{id}'
*/
const updateForm = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::update
* @see app/Http/Controllers/Dashboard/BlogPostController.php:101
* @route '/{current_team}/blog/{id}'
*/
updateForm.put = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Dashboard\BlogPostController::destroy
* @see app/Http/Controllers/Dashboard/BlogPostController.php:124
* @route '/{current_team}/blog/{id}'
*/
export const destroy = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/{current_team}/blog/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::destroy
* @see app/Http/Controllers/Dashboard/BlogPostController.php:124
* @route '/{current_team}/blog/{id}'
*/
destroy.url = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            id: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
        id: args.id,
    }

    return destroy.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::destroy
* @see app/Http/Controllers/Dashboard/BlogPostController.php:124
* @route '/{current_team}/blog/{id}'
*/
destroy.delete = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::destroy
* @see app/Http/Controllers/Dashboard/BlogPostController.php:124
* @route '/{current_team}/blog/{id}'
*/
const destroyForm = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\BlogPostController::destroy
* @see app/Http/Controllers/Dashboard/BlogPostController.php:124
* @route '/{current_team}/blog/{id}'
*/
destroyForm.delete = (args: { current_team: string | number, id: string | number } | [current_team: string | number, id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const blog = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default blog