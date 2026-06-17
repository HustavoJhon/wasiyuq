import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:14
* @route '/admin/organizaciones'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/organizaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:14
* @route '/admin/organizaciones'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:14
* @route '/admin/organizaciones'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:14
* @route '/admin/organizaciones'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:14
* @route '/admin/organizaciones'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:14
* @route '/admin/organizaciones'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:14
* @route '/admin/organizaciones'
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
* @see \App\Http\Controllers\Admin\OrganizationController::create
* @see app/Http/Controllers/Admin/OrganizationController.php:51
* @route '/admin/organizaciones/crear'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/organizaciones/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::create
* @see app/Http/Controllers/Admin/OrganizationController.php:51
* @route '/admin/organizaciones/crear'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::create
* @see app/Http/Controllers/Admin/OrganizationController.php:51
* @route '/admin/organizaciones/crear'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::create
* @see app/Http/Controllers/Admin/OrganizationController.php:51
* @route '/admin/organizaciones/crear'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::create
* @see app/Http/Controllers/Admin/OrganizationController.php:51
* @route '/admin/organizaciones/crear'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::create
* @see app/Http/Controllers/Admin/OrganizationController.php:51
* @route '/admin/organizaciones/crear'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::create
* @see app/Http/Controllers/Admin/OrganizationController.php:51
* @route '/admin/organizaciones/crear'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Admin\OrganizationController::store
* @see app/Http/Controllers/Admin/OrganizationController.php:56
* @route '/admin/organizaciones'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/organizaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::store
* @see app/Http/Controllers/Admin/OrganizationController.php:56
* @route '/admin/organizaciones'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::store
* @see app/Http/Controllers/Admin/OrganizationController.php:56
* @route '/admin/organizaciones'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::store
* @see app/Http/Controllers/Admin/OrganizationController.php:56
* @route '/admin/organizaciones'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::store
* @see app/Http/Controllers/Admin/OrganizationController.php:56
* @route '/admin/organizaciones'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\OrganizationController::show
* @see app/Http/Controllers/Admin/OrganizationController.php:84
* @route '/admin/organizaciones/{team}'
*/
export const show = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/organizaciones/{team}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::show
* @see app/Http/Controllers/Admin/OrganizationController.php:84
* @route '/admin/organizaciones/{team}'
*/
show.url = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { team: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: typeof args.team === 'object'
        ? args.team.slug
        : args.team,
    }

    return show.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::show
* @see app/Http/Controllers/Admin/OrganizationController.php:84
* @route '/admin/organizaciones/{team}'
*/
show.get = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::show
* @see app/Http/Controllers/Admin/OrganizationController.php:84
* @route '/admin/organizaciones/{team}'
*/
show.head = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::show
* @see app/Http/Controllers/Admin/OrganizationController.php:84
* @route '/admin/organizaciones/{team}'
*/
const showForm = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::show
* @see app/Http/Controllers/Admin/OrganizationController.php:84
* @route '/admin/organizaciones/{team}'
*/
showForm.get = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::show
* @see app/Http/Controllers/Admin/OrganizationController.php:84
* @route '/admin/organizaciones/{team}'
*/
showForm.head = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\OrganizationController::edit
* @see app/Http/Controllers/Admin/OrganizationController.php:110
* @route '/admin/organizaciones/{team}/editar'
*/
export const edit = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/organizaciones/{team}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::edit
* @see app/Http/Controllers/Admin/OrganizationController.php:110
* @route '/admin/organizaciones/{team}/editar'
*/
edit.url = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { team: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: typeof args.team === 'object'
        ? args.team.slug
        : args.team,
    }

    return edit.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::edit
* @see app/Http/Controllers/Admin/OrganizationController.php:110
* @route '/admin/organizaciones/{team}/editar'
*/
edit.get = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::edit
* @see app/Http/Controllers/Admin/OrganizationController.php:110
* @route '/admin/organizaciones/{team}/editar'
*/
edit.head = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::edit
* @see app/Http/Controllers/Admin/OrganizationController.php:110
* @route '/admin/organizaciones/{team}/editar'
*/
const editForm = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::edit
* @see app/Http/Controllers/Admin/OrganizationController.php:110
* @route '/admin/organizaciones/{team}/editar'
*/
editForm.get = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::edit
* @see app/Http/Controllers/Admin/OrganizationController.php:110
* @route '/admin/organizaciones/{team}/editar'
*/
editForm.head = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:119
* @route '/admin/organizaciones/{team}'
*/
export const update = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/organizaciones/{team}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:119
* @route '/admin/organizaciones/{team}'
*/
update.url = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { team: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: typeof args.team === 'object'
        ? args.team.slug
        : args.team,
    }

    return update.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:119
* @route '/admin/organizaciones/{team}'
*/
update.put = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:119
* @route '/admin/organizaciones/{team}'
*/
const updateForm = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:119
* @route '/admin/organizaciones/{team}'
*/
updateForm.put = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\OrganizationController::destroy
* @see app/Http/Controllers/Admin/OrganizationController.php:143
* @route '/admin/organizaciones/{team}'
*/
export const destroy = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/organizaciones/{team}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::destroy
* @see app/Http/Controllers/Admin/OrganizationController.php:143
* @route '/admin/organizaciones/{team}'
*/
destroy.url = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { team: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: typeof args.team === 'object'
        ? args.team.slug
        : args.team,
    }

    return destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::destroy
* @see app/Http/Controllers/Admin/OrganizationController.php:143
* @route '/admin/organizaciones/{team}'
*/
destroy.delete = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::destroy
* @see app/Http/Controllers/Admin/OrganizationController.php:143
* @route '/admin/organizaciones/{team}'
*/
const destroyForm = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::destroy
* @see app/Http/Controllers/Admin/OrganizationController.php:143
* @route '/admin/organizaciones/{team}'
*/
destroyForm.delete = (args: { team: string | { slug: string } } | [team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const organizations = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default organizations