import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ShelterController::index
* @see app/Http/Controllers/Admin/ShelterController.php:11
* @route '/admin/albergues'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/albergues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ShelterController::index
* @see app/Http/Controllers/Admin/ShelterController.php:11
* @route '/admin/albergues'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ShelterController::index
* @see app/Http/Controllers/Admin/ShelterController.php:11
* @route '/admin/albergues'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::index
* @see app/Http/Controllers/Admin/ShelterController.php:11
* @route '/admin/albergues'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::index
* @see app/Http/Controllers/Admin/ShelterController.php:11
* @route '/admin/albergues'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::index
* @see app/Http/Controllers/Admin/ShelterController.php:11
* @route '/admin/albergues'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::index
* @see app/Http/Controllers/Admin/ShelterController.php:11
* @route '/admin/albergues'
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
* @see \App\Http\Controllers\Admin\ShelterController::toggleVerification
* @see app/Http/Controllers/Admin/ShelterController.php:21
* @route '/admin/albergues/{shelter}/verificar'
*/
export const toggleVerification = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVerification.url(args, options),
    method: 'post',
})

toggleVerification.definition = {
    methods: ["post"],
    url: '/admin/albergues/{shelter}/verificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ShelterController::toggleVerification
* @see app/Http/Controllers/Admin/ShelterController.php:21
* @route '/admin/albergues/{shelter}/verificar'
*/
toggleVerification.url = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shelter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { shelter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            shelter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shelter: typeof args.shelter === 'object'
        ? args.shelter.id
        : args.shelter,
    }

    return toggleVerification.definition.url
            .replace('{shelter}', parsedArgs.shelter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ShelterController::toggleVerification
* @see app/Http/Controllers/Admin/ShelterController.php:21
* @route '/admin/albergues/{shelter}/verificar'
*/
toggleVerification.post = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVerification.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::toggleVerification
* @see app/Http/Controllers/Admin/ShelterController.php:21
* @route '/admin/albergues/{shelter}/verificar'
*/
const toggleVerificationForm = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleVerification.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::toggleVerification
* @see app/Http/Controllers/Admin/ShelterController.php:21
* @route '/admin/albergues/{shelter}/verificar'
*/
toggleVerificationForm.post = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleVerification.url(args, options),
    method: 'post',
})

toggleVerification.form = toggleVerificationForm

/**
* @see \App\Http\Controllers\Admin\ShelterController::destroy
* @see app/Http/Controllers/Admin/ShelterController.php:28
* @route '/admin/albergues/{shelter}'
*/
export const destroy = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/albergues/{shelter}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ShelterController::destroy
* @see app/Http/Controllers/Admin/ShelterController.php:28
* @route '/admin/albergues/{shelter}'
*/
destroy.url = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shelter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { shelter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            shelter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shelter: typeof args.shelter === 'object'
        ? args.shelter.id
        : args.shelter,
    }

    return destroy.definition.url
            .replace('{shelter}', parsedArgs.shelter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ShelterController::destroy
* @see app/Http/Controllers/Admin/ShelterController.php:28
* @route '/admin/albergues/{shelter}'
*/
destroy.delete = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::destroy
* @see app/Http/Controllers/Admin/ShelterController.php:28
* @route '/admin/albergues/{shelter}'
*/
const destroyForm = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ShelterController::destroy
* @see app/Http/Controllers/Admin/ShelterController.php:28
* @route '/admin/albergues/{shelter}'
*/
destroyForm.delete = (args: { shelter: number | { id: number } } | [shelter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ShelterController = { index, toggleVerification, destroy }

export default ShelterController