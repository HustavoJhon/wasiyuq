import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Public\ContactController::index
* @see app/Http/Controllers/Public/ContactController.php:15
* @route '/contacto'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/contacto',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\ContactController::index
* @see app/Http/Controllers/Public/ContactController.php:15
* @route '/contacto'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ContactController::index
* @see app/Http/Controllers/Public/ContactController.php:15
* @route '/contacto'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ContactController::index
* @see app/Http/Controllers/Public/ContactController.php:15
* @route '/contacto'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\ContactController::index
* @see app/Http/Controllers/Public/ContactController.php:15
* @route '/contacto'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ContactController::index
* @see app/Http/Controllers/Public/ContactController.php:15
* @route '/contacto'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ContactController::index
* @see app/Http/Controllers/Public/ContactController.php:15
* @route '/contacto'
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
* @see \App\Http\Controllers\Public\ContactController::send
* @see app/Http/Controllers/Public/ContactController.php:37
* @route '/contacto'
*/
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/contacto',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\ContactController::send
* @see app/Http/Controllers/Public/ContactController.php:37
* @route '/contacto'
*/
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ContactController::send
* @see app/Http/Controllers/Public/ContactController.php:37
* @route '/contacto'
*/
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ContactController::send
* @see app/Http/Controllers/Public/ContactController.php:37
* @route '/contacto'
*/
const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ContactController::send
* @see app/Http/Controllers/Public/ContactController.php:37
* @route '/contacto'
*/
sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(options),
    method: 'post',
})

send.form = sendForm

const contact = {
    index: Object.assign(index, index),
    send: Object.assign(send, send),
}

export default contact