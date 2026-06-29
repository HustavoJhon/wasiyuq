import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserController::index
* @see app/Http/Controllers/Admin/UserController.php:20
* @route '/admin/usuarios'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::index
* @see app/Http/Controllers/Admin/UserController.php:20
* @route '/admin/usuarios'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::index
* @see app/Http/Controllers/Admin/UserController.php:20
* @route '/admin/usuarios'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::index
* @see app/Http/Controllers/Admin/UserController.php:20
* @route '/admin/usuarios'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserController::index
* @see app/Http/Controllers/Admin/UserController.php:20
* @route '/admin/usuarios'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::index
* @see app/Http/Controllers/Admin/UserController.php:20
* @route '/admin/usuarios'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::index
* @see app/Http/Controllers/Admin/UserController.php:20
* @route '/admin/usuarios'
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
* @see \App\Http\Controllers\Admin\UserController::create
* @see app/Http/Controllers/Admin/UserController.php:63
* @route '/admin/usuarios/crear'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::create
* @see app/Http/Controllers/Admin/UserController.php:63
* @route '/admin/usuarios/crear'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::create
* @see app/Http/Controllers/Admin/UserController.php:63
* @route '/admin/usuarios/crear'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::create
* @see app/Http/Controllers/Admin/UserController.php:63
* @route '/admin/usuarios/crear'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserController::create
* @see app/Http/Controllers/Admin/UserController.php:63
* @route '/admin/usuarios/crear'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::create
* @see app/Http/Controllers/Admin/UserController.php:63
* @route '/admin/usuarios/crear'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::create
* @see app/Http/Controllers/Admin/UserController.php:63
* @route '/admin/usuarios/crear'
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
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:75
* @route '/admin/usuarios'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/usuarios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:75
* @route '/admin/usuarios'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:75
* @route '/admin/usuarios'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:75
* @route '/admin/usuarios'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::store
* @see app/Http/Controllers/Admin/UserController.php:75
* @route '/admin/usuarios'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\UserController::show
* @see app/Http/Controllers/Admin/UserController.php:99
* @route '/admin/usuarios/{user}'
*/
export const show = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::show
* @see app/Http/Controllers/Admin/UserController.php:99
* @route '/admin/usuarios/{user}'
*/
show.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::show
* @see app/Http/Controllers/Admin/UserController.php:99
* @route '/admin/usuarios/{user}'
*/
show.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::show
* @see app/Http/Controllers/Admin/UserController.php:99
* @route '/admin/usuarios/{user}'
*/
show.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserController::show
* @see app/Http/Controllers/Admin/UserController.php:99
* @route '/admin/usuarios/{user}'
*/
const showForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::show
* @see app/Http/Controllers/Admin/UserController.php:99
* @route '/admin/usuarios/{user}'
*/
showForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::show
* @see app/Http/Controllers/Admin/UserController.php:99
* @route '/admin/usuarios/{user}'
*/
showForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\UserController::edit
* @see app/Http/Controllers/Admin/UserController.php:137
* @route '/admin/usuarios/{user}/editar'
*/
export const edit = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/usuarios/{user}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserController::edit
* @see app/Http/Controllers/Admin/UserController.php:137
* @route '/admin/usuarios/{user}/editar'
*/
edit.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return edit.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::edit
* @see app/Http/Controllers/Admin/UserController.php:137
* @route '/admin/usuarios/{user}/editar'
*/
edit.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::edit
* @see app/Http/Controllers/Admin/UserController.php:137
* @route '/admin/usuarios/{user}/editar'
*/
edit.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\UserController::edit
* @see app/Http/Controllers/Admin/UserController.php:137
* @route '/admin/usuarios/{user}/editar'
*/
const editForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::edit
* @see app/Http/Controllers/Admin/UserController.php:137
* @route '/admin/usuarios/{user}/editar'
*/
editForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\UserController::edit
* @see app/Http/Controllers/Admin/UserController.php:137
* @route '/admin/usuarios/{user}/editar'
*/
editForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:163
* @route '/admin/usuarios/{user}'
*/
export const update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/usuarios/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:163
* @route '/admin/usuarios/{user}'
*/
update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:163
* @route '/admin/usuarios/{user}'
*/
update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:163
* @route '/admin/usuarios/{user}'
*/
const updateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::update
* @see app/Http/Controllers/Admin/UserController.php:163
* @route '/admin/usuarios/{user}'
*/
updateForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\UserController::updateRole
* @see app/Http/Controllers/Admin/UserController.php:186
* @route '/admin/usuarios/{user}/role'
*/
export const updateRole = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRole.url(args, options),
    method: 'put',
})

updateRole.definition = {
    methods: ["put"],
    url: '/admin/usuarios/{user}/role',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\UserController::updateRole
* @see app/Http/Controllers/Admin/UserController.php:186
* @route '/admin/usuarios/{user}/role'
*/
updateRole.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updateRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::updateRole
* @see app/Http/Controllers/Admin/UserController.php:186
* @route '/admin/usuarios/{user}/role'
*/
updateRole.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRole.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\UserController::updateRole
* @see app/Http/Controllers/Admin/UserController.php:186
* @route '/admin/usuarios/{user}/role'
*/
const updateRoleForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::updateRole
* @see app/Http/Controllers/Admin/UserController.php:186
* @route '/admin/usuarios/{user}/role'
*/
updateRoleForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateRole.form = updateRoleForm

/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:200
* @route '/admin/usuarios/{user}'
*/
export const destroy = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/usuarios/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:200
* @route '/admin/usuarios/{user}'
*/
destroy.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:200
* @route '/admin/usuarios/{user}'
*/
destroy.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:200
* @route '/admin/usuarios/{user}'
*/
const destroyForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::destroy
* @see app/Http/Controllers/Admin/UserController.php:200
* @route '/admin/usuarios/{user}'
*/
destroyForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Admin\UserController::addMembership
* @see app/Http/Controllers/Admin/UserController.php:221
* @route '/admin/usuarios/{user}/membership'
*/
export const addMembership = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMembership.url(args, options),
    method: 'post',
})

addMembership.definition = {
    methods: ["post"],
    url: '/admin/usuarios/{user}/membership',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserController::addMembership
* @see app/Http/Controllers/Admin/UserController.php:221
* @route '/admin/usuarios/{user}/membership'
*/
addMembership.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return addMembership.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::addMembership
* @see app/Http/Controllers/Admin/UserController.php:221
* @route '/admin/usuarios/{user}/membership'
*/
addMembership.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMembership.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::addMembership
* @see app/Http/Controllers/Admin/UserController.php:221
* @route '/admin/usuarios/{user}/membership'
*/
const addMembershipForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMembership.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::addMembership
* @see app/Http/Controllers/Admin/UserController.php:221
* @route '/admin/usuarios/{user}/membership'
*/
addMembershipForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addMembership.url(args, options),
    method: 'post',
})

addMembership.form = addMembershipForm

/**
* @see \App\Http\Controllers\Admin\UserController::removeMembership
* @see app/Http/Controllers/Admin/UserController.php:241
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
export const removeMembership = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMembership.url(args, options),
    method: 'delete',
})

removeMembership.definition = {
    methods: ["delete"],
    url: '/admin/usuarios/{user}/membership/{membership}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\UserController::removeMembership
* @see app/Http/Controllers/Admin/UserController.php:241
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
removeMembership.url = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            membership: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        membership: args.membership,
    }

    return removeMembership.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::removeMembership
* @see app/Http/Controllers/Admin/UserController.php:241
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
removeMembership.delete = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMembership.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\UserController::removeMembership
* @see app/Http/Controllers/Admin/UserController.php:241
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
const removeMembershipForm = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMembership.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::removeMembership
* @see app/Http/Controllers/Admin/UserController.php:241
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
removeMembershipForm.delete = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMembership.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeMembership.form = removeMembershipForm

/**
* @see \App\Http\Controllers\Admin\UserController::updateMembershipRole
* @see app/Http/Controllers/Admin/UserController.php:250
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
export const updateMembershipRole = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMembershipRole.url(args, options),
    method: 'put',
})

updateMembershipRole.definition = {
    methods: ["put"],
    url: '/admin/usuarios/{user}/membership/{membership}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\UserController::updateMembershipRole
* @see app/Http/Controllers/Admin/UserController.php:250
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
updateMembershipRole.url = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            membership: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        membership: args.membership,
    }

    return updateMembershipRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{membership}', parsedArgs.membership.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::updateMembershipRole
* @see app/Http/Controllers/Admin/UserController.php:250
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
updateMembershipRole.put = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMembershipRole.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\UserController::updateMembershipRole
* @see app/Http/Controllers/Admin/UserController.php:250
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
const updateMembershipRoleForm = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMembershipRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\UserController::updateMembershipRole
* @see app/Http/Controllers/Admin/UserController.php:250
* @route '/admin/usuarios/{user}/membership/{membership}'
*/
updateMembershipRoleForm.put = (args: { user: number | { id: number }, membership: string | number } | [user: number | { id: number }, membership: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMembershipRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMembershipRole.form = updateMembershipRoleForm

const UserController = { index, create, store, show, edit, update, updateRole, destroy, addMembership, removeMembership, updateMembershipRole }

export default UserController