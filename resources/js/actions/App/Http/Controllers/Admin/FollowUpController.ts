import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\FollowUpController::index
* @see app/Http/Controllers/Admin/FollowUpController.php:15
* @route '/admin/seguimiento'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/seguimiento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FollowUpController::index
* @see app/Http/Controllers/Admin/FollowUpController.php:15
* @route '/admin/seguimiento'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FollowUpController::index
* @see app/Http/Controllers/Admin/FollowUpController.php:15
* @route '/admin/seguimiento'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::index
* @see app/Http/Controllers/Admin/FollowUpController.php:15
* @route '/admin/seguimiento'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::index
* @see app/Http/Controllers/Admin/FollowUpController.php:15
* @route '/admin/seguimiento'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::index
* @see app/Http/Controllers/Admin/FollowUpController.php:15
* @route '/admin/seguimiento'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::index
* @see app/Http/Controllers/Admin/FollowUpController.php:15
* @route '/admin/seguimiento'
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
* @see \App\Http\Controllers\Admin\FollowUpController::create
* @see app/Http/Controllers/Admin/FollowUpController.php:69
* @route '/admin/seguimiento/crear'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/seguimiento/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FollowUpController::create
* @see app/Http/Controllers/Admin/FollowUpController.php:69
* @route '/admin/seguimiento/crear'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FollowUpController::create
* @see app/Http/Controllers/Admin/FollowUpController.php:69
* @route '/admin/seguimiento/crear'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::create
* @see app/Http/Controllers/Admin/FollowUpController.php:69
* @route '/admin/seguimiento/crear'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::create
* @see app/Http/Controllers/Admin/FollowUpController.php:69
* @route '/admin/seguimiento/crear'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::create
* @see app/Http/Controllers/Admin/FollowUpController.php:69
* @route '/admin/seguimiento/crear'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::create
* @see app/Http/Controllers/Admin/FollowUpController.php:69
* @route '/admin/seguimiento/crear'
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
* @see \App\Http\Controllers\Admin\FollowUpController::store
* @see app/Http/Controllers/Admin/FollowUpController.php:80
* @route '/admin/seguimiento'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/seguimiento',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FollowUpController::store
* @see app/Http/Controllers/Admin/FollowUpController.php:80
* @route '/admin/seguimiento'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FollowUpController::store
* @see app/Http/Controllers/Admin/FollowUpController.php:80
* @route '/admin/seguimiento'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::store
* @see app/Http/Controllers/Admin/FollowUpController.php:80
* @route '/admin/seguimiento'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::store
* @see app/Http/Controllers/Admin/FollowUpController.php:80
* @route '/admin/seguimiento'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\FollowUpController::show
* @see app/Http/Controllers/Admin/FollowUpController.php:95
* @route '/admin/seguimiento/{followUp}'
*/
export const show = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/seguimiento/{followUp}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FollowUpController::show
* @see app/Http/Controllers/Admin/FollowUpController.php:95
* @route '/admin/seguimiento/{followUp}'
*/
show.url = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { followUp: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { followUp: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            followUp: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return show.definition.url
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FollowUpController::show
* @see app/Http/Controllers/Admin/FollowUpController.php:95
* @route '/admin/seguimiento/{followUp}'
*/
show.get = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::show
* @see app/Http/Controllers/Admin/FollowUpController.php:95
* @route '/admin/seguimiento/{followUp}'
*/
show.head = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::show
* @see app/Http/Controllers/Admin/FollowUpController.php:95
* @route '/admin/seguimiento/{followUp}'
*/
const showForm = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::show
* @see app/Http/Controllers/Admin/FollowUpController.php:95
* @route '/admin/seguimiento/{followUp}'
*/
showForm.get = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::show
* @see app/Http/Controllers/Admin/FollowUpController.php:95
* @route '/admin/seguimiento/{followUp}'
*/
showForm.head = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\FollowUpController::edit
* @see app/Http/Controllers/Admin/FollowUpController.php:104
* @route '/admin/seguimiento/{followUp}/editar'
*/
export const edit = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/seguimiento/{followUp}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FollowUpController::edit
* @see app/Http/Controllers/Admin/FollowUpController.php:104
* @route '/admin/seguimiento/{followUp}/editar'
*/
edit.url = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { followUp: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { followUp: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            followUp: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return edit.definition.url
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FollowUpController::edit
* @see app/Http/Controllers/Admin/FollowUpController.php:104
* @route '/admin/seguimiento/{followUp}/editar'
*/
edit.get = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::edit
* @see app/Http/Controllers/Admin/FollowUpController.php:104
* @route '/admin/seguimiento/{followUp}/editar'
*/
edit.head = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::edit
* @see app/Http/Controllers/Admin/FollowUpController.php:104
* @route '/admin/seguimiento/{followUp}/editar'
*/
const editForm = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::edit
* @see app/Http/Controllers/Admin/FollowUpController.php:104
* @route '/admin/seguimiento/{followUp}/editar'
*/
editForm.get = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::edit
* @see app/Http/Controllers/Admin/FollowUpController.php:104
* @route '/admin/seguimiento/{followUp}/editar'
*/
editForm.head = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\FollowUpController::update
* @see app/Http/Controllers/Admin/FollowUpController.php:118
* @route '/admin/seguimiento/{followUp}'
*/
export const update = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/seguimiento/{followUp}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\FollowUpController::update
* @see app/Http/Controllers/Admin/FollowUpController.php:118
* @route '/admin/seguimiento/{followUp}'
*/
update.url = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { followUp: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { followUp: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            followUp: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return update.definition.url
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FollowUpController::update
* @see app/Http/Controllers/Admin/FollowUpController.php:118
* @route '/admin/seguimiento/{followUp}'
*/
update.put = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::update
* @see app/Http/Controllers/Admin/FollowUpController.php:118
* @route '/admin/seguimiento/{followUp}'
*/
const updateForm = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::update
* @see app/Http/Controllers/Admin/FollowUpController.php:118
* @route '/admin/seguimiento/{followUp}'
*/
updateForm.put = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\FollowUpController::destroy
* @see app/Http/Controllers/Admin/FollowUpController.php:133
* @route '/admin/seguimiento/{followUp}'
*/
export const destroy = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/seguimiento/{followUp}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\FollowUpController::destroy
* @see app/Http/Controllers/Admin/FollowUpController.php:133
* @route '/admin/seguimiento/{followUp}'
*/
destroy.url = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { followUp: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { followUp: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            followUp: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return destroy.definition.url
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FollowUpController::destroy
* @see app/Http/Controllers/Admin/FollowUpController.php:133
* @route '/admin/seguimiento/{followUp}'
*/
destroy.delete = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::destroy
* @see app/Http/Controllers/Admin/FollowUpController.php:133
* @route '/admin/seguimiento/{followUp}'
*/
const destroyForm = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FollowUpController::destroy
* @see app/Http/Controllers/Admin/FollowUpController.php:133
* @route '/admin/seguimiento/{followUp}'
*/
destroyForm.delete = (args: { followUp: string | number | { id: string | number } } | [followUp: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const FollowUpController = { index, create, store, show, edit, update, destroy }

export default FollowUpController