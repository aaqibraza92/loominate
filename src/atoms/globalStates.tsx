import { atom } from "recoil";

export const tenantNameState = atom({
    key: "tenantNameState",
    default: '',
})

export const categoriesState = atom({
    key: "categoriesState",
    default: {},
})

export const flagFeedUpdate = atom({
    key: "flagFeedUpdate",
    default: true,
})

export const feedFilter = atom({
    key: "feedFilter",
    default: {name: 'All', value: 'All'},
})

export const wakeHastags = atom({
    key: "wakeHastags",
    default: false,
})

export const wakeCats = atom({
    key: "wakeCats",
    default: false,
})

export const hashFilterValue = atom({
    key: "hashFilterValue",
    default: {name: '', value: ''},
})

export const catIds = atom({
    key: "catIds",
    default: '',
})

export const karmaPoints = atom({
    key: "karmaPoints",
    default: 0,
})


export const notReadNotification = atom({
    key: "UnReadNotification",
    default: 0,
})

export const wakeGetCat = atom({
    key: "notReadNotification",
    default: false,
})




