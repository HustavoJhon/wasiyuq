import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\VeterinarianController::index
* @see app/Http/Controllers/Admin/VeterinarianController.php:11
* @route '/admin/veterinarias'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/veterinarias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::index
* @see app/Http/Controllers/Admin/VeterinarianController.php:11
* @route '/admin/veterinarias'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::index
* @see app/Http/Controllers/Admin/VeterinarianController.php:11
* @route '/admin/veterinarias'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::index
* @see app/Http/Controllers/Admin/VeterinarianController.php:11
* @route '/admin/veterinarias'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::index
* @see app/Http/Controllers/Admin/VeterinarianController.php:11
* @route '/admin/veterinarias'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::index
* @see app/Http/Controllers/Admin/VeterinarianController.php:11
* @route '/admin/veterinarias'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::index
* @see app/Http/Controllers/Admin/VeterinarianController.php:11
* @route '/admin/veterinarias'
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
* @see \App\Http\Controllers\Admin\VeterinarianController::toggleVerification
* @see app/Http/Controllers/Admin/VeterinarianController.php:30
* @route '/admin/veterinarias/{veterinarian}/verificar'
*/
export const toggleVerification = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVerification.url(args, options),
    method: 'post',
})

toggleVerification.definition = {
    methods: ["post"],
    url: '/admin/veterinarias/{veterinarian}/verificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::toggleVerification
* @see app/Http/Controllers/Admin/VeterinarianController.php:30
* @route '/admin/veterinarias/{veterinarian}/verificar'
*/
toggleVerification.url = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { veterinarian: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { veterinarian: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            veterinarian: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        veterinarian: typeof args.veterinarian === 'object'
        ? args.veterinarian.id
        : args.veterinarian,
    }

    return toggleVerification.definition.url
            .replace('{veterinarian}', parsedArgs.veterinarian.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::toggleVerification
* @see app/Http/Controllers/Admin/VeterinarianController.php:30
* @route '/admin/veterinarias/{veterinarian}/verificar'
*/
toggleVerification.post = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVerification.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::toggleVerification
* @see app/Http/Controllers/Admin/VeterinarianController.php:30
* @route '/admin/veterinarias/{veterinarian}/verificar'
*/
const toggleVerificationForm = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleVerification.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::toggleVerification
* @see app/Http/Controllers/Admin/VeterinarianController.php:30
* @route '/admin/veterinarias/{veterinarian}/verificar'
*/
toggleVerificationForm.post = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleVerification.url(args, options),
    method: 'post',
})

toggleVerification.form = toggleVerificationForm

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::destroy
* @see app/Http/Controllers/Admin/VeterinarianController.php:39
* @route '/admin/veterinarias/{veterinarian}'
*/
export const destroy = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/veterinarias/{veterinarian}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::destroy
* @see app/Http/Controllers/Admin/VeterinarianController.php:39
* @route '/admin/veterinarias/{veterinarian}'
*/
destroy.url = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { veterinarian: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { veterinarian: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            veterinarian: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        veterinarian: typeof args.veterinarian === 'object'
        ? args.veterinarian.id
        : args.veterinarian,
    }

    return destroy.definition.url
            .replace('{veterinarian}', parsedArgs.veterinarian.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::destroy
* @see app/Http/Controllers/Admin/VeterinarianController.php:39
* @route '/admin/veterinarias/{veterinarian}'
*/
destroy.delete = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::destroy
* @see app/Http/Controllers/Admin/VeterinarianController.php:39
* @route '/admin/veterinarias/{veterinarian}'
*/
const destroyForm = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\VeterinarianController::destroy
* @see app/Http/Controllers/Admin/VeterinarianController.php:39
* @route '/admin/veterinarias/{veterinarian}'
*/
destroyForm.delete = (args: { veterinarian: number | { id: number } } | [veterinarian: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
    toggleVerification: Object.assign(toggleVerification, toggleVerification),
    destroy: Object.assign(destroy, destroy),
}

export default veterinarians