import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ProfileController::index
* @see app/Http/Controllers/Admin/ProfileController.php:13
* @route '/admin/perfil'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/perfil',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProfileController::index
* @see app/Http/Controllers/Admin/ProfileController.php:13
* @route '/admin/perfil'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProfileController::index
* @see app/Http/Controllers/Admin/ProfileController.php:13
* @route '/admin/perfil'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProfileController::index
* @see app/Http/Controllers/Admin/ProfileController.php:13
* @route '/admin/perfil'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProfileController::index
* @see app/Http/Controllers/Admin/ProfileController.php:13
* @route '/admin/perfil'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProfileController::index
* @see app/Http/Controllers/Admin/ProfileController.php:13
* @route '/admin/perfil'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProfileController::index
* @see app/Http/Controllers/Admin/ProfileController.php:13
* @route '/admin/perfil'
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
* @see \App\Http\Controllers\Admin\ProfileController::update
* @see app/Http/Controllers/Admin/ProfileController.php:29
* @route '/admin/perfil'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/perfil',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ProfileController::update
* @see app/Http/Controllers/Admin/ProfileController.php:29
* @route '/admin/perfil'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProfileController::update
* @see app/Http/Controllers/Admin/ProfileController.php:29
* @route '/admin/perfil'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ProfileController::update
* @see app/Http/Controllers/Admin/ProfileController.php:29
* @route '/admin/perfil'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProfileController::update
* @see app/Http/Controllers/Admin/ProfileController.php:29
* @route '/admin/perfil'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const profile = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
}

export default profile