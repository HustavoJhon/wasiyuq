import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Adopter\PetController::index
* @see app/Http/Controllers/Adopter/PetController.php:14
* @route '/mi-adopcion/mascotas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/mascotas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\PetController::index
* @see app/Http/Controllers/Adopter/PetController.php:14
* @route '/mi-adopcion/mascotas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\PetController::index
* @see app/Http/Controllers/Adopter/PetController.php:14
* @route '/mi-adopcion/mascotas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::index
* @see app/Http/Controllers/Adopter/PetController.php:14
* @route '/mi-adopcion/mascotas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::index
* @see app/Http/Controllers/Adopter/PetController.php:14
* @route '/mi-adopcion/mascotas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::index
* @see app/Http/Controllers/Adopter/PetController.php:14
* @route '/mi-adopcion/mascotas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::index
* @see app/Http/Controllers/Adopter/PetController.php:14
* @route '/mi-adopcion/mascotas'
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
* @see \App\Http\Controllers\Adopter\PetController::create
* @see app/Http/Controllers/Adopter/PetController.php:36
* @route '/mi-adopcion/mascotas/publicar'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/mascotas/publicar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\PetController::create
* @see app/Http/Controllers/Adopter/PetController.php:36
* @route '/mi-adopcion/mascotas/publicar'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\PetController::create
* @see app/Http/Controllers/Adopter/PetController.php:36
* @route '/mi-adopcion/mascotas/publicar'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::create
* @see app/Http/Controllers/Adopter/PetController.php:36
* @route '/mi-adopcion/mascotas/publicar'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::create
* @see app/Http/Controllers/Adopter/PetController.php:36
* @route '/mi-adopcion/mascotas/publicar'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::create
* @see app/Http/Controllers/Adopter/PetController.php:36
* @route '/mi-adopcion/mascotas/publicar'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::create
* @see app/Http/Controllers/Adopter/PetController.php:36
* @route '/mi-adopcion/mascotas/publicar'
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
* @see \App\Http\Controllers\Adopter\PetController::store
* @see app/Http/Controllers/Adopter/PetController.php:41
* @route '/mi-adopcion/mascotas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mi-adopcion/mascotas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Adopter\PetController::store
* @see app/Http/Controllers/Adopter/PetController.php:41
* @route '/mi-adopcion/mascotas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\PetController::store
* @see app/Http/Controllers/Adopter/PetController.php:41
* @route '/mi-adopcion/mascotas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::store
* @see app/Http/Controllers/Adopter/PetController.php:41
* @route '/mi-adopcion/mascotas'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::store
* @see app/Http/Controllers/Adopter/PetController.php:41
* @route '/mi-adopcion/mascotas'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Adopter\PetController::destroy
* @see app/Http/Controllers/Adopter/PetController.php:84
* @route '/mi-adopcion/mascotas/{pet}'
*/
export const destroy = (args: { pet: string | { slug: string } } | [pet: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/mi-adopcion/mascotas/{pet}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Adopter\PetController::destroy
* @see app/Http/Controllers/Adopter/PetController.php:84
* @route '/mi-adopcion/mascotas/{pet}'
*/
destroy.url = (args: { pet: string | { slug: string } } | [pet: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { pet: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            pet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pet: typeof args.pet === 'object'
        ? args.pet.slug
        : args.pet,
    }

    return destroy.definition.url
            .replace('{pet}', parsedArgs.pet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\PetController::destroy
* @see app/Http/Controllers/Adopter/PetController.php:84
* @route '/mi-adopcion/mascotas/{pet}'
*/
destroy.delete = (args: { pet: string | { slug: string } } | [pet: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::destroy
* @see app/Http/Controllers/Adopter/PetController.php:84
* @route '/mi-adopcion/mascotas/{pet}'
*/
const destroyForm = (args: { pet: string | { slug: string } } | [pet: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\PetController::destroy
* @see app/Http/Controllers/Adopter/PetController.php:84
* @route '/mi-adopcion/mascotas/{pet}'
*/
destroyForm.delete = (args: { pet: string | { slug: string } } | [pet: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const PetController = { index, create, store, destroy }

export default PetController