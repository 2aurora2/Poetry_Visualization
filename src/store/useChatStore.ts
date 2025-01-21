import {defineStore} from "pinia";
import {parse, stringify} from 'zipson'

export const useChatStore = defineStore('chat', {
    state: () => {
        return {}
    },
    getters: {},
    actions: {},
    persist: {
        key: 'POETRY_CHAT',
        serializer: {
            deserialize: parse,
            serialize: stringify
        },
        storage: localStorage
    }
})