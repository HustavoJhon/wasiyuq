import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Public\ChatbotController::ask
* @see app/Http/Controllers/Public/ChatbotController.php:15
* @route '/api/chatbot/ask'
*/
export const ask = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(options),
    method: 'post',
})

ask.definition = {
    methods: ["post"],
    url: '/api/chatbot/ask',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\ChatbotController::ask
* @see app/Http/Controllers/Public/ChatbotController.php:15
* @route '/api/chatbot/ask'
*/
ask.url = (options?: RouteQueryOptions) => {
    return ask.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ChatbotController::ask
* @see app/Http/Controllers/Public/ChatbotController.php:15
* @route '/api/chatbot/ask'
*/
ask.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ChatbotController::ask
* @see app/Http/Controllers/Public/ChatbotController.php:15
* @route '/api/chatbot/ask'
*/
const askForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ask.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ChatbotController::ask
* @see app/Http/Controllers/Public/ChatbotController.php:15
* @route '/api/chatbot/ask'
*/
askForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ask.url(options),
    method: 'post',
})

ask.form = askForm

const chatbot = {
    ask: Object.assign(ask, ask),
}

export default chatbot