import request from "../utils/request";

export function getNotes(params = {}) {
    return request({
        method: 'GET',
        url: '/notes',
        params,
    })
}

export function getNote(id) {
    return request({
        method: 'GET',
        url: `/notes/${id}`,
    })
}

export function updateNote(id, data) {
    return request({
        method: 'PUT',
        url: `/notes/${id}`,
        data,
    })
}

export function deleteNote(id) {
    return request({
        method: 'DELETE',
        url: `/notes/${id}`
    })
}