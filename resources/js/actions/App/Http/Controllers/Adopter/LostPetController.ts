import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:12
* @route '/mi-adopcion/mascotas-perdidas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/mascotas-perdidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:12
* @route '/mi-adopcion/mascotas-perdidas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:12
* @route '/mi-adopcion/mascotas-perdidas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:12
* @route '/mi-adopcion/mascotas-perdidas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:12
* @route '/mi-adopcion/mascotas-perdidas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:12
* @route '/mi-adopcion/mascotas-perdidas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\LostPetController::index
* @see app/Http/Controllers/Adopter/LostPetController.php:12
* @route '/mi-adopcion/mascotas-perdidas'
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

const LostPetController = { index }

export default LostPetController